import React, { useState } from 'react';
import { Smartphone, Zap, DollarSign } from 'lucide-react';
import { fonbnkService } from '../services/fonbnk';

interface FonbnkDepositProps {
  onDepositComplete: (newBalance: number) => void;
}

export const FonbnkDeposit: React.FC<FonbnkDepositProps> = ({ onDepositComplete }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [airtimeAmount, setAirtimeAmount] = useState('');
  const [currency, setCurrency] = useState('KES');
  const [isLoading, setIsLoading] = useState(false);
  const [estimatedXLM, setEstimatedXLM] = useState<number | null>(null);

  const handleEstimate = async () => {
    if (airtimeAmount && currency) {
      try {
        const xlmAmount = await fonbnkService.calculateXLMFromAirtime(
          parseFloat(airtimeAmount), 
          currency
        );
        setEstimatedXLM(xlmAmount);
      } catch (error) {
        console.error('Failed to calculate estimate:', error);
      }
    }
  };

  const handleDeposit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fonbnkService.depositViaAirtime({
        phone_number: phoneNumber,
        airtime_amount: parseFloat(airtimeAmount),
        currency,
      });

      if (response.success) {
        onDepositComplete(response.new_balance);
        // Reset form
        setPhoneNumber('');
        setAirtimeAmount('');
        setEstimatedXLM(null);
        alert(`Success! ${response.xlm_amount.toFixed(4)} XLM added to your wallet`);
      }
    } catch (error) {
      console.error('Deposit failed:', error);
      alert('Deposit failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-orange-100 rounded-lg">
          <Smartphone className="w-6 h-6 text-orange-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Deposit via Airtime</h3>
          <p className="text-sm text-gray-600">Convert your mobile airtime to XLM</p>
        </div>
      </div>

      <form onSubmit={handleDeposit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number
          </label>
          <input
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="+254712345678"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Currency
          </label>
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="KES">KES (Kenya Shilling)</option>
            <option value="UGX">UGX (Uganda Shilling)</option>
            <option value="TZS">TZS (Tanzania Shilling)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Airtime Amount
          </label>
          <div className="relative">
            <input
              type="number"
              value={airtimeAmount}
              onChange={(e) => {
                setAirtimeAmount(e.target.value);
                setEstimatedXLM(null);
              }}
              onBlur={handleEstimate}
              placeholder="1000"
              min="10"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <span className="absolute right-3 top-2 text-gray-500 text-sm">
              {currency}
            </span>
          </div>
        </div>

        {estimatedXLM && (
          <div className="bg-blue-50 p-3 rounded-md">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-blue-600" />
              <span className="text-sm text-blue-800">
                Estimated: ~{estimatedXLM.toFixed(4)} XLM
              </span>
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading || !phoneNumber || !airtimeAmount}
          className="w-full bg-orange-600 text-white py-2 px-4 rounded-md hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Converting Airtime...
            </>
          ) : (
            <>
              <DollarSign className="w-4 h-4" />
              Convert Airtime to XLM
            </>
          )}
        </button>
      </form>

      <div className="mt-4 text-xs text-gray-500">
        <p>• Airtime will be deducted from your mobile account</p>
        <p>• Conversion happens instantly via Fonbnk</p>
        <p>• XLM will be added to your NovaPay wallet</p>
      </div>
    </div>
  );
};