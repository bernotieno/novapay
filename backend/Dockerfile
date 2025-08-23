# Build stage
FROM rust:1.75 as builder

WORKDIR /app

# 1. Copy only manifests first (to cache deps)
COPY Cargo.toml Cargo.lock ./
RUN mkdir src && echo "fn main() {}" > src/main.rs
RUN cargo build --release || true

# 2. Now copy real source code
COPY src ./src
COPY migrations ./migrations

# 3. Build actual application
RUN cargo build --release

# Runtime stage
FROM debian:bookworm-slim

# Install runtime dependencies
RUN apt-get update && apt-get install -y \
    ca-certificates \
    libssl3 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy binary + migrations
COPY --from=builder /app/target/release/novapay-backend .
COPY --from=builder /app/migrations ./migrations

# Create a non-root user
RUN useradd -r -s /bin/false novapay
RUN chown -R novapay:novapay /app
USER novapay

EXPOSE 10000

CMD ["./novapay-backend"]
