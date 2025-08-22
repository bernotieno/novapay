import React from 'react';
import { Activity, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import Card from './Card';

interface Transaction {
  id: string;
  recipient: string;
  amount: number;
  currency: string;
  status: 'completed' | 'pending' | 'failed';
  date: string;
  fee: number;
}

interface TransactionListProps {
  transactions: Transaction[];
  showAll?: boolean;
}

const TransactionList: React.FC<TransactionListProps> = ({ transactions, showAll = false }) => {
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

  const displayTransactions = showAll ? transactions : transactions.slice(0, 5);

  return (
    <Card>
      <h3 className="text-lg font-semibold text-secondary mb-4">
        {showAll ? 'All Transactions' : 'Recent Transactions'}
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
          {displayTransactions.map((transaction) => (
            <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
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
  );
};

export default TransactionList;