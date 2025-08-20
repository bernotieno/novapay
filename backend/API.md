# NovaPay Backend API Documentation

## Base URL
```
http://localhost:3000
```

## Authentication
All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## Endpoints

### 🔐 Authentication

#### Register User
```http
POST /auth/register
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "full_name": "John Doe"
}
```

**Response:**
```json
{
  "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "user": {
    "id": "uuid-here",
    "email": "user@example.com",
    "full_name": "John Doe",
    "stellar_public_key": "GXXXXXXX..."
  }
}
```

#### Login User
```http
POST /auth/login
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "user": {
    "id": "uuid-here",
    "email": "user@example.com",
    "full_name": "John Doe",
    "stellar_public_key": "GXXXXXXX..."
  }
}
```

#### Get Current User
```http
GET /auth/me
```
*Requires Authentication*

**Response:**
```json
{
  "id": "uuid-here",
  "email": "user@example.com",
  "full_name": "John Doe",
  "stellar_public_key": "GXXXXXXX..."
}
```

### 💰 Transactions

#### Send Money
```http
POST /transactions/send
```
*Requires Authentication*

**Request Body:**
```json
{
  "recipient_email": "recipient@example.com",
  "amount": 100.50,
  "currency": "USD",
  "target_currency": "KES"
}
```

**Response:**
```json
{
  "transaction": {
    "id": "tx-uuid-here",
    "recipient_email": "recipient@example.com",
    "amount": 100.50,
    "currency": "USD",
    "target_currency": "KES",
    "status": "completed",
    "created_at": "2024-01-15T10:30:00Z",
    "stellar_tx_hash": "tx_abc123..."
  }
}
```

#### Get Transaction History
```http
GET /transactions/history
```
*Requires Authentication*

**Response:**
```json
[
  {
    "id": "tx-uuid-here",
    "recipient_email": "recipient@example.com",
    "amount": 100.50,
    "currency": "USD",
    "target_currency": "KES",
    "status": "completed",
    "created_at": "2024-01-15T10:30:00Z",
    "stellar_tx_hash": "tx_abc123..."
  }
]
```

### 🌟 Stellar Integration

#### Fund Test Account
```http
POST /stellar/fund-test-account
```
*Requires Authentication*

**Response:**
```json
{
  "success": true,
  "message": "Test account funded successfully"
}
```

#### Get Account Balance
```http
GET /stellar/get-balance
```
*Requires Authentication*

**Response:**
```json
{
  "public_key": "GXXXXXXX...",
  "balances": [
    {
      "balance": "10000.0000000",
      "asset_type": "native"
    }
  ]
}
```

## Error Responses

### 400 Bad Request
```json
{
  "error": "Invalid request data"
}
```

### 401 Unauthorized
```json
{
  "error": "Invalid or missing authentication token"
}
```

### 404 Not Found
```json
{
  "error": "Resource not found"
}
```

### 409 Conflict
```json
{
  "error": "Email already exists"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error"
}
```

## Frontend Integration Examples

### JavaScript/TypeScript

```javascript
// Register user
const registerUser = async (userData) => {
  const response = await fetch('http://localhost:3000/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData)
  });
  return response.json();
};

// Login user
const loginUser = async (credentials) => {
  const response = await fetch('http://localhost:3000/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials)
  });
  return response.json();
};

// Send money (protected)
const sendMoney = async (transactionData, token) => {
  const response = await fetch('http://localhost:3000/transactions/send', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(transactionData)
  });
  return response.json();
};

// Get transaction history (protected)
const getTransactionHistory = async (token) => {
  const response = await fetch('http://localhost:3000/transactions/history', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return response.json();
};
```

### React Hook Example

```typescript
import { useState, useEffect } from 'react';

const useAuth = () => {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem('novapay_token')
  );
  const [user, setUser] = useState(null);

  const login = async (credentials: LoginCredentials) => {
    const response = await fetch('http://localhost:3000/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    
    const data = await response.json();
    if (data.token) {
      setToken(data.token);
      setUser(data.user);
      localStorage.setItem('novapay_token', data.token);
    }
    return data;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('novapay_token');
  };

  return { token, user, login, logout };
};
```

## Development Notes

- The backend uses SQLite for development (easily switchable to PostgreSQL)
- JWT tokens expire after 24 hours
- Stellar integration uses testnet for development
- All passwords are hashed with Argon2
- CORS is enabled for frontend integration
- Input validation is performed on all endpoints