package main

import (
	"context"
	"errors"
	"fmt"
	"log"
	"net/http"
	"os"
	"os/signal"
	"strings"
	"syscall"
	"time"

	"cloud.google.com/go/compute/metadata"
	"cloud.google.com/go/firestore"
	connect "connectrpc.com/connect"
	firebase "firebase.google.com/go/v4"
	"firebase.google.com/go/v4/auth"
	"google.golang.org/api/option"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"

	appv1 "lectory/gen/go/app/v1"
	"lectory/gen/go/app/v1/appv1connect"
)

// TokenVerifier defines the contract for ID token verification. Concrete *auth.Client satisfies this.
type TokenVerifier interface {
	VerifyIDToken(ctx context.Context, idToken string) (*auth.Token, error)
}

func newAuthInterceptor(verifier TokenVerifier) connect.UnaryInterceptorFunc {
	return func(next connect.UnaryFunc) connect.UnaryFunc {
		return func(ctx context.Context, req connect.AnyRequest) (connect.AnyResponse, error) {
			authHeader := strings.TrimSpace(req.Header().Get("Authorization"))
			if authHeader == "" {
				return nil, connect.NewError(connect.CodeUnauthenticated, errors.New("missing Authorization header"))
			}

			if !strings.HasPrefix(strings.ToLower(authHeader), "bearer") {
				return nil, connect.NewError(connect.CodeUnauthenticated, errors.New("invalid Authorization header format, expected Bearer <token>"))
			}

			tokenString := strings.TrimSpace(authHeader[len("bearer"):])
			if tokenString == "" {
				return nil, connect.NewError(connect.CodeInvalidArgument, errors.New("empty token"))
			}

			_, err := verifier.VerifyIDToken(ctx, tokenString)
			if err != nil {
				return nil, connect.NewError(connect.CodeUnauthenticated, fmt.Errorf("invalid token: %w", err))
			}

			return next(ctx, req)
		}
	}
}

func corsMiddleware(next http.Handler) http.Handler {
	allowedOrigins := map[string]bool{
		"http://localhost:5173":   true,
		"http://localhost:8081":   true,
		"http://127.0.0.1:8081":   true,
		"https://app.lectory.dev": true,
	}

	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		origin := r.Header.Get("Origin")
		if allowedOrigins[origin] {
			w.Header().Set("Access-Control-Allow-Origin", origin)
			w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
			w.Header().Set("Access-Control-Allow-Headers", "Accept, Content-Type, Content-Length, Accept-Encoding, Authorization, Connect-Protocol-Version")
			w.Header().Set("Access-Control-Allow-Credentials", "true")
		}

		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusNoContent)
			return
		}

		next.ServeHTTP(w, r)
	})
}

// Profile represents the user profile data model.
type Profile struct {
	UserID      string   `json:"user_id"`
	DisplayName string   `json:"display_name"`
	Roles       []string `json:"roles"`
}

// ProfileStore defines the data layer contract for user profiles.
type ProfileStore interface {
	GetProfile(ctx context.Context, userID string) (*Profile, error)
}

// FirestoreProfileStore implements ProfileStore backed by Google Cloud Firestore.
type FirestoreProfileStore struct {
	client *firestore.Client
}

func NewFirestoreProfileStore(client *firestore.Client) *FirestoreProfileStore {
	return &FirestoreProfileStore{client: client}
}

func (s *FirestoreProfileStore) GetProfile(ctx context.Context, userID string) (*Profile, error) {
	doc, err := s.client.Collection("users").Doc(userID).Get(ctx)
	if err != nil {
		return nil, err
	}

	data := doc.Data()
	displayName, _ := data["display_name"].(string)

	var roles []string
	if rawRoles, ok := data["roles"].([]any); ok {
		for _, r := range rawRoles {
			if strRole, ok := r.(string); ok {
				roles = append(roles, strRole)
			}
		}
	} else if strRoles, ok := data["roles"].([]string); ok {
		roles = strRoles
	}

	return &Profile{
		UserID:      userID,
		DisplayName: displayName,
		Roles:       roles,
	}, nil
}

type userServiceServer struct {
	store ProfileStore
}

func newUserServiceServer(store ProfileStore) *userServiceServer {
	return &userServiceServer{store: store}
}

