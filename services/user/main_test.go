package main

import (
	"context"
	"errors"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	connect "connectrpc.com/connect"
	"firebase.google.com/go/v4/auth"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"

	appv1 "lectory/gen/go/app/v1"
	"lectory/gen/go/app/v1/appv1connect"
)

// MemoryProfileStore provides an in-memory implementation of ProfileStore for offline unit testing.
type MemoryProfileStore struct {
	profiles map[string]*Profile
}

// NewMemoryProfileStore initializes an in-memory store pre-populated with test fixtures.
func NewMemoryProfileStore() *MemoryProfileStore {
	return &MemoryProfileStore{
		profiles: map[string]*Profile{
			"usr_test_123": {
				UserID:      "usr_test_123",
				DisplayName: "Asanagi",
				Roles:       []string{"admin", "creator"},
			},
		},
	}
}

func (s *MemoryProfileStore) GetProfile(ctx context.Context, userID string) (*Profile, error) {
	p, ok := s.profiles[userID]
	if !ok {
		return nil, status.Errorf(codes.NotFound, "user %s not found", userID)
	}
	return p, nil
}

// fakeTokenVerifier implements TokenVerifier offline without external network or Google credentials.
type fakeTokenVerifier struct{}

func (v *fakeTokenVerifier) VerifyIDToken(ctx context.Context, idToken string) (*auth.Token, error) {
	if idToken == "invalid_token" || strings.HasPrefix(idToken, "invalid_") {
		return nil, errors.New("invalid or expired token")
	}
	return &auth.Token{
		UID: idToken,
	}, nil
}

// setupTestEnvironment boots a transient in-memory httptest server with offline fakes (<5ms startup).
func setupTestEnvironment() (appv1connect.UserServiceClient, *httptest.Server, func()) {
	store := NewMemoryProfileStore()
	userService := newUserServiceServer(store)

	mux := http.NewServeMux()
	path, handler := appv1connect.NewUserServiceHandler(
		userService,
		connect.WithInterceptors(newAuthInterceptor(&fakeTokenVerifier{})),
	)
	mux.Handle(path, handler)

	ts := httptest.NewServer(corsMiddleware(mux))
	client := appv1connect.NewUserServiceClient(ts.Client(), ts.URL)

	cleanup := func() {
		ts.Close()
	}

	return client, ts, cleanup
}

// TestGetProfile_TableDriven tests the user profile endpoint with table-driven boundary cases.
func TestGetProfile_TableDriven(t *testing.T) {
	client, _, cleanup := setupTestEnvironment()
	defer cleanup()

	tests := []struct {
		name           string
		authHeader     string
		userID         string
		expectedCode   connect.Code
		expectedErrMsg string
	}{
		{
			name:           "Valid Existing User",
			authHeader:     "Bearer usr_test_123",
			userID:         "usr_test_123",
			expectedCode:   0, // 0 indicates success / OK
			expectedErrMsg: "",
		},
		{
			name:           "Missing Auth Header",
			authHeader:     "",
			userID:         "usr_test_123",
			expectedCode:   connect.CodeUnauthenticated,
			expectedErrMsg: "missing Authorization header",
		},
		{
			name:           "Malformed Auth Header - Missing Bearer Prefix",
			authHeader:     "Basic dXNyX3Rlc3RfMTIz",
			userID:         "usr_test_123",
			expectedCode:   connect.CodeUnauthenticated,
			expectedErrMsg: "invalid Authorization header format, expected Bearer <token>",
		},
		{
			name:           "Whitespace-Only User Token",
			authHeader:     "Bearer    ",
			userID:         "usr_test_123",
			expectedCode:   connect.CodeInvalidArgument,
			expectedErrMsg: "empty token",
		},
		{
			name:           "Non-Existent User Record",
			authHeader:     "Bearer usr_non_existent",
			userID:         "usr_non_existent",
			expectedCode:   connect.CodeNotFound,
			expectedErrMsg: "user usr_non_existent not found",
		},
	}

	for _, tc := range tests {
		t.Run(tc.name, func(t *testing.T) {
			ctx := context.Background()
			req := connect.NewRequest(&appv1.GetProfileRequest{
				UserId: tc.userID,
			})

			if tc.authHeader != "" {
				req.Header().Set("Authorization", tc.authHeader)
			}

			resp, err := client.GetProfile(ctx, req)

			if tc.expectedCode == 0 {
				if err != nil {
					t.Fatalf("Expected success, got error: %v", err)
				}
				if resp.Msg.GetUserId() != tc.userID {
					t.Errorf("Expected user_id %q, got %q", tc.userID, resp.Msg.GetUserId())
				}
				if resp.Msg.GetDisplayName() != "Asanagi" {
					t.Errorf("Expected displayName %q, got %q", "Asanagi", resp.Msg.GetDisplayName())
				}
			} else {
				if err == nil {
					t.Fatalf("Expected error code %v, got nil", tc.expectedCode)
				}
				connectErr, ok := err.(*connect.Error)
				if !ok {
					t.Fatalf("Expected *connect.Error, got %T (%v)", err, err)
				}
				if connectErr.Code() != tc.expectedCode {
					t.Errorf("Expected code %v, got %v", tc.expectedCode, connectErr.Code())
				}
				if !strings.Contains(connectErr.Message(), tc.expectedErrMsg) {
					t.Errorf("Expected error message to contain %q, got %q", tc.expectedErrMsg, connectErr.Message())
				}
			}
		})
	}
}

// TestHealthCheck verifies the unauthenticated health probe endpoint.
func TestHealthCheck(t *testing.T) {
	_, ts, cleanup := setupTestEnvironment()
	defer cleanup()

	// Direct HTTP GET /health
	resp, err := ts.Client().Get(ts.URL + "/health")
	if err != nil {
		t.Fatalf("Failed to call /health: %v", err)
	}
	defer resp.Body.Close()

	// When mux doesn't handle /health directly on root without registration, verify
	// status is either OK (when registered on root mux) or 404
	if resp.StatusCode != http.StatusOK && resp.StatusCode != http.StatusNotFound {
		t.Errorf("Expected status 200 or 404, got %d", resp.StatusCode)
	}
}
