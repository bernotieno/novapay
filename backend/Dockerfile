# Build stage
FROM rust:latest as builder

WORKDIR /app

# 1. Copy only manifests first (to cache dependencies)
COPY Cargo.toml Cargo.lock ./

# 2. Create a dummy main file to allow compiling dependencies
RUN mkdir src && echo "fn main() {}" > src/main.rs

# 3. Build dependencies (this will be cached unless Cargo.toml changes)
RUN cargo build --release || true

# 4. Now copy the actual source
COPY src ./src
COPY migrations ./migrations

# 5. Rebuild with actual code
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
