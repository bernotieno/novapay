#!/bin/bash

# Render.com build script for NovaPay Backend

set -e

echo "🔧 Installing Rust toolchain..."
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
source ~/.cargo/env

echo "🏗️  Building NovaPay Backend..."
cargo build --release

echo "✅ Build completed successfully!"