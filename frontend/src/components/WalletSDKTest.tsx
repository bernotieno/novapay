import React, { useState } from 'react';
import { walletSDK } from '../services/walletSDK';
import Button from './Button';
import Card from './Card';

const WalletSDKTest: React.FC = () => {
  const [wallet, setWallet] = useState<any>(null);
  const [balance, setBalance] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const testCreateWallet = async () => {
    setLoading(true);
    try {
      const newWallet = await walletSDK.createWallet();
      setWallet(newWallet);
      addLog(`✅ Wallet created: ${newWallet.public_key.substring(0, 10)}...`);
    } catch (error) {
      addLog(`❌ Failed to create wallet: ${error}`);
    }
    setLoading(false);
  };

  const testFundAccount = async () => {
    if (!wallet) return;
    setLoading(true);
    try {
      const result = await walletSDK.fundTestnetAccount(wallet.secret_key);
      addLog(`✅ Testnet funding: ${result.success ? 'Success' : 'Failed'}`);
    } catch (error) {
      addLog(`❌ Failed to fund account: ${error}`);
    }
    setLoading(false);
  };

  const testGetBalance = async () => {
    if (!wallet) return;
    setLoading(true);
    try {
      const balanceData = await walletSDK.getWalletBalance(wallet.secret_key);
      setBalance(balanceData);
      addLog(`✅ Balance loaded: ${balanceData.balances[0]?.balance || '0'} XLM`);
    } catch (error) {
      addLog(`❌ Failed to get balance: ${error}`);
    }
    setLoading(false);
  };

  const testSendPayment = async () => {
    if (!wallet) return;
    setLoading(true);
    try {
      const result = await walletSDK.sendPayment(wallet.secret_key, {
        destination: wallet.public_key, // Send to self
        amount: '1.0',
        memo: 'SDK Test Payment'
      });
      addLog(`✅ Payment sent: ${result.transaction_hash.substring(0, 10)}...`);
    } catch (error) {
      addLog(`❌ Failed to send payment: ${error}`);
    }
    setLoading(false);
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Wallet SDK Test</h2>
      
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Button onClick={testCreateWallet} disabled={loading}>
            1. Create Wallet
          </Button>
          <Button onClick={testFundAccount} disabled={loading || !wallet}>
            2. Fund Testnet
          </Button>
          <Button onClick={testGetBalance} disabled={loading || !wallet}>
            3. Get Balance
          </Button>
          <Button onClick={testSendPayment} disabled={loading || !wallet}>
            4. Send Payment
          </Button>
        </div>

        {wallet && (
          <div className="bg-gray-50 p-3 rounded text-sm">
            <div><strong>Public Key:</strong> {wallet.public_key}</div>
            <div><strong>Secret Key:</strong> {wallet.secret_key.substring(0, 10)}...</div>
          </div>
        )}

        {balance && (
          <div className="bg-green-50 p-3 rounded text-sm">
            <strong>Balances:</strong>
            {balance.balances.map((b: any, i: number) => (
              <div key={i}>{b.balance} {b.asset_code}</div>
            ))}
          </div>
        )}

        <div className="bg-gray-100 p-3 rounded max-h-40 overflow-y-auto">
          <strong>Logs:</strong>
          {logs.map((log, i) => (
            <div key={i} className="text-sm font-mono">{log}</div>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default WalletSDKTest;