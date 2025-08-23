const API_BASE_URL = 'http://localhost:3000';

export interface FonbnkDepositRequest {
  phone_number: string;
  airtime_amount: number;
  currency: string;
}

export interface FonbnkDepositResponse {
  success: boolean;
  transaction_id: string;
  usd_amount: number;
  xlm_amount: number;
  new_balance: number;
  message: string;
}

export interface FonbnkRateRequest {
  from_currency: string;
  to_currency: string;
}

export interface FonbnkRateResponse {
  from_currency: string;
  to_currency: string;
  rate: number;
}

export const fonbnkService = {
  async depositViaAirtime(request: FonbnkDepositRequest): Promise<FonbnkDepositResponse> {
    const token = localStorage.getItem('token');
    
    const response = await fetch(`${API_BASE_URL}/fonbnk/deposit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`Fonbnk deposit failed: ${response.statusText}`);
    }

    return response.json();
  },

  async getConversionRate(request: FonbnkRateRequest): Promise<FonbnkRateResponse> {
    const token = localStorage.getItem('token');
    
    const response = await fetch(`${API_BASE_URL}/fonbnk/rate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`Failed to get conversion rate: ${response.statusText}`);
    }

    return response.json();
  },

  // Helper function to calculate XLM amount from airtime
  calculateXLMFromAirtime(airtimeAmount: number, currency: string): Promise<number> {
    return this.getConversionRate({ from_currency: currency, to_currency: 'USD' })
      .then(rate => {
        const usdAmount = airtimeAmount * rate.rate;
        const xlmAmount = usdAmount * 8.33; // Approximate USD to XLM rate
        return xlmAmount;
      });
  },
};