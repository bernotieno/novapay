const API_BASE_URL = 'http://localhost:3000';

interface User {
  id: string;
  email: string;
  full_name: string;
  name?: string;
  phone_number?: string;
  phone?: string;
  stellar_public_key?: string;
  created_at?: string;
  updated_at?: string;
}

interface LoginResponse {
  token: string;
  user: User;
}

interface Transaction {
  id: string;
  recipient_email: string;
  amount: number;
  currency: string;
  target_currency: string;
  status: string;
  created_at: string;
  stellar_tx_hash?: string;
}

class ApiService {
  private getAuthHeaders() {
    const token = localStorage.getItem('novapay_token');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  }

  async register(email: string, password: string, full_name: string): Promise<LoginResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, full_name })
    });
    
    if (!response.ok) throw new Error('Registration failed');
    return response.json();
  }

  async login(email: string, password: string): Promise<LoginResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    
    if (!response.ok) throw new Error('Login failed');
    return response.json();
  }

  async getCurrentUser(): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: this.getAuthHeaders()
    });
    
    if (!response.ok) throw new Error('Failed to get user');
    return response.json();
  }

  async getUserProfile(): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/user/profile`, {
      headers: this.getAuthHeaders()
    });
    
    if (!response.ok) throw new Error('Failed to get user profile');
    return response.json();
  }

  async updateUserProfile(profileData: Partial<User>): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/user/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeaders()
      },
      body: JSON.stringify(profileData)
    });
    
    if (!response.ok) throw new Error('Failed to update profile');
    return response.json();
  }

  async sendMoney(recipient_email: string, amount: number, currency = 'USD', target_currency = 'KES') {
    const response = await fetch(`${API_BASE_URL}/transactions/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeaders()
      },
      body: JSON.stringify({ recipient_email, amount, currency, target_currency })
    });
    
    if (!response.ok) throw new Error('Failed to send money');
    return response.json();
  }

  async getTransactionHistory(): Promise<Transaction[]> {
    const response = await fetch(`${API_BASE_URL}/transactions/history`, {
      headers: this.getAuthHeaders()
    });
    
    if (!response.ok) throw new Error('Failed to get transactions');
    return response.json();
  }

  async fundTestAccount() {
    const response = await fetch(`${API_BASE_URL}/stellar/fund-test-account`, {
      method: 'POST',
      headers: this.getAuthHeaders()
    });
    
    if (!response.ok) throw new Error('Failed to fund account');
    return response.json();
  }

  async getBalance() {
    const response = await fetch(`${API_BASE_URL}/stellar/get-balance`, {
      headers: this.getAuthHeaders()
    });
    
    if (!response.ok) throw new Error('Failed to get balance');
    return response.json();
  }

  async getWalletBalance() {
    const response = await fetch(`${API_BASE_URL}/wallet/balance`, {
      headers: this.getAuthHeaders()
    });
    
    if (!response.ok) throw new Error('Failed to get wallet balance');
    return response.json();
  }

  async depositFromMpesa(kesAmount: number, mpesaRef: string) {
    const response = await fetch(`${API_BASE_URL}/wallet/deposit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeaders()
      },
      body: JSON.stringify({ kes_amount: kesAmount, mpesa_ref: mpesaRef })
    });
    
    if (!response.ok) throw new Error('Failed to deposit');
    return response.json();
  }

  async withdrawToMpesa(xlmAmount: number, mpesaNumber: string) {
    const response = await fetch(`${API_BASE_URL}/wallet/withdraw`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeaders()
      },
      body: JSON.stringify({ xlm_amount: xlmAmount, mpesa_number: mpesaNumber })
    });
    
    if (!response.ok) throw new Error('Failed to withdraw');
    return response.json();
  }

  async transferToWallet(xlmAmount: number, toWalletId: string) {
    const response = await fetch(`${API_BASE_URL}/wallet/transfer`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeaders()
      },
      body: JSON.stringify({ xlm_amount: xlmAmount, to_wallet_id: toWalletId })
    });
    
    if (!response.ok) throw new Error('Failed to transfer');
    return response.json();
  }
}

export const apiService = new ApiService();
export type { User, Transaction };