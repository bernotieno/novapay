#!/bin/bash

BASE_URL="http://localhost:3000"

echo "🚀 Testing NovaPay Backend API"
echo "================================"

# Test user registration
echo "📝 Testing user registration..."
REGISTER_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@novapay.com",
    "password": "password123",
    "full_name": "Test User"
  }')

echo "Register Response: $REGISTER_RESPONSE"

# Extract token from response
TOKEN=$(echo $REGISTER_RESPONSE | grep -o '"token":"[^"]*"' | cut -d'"' -f4)
echo "Token: $TOKEN"

if [ -n "$TOKEN" ]; then
  echo "✅ Registration successful!"
  
  # Test protected route - get user info
  echo "👤 Testing user info endpoint..."
  curl -s -X GET "$BASE_URL/auth/me" \
    -H "Authorization: Bearer $TOKEN" | jq .
  
  # Test fund test account
  echo "💰 Testing fund test account..."
  curl -s -X POST "$BASE_URL/stellar/fund-test-account" \
    -H "Authorization: Bearer $TOKEN" | jq .
  
  # Test get balance
  echo "💳 Testing get balance..."
  curl -s -X GET "$BASE_URL/stellar/get-balance" \
    -H "Authorization: Bearer $TOKEN" | jq .
  
  # Test send money
  echo "💸 Testing send money..."
  curl -s -X POST "$BASE_URL/transactions/send" \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d '{
      "recipient_email": "recipient@example.com",
      "amount": 100.50,
      "currency": "USD",
      "target_currency": "KES"
    }' | jq .
  
  # Test transaction history
  echo "📊 Testing transaction history..."
  curl -s -X GET "$BASE_URL/transactions/history" \
    -H "Authorization: Bearer $TOKEN" | jq .
    
else
  echo "❌ Registration failed!"
fi

echo "🏁 API testing complete!"