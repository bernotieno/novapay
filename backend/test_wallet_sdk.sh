#!/bin/bash

BASE_URL="http://localhost:3000"

# First, register a test user and get token
echo "1. Registering test user..."
REGISTER_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "full_name": "Test User"
  }')

TOKEN=$(echo $REGISTER_RESPONSE | grep -o '"token":"[^"]*' | cut -d'"' -f4)
echo "Token: $TOKEN"

# 2. Create wallet
echo -e "\n2. Creating wallet..."
WALLET_RESPONSE=$(curl -s -X POST "$BASE_URL/sdk/wallet/create" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN")

echo "Wallet Response: $WALLET_RESPONSE"

SECRET_KEY=$(echo $WALLET_RESPONSE | grep -o '"secret_key":"[^"]*' | cut -d'"' -f4)
PUBLIC_KEY=$(echo $WALLET_RESPONSE | grep -o '"public_key":"[^"]*' | cut -d'"' -f4)

echo "Secret Key: $SECRET_KEY"
echo "Public Key: $PUBLIC_KEY"

# 3. Fund testnet account
echo -e "\n3. Funding testnet account..."
FUND_RESPONSE=$(curl -s -X POST "$BASE_URL/sdk/wallet/fund-testnet" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "{\"secret_key\": \"$SECRET_KEY\"}")

echo "Fund Response: $FUND_RESPONSE"

# 4. Get balance
echo -e "\n4. Getting wallet balance..."
BALANCE_RESPONSE=$(curl -s -X POST "$BASE_URL/sdk/wallet/balance" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "{\"secret_key\": \"$SECRET_KEY\"}")

echo "Balance Response: $BALANCE_RESPONSE"

# 5. Send payment (to self for testing)
echo -e "\n5. Sending test payment..."
PAYMENT_RESPONSE=$(curl -s -X POST "$BASE_URL/sdk/wallet/send" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "{
    \"secret_key\": \"$SECRET_KEY\",
    \"destination\": \"$PUBLIC_KEY\",
    \"amount\": \"1.0\",
    \"memo\": \"Test payment\"
  }")

echo "Payment Response: $PAYMENT_RESPONSE"

echo -e "\n✅ Wallet SDK test completed!"