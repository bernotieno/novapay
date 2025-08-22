import React from 'react';
import { Send, Plus } from 'lucide-react';
import Card from './Card';
import Button from './Button';
import FormInput from './FormInput';

interface SendMoneyFormProps {
  showForm: boolean;
  onToggleForm: () => void;
  formData: any;
  onFormChange: (data: any) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
}

const SendMoneyForm: React.FC<SendMoneyFormProps> = ({
  showForm,
  onToggleForm,
  formData,
  onFormChange,
  onSubmit,
  isLoading
}) => {
  if (!showForm) {
    return (
      <Card>
        <div className="text-center py-8">
          <div className="bg-primary/10 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <Send className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-xl font-bold text-secondary mb-2">Send Money</h2>
          <p className="text-gray-600 mb-6">
            Send money to your loved ones across East Africa instantly
          </p>
          <Button onClick={onToggleForm}>
            <Plus className="mr-2 h-4 w-4" />
            Start New Transfer
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-secondary">Send Money</h2>
        <Button variant="outline" onClick={onToggleForm}>
          Cancel
        </Button>
      </div>
      
      <form onSubmit={onSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormInput
            label="Amount"
            type="number"
            value={formData.amount}
            onChange={(e) => onFormChange({ ...formData, amount: e.target.value })}
            required
            placeholder="100"
            helper="Minimum: $1"
          />
          
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Currency
            </label>
            <select
              value={formData.currency}
              onChange={(e) => onFormChange({ ...formData, currency: e.target.value })}
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
          value={formData.recipient}
          onChange={(e) => onFormChange({ ...formData, recipient: e.target.value })}
          required
          placeholder="+254712345678"
          helper="Include country code"
        />
        
        <FormInput
          label="Recipient Name (Optional)"
          type="text"
          value={formData.recipientName}
          onChange={(e) => onFormChange({ ...formData, recipientName: e.target.value })}
          placeholder="John Doe"
          helper="This helps identify the recipient"
        />
        
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex justify-between text-sm mb-2">
            <span>You send:</span>
            <span className="font-medium">${formData.amount || '0'}</span>
          </div>
          <div className="flex justify-between text-sm mb-2">
            <span>Our fee:</span>
            <span className="font-medium text-green-600">$0.50</span>
          </div>
          <div className="flex justify-between text-sm font-medium border-t pt-2">
            <span>Total:</span>
            <span>${(parseFloat(formData.amount || '0') + 0.5).toFixed(2)}</span>
          </div>
        </div>
        
        <Button type="submit" className="w-full" isLoading={isLoading}>
          <Send className="mr-2 h-4 w-4" />
          {isLoading ? 'Processing...' : 'Send Money'}
        </Button>
      </form>
    </Card>
  );
};

export default SendMoneyForm;