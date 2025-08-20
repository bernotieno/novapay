# NovaPay Backend

Rust backend for the NovaPay cross-border remittance platform built on Stellar blockchain.

## 🚀 Quick Start

1. **Install Rust**: https://rustup.rs/

2. **Setup Environment**:
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. **Run the server**:
```bash
cargo run
```

The server will start on `http://localhost:3000`

## 📡 API Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `GET /auth/me` - Get current user (protected)

### Transactions
- `POST /transactions/send` - Send money (protected)
- `GET /transactions/history` - Get transaction history (protected)

### Stellar
- `POST /stellar/fund-test-account` - Fund testnet account (protected)
- `GET /stellar/get-balance` - Get account balance (protected)

## 🔧 Development

```bash
# Run with auto-reload
cargo watch -x run

# Run tests
cargo test

# Format code
cargo fmt

# Lint code
cargo clippy
```

## 🌐 Frontend Integration

The React frontend should call these endpoints with JWT authentication:

```javascript
// Login example
const response = await fetch('http://localhost:3000/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password })
});

// Protected request example
const response = await fetch('http://localhost:3000/auth/me', {
  headers: { 'Authorization': `Bearer ${token}` }
});
```

## 🔐 Security

- Passwords hashed with Argon2
- JWT tokens for authentication
- CORS enabled for frontend integration
- Input validation on all endpoints

## 🌟 Stellar Integration

- Testnet support with Friendbot funding
- Mock payment processing (replace with real Stellar SDK)
- Account balance queries
- Transaction history tracking