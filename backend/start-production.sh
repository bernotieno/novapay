#!/bin/bash

# Production startup script for NovaPay Backend

set -e

echo "🚀 Starting NovaPay Backend in production mode..."

# Set production environment
export RUST_ENV=production
export RUST_LOG=info

# Check required environment variables
required_vars=(
    "DATABASE_URL"
    "JWT_SECRET"
    "FONBNK_CLIENT_ID"
    "FONBNK_API_SIGNATURE_SECRET"
    "FONBNK_URL_SIGNATURE_SECRET"
    "FONBNK_SOURCE_PARAM"
)

for var in "${required_vars[@]}"; do
    if [ -z "${!var}" ]; then
        echo "❌ Error: $var is not set"
        exit 1
    fi
done

echo "✅ All required environment variables are set"

# Start the application
exec ./target/release/novapay-backend