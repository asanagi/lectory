package main

import (
	"context"
	"errors"
	"fmt"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"cloud.google.com/go/firestore"
	connect "connectrpc.com/connect"
	firebase "firebase.google.com/go/v4"
	"google.golang.org/api/option"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"

	appv1 "lectory/gen/go/app/v1"
	"lectory/gen/go/app/v1/appv1connect"
)

type userServiceServer struct {
	firestoreClient *firestore.Client
}

func (s *userServiceServer) GetProfile(
	ctx context.Context,
	req *connect.Request[appv1.GetProfileRequest],
) (*connect.Response[appv1.GetProfileResponse], error) {
	userID := req.Msg.GetUserId()
	if userID == "" {
		return nil, connect.NewError(connect.CodeInvalidArgument, errors.New("userId is required"))
	}

	doc, err := s.firestoreClient.Collection("users").Doc(userID).Get(ctx)
	if err != nil {
		if status.Code(err) == codes.NotFound {
			return nil, connect.NewError(connect.CodeNotFound, fmt.Errorf("user %s not found", userID))
		}
		return nil, connect.NewError(connect.CodeInternal, fmt.Errorf("failed to fetch user: %w", err))
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

	res := connect.NewResponse(&appv1.GetProfileResponse{
		UserId:      userID,
		DisplayName: displayName,
		Roles:       roles,
	})
	return res, nil
}

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "8082"
	}

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
		log.Fatalf("Error initializing Firebase App: %v", err)
	}

	firestoreClient, err := app.Firestore(ctx)
	if err != nil {
		log.Fatalf("Error initializing Firestore client: %v", err)
	}
	defer firestoreClient.Close()

	mux := http.NewServeMux()

	// Register UserService Connect RPC handler
	userService := &userServiceServer{firestoreClient: firestoreClient}
	path, handler := appv1connect.NewUserServiceHandler(userService)
	mux.Handle(path, handler)

	// Health check endpoint
	mux.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		_, _ = w.Write([]byte(`{"status":"ok","service":"user-service"}`))
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
		Handler:      mux,
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
