# Build stage
FROM rust:1.75 as builder

WORKDIR /app
COPY Cargo.toml Cargo.lock ./
COPY src ./src
COPY migrations ./migrations

# Build the application
RUN cargo build --release

# Runtime stage
FROM debian:bookworm-slim

# Install runtime dependencies
RUN apt-get update && apt-get install -y \
    ca-certificates \
    libssl3 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy the binary from builder stage
COPY --from=builder /app/target/release/novapay-backend .
COPY --from=builder /app/migrations ./migrations

# Create a non-root user
RUN useradd -r -s /bin/false novapay
RUN chown -R novapay:novapay /app
USER novapay

EXPOSE 10000

CMD ["./novapay-backend"]