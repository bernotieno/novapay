#!/bin/bash

# Production deployment script for NovaPay Backend

set -e

echo "🚀 Deploying NovaPay Backend to Production..."

# Build optimized release
echo "📦 Building optimized release..."
cargo build --release

# Run tests
echo "🧪 Running tests..."
cargo test

# Create deployment directory
DEPLOY_DIR="/opt/novapay"
echo "📁 Setting up deployment directory: $DEPLOY_DIR"
sudo mkdir -p $DEPLOY_DIR
sudo chown $USER:$USER $DEPLOY_DIR

# Copy binary and assets
echo "📋 Copying application files..."
cp target/release/novapay-backend $DEPLOY_DIR/
cp -r migrations $DEPLOY_DIR/
cp .env.production $DEPLOY_DIR/.env

# Set permissions
chmod +x $DEPLOY_DIR/novapay-backend

# Create systemd service
echo "⚙️ Creating systemd service..."
sudo tee /etc/systemd/system/novapay.service > /dev/null <<EOF
[Unit]
Description=NovaPay Backend Service
After=network.target

[Service]
Type=simple
User=$USER
WorkingDirectory=$DEPLOY_DIR
ExecStart=$DEPLOY_DIR/novapay-backend
Restart=always
RestartSec=10
Environment=RUST_LOG=info

[Install]
WantedBy=multi-user.target
EOF

# Reload systemd and start service
echo "🔄 Starting service..."
sudo systemctl daemon-reload
sudo systemctl enable novapay
sudo systemctl restart novapay

echo "✅ Deployment complete!"
echo "📊 Check status: sudo systemctl status novapay"
echo "📝 View logs: sudo journalctl -u novapay -f"