func (s *userServiceServer) GetProfile(
	ctx context.Context,
	req *connect.Request[appv1.GetProfileRequest],
) (*connect.Response[appv1.GetProfileResponse], error) {
	userID := req.Msg.GetUserId()
	if userID == "" {
		return nil, connect.NewError(connect.CodeInvalidArgument, errors.New("userId is required"))
	}

	profile, err := s.store.GetProfile(ctx, userID)
	if err != nil {
		if status.Code(err) == codes.NotFound {
			return nil, connect.NewError(connect.CodeNotFound, fmt.Errorf("user %s not found", userID))
		}
		return nil, connect.NewError(connect.CodeInternal, fmt.Errorf("failed to fetch user: %w", err))
	}

	res := connect.NewResponse(&appv1.GetProfileResponse{
		UserId:      profile.UserID,
		DisplayName: profile.DisplayName,
		Roles:       profile.Roles,
	})
	return res, nil
}

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "8082"
	}

	env := os.Getenv("ENV")
	if env == "" {
		env = "production"
	}

	ctx := context.Background()

	conf := &firebase.Config{}
	if p := os.Getenv("FIREBASE_PROJECT_ID"); p != "" {
		conf.ProjectID = p
	}

	var app *firebase.App
	var err error

	if credPath := os.Getenv("GOOGLE_APPLICATION_CREDENTIALS"); credPath != "" {
		app, err = firebase.NewApp(ctx, conf)
	} else if _, errStat := os.Stat("service-account.json"); errStat == nil {
		app, err = firebase.NewApp(ctx, conf, option.WithCredentialsFile("service-account.json"))
	} else {
		app, err = firebase.NewApp(ctx, conf)
	}
	if err != nil {
		log.Fatalf("Error initializing Firebase App: %v", err)
	}

	authClient, err := app.Auth(ctx)
	if err != nil {
		log.Fatalf("Error initializing Auth client: %v", err)
	}

	// Environment-aware Firestore: supports dedicated project isolation (FIREBASE_PROJECT_ID / Cloud Run metadata)
	// and optional named databases via FIRESTORE_DATABASE.
	var firestoreClient *firestore.Client
	projectID := os.Getenv("FIREBASE_PROJECT_ID")
	if projectID == "" {
		// On Cloud Run the project id is available from the metadata server.
		projectID, _ = metadata.ProjectID()
	}

	if dbID := os.Getenv("FIRESTORE_DATABASE"); dbID != "" && dbID != "(default)" {
		firestoreClient, err = firestore.NewClientWithDatabase(ctx, projectID, dbID)
	} else if projectID != "" {
		firestoreClient, err = firestore.NewClient(ctx, projectID)
	} else {
		firestoreClient, err = app.Firestore(ctx)
	}
	if err != nil {
		log.Fatalf("Error initializing Firestore client: %v", err)
	}
	defer firestoreClient.Close()

	mux := http.NewServeMux()

	// Register UserService Connect RPC handler with auth interceptor
	store := NewFirestoreProfileStore(firestoreClient)
	userService := newUserServiceServer(store)
	path, handler := appv1connect.NewUserServiceHandler(
		userService,
		connect.WithInterceptors(newAuthInterceptor(authClient)),
	)
	mux.Handle(path, handler)

	// Health check endpoint
	mux.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		_, _ = w.Write([]byte(`{"status":"ok","service":"user-service","env":"` + env + `"}`))
	})

	// Root endpoint
	mux.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		if r.URL.Path != "/" {
			http.NotFound(w, r)
			return
		}
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		_, _ = w.Write([]byte(`{"message":"Lectory User Service","status":"running","port":` + port + `}`))
	})

	server := &http.Server{
		Addr:         ":" + port,
		Handler:      corsMiddleware(mux),
		ReadTimeout:  10 * time.Second,
		WriteTimeout: 10 * time.Second,
		IdleTimeout:  60 * time.Second,
	}

	// Server run context for graceful shutdown
	serverCtx, serverStopCtx := context.WithCancel(context.Background())

	// Listen for syscall signals for process to quit
	sig := make(chan os.Signal, 1)
	signal.Notify(sig, syscall.SIGHUP, syscall.SIGINT, syscall.SIGTERM, syscall.SIGQUIT)

	go func() {
		<-sig

		// Shutdown signal with grace period of 15 seconds
		shutdownCtx, shutdownCancel := context.WithTimeout(serverCtx, 15*time.Second)
		defer shutdownCancel()

		go func() {
			<-shutdownCtx.Done()
			if shutdownCtx.Err() == context.DeadlineExceeded {
				log.Fatal("Graceful shutdown timed out.. forcing exit.")
			}
		}()

		// Trigger graceful shutdown
		log.Println("Shutting down user service...")
		if err := server.Shutdown(shutdownCtx); err != nil {
			log.Fatalf("Error during server shutdown: %v", err)
		}
		serverStopCtx()
	}()

	log.Printf("User service starting on port %s (http://localhost:%s)", port, port)
	if err := server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
		log.Fatalf("User service failed to start: %v", err)
	}

	// Wait for server context to be stopped
	<-serverCtx.Done()
	fmt.Println("User service stopped gracefully")
}
