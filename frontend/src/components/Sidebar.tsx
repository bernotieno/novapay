import React from 'react';
import { 
  Home, 
  Send, 
  CreditCard, 
  Activity, 
  User, 
  Settings
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange }) => {
  const menuItems = [
    { id: 'overview', label: 'Overview', icon: Home },
    { id: 'send', label: 'Send Money', icon: Send },
    { id: 'wallet', label: 'Wallet', icon: CreditCard },
    { id: 'transactions', label: 'Transactions', icon: Activity },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <>
      {/* Sidebar - Desktop only */}
      <div className="hidden lg:flex lg:flex-col lg:w-64 lg:bg-white lg:border-r lg:border-gray-200 lg:sticky lg:top-0 lg:h-screen">
        {/* Header */}
        <div className="flex items-center p-6 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <div className="bg-primary p-2 rounded-lg">
              <Send className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-secondary">NovaPay</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`
                  w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors
                  ${isActive 
                    ? 'bg-primary text-white' 
                    : 'text-gray-700 hover:bg-gray-100'
                  }
                `}
              >
                <Icon className="h-5 w-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Settings */}
        <div className="mt-auto p-4">
          <button
            onClick={() => onTabChange('settings')}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <Settings className="h-5 w-5" />
            <span className="font-medium">Settings</span>
          </button>
        </div>
      </div>

      {/* Mobile bottom navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40">
        <div className="flex justify-around py-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`flex flex-col items-center p-2 rounded-lg transition-colors ${
                  isActive ? 'text-primary' : 'text-gray-600'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="text-xs mt-1">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default Sidebar;