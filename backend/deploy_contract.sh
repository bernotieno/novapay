#!/bin/bash

echo "🚀 Deploying NovaPay Soroban Smart Contract"
echo "==========================================="

cd soroban-contract

# Build the contract
echo "🔨 Building contract..."
soroban contract build

if [ ! -f "target/wasm32v1-none/release/novapay_contract.wasm" ]; then
    echo "❌ Build failed - WASM file not found"
    exit 1
fi

# Deploy to testnet
echo "📡 Deploying to Stellar testnet..."
CONTRACT_ID=$(soroban contract deploy \
    --wasm target/wasm32v1-none/release/novapay_contract.wasm \
    --source-account default \
    --network testnet)

echo "✅ Contract deployed!"
echo "📋 Contract ID: $CONTRACT_ID"

# Save contract ID to env file
echo "SOROBAN_CONTRACT_ID=$CONTRACT_ID" >> ../.env

echo "🎉 Deployment complete! Contract ID saved to .env"