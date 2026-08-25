# Multi-stage Dockerfile for user-service
FROM golang:1.24-alpine AS builder

WORKDIR /app

# Copy root module and services
COPY go.mod ./
COPY gen/ ./gen/
COPY services/user/ ./services/user/

WORKDIR /app/services/user
ENV GOTOOLCHAIN=auto
RUN go mod download
RUN CGO_ENABLED=0 GOOS=linux go build -o /app/user-service .

FROM alpine:3.20
RUN apk --no-cache add ca-certificates tzdata

WORKDIR /app
COPY --from=builder /app/user-service /app/user-service

ENV PORT=8080
EXPOSE 8080

CMD ["/app/user-service"]
