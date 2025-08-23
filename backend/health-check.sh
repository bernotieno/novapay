#!/bin/bash

# Health check script for production monitoring

API_URL="${API_URL:-http://localhost:10000}"

echo "🏥 NovaPay Backend Health Check"
echo "================================"

# Basic health check
echo "📡 Testing API connectivity..."
if curl -s -f "$API_URL/health" > /dev/null; then
    echo "✅ API is responding"
else
    echo "❌ API is not responding"
    exit 1
fi

# Database connectivity (if health endpoint includes DB check)
echo "🗄️ Testing database connectivity..."
DB_STATUS=$(curl -s "$API_URL/health" | grep -o '"database":"[^"]*"' | cut -d'"' -f4)
if [ "$DB_STATUS" = "ok" ]; then
    echo "✅ Database is connected"
else
    echo "❌ Database connection failed"
    exit 1
fi

echo "✅ All health checks passed!"