# NovaPay Backend Deployment Guide

## 🚀 Quick Start

### Development
```bash
# 1. Start the backend
cd backend
./start.sh

# 2. Test the API
./test_api.sh

# 3. Start frontend (in another terminal)
cd ../frontend
npm run dev
```

## 🏗️ Architecture Overview

### Backend Components
- **Axum Web Server**: High-performance async web framework
- **JWT Authentication**: Secure token-based auth with Argon2 password hashing
- **SQLite Database**: Development database (easily switchable to PostgreSQL)
- **Stellar Integration**: Testnet integration with Horizon API
- **Soroban Contracts**: Smart contracts for remittance logic

### API Endpoints
- `POST /auth/register` - User registration
- `POST /auth/login` - User authentication
- `GET /auth/me` - Get current user (protected)
- `POST /transactions/send` - Send money (protected)
- `GET /transactions/history` - Transaction history (protected)
- `POST /stellar/fund-test-account` - Fund testnet account (protected)
- `GET /stellar/get-balance` - Get account balance (protected)

## 🔧 Configuration

### Environment Variables (.env)
```bash
DATABASE_URL=sqlite:./novapay.db
JWT_SECRET=your-super-secret-jwt-key
STELLAR_NETWORK=testnet
STELLAR_HORIZON_URL=https://horizon-testnet.stellar.org
FRIENDBOT_URL=https://friendbot.stellar.org
PORT=3000
```

### Database Schema
- **users**: User accounts with Stellar keypairs
- **transactions**: Payment transaction records
- **wallets**: Stellar wallet information

## 🌐 Production Deployment

### Docker Deployment
```dockerfile
FROM rust:1.70 as builder
WORKDIR /app
COPY . .
RUN cargo build --release

FROM debian:bookworm-slim
RUN apt-get update && apt-get install -y ca-certificates && rm -rf /var/lib/apt/lists/*
COPY --from=builder /app/target/release/novapay-backend /usr/local/bin/
EXPOSE 3000
CMD ["novapay-backend"]
```

### Environment Setup
1. **Database**: Switch to PostgreSQL for production
2. **Secrets**: Use proper secret management (AWS Secrets Manager, etc.)
3. **Stellar**: Configure for mainnet when ready
4. **Monitoring**: Add logging and metrics
5. **Security**: Enable HTTPS, rate limiting, input sanitization

### Scaling Considerations
- **Load Balancing**: Use nginx or AWS ALB
- **Database**: PostgreSQL with connection pooling
- **Caching**: Redis for session management
- **Monitoring**: Prometheus + Grafana
- **Logging**: Structured logging with tracing

## 🔐 Security Features

### Implemented
- ✅ Password hashing with Argon2
- ✅ JWT token authentication
- ✅ Input validation on all endpoints
- ✅ CORS configuration
- ✅ SQL injection prevention (SQLx)

### Production Recommendations
- [ ] Rate limiting
- [ ] Request size limits
- [ ] HTTPS enforcement
- [ ] Security headers
- [ ] API key management
- [ ] Audit logging

## 🧪 Testing

### Manual Testing
```bash
# Run the test script
./test_api.sh
```

### Unit Tests
```bash
# Run Rust tests
cargo test

# Run Soroban contract tests
cd soroban-contract
cargo test
```

### Integration Testing
```bash
# Test with real Stellar testnet
curl -X POST "http://localhost:3000/stellar/fund-test-account" \
  -H "Authorization: Bearer $TOKEN"
```

## 📊 Monitoring & Observability

### Metrics to Track
- Request latency and throughput
- Authentication success/failure rates
- Transaction processing times
- Stellar network interaction success rates
- Database connection pool usage

### Logging
- Structured JSON logging
- Request/response logging
- Error tracking with stack traces
- Stellar transaction logging

## 🔄 CI/CD Pipeline

### GitHub Actions Example
```yaml
name: Deploy NovaPay Backend
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions-rs/toolchain@v1
        with:
          toolchain: stable
      - run: cargo test
      - run: cargo build --release
      - name: Deploy to production
        run: # Your deployment script
```

## 🌟 Stellar Integration Details

### Testnet Configuration
- **Network**: Stellar Testnet
- **Horizon URL**: https://horizon-testnet.stellar.org
- **Friendbot**: https://friendbot.stellar.org (for funding test accounts)

### Mainnet Migration
1. Update `STELLAR_NETWORK=mainnet`
2. Change Horizon URL to mainnet
3. Remove Friendbot integration
4. Implement proper account funding mechanism
5. Add transaction fee management

### Soroban Smart Contracts
- Contract deployment on Stellar network
- Remittance logic implementation
- Event emission for transaction tracking
- Integration with backend API

## 📈 Performance Optimization

### Backend Optimizations
- Connection pooling for database
- Async/await throughout the stack
- Efficient JSON serialization
- Minimal memory allocations

### Database Optimizations
- Proper indexing on frequently queried fields
- Connection pooling
- Query optimization
- Database migrations

## 🚨 Error Handling

### HTTP Status Codes
- `200`: Success
- `400`: Bad Request (validation errors)
- `401`: Unauthorized (invalid/missing token)
- `404`: Not Found
- `409`: Conflict (duplicate email)
- `500`: Internal Server Error

### Error Response Format
```json
{
  "error": "Description of the error",
  "code": "ERROR_CODE",
  "details": {}
}
```

## 📚 Additional Resources

- [Stellar Documentation](https://developers.stellar.org/)
- [Soroban Smart Contracts](https://soroban.stellar.org/)
- [Axum Web Framework](https://github.com/tokio-rs/axum)
- [SQLx Database Toolkit](https://github.com/launchbadge/sqlx)