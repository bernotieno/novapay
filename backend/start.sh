#!/bin/bash

echo "🚀 Starting NovaPay Backend Server"
echo "=================================="

# Check if .env exists
if [ ! -f .env ]; then
    echo "📝 Creating .env file from template..."
    cp .env.example .env
    echo "⚠️  Please edit .env file with your configuration"
fi

# Setup database
echo "🗄️  Setting up database..."
if [ ! -f novapay.db ]; then
    touch novapay.db
fi
sqlite3 novapay.db < migrations/001_initial.sql
echo "✅ Database ready"

# Build and run
echo "🔨 Building backend..."
cargo build --release

echo "🌟 Starting server on port 3000..."
echo "📡 API Documentation: http://localhost:3000"
echo "🧪 Test with: ./test_api.sh"
echo ""

# Run the server
./target/release/novapay-backend