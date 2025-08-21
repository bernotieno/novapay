import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Send, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Plus,
  User,
  LogOut,
  CreditCard,
  Activity,
  DollarSign,
  Smartphone,
  ArrowUpRight,
  ArrowDownLeft
} from 'lucide-react';
import Button from '../components/Button';
import FormInput from '../components/FormInput';
import Card from '../components/Card';
import WalletCard from '../components/WalletCard';
import { apiService, type Transaction as ApiTransaction } from '../services/api';

interface Transaction {
  id: string;
  recipient: string;
  amount: number;
  currency: string;
  status: 'completed' | 'pending' | 'failed';
  date: string;
  fee: number;
}

const Dashboard: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [walletBalance, setWalletBalance] = useState({ xlm_balance: 0, kes_equivalent: 0, wallet_id: '' });
  const [showSendForm, setShowSendForm] = useState(false);
  const [showDepositForm, setShowDepositForm] = useState(false);
  const [showWithdrawForm, setShowWithdrawForm] = useState(false);
  const [showTransferForm, setShowTransferForm] = useState(false);
  const [sendForm, setSendForm] = useState({
    amount: '',
    recipient: '',
    recipientName: '',
    currency: 'KES',
  });
  const [depositForm, setDepositForm] = useState({ amount: '', mpesaRef: '' });
  const [withdrawForm, setWithdrawForm] = useState({ amount: '', mpesaNumber: '' });
  const [transferForm, setTransferForm] = useState({ amount: '', walletId: '' });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('novapay_token');
    if (!token) {
      navigate('/login');
      return;
    }
    
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
    
    // Load transaction history and wallet balance
    loadTransactions();
    loadWalletBalance();
  }, [navigate]);

  const loadTransactions = async () => {
    try {
      const apiTransactions = await apiService.getTransactionHistory();
      const formattedTransactions = apiTransactions.map(tx => ({
        id: tx.id,
        recipient: tx.recipient_email,
        amount: tx.amount,
        currency: tx.target_currency,
        status: tx.status as 'completed' | 'pending' | 'failed',
        date: tx.created_at,
        fee: 0.5,
      }));
      setTransactions(formattedTransactions);
    } catch (error) {
      console.error('Failed to load transactions:', error);
    }
  };

  const loadWalletBalance = async () => {
    try {
      const balance = await apiService.getWalletBalance();
      setWalletBalance(balance);
    } catch (error) {
      console.error('Failed to load wallet balance:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('novapay_token');
    navigate('/');
  };

  const handleSendMoney = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await apiService.sendMoney(
        sendForm.recipient,
        parseFloat(sendForm.amount),
        'USD',
        sendForm.currency
      );
      
      setSendForm({ amount: '', recipient: '', recipientName: '', currency: 'KES' });
      setShowSendForm(false);
      loadTransactions(); // Reload transactions
      alert('Money sent successfully! Your recipient will receive an SMS confirmation.');
    } catch (error) {
      alert('Failed to send money. Please try again.');
    }
    
    setIsLoading(false);
  };

  const handleDeposit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await apiService.depositFromMpesa(parseFloat(depositForm.amount), depositForm.mpesaRef);
      setDepositForm({ amount: '', mpesaRef: '' });
      setShowDepositForm(false);
      loadWalletBalance();
      loadTransactions();
      alert('Deposit successful! Your wallet has been funded.');
    } catch (error) {
      alert('Failed to deposit. Please try again.');
    }
    
    setIsLoading(false);
  };

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await apiService.withdrawToMpesa(parseFloat(withdrawForm.amount), withdrawForm.mpesaNumber);
      setWithdrawForm({ amount: '', mpesaNumber: '' });
      setShowWithdrawForm(false);
      loadWalletBalance();
      loadTransactions();
      alert('Withdrawal successful! Check your M-Pesa.');
    } catch (error) {
      alert('Failed to withdraw. Please try again.');
    }
    
    setIsLoading(false);
  };

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await apiService.transferToWallet(parseFloat(transferForm.amount), transferForm.walletId);
      setTransferForm({ amount: '', walletId: '' });
      setShowTransferForm(false);
      loadWalletBalance();
      loadTransactions();
      alert('Transfer successful!');
    } catch (error) {
      alert('Failed to transfer. Please try again.');
    }
    
    setIsLoading(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'failed':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-500';
      case 'pending':
        return 'text-yellow-500';
      case 'failed':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  const totalSent = transactions
    .filter(t => t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-primary p-2 rounded-lg">
                <User className="h-6 w-6 text-secondary" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-secondary">
                  Welcome back, {user.name}!
                </h1>
                <p className="text-sm text-gray-600">{user.email}</p>
              </div>
            </div>
            <Button variant="outline" onClick={handleLogout} className="text-red-600 border-red-600 hover:bg-red-600 hover:text-white">
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Wallet Card */}
            <WalletCard
              xlmBalance={walletBalance.xlm_balance}
              kesEquivalent={walletBalance.kes_equivalent}
              walletId={walletBalance.wallet_id}
              onDeposit={() => setShowDepositForm(true)}
              onWithdraw={() => setShowWithdrawForm(true)}
              onTransfer={() => setShowTransferForm(true)}
            />
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="text-center">
                <div className="bg-green-100 p-3 rounded-full w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-green-600" />
                </div>
                <div className="text-2xl font-bold text-secondary mb-1">
                  {walletBalance.xlm_balance.toFixed(2)} XLM
                </div>
                <div className="text-sm text-gray-600">Total Sent</div>
              </Card>
              
              <Card className="text-center">
                <div className="bg-blue-100 p-3 rounded-full w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                  <Activity className="h-6 w-6 text-blue-600" />
                </div>
                <div className="text-2xl font-bold text-secondary mb-1">
                  {transactions.length}
                </div>
                <div className="text-sm text-gray-600">Transactions</div>
              </Card>
              
              <Card className="text-center">
                <div className="bg-primary/10 p-3 rounded-full w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                  <CreditCard className="h-6 w-6 text-primary" />
                </div>
                <div className="text-2xl font-bold text-secondary mb-1">
                  ${(transactions.length * 0.5).toFixed(2)}
                </div>
                <div className="text-sm text-gray-600">Fees Saved</div>
              </Card>
            </div>

            {/* Send Money Section */}
            {!showSendForm ? (
              <Card>
                <div className="text-center py-8">
                  <div className="bg-primary/10 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <Send className="h-8 w-8 text-primary" />
                  </div>
                  <h2 className="text-xl font-bold text-secondary mb-2">Send Money</h2>
                  <p className="text-gray-600 mb-6">
                    Send money to your loved ones across East Africa instantly
                  </p>
                  <Button onClick={() => setShowSendForm(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Start New Transfer
                  </Button>
                </div>
              </Card>
            ) : (
              <Card>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-secondary">Send Money</h2>
                  <Button 
                    variant="outline" 
                    onClick={() => setShowSendForm(false)}
                    className="text-gray-600"
                  >
                    Cancel
                  </Button>
                </div>
                
                <form onSubmit={handleSendMoney} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormInput
                      label="Amount"
                      type="number"
                      value={sendForm.amount}
                      onChange={(e) => setSendForm(prev => ({ ...prev, amount: e.target.value }))}
                      required
                      placeholder="100"
                      helper="Minimum: $1"
                    />
                    
                    <div className="space-y-1">
                      <label className="block text-sm font-medium text-gray-700">
                        Currency
                      </label>
                      <select
                        value={sendForm.currency}
                        onChange={(e) => setSendForm(prev => ({ ...prev, currency: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                      >
                        <option value="KES">KES - Kenyan Shilling</option>
                        <option value="UGX">UGX - Ugandan Shilling</option>
                        <option value="TZS">TZS - Tanzanian Shilling</option>
                        <option value="RWF">RWF - Rwandan Franc</option>
                      </select>
                    </div>
                  </div>
                  
                  <FormInput
                    label="Recipient Phone Number"
                    type="tel"
                    value={sendForm.recipient}
                    onChange={(e) => setSendForm(prev => ({ ...prev, recipient: e.target.value }))}
                    required
                    placeholder="+254712345678"
                    helper="Include country code"
                  />
                  
                  <FormInput
                    label="Recipient Name (Optional)"
                    type="text"
                    value={sendForm.recipientName}
                    onChange={(e) => setSendForm(prev => ({ ...prev, recipientName: e.target.value }))}
                    placeholder="John Doe"
                    helper="This helps identify the recipient"
                  />
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between text-sm mb-2">
                      <span>You send:</span>
                      <span className="font-medium">
                        ${sendForm.amount || '0'}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Our fee:</span>
                      <span className="font-medium text-green-600">$0.50</span>
                    </div>
                    <div className="flex justify-between text-sm font-medium border-t pt-2">
                      <span>Total:</span>
                      <span>${(parseFloat(sendForm.amount || '0') + 0.5).toFixed(2)}</span>
                    </div>
                  </div>
                  
                  <Button type="submit" className="w-full" isLoading={isLoading}>
                    <Send className="mr-2 h-4 w-4" />
                    {isLoading ? 'Processing...' : 'Send Money'}
                  </Button>
                </form>
              </Card>
            )}

            {/* Deposit Form */}
            {showDepositForm && (
              <Card>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-secondary flex items-center">
                    <ArrowDownLeft className="mr-2 h-5 w-5" />
                    Deposit from M-Pesa
                  </h2>
                  <Button variant="outline" onClick={() => setShowDepositForm(false)}>
                    Cancel
                  </Button>
                </div>
                
                <form onSubmit={handleDeposit} className="space-y-6">
                  <FormInput
                    label="Amount (KES)"
                    type="number"
                    value={depositForm.amount}
                    onChange={(e) => setDepositForm(prev => ({ ...prev, amount: e.target.value }))}
                    required
                    placeholder="1000"
                    helper="Will be converted to XLM automatically"
                  />
                  
                  <FormInput
                    label="M-Pesa Reference"
                    type="text"
                    value={depositForm.mpesaRef}
                    onChange={(e) => setDepositForm(prev => ({ ...prev, mpesaRef: e.target.value }))}
                    required
                    placeholder="QH7X8Y9Z"
                    helper="M-Pesa transaction code"
                  />
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-sm text-gray-600 mb-2">
                      Exchange Rate: 1 XLM = 120 KES
                    </div>
                    <div className="text-sm font-medium">
                      You will receive: {depositForm.amount ? (parseFloat(depositForm.amount) / 120).toFixed(4) : '0'} XLM
                    </div>
                  </div>
                  
                  <Button type="submit" className="w-full" isLoading={isLoading}>
                    <Smartphone className="mr-2 h-4 w-4" />
                    Deposit to Wallet
                  </Button>
                </form>
              </Card>
            )}

            {/* Withdraw Form */}
            {showWithdrawForm && (
              <Card>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-secondary flex items-center">
                    <ArrowUpRight className="mr-2 h-5 w-5" />
                    Withdraw to M-Pesa
                  </h2>
                  <Button variant="outline" onClick={() => setShowWithdrawForm(false)}>
                    Cancel
                  </Button>
                </div>
                
                <form onSubmit={handleWithdraw} className="space-y-6">
                  <FormInput
                    label="Amount (XLM)"
                    type="number"
                    step="0.0001"
                    value={withdrawForm.amount}
                    onChange={(e) => setWithdrawForm(prev => ({ ...prev, amount: e.target.value }))}
                    required
                    placeholder="10.0000"
                    helper={`Available: ${walletBalance.xlm_balance.toFixed(4)} XLM`}
                  />
                  
                  <FormInput
                    label="M-Pesa Number"
                    type="tel"
                    value={withdrawForm.mpesaNumber}
                    onChange={(e) => setWithdrawForm(prev => ({ ...prev, mpesaNumber: e.target.value }))}
                    required
                    placeholder="+254712345678"
                    helper="Include country code"
                  />
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-sm text-gray-600 mb-2">
                      Exchange Rate: 1 XLM = 120 KES
                    </div>
                    <div className="text-sm font-medium">
                      You will receive: KES {withdrawForm.amount ? (parseFloat(withdrawForm.amount) * 120).toFixed(2) : '0'}
                    </div>
                  </div>
                  
                  <Button type="submit" className="w-full" isLoading={isLoading}>
                    <Smartphone className="mr-2 h-4 w-4" />
                    Withdraw to M-Pesa
                  </Button>
                </form>
              </Card>
            )}

            {/* Transfer Form */}
            {showTransferForm && (
              <Card>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-secondary flex items-center">
                    <Send className="mr-2 h-5 w-5" />
                    Transfer to Wallet
                  </h2>
                  <Button variant="outline" onClick={() => setShowTransferForm(false)}>
                    Cancel
                  </Button>
                </div>
                
                <form onSubmit={handleTransfer} className="space-y-6">
                  <FormInput
                    label="Amount (XLM)"
                    type="number"
                    step="0.0001"
                    value={transferForm.amount}
                    onChange={(e) => setTransferForm(prev => ({ ...prev, amount: e.target.value }))}
                    required
                    placeholder="5.0000"
                    helper={`Available: ${walletBalance.xlm_balance.toFixed(4)} XLM`}
                  />
                  
                  <FormInput
                    label="Recipient Wallet ID"
                    type="text"
                    value={transferForm.walletId}
                    onChange={(e) => setTransferForm(prev => ({ ...prev, walletId: e.target.value }))}
                    required
                    placeholder="GXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
                    helper="Stellar public key of recipient"
                  />
                  
                  <Button type="submit" className="w-full" isLoading={isLoading}>
                    <Send className="mr-2 h-4 w-4" />
                    Transfer XLM
                  </Button>
                </form>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Recent Transactions */}
            <Card>
              <h3 className="text-lg font-semibold text-secondary mb-4">
                Recent Transactions
              </h3>
              
              {transactions.length === 0 ? (
                <div className="text-center py-8">
                  <div className="bg-gray-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <Activity className="h-8 w-8 text-gray-400" />
                  </div>
                  <p className="text-gray-600">No transactions yet</p>
                  <p className="text-sm text-gray-500">Start by sending your first transfer</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {transactions.slice(0, 5).map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(transaction.status)}
                        <div>
                          <div className="text-sm font-medium text-secondary">
                            {transaction.recipient}
                          </div>
                          <div className="text-xs text-gray-500">
                            {new Date(transaction.date).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-secondary">
                          {transaction.amount} {transaction.currency}
                        </div>
                        <div className={`text-xs capitalize ${getStatusColor(transaction.status)}`}>
                          {transaction.status}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            {/* Help & Support */}
            <Card>
              <h3 className="text-lg font-semibold text-secondary mb-4">
                Need Help?
              </h3>
              <div className="space-y-3">
                <a 
                  href="/contact"
                  className="block text-sm text-primary hover:text-primary/80 transition-colors duration-200"
                >
                  Contact Support
                </a>
                <a 
                  href="#"
                  className="block text-sm text-primary hover:text-primary/80 transition-colors duration-200"
                >
                  View FAQ
                </a>
                <a 
                  href="#"
                  className="block text-sm text-primary hover:text-primary/80 transition-colors duration-200"
                >
                  Track Transfer
                </a>
                <a 
                  href="#"
                  className="block text-sm text-primary hover:text-primary/80 transition-colors duration-200"
                >
                  Rate & Fees
                </a>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;