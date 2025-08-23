import React, { useState } from 'react';
import { Wallet, Eye, EyeOff, Copy } from 'lucide-react';
import Button from './Button';

interface WalletCardProps {
  xlmBalance: number;
  kesEquivalent: number;
  walletId: string;
  onDeposit: () => void;
  onWithdraw: () => void;
  onTransfer: () => void;
  onFonbnkDeposit?: () => void;
}

const WalletCard: React.FC<WalletCardProps> = ({
  xlmBalance,
  kesEquivalent,
  walletId,
  onDeposit,
  onWithdraw,
  onTransfer,
  onFonbnkDeposit,
}) => {
  const [showInKes, setShowInKes] = useState(false);
  const [showWalletId, setShowWalletId] = useState(false);

  const copyWalletId = () => {
    navigator.clipboard.writeText(walletId);
    alert('Wallet ID copied to clipboard!');
  };

  return (
    <div className="bg-gradient-to-r from-primary to-primary/80 text-white p-6 rounded-xl shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Wallet className="h-6 w-6" />
          <h3 className="text-lg font-semibold">Stellar Wallet</h3>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowInKes(!showInKes)}
          className="text-white border-white/30 hover:bg-white/10"
        >
          {showInKes ? 'KES' : 'XLM'}
        </Button>
      </div>

      <div className="mb-4">
        <div className="text-3xl font-bold mb-1">
          {showInKes ? `KES ${kesEquivalent.toFixed(2)}` : `${xlmBalance.toFixed(4)} XLM`}
        </div>
        <div className="text-white/70 text-sm">
          {showInKes ? `≈ ${xlmBalance.toFixed(4)} XLM` : `≈ KES ${kesEquivalent.toFixed(2)}`}
        </div>
      </div>

      <div className="mb-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-white/70">Wallet ID:</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowWalletId(!showWalletId)}
            className="text-white/70 hover:text-white"
          >
            {showWalletId ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
        </div>
        <div className="flex items-center space-x-2 mt-1">
          <code className="text-xs bg-white/10 px-2 py-1 rounded">
            {showWalletId ? walletId : `${walletId.slice(0, 8)}...${walletId.slice(-8)}`}
          </code>
          <Button
            variant="ghost"
            size="sm"
            onClick={copyWalletId}
            className="text-white/70 hover:text-white"
          >
            <Copy className="h-3 w-3" />
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <div className="grid grid-cols-3 gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onDeposit}
            className="text-white border-white/30 hover:bg-white/10"
          >
            Deposit
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onWithdraw}
            className="text-white border-white/30 hover:bg-white/10"
          >
            Withdraw
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onTransfer}
            className="text-white border-white/30 hover:bg-white/10"
          >
            Transfer
          </Button>
        </div>
        {onFonbnkDeposit && (
          <Button
            variant="outline"
            size="sm"
            onClick={onFonbnkDeposit}
            className="w-full text-white border-white/30 hover:bg-white/10 bg-orange-500/20"
          >
            📱 Deposit via Airtime
          </Button>
        )}
      </div>
    </div>
  );
};

export default WalletCard;