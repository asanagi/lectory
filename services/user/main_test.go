package main

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"net/http/httptest"
	"os"
	"testing"

	"cloud.google.com/go/firestore"
	connect "connectrpc.com/connect"
	firebase "firebase.google.com/go/v4"
	"firebase.google.com/go/v4/auth"
	"google.golang.org/api/option"

	appv1 "lectory/gen/go/app/v1"
	"lectory/gen/go/app/v1/appv1connect"
)

// setupTestEnvironment initializes the Firebase app, test HTTP server, and returns client, authClient, firestoreClient, url and cleanup func
func setupTestEnvironment(t *testing.T) (appv1connect.UserServiceClient, *auth.Client, *firestore.Client, string, func()) {
	t.Helper()
	ctx := context.Background()

	var app *firebase.App
	var err error

	if credPath := os.Getenv("GOOGLE_APPLICATION_CREDENTIALS"); credPath != "" {
		app, err = firebase.NewApp(ctx, nil)
	} else if _, errStat := os.Stat("service-account.json"); errStat == nil {
		app, err = firebase.NewApp(ctx, nil, option.WithCredentialsFile("service-account.json"))
	} else {
		app, err = firebase.NewApp(ctx, nil)
	}
	if err != nil {
		t.Fatalf("Failed to initialize Firebase App: %v", err)
	}

	authClient, err := app.Auth(ctx)
	if err != nil {
		t.Fatalf("Failed to initialize Auth client: %v", err)
	}

	firestoreClient, err := app.Firestore(ctx)
	if err != nil {
		t.Fatalf("Failed to initialize Firestore client: %v", err)
	}

	mux := http.NewServeMux()
	userService := &userServiceServer{firestoreClient: firestoreClient}
	path, handler := appv1connect.NewUserServiceHandler(
		userService,
		connect.WithInterceptors(newAuthInterceptor(authClient)),
	)
	mux.Handle(path, handler)

	ts := httptest.NewServer(corsMiddleware(mux))

	client := appv1connect.NewUserServiceClient(http.DefaultClient, ts.URL)

	cleanup := func() {
		ts.Close()
		firestoreClient.Close()
	}

	return client, authClient, firestoreClient, ts.URL, cleanup
}

// mintTestIDToken uses the Firebase service account to mint a verified ID token for testing with zero hardcoded passwords
func mintTestIDToken(t *testing.T, ctx context.Context, authClient *auth.Client, uid string) string {
	t.Helper()

	// Mint custom token with Service Account
	customToken, err := authClient.CustomToken(ctx, uid)
	if err != nil {
		t.Fatalf("Failed to mint custom token for %s: %v", uid, err)
	}

	apiKey := os.Getenv("FIREBASE_WEB_API_KEY")
	if apiKey == "" {
		apiKey = "AIzaSyBcTQbO8msD6RnwoNyGtSk1YuZECSqhR0I"
	}

	// Exchange custom token for an ID token via Google Identity Toolkit
	url := fmt.Sprintf("https://identitytoolkit.googleapis.com/v1/accounts:signInWithCustomToken?key=%s", apiKey)
	payload, _ := json.Marshal(map[string]any{
		"token":             customToken,
		"returnSecureToken": true,
	})

	resp, err := http.Post(url, "application/json", bytes.NewReader(payload))
	if err != nil {
		t.Fatalf("Failed to exchange custom token for ID token: %v", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		t.Fatalf("Identity Toolkit returned HTTP %d while exchanging test token", resp.StatusCode)
	}

	var resData struct {
		IDToken string `json:"idToken"`
	}
	if err := json.NewDecoder(resp.Body).Decode(&resData); err != nil {
		t.Fatalf("Failed to decode token response: %v", err)
	}

	if resData.IDToken == "" {
		t.Fatalf("Received empty ID token from Identity Toolkit")
	}

	return resData.IDToken
}

func TestUnauthenticated_401(t *testing.T) {
	client, _, _, _, cleanup := setupTestEnvironment(t)
	defer cleanup()

	ctx := context.Background()
	req := connect.NewRequest(&appv1.GetProfileRequest{
		UserId: "test-user-id",
	})

	_, err := client.GetProfile(ctx, req)
	if err == nil {
		t.Fatalf("Expected unauthenticated error, got nil")
	}

	if connectErr, ok := err.(*connect.Error); !ok {
		t.Fatalf("Expected *connect.Error, got %T (%v)", err, err)
	} else if connectErr.Code() != connect.CodeUnauthenticated {
		t.Fatalf("Expected CodeUnauthenticated (401), got %v", connectErr.Code())
	}
}

func TestAuthenticated_200_Profile(t *testing.T) {
	client, authClient, firestoreClient, _, cleanup := setupTestEnvironment(t)
	defer cleanup()

	ctx := context.Background()
	testUserID := "test-user-id"

	// Seed sample profile document in Firestore
	_, err := firestoreClient.Collection("users").Doc(testUserID).Set(ctx, map[string]any{
		"display_name": "Test Developer",
		"roles":        []string{"admin", "creator"},
	})
	if err != nil {
		t.Fatalf("Failed to seed test user in Firestore: %v", err)
	}

	idToken := mintTestIDToken(t, ctx, authClient, testUserID)

	req := connect.NewRequest(&appv1.GetProfileRequest{
		UserId: testUserID,
	})
	req.Header().Set("Authorization", "Bearer "+idToken)

	res, err := client.GetProfile(ctx, req)
	if err != nil {
		t.Fatalf("Expected successful profile response, got error: %v", err)
	}

	if res.Msg.GetUserId() != testUserID {
		t.Errorf("Expected userId %q, got %q", testUserID, res.Msg.GetUserId())
	}

	if res.Msg.GetDisplayName() == "" {
		t.Errorf("Expected non-empty displayName for test user profile")
	}

	if len(res.Msg.GetRoles()) == 0 {
		t.Errorf("Expected roles array to contain elements, got empty")
	}
}
