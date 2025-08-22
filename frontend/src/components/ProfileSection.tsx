import React, { useState } from 'react';
import { User, Edit, Copy, Check } from 'lucide-react';
import Card from './Card';
import Button from './Button';
import FormInput from './FormInput';

interface ProfileSectionProps {
  user: any;
  walletBalance: any;
  onUpdateProfile: (data: any) => void;
}

const ProfileSection: React.FC<ProfileSectionProps> = ({ user, walletBalance, onUpdateProfile }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [profileData, setProfileData] = useState({
    full_name: user.full_name || user.name || '',
    email: user.email || '',
    phone_number: user.phone_number || user.phone || '',
  });

  const handleCopyWalletId = () => {
    navigator.clipboard.writeText(walletBalance.wallet_id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile(profileData);
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      <Card>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-secondary">Profile Information</h2>
          <Button
            variant="outline"
            onClick={() => setIsEditing(!isEditing)}
          >
            <Edit className="mr-2 h-4 w-4" />
            {isEditing ? 'Cancel' : 'Edit'}
          </Button>
        </div>

        <div className="flex items-center space-x-4 mb-6">
          <div className="bg-primary p-4 rounded-full">
            <User className="h-8 w-8 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-secondary">{user.full_name || user.name}</h3>
            <p className="text-gray-600">{user.email}</p>
          </div>
        </div>

        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <FormInput
              label="Full Name"
              value={profileData.full_name}
              onChange={(e) => setProfileData(prev => ({ ...prev, full_name: e.target.value }))}
              required
            />
            <FormInput
              label="Email"
              type="email"
              value={profileData.email}
              onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
              required
            />
            <FormInput
              label="Phone Number"
              type="tel"
              value={profileData.phone_number}
              onChange={(e) => setProfileData(prev => ({ ...prev, phone_number: e.target.value }))}
              placeholder="+254712345678"
            />
            <Button type="submit" className="w-full">
              Save Changes
            </Button>
          </form>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Full Name</label>
              <p className="text-gray-900">{user.full_name || user.name}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Email</label>
              <p className="text-gray-900">{user.email}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Phone Number</label>
              <p className="text-gray-900">{user.phone_number || user.phone || 'Not provided'}</p>
            </div>
          </div>
        )}
      </Card>

      <Card>
        <h3 className="text-lg font-semibold text-secondary mb-4">Wallet Information</h3>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700">Wallet ID</label>
            <div className="flex items-center space-x-2 mt-1">
              <code className="flex-1 p-2 bg-gray-100 rounded text-sm font-mono break-all">
                {walletBalance.wallet_id}
              </code>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyWalletId}
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">XLM Balance</label>
              <p className="text-lg font-semibold text-secondary">{walletBalance.xlm_balance.toFixed(4)} XLM</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">KES Equivalent</label>
              <p className="text-lg font-semibold text-secondary">KES {walletBalance.kes_equivalent.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ProfileSection;