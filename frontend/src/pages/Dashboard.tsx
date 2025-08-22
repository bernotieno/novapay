import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  DollarSign,
  Activity,
  CreditCard,
  Smartphone,
  ArrowUpRight,
  ArrowDownLeft,
  Send
} from 'lucide-react';
import Button from '../components/Button';
import FormInput from '../components/FormInput';
import Card from '../components/Card';
import WalletCard from '../components/WalletCard';
import Sidebar from '../components/Sidebar';
import ProfileHeader from '../components/ProfileHeader';
import ProfileSection from '../components/ProfileSection';
import SendMoneyForm from '../components/SendMoneyForm';
import TransactionList from '../components/TransactionList';
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
  const [activeTab, setActiveTab] = useState('overview');
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
    
    // Load user profile, transaction history and wallet balance
    loadUserProfile();
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

  const loadUserProfile = async () => {
    try {
      const profile = await apiService.getUserProfile();
      setUser(profile);
      localStorage.setItem('user', JSON.stringify(profile));
    } catch (error) {
      console.error('Failed to load user profile:', error);
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
      loadTransactions();
      // TODO: Replace with toast notification
      alert('Money sent successfully! Your recipient will receive an SMS confirmation.');
    } catch (error) {
      alert('Failed to send money. Please try again.');
    }
    
    setIsLoading(false);
  };

  const handleUpdateProfile = async (profileData: any) => {
    try {
      const updatedProfile = await apiService.updateUserProfile(profileData);
      setUser(updatedProfile);
      localStorage.setItem('user', JSON.stringify(updatedProfile));
      alert('Profile updated successfully!');
    } catch (error) {
      alert('Failed to update profile. Please try again.');
    }
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

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <ProfileSection
            user={user}
            walletBalance={walletBalance}
            onUpdateProfile={handleUpdateProfile}
          />
        );
      case 'send':
        return (
          <SendMoneyForm
            showForm={showSendForm}
            onToggleForm={() => setShowSendForm(!showSendForm)}
            formData={sendForm}
            onFormChange={setSendForm}
            onSubmit={handleSendMoney}
            isLoading={isLoading}
          />
        );
      case 'transactions':
        return <TransactionList transactions={transactions} showAll />;
      case 'wallet':
        return (
          <div className="space-y-6">
            <WalletCard
              xlmBalance={walletBalance.xlm_balance}
              kesEquivalent={walletBalance.kes_equivalent}
              walletId={walletBalance.wallet_id}
              onDeposit={() => setShowDepositForm(true)}
              onWithdraw={() => setShowWithdrawForm(true)}
              onTransfer={() => setShowTransferForm(true)}
            />
            {renderWalletForms()}
          </div>
        );
      default:
        return renderOverview();
    }
  };

  const renderOverview = () => (
    <div className="space-y-6">
      <WalletCard
        xlmBalance={walletBalance.xlm_balance}
        kesEquivalent={walletBalance.kes_equivalent}
        walletId={walletBalance.wallet_id}
        onDeposit={() => setShowDepositForm(true)}
        onWithdraw={() => setShowWithdrawForm(true)}
        onTransfer={() => setShowTransferForm(true)}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="text-center">
          <div className="bg-green-100 p-3 rounded-full w-12 h-12 mx-auto mb-3 flex items-center justify-center">
            <DollarSign className="h-6 w-6 text-green-600" />
          </div>
          <div className="text-2xl font-bold text-secondary mb-1">
            {walletBalance.xlm_balance.toFixed(2)} XLM
          </div>
          <div className="text-sm text-gray-600">Wallet Balance</div>
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

      <SendMoneyForm
        showForm={showSendForm}
        onToggleForm={() => setShowSendForm(!showSendForm)}
        formData={sendForm}
        onFormChange={setSendForm}
        onSubmit={handleSendMoney}
        isLoading={isLoading}
      />
    </div>
  );

  const renderWalletForms = () => (
    <div className="space-y-6">
      {showDepositForm && renderDepositForm()}
      {showWithdrawForm && renderWithdrawForm()}
      {showTransferForm && renderTransferForm()}
    </div>
  );

  const renderDepositForm = () => (
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
  );

  const renderWithdrawForm = () => (
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
  );

  const renderTransferForm = () => (
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
  );

  if (!user) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
      
      <div className="flex-1 flex flex-col lg:ml-0">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-4">
                <h1 className="text-xl font-semibold text-secondary capitalize">
                  {activeTab === 'overview' ? 'Dashboard' : activeTab}
                </h1>
              </div>
              <ProfileHeader
                user={user}
                onLogout={handleLogout}
                onProfileClick={() => setActiveTab('profile')}
              />
            </div>
          </div>
        </header>

        <div className="flex flex-1 overflow-hidden">
          {/* Main Content */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto pb-20 lg:pb-8">
            <div className="max-w-6xl mx-auto">
              {renderContent()}
            </div>
          </main>
          
          {/* Right Sidebar - Only on overview */}
          {activeTab === 'overview' && (
            <aside className="hidden xl:block w-80 bg-white border-l border-gray-200 p-6 sticky top-16 h-screen overflow-y-auto">
              <div className="space-y-6">
                <TransactionList transactions={transactions} />
                
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
            </aside>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;