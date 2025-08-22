# NovaPay Wallet SDK

A comprehensive Stellar blockchain wallet SDK for seamless integration with NovaPay's cross-border payment platform.

## Features

- **Wallet Management**: Create and manage Stellar wallets
- **Balance Queries**: Get real-time account balances
- **Payments**: Send XLM and custom assets
- **Trustlines**: Create trustlines for custom assets
- **Testnet Support**: Fund testnet accounts for development
- **Validation**: Built-in address and secret key validation

## Backend Integration

### Rust SDK

```rust
use crate::wallet_sdk::{NovaPayWallet, WalletConfig};

// Create wallet configuration
let config = WalletConfig {
    network: "testnet".to_string(),
    horizon_url: "https://horizon-testnet.stellar.org".to_string(),
};

// Generate new wallet
let (public_key, secret_key) = NovaPayWallet::generate();

// Initialize wallet
let wallet = NovaPayWallet::new(&secret_key, config)?;

// Get balances
let balances = wallet.get_balances().await?;

// Send payment
let result = wallet.send_payment(
    "GDESTINATION...", 
    "10.0", 
    None // XLM
).await?;
```

### Service Layer

```rust
use crate::wallet_sdk_service::WalletSDKService;

let service = WalletSDKService::new();

// Create wallet
let wallet_response = service.create_wallet();

// Get balance
let balance = service.get_wallet_balance(&secret_key).await?;

// Send payment
let payment_request = SendPaymentRequest {
    destination: "GDEST...".to_string(),
    amount: "5.0".to_string(),
    asset_code: None,
    memo: Some("Payment memo".to_string()),
};
let result = service.send_payment(&secret_key, payment_request).await?;
```

## Frontend Integration

### TypeScript SDK

```typescript
import { walletSDK } from './services/walletSDK';

// Create new wallet
const wallet = await walletSDK.createWallet();
console.log('Public Key:', wallet.public_key);

// Get wallet balance
const balance = await walletSDK.getWalletBalance(wallet.secret_key);
console.log('Balances:', balance.balances);

// Send payment
const payment = await walletSDK.sendPayment(wallet.secret_key, {
  destination: 'GDEST...',
  amount: '10.0',
  asset_code: 'XLM'
});
console.log('Transaction Hash:', payment.transaction_hash);

// Fund testnet account
const funded = await walletSDK.fundTestnetAccount(wallet.secret_key);
console.log('Funded:', funded.success);
```

## API Endpoints

All endpoints require authentication via JWT token.

### Create Wallet
```http
POST /sdk/wallet/create
Authorization: Bearer <token>
```

**Response:**
```json
{
  "public_key": "GXXXXXXX...",
  "secret_key": "SXXXXXXX...",
  "wallet_id": "uuid-here"
}
```

### Get Balance
```http
POST /sdk/wallet/balance
Content-Type: application/json
Authorization: Bearer <token>

{
  "secret_key": "SXXXXXXX..."
}
```

**Response:**
```json
{
  "balances": [
    {
      "asset_code": "XLM",
      "balance": "100.0000000",
      "limit": null
    }
  ],
  "public_key": "GXXXXXXX..."
}
```

### Send Payment
```http
POST /sdk/wallet/send
Content-Type: application/json
Authorization: Bearer <token>

{
  "secret_key": "SXXXXXXX...",
  "destination": "GDEST...",
  "amount": "10.0",
  "asset_code": "XLM",
  "memo": "Payment description"
}
```

**Response:**
```json
{
  "transaction_hash": "abc123...",
  "amount": "10.0",
  "asset_code": "XLM",
  "destination": "GDEST..."
}
```

### Fund Testnet Account
```http
POST /sdk/wallet/fund-testnet
Content-Type: application/json
Authorization: Bearer <token>

{
  "secret_key": "SXXXXXXX..."
}
```

### Create Trustline
```http
POST /sdk/wallet/trustline
Content-Type: application/json
Authorization: Bearer <token>

{
  "secret_key": "SXXXXXXX...",
  "asset_code": "USD",
  "issuer": "GISSUER...",
  "limit": "1000"
}
```

## Error Handling

The SDK provides comprehensive error handling:

```rust
use crate::wallet_sdk::WalletError;

match wallet.send_payment("GDEST...", "10.0", None).await {
    Ok(result) => println!("Success: {}", result.transaction_hash),
    Err(WalletError::InsufficientBalance) => println!("Not enough funds"),
    Err(WalletError::NetworkError(msg)) => println!("Network error: {}", msg),
    Err(WalletError::TransactionFailed(msg)) => println!("Transaction failed: {}", msg),
    Err(e) => println!("Other error: {}", e),
}
```

## Validation Utilities

```typescript
// Validate Stellar addresses
const isValidAddress = walletSDK.validateStellarAddress('GXXXXXXX...');

// Validate secret keys
const isValidSecret = walletSDK.validateStellarSecret('SXXXXXXX...');

// Format amounts
const formatted = walletSDK.formatAmount(10.123456789); // "10.1234568"

// Convert between XLM and stroops
const stroops = walletSDK.xlmToStroops('10.0'); // "100000000"
const xlm = walletSDK.stroopsToXLM('100000000'); // "10.0000000"
```

## Environment Configuration

Set these environment variables:

```bash
STELLAR_NETWORK=testnet  # or "mainnet"
```

The SDK automatically configures Horizon URLs based on the network setting.

## Security Best Practices

1. **Never expose secret keys** in frontend code
2. **Store secret keys securely** on the backend
3. **Use environment variables** for configuration
4. **Validate all inputs** before processing
5. **Use HTTPS** in production
6. **Implement rate limiting** for API endpoints

## Integration Examples

### React Hook

```typescript
import { useState, useEffect } from 'react';
import { walletSDK, WalletBalanceResponse } from '../services/walletSDK';

export const useWallet = (secretKey?: string) => {
  const [balance, setBalance] = useState<WalletBalanceResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const refreshBalance = async () => {
    if (!secretKey) return;
    setLoading(true);
    try {
      const balanceData = await walletSDK.getWalletBalance(secretKey);
      setBalance(balanceData);
    } catch (error) {
      console.error('Failed to load balance:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshBalance();
  }, [secretKey]);

  return { balance, loading, refreshBalance };
};
```

### Payment Component

```typescript
const SendPayment: React.FC = () => {
  const [form, setForm] = useState({
    destination: '',
    amount: '',
    memo: ''
  });

  const handleSend = async () => {
    try {
      const result = await walletSDK.sendPayment(userSecretKey, {
        destination: form.destination,
        amount: form.amount,
        memo: form.memo
      });
      alert(`Payment sent! TX: ${result.transaction_hash}`);
    } catch (error) {
      alert('Payment failed');
    }
  };

  return (
    <form onSubmit={handleSend}>
      {/* Form fields */}
    </form>
  );
};
```

This SDK provides a complete solution for Stellar blockchain integration within the NovaPay ecosystem.