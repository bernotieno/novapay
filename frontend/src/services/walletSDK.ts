const API_BASE_URL = 'https://9c8ea870332a.ngrok-free.app';

interface WalletCreateResponse {
  public_key: string;
  secret_key: string;
  wallet_id: string;
}

interface Balance {
  asset_code: string;
  balance: string;
  limit?: string;
}

interface WalletBalanceResponse {
  balances: Balance[];
  public_key: string;
}

interface PaymentResult {
  transaction_hash: string;
  amount: string;
  asset_code: string;
  destination: string;
}

interface SendPaymentRequest {
  destination: string;
  amount: string;
  asset_code?: string;
  memo?: string;
}

class WalletSDK {
  private getAuthHeaders() {
    const token = localStorage.getItem('novapay_token');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  }

  async createWallet(): Promise<WalletCreateResponse> {
    const response = await fetch(`${API_BASE_URL}/sdk/wallet/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeaders()
      }
    });
    
    if (!response.ok) throw new Error('Failed to create wallet');
    return response.json();
  }

  async getWalletBalance(secretKey: string): Promise<WalletBalanceResponse> {
    const response = await fetch(`${API_BASE_URL}/sdk/wallet/balance`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeaders()
      },
      body: JSON.stringify({ secret_key: secretKey })
    });
    
    if (!response.ok) throw new Error('Failed to get wallet balance');
    return response.json();
  }

  async sendPayment(secretKey: string, payment: SendPaymentRequest): Promise<PaymentResult> {
    const response = await fetch(`${API_BASE_URL}/sdk/wallet/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeaders()
      },
      body: JSON.stringify({
        secret_key: secretKey,
        ...payment
      })
    });
    
    if (!response.ok) throw new Error('Failed to send payment');
    return response.json();
  }

  async fundTestnetAccount(secretKey: string): Promise<{ success: boolean; message: string }> {
    const response = await fetch(`${API_BASE_URL}/sdk/wallet/fund-testnet`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeaders()
      },
      body: JSON.stringify({ secret_key: secretKey })
    });
    
    if (!response.ok) throw new Error('Failed to fund testnet account');
    return response.json();
  }

  async createTrustline(
    secretKey: string,
    assetCode: string,
    issuer: string,
    limit?: string
  ): Promise<{ transaction_hash: string; asset_code: string; issuer: string }> {
    const response = await fetch(`${API_BASE_URL}/sdk/wallet/trustline`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeaders()
      },
      body: JSON.stringify({
        secret_key: secretKey,
        asset_code: assetCode,
        issuer,
        limit
      })
    });
    
    if (!response.ok) throw new Error('Failed to create trustline');
    return response.json();
  }

  validateStellarAddress(address: string): boolean {
    return address.length === 56 && address.startsWith('G');
  }

  validateStellarSecret(secret: string): boolean {
    return secret.length === 56 && secret.startsWith('S');
  }

  formatAmount(amount: string | number): string {
    return parseFloat(amount.toString()).toFixed(7);
  }

  stroopsToXLM(stroops: string | number): string {
    return (parseFloat(stroops.toString()) / 10000000).toFixed(7);
  }

  xlmToStroops(xlm: string | number): string {
    return (parseFloat(xlm.toString()) * 10000000).toString();
  }
}

export const walletSDK = new WalletSDK();
export type { WalletCreateResponse, Balance, WalletBalanceResponse, PaymentResult, SendPaymentRequest };