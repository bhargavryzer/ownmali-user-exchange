"use client";

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Wallet as WalletIcon,
  Smartphone,
  ArrowUpRight,
  ArrowDownRight,
  Info,
  TrendingUp,
  Clock,
  CheckCircle2,
  XCircle,
  DollarSign,
  Zap,
  Shield
} from 'lucide-react';

// Types
type TransactionType = 'deposit' | 'withdrawal';
type TransactionStatus = 'completed' | 'pending' | 'failed';

interface Transaction {
  id: string;
  type: TransactionType;
  method: string;
  amount: number;
  status: TransactionStatus;
  date: Date;
  reference: string;
  phoneNumber: string;
}

interface WalletStats {
  availableBalance: number;
  totalDeposited: number;
  totalWithdrawn: number;
  pendingTransactions: number;
}

// Enhanced mock data for Kenyan M-Pesa wallet
const mockWalletStats: WalletStats = {
  availableBalance: 125750.50,
  totalDeposited: 450000.00,
  totalWithdrawn: 324249.50,
  pendingTransactions: 2
};

const mockWalletTransactions: Transaction[] = [
  {
    id: 'TXN-2024-001',
    type: 'deposit',
    method: 'M-Pesa',
    amount: 50000.00,
    status: 'completed',
    date: new Date('2024-11-07T09:15:00'),
    reference: 'SKH7G2M4PQ',
    phoneNumber: '0712***678'
  },
  {
    id: 'TXN-2024-002',
    type: 'withdrawal',
    method: 'M-Pesa',
    amount: 25000.00,
    status: 'completed',
    date: new Date('2024-11-06T14:30:00'),
    reference: 'SKH6F8N2KL',
    phoneNumber: '0712***678'
  },
  {
    id: 'TXN-2024-003',
    type: 'deposit',
    method: 'M-Pesa',
    amount: 15000.00,
    status: 'pending',
    date: new Date('2024-11-06T11:20:00'),
    reference: 'SKH5D9P1MN',
    phoneNumber: '0712***678'
  },
  {
    id: 'TXN-2024-004',
    type: 'deposit',
    method: 'M-Pesa',
    amount: 100000.00,
    status: 'completed',
    date: new Date('2024-11-05T16:45:00'),
    reference: 'SKH4C7Q3RS',
    phoneNumber: '0712***678'
  },
  {
    id: 'TXN-2024-005',
    type: 'withdrawal',
    method: 'M-Pesa',
    amount: 30000.00,
    status: 'completed',
    date: new Date('2024-11-04T10:10:00'),
    reference: 'SKH3B2W5TU',
    phoneNumber: '0712***678'
  },
  {
    id: 'TXN-2024-006',
    type: 'deposit',
    method: 'M-Pesa',
    amount: 75000.00,
    status: 'completed',
    date: new Date('2024-11-03T13:00:00'),
    reference: 'SKH2A1X7VW',
    phoneNumber: '0712***678'
  },
  {
    id: 'TXN-2024-007',
    type: 'withdrawal',
    method: 'M-Pesa',
    amount: 20000.00,
    status: 'failed',
    date: new Date('2024-11-02T15:30:00'),
    reference: 'SKH1Z9Y8XY',
    phoneNumber: '0712***678'
  }
];

export default function WalletPage() {
  const [depositAmount, setDepositAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [depositPhone, setDepositPhone] = useState('');
  const [withdrawPhone, setWithdrawPhone] = useState('');
  const [activeTab, setActiveTab] = useState<'deposit' | 'withdraw'>('deposit');

  const quickAmounts = [1000, 5000, 10000, 25000, 50000];

  /**
   * Formats a number as Kenyan Shillings (KES)
   * @param amount - The amount to format
   * @returns string - Formatted currency string
   */
  const formatKES = (amount: number): string => {
    return amount.toLocaleString('en-KE', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2,
      currency: 'KES'
    });
  };

  /**
   * Validates a Kenyan phone number
   * @param phone - The phone number to validate (10 digits starting with 07 or 01)
   * @returns boolean - True if the phone number is valid
   */
  const validatePhone = (phone: string): boolean => {
    const kenyanPhoneRegex = /^(07|01)\d{8}$/;
    return kenyanPhoneRegex.test(phone);
  };

  const handleDeposit = () => {
    if (!depositAmount || parseFloat(depositAmount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }
    if (!validatePhone(depositPhone)) {
      alert('Please enter a valid Kenyan M-Pesa number (07xxxxxxxx or 01xxxxxxxx)');
      return;
    }
    // Simulated success
    console.log(`STK push sent to ${depositPhone} for KES ${formatKES(parseFloat(depositAmount))}`);
    setDepositAmount('');
    setDepositPhone('');
  };

  const handleWithdraw = () => {
    if (!withdrawAmount || parseFloat(withdrawAmount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }
    if (!validatePhone(withdrawPhone)) {
      alert('Please enter a valid Kenyan M-Pesa number (07xxxxxxxx or 01xxxxxxxx)');
      return;
    }
    if (parseFloat(withdrawAmount) > mockWalletStats.availableBalance) {
      alert('Insufficient balance');
      return;
    }
    // Simulated success
    console.log(`Withdrawal of KES ${formatKES(parseFloat(withdrawAmount))} initiated to ${withdrawPhone}`);
    setWithdrawAmount('');
    setWithdrawPhone('');
  };

  const addQuickAmount = (amount: number) => {
    if (activeTab === 'deposit') {
      const currentAmount = depositAmount ? parseFloat(depositAmount) : 0;
      setDepositAmount((currentAmount + amount).toString());
    } else {
      const currentAmount = withdrawAmount ? parseFloat(withdrawAmount) : 0;
      setWithdrawAmount((currentAmount + amount).toString());
    }
  };

  const getStatusIcon = (status: TransactionStatus): React.ReactNode => {
    switch(status) {
      case 'completed':
        return <CheckCircle2 className="w-4 h-4" />;
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'failed':
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-white p-4 sm:p-6 lg:p-8">
      <main className="max-w-7xl mx-auto space-y-8" role="main" aria-label="Wallet management">
        <div className="space-y-6">
          {/* Enhanced Header */}
          <header className="mb-8">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-3 bg-emerald-500/10 rounded-xl" aria-hidden="true">
                <WalletIcon className="w-7 h-7 text-emerald-600" aria-hidden="true" />
              </div>
              <div>
                <h1 id="wallet-heading" className="text-3xl font-bold text-slate-900">M-Pesa Wallet</h1>
                <p className="text-slate-600 mt-1">Instant deposits and withdrawals</p>
              </div>
            </div>
          </header>

          {/* Wallet Stats Section */}
          <section aria-labelledby="wallet-stats-heading" className="mb-6">
            <h2 id="wallet-stats-heading" className="sr-only">Wallet Statistics</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Available Balance Card */}
              <Card className="bg-white border border-slate-200 rounded-xl p-5 hover:shadow-md transition-shadow" role="region" aria-label="Available balance">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-slate-600 text-sm font-medium mb-2">Available Balance</p>
                    <p className="text-2xl font-bold text-slate-900">
                      {formatKES(mockWalletStats.availableBalance)}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">KES</p>
                  </div>
                  <div className="p-2.5 bg-emerald-50 rounded-lg">
                    <WalletIcon className="w-5 h-5 text-emerald-600" />
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-emerald-600 text-xs mt-3">
                  <Zap className="w-3.5 h-3.5" />
                  <span>Ready to invest</span>
                </div>
              </Card>
              <Card className="bg-white border border-slate-200 rounded-xl p-5 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-slate-600 text-sm font-medium mb-2">Total Deposited</p>
                    <p className="text-2xl font-bold text-slate-900">
                      {formatKES(mockWalletStats.totalDeposited)}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">KES</p>
                  </div>
                  <div className="p-2.5 bg-blue-50 rounded-lg">
                    <ArrowDownRight className="w-5 h-5 text-blue-600" />
                  </div>
                </div>
                <p className="text-xs text-slate-500 mt-3">All-time deposits</p>
              </Card>
              <Card className="bg-white border border-slate-200 rounded-xl p-5 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-slate-600 text-sm font-medium mb-2">Total Withdrawn</p>
                    <p className="text-2xl font-bold text-slate-900">
                      {formatKES(mockWalletStats.totalWithdrawn)}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">KES</p>
                  </div>
                  <div className="p-2.5 bg-purple-50 rounded-lg">
                    <ArrowUpRight className="w-5 h-5 text-purple-600" />
                  </div>
                </div>
                <p className="text-xs text-slate-500 mt-3">All-time withdrawals</p>
              </Card>
              <Card className="bg-white border border-slate-200 rounded-xl p-5 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-slate-600 text-sm font-medium mb-2">Pending</p>
                    <p className="text-2xl font-bold text-slate-900">
                      {mockWalletStats.pendingTransactions}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">Transactions</p>
                  </div>
                  <div className="p-2.5 bg-amber-50 rounded-lg">
                    <Clock className="w-5 h-5 text-amber-600" />
                  </div>
                </div>
                <p className="text-xs text-slate-500 mt-3">Processing</p>
              </Card>
            </div>
          </section>

          {/* Transaction Actions Section */}
          <section aria-labelledby="transaction-actions-heading" className="mb-6">
            <h2 id="transaction-actions-heading" className="text-lg font-semibold text-slate-900 mb-4">Transaction Actions</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Deposit Card */}
              <Card 
                className="bg-white border border-slate-200 rounded-xl overflow-hidden"
                role="region"
                aria-labelledby="deposit-heading"
              >
                <div className="bg-gradient-to-r from-emerald-50 to-emerald-50 p-5 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-100 rounded-lg" aria-hidden="true">
                      <Smartphone className="w-5 h-5 text-emerald-600" aria-hidden="true" />
                    </div>
                    <div>
                      <h2 id="deposit-heading" className="text-lg font-semibold text-slate-900">Deposit Funds</h2>
                      <p className="text-sm text-slate-500">Add money via M-Pesa STK Push</p>
                    </div>
                  </div>
                </div>
                <div className="p-6 space-y-5">
                  <div>
                    <label className="text-sm font-semibold text-slate-700 mb-2 block">
                      M-Pesa Phone Number
                    </label>
                    <div className="relative">
                      <Input
                        type="tel"
                        inputMode="tel"
                        placeholder="0712345678"
                        className="bg-white border-slate-300 text-slate-900 h-12 pl-10"
                        value={depositPhone}
                        onChange={(e) => setDepositPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                        maxLength={10}
                        minLength={10}
                        aria-required="true"
                        aria-invalid={depositPhone ? !validatePhone(depositPhone) : false}
                        aria-describedby="phone-help"
                        aria-label="M-Pesa phone number for deposit"
                      />
                      <Smartphone className="w-4 h-4 text-slate-400 absolute left-3 top-4" aria-hidden="true" />
                    </div>
                    <p id="phone-help" className="text-xs text-slate-500 mt-1.5">
                      {depositPhone && !validatePhone(depositPhone) ? (
                        <span className="text-red-500">Please enter a valid 10-digit Safaricom number</span>
                      ) : (
                        'Enter your 10-digit Safaricom M-Pesa number'
                      )}
                    </p>
                    <p className="text-xs text-slate-500 mt-1.5">Enter your Safaricom M-Pesa number</p>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-slate-700 mb-2 block">
                      Amount (KES)
                    </label>
                    <div className="relative">
                      <Input
                        type="number"
                        inputMode="decimal"
                        placeholder="0.00"
                        className="bg-white border-slate-300 text-slate-900 text-2xl h-16 pl-10"
                        value={depositAmount}
                        onChange={(e) => {
                          const value = e.target.value;
                          // Allow only numbers and one decimal point
                          if (value === '' || /^\d*\.?\d{0,2}$/.test(value)) {
                            setDepositAmount(value);
                          }
                        }}
                        min="10"
                        step="0.01"
                        aria-required="true"
                        aria-invalid={depositAmount ? parseFloat(depositAmount) < 10 : false}
                        aria-describedby="amount-help"
                        aria-label="Deposit amount in KES"
                      />
                      <DollarSign className="w-5 h-5 text-slate-400 absolute left-3 top-5" aria-hidden="true" />
                    </div>
                    <p id="amount-help" className="text-xs text-slate-500 mt-1.5">
                      {depositAmount && parseFloat(depositAmount) < 10 ? (
                        <span className="text-red-500">Minimum deposit amount is KES 10</span>
                      ) : (
                        'Enter amount in KES'
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-600 mb-2">Quick Add</p>
                    <div className="grid grid-cols-5 gap-2">
                      {quickAmounts.map((amount) => (
                        <Button
                          key={amount}
                          variant="outline"
                          size="sm"
                          className="border-slate-300 hover:bg-emerald-600 hover:border-emerald-600 hover:text-white text-xs font-semibold"
                          onClick={() => {
                            setActiveTab('deposit');
                            addQuickAmount(amount);
                          }}
                        >
                          +{amount >= 1000 ? `${amount/1000}K` : amount}
                        </Button>
                      ))}
                    </div>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-4 space-y-2.5">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600 flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        Processing Time
                      </span>
                      <span className="font-semibold text-slate-900">Instant</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600 flex items-center gap-2">
                        <TrendingUp className="w-4 h-4" />
                        Transaction Fee
                      </span>
                      <span className="font-semibold text-emerald-600">Free</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600 flex items-center gap-2">
                        <Shield className="w-4 h-4" />
                        Security
                      </span>
                      <span className="font-semibold text-blue-600">Encrypted</span>
                    </div>
                  </div>
                  <Button
                    className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white h-12 text-base font-semibold shadow-lg shadow-emerald-500/30"
                    onClick={handleDeposit}
                    disabled={!depositAmount || !depositPhone || !validatePhone(depositPhone) || parseFloat(depositAmount) < 10}
                    aria-disabled={!depositAmount || !depositPhone || !validatePhone(depositPhone) || parseFloat(depositAmount) < 10}
                  >
                    <Smartphone className="w-5 h-5 mr-2" aria-hidden="true" />
                    Send STK Push
                  </Button>
                </div>
              </Card>

              {/* Withdraw Card */}
              <Card 
                className="bg-white border-slate-200 overflow-hidden"
                role="region"
                aria-labelledby="withdraw-heading"
              >
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 border-b border-blue-200">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-blue-500/20 rounded-xl" aria-hidden="true">
                      <ArrowUpRight className="w-6 h-6 text-blue-600" aria-hidden="true" />
                    </div>
                    <div>
                      <h2 id="withdraw-heading" className="text-xl font-semibold text-slate-900">Withdraw Funds</h2>
                      <p className="text-sm text-slate-600">Send money to M-Pesa</p>
                    </div>
                  </div>
                </div>
                <div className="p-6 space-y-5">
                  <div>
                    <label className="text-sm font-semibold text-slate-700 mb-2 block">
                      M-Pesa Phone Number
                    </label>
                    <div className="relative">
                      <Input
                        type="tel"
                        placeholder="0712345678"
                        className="bg-white border-slate-300 text-slate-900 h-12 pl-10"
                        value={withdrawPhone}
                        onChange={(e) => setWithdrawPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                        maxLength={10}
                        aria-label="M-Pesa phone number for withdrawal"
                      />
                      <Smartphone className="w-4 h-4 text-slate-400 absolute left-3 top-4" />
                    </div>
                    <p className="text-xs text-slate-500 mt-1.5">Enter your Safaricom M-Pesa number</p>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-slate-700 mb-2 block">
                      Amount (KES)
                    </label>
                    <div className="relative">
                      <Input
                        type="number"
                        placeholder="0.00"
                        className="bg-white border-slate-300 text-slate-900 text-2xl h-16 pl-10"
                        value={withdrawAmount}
                        onChange={(e) => {
                          const value = e.target.value;
                          // Allow only numbers and one decimal point
                          if (value === '' || /^\d*\.?\d{0,2}$/.test(value)) {
                            setWithdrawAmount(value);
                          }
                        }}
                        min="0"
                        step="0.01"
                        aria-label="Withdrawal amount"
                      />
                      <DollarSign className="w-5 h-5 text-slate-400 absolute left-3 top-5" />
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-600 mb-2">Quick Add</p>
                    <div className="grid grid-cols-5 gap-2">
                      {quickAmounts.map((amount) => (
                        <Button
                          key={amount}
                          variant="outline"
                          size="sm"
                          className="border-slate-300 hover:bg-blue-600 hover:border-blue-600 hover:text-white text-xs font-semibold"
                          onClick={() => {
                            setActiveTab('withdraw');
                            addQuickAmount(amount);
                          }}
                        >
                          +{amount >= 1000 ? `${amount/1000}K` : amount}
                        </Button>
                      ))}
                    </div>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-4 space-y-2.5">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600 flex items-center gap-2">
                        <WalletIcon className="w-4 h-4" />
                        Available Balance
                      </span>
                      <span className="font-semibold text-emerald-600">
                        KES {formatKES(mockWalletStats.availableBalance)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600 flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        Processing Time
                      </span>
                      <span className="font-semibold text-slate-900">Instant</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600 flex items-center gap-2">
                        <TrendingUp className="w-4 h-4" />
                        Transaction Fee
                      </span>
                      <span className="font-semibold text-emerald-600">Free</span>
                    </div>
                  </div>
                  <Button
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white h-12 text-base font-semibold shadow-lg shadow-blue-500/30"
                    onClick={handleWithdraw}
                    disabled={!withdrawAmount || !withdrawPhone || !validatePhone(withdrawPhone) || parseFloat(withdrawAmount) > mockWalletStats.availableBalance || parseFloat(withdrawAmount) <= 0}
                  >
                    <ArrowUpRight className="w-5 h-5 mr-2" />
                    Withdraw to M-Pesa
                  </Button>
                </div>
              </Card>
            </div>
          </section>

          {/* Transaction History Section */}
          <section aria-labelledby="transaction-history-heading" className="mb-8">
            <Card className="bg-white border-slate-200 overflow-hidden">
              <div className="p-6 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white">
                <h2 id="transaction-history-heading" className="text-xl font-semibold text-slate-900">Transaction History</h2>
                <p className="text-slate-600 mt-1">Your recent M-Pesa transactions</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full" aria-label="Transaction history">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50">
                      <th scope="col" className="text-left p-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                        <span className="sr-only">Date & Time</span>
                        <span aria-hidden="true">Date & Time</span>
                      </th>
                      <th scope="col" className="text-left p-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                        <span className="sr-only">Transaction Type</span>
                        <span aria-hidden="true">Type</span>
                      </th>
                      <th scope="col" className="text-left p-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                        <span className="sr-only">Transaction Reference</span>
                        <span aria-hidden="true">Reference</span>
                      </th>
                      <th scope="col" className="text-right p-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                        <span className="sr-only">Transaction Amount</span>
                        <span aria-hidden="true">Amount</span>
                      </th>
                      <th scope="col" className="text-right p-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                        <span className="sr-only">Transaction Status</span>
                        <span aria-hidden="true">Status</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockWalletTransactions.map((transaction) => (
                      <tr
                        key={transaction.id}
                        className="border-b border-slate-200 hover:bg-slate-50 transition-colors"
                        aria-label={`Transaction ${transaction.id}`}
                      >
                        <td className="p-4">
                          <time dateTime={transaction.date.toISOString()} className="text-sm font-medium text-slate-900">
                            {transaction.date.toLocaleDateString('en-KE', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </time>
                          <p className="text-xs text-slate-500">
                            {transaction.date.toLocaleTimeString('en-KE', { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </td>
                        <td className="p-4">
                          <Badge
                            className={`${
                              transaction.type === 'deposit'
                                ? 'bg-emerald-500/20 text-emerald-700 hover:bg-emerald-500/20'
                                : 'bg-blue-500/20 text-blue-700 hover:bg-blue-500/20'
                            } flex items-center gap-1 w-fit capitalize`}
                            aria-label={`Transaction type: ${transaction.type}`}
                          >
                            {transaction.type === 'deposit' ? (
                              <>
                                <span className="sr-only">Deposit</span>
                                <ArrowDownRight className="w-3 h-3" aria-hidden="true" />
                              </>
                            ) : (
                              <>
                                <span className="sr-only">Withdrawal</span>
                                <ArrowUpRight className="w-3 h-3" aria-hidden="true" />
                              </>
                            )}
                            <span aria-hidden="true">{transaction.type}</span>
                          </Badge>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <Smartphone className="w-4 h-4 text-slate-400 flex-shrink-0" aria-hidden="true" />
                            <div>
                              <p className="text-sm font-mono text-slate-900">
                                <span className="sr-only">Reference: </span>
                                {transaction.reference}
                              </p>
                              <p className="text-xs text-slate-500">
                                <span className="sr-only">Phone number: </span>
                                {transaction.phoneNumber}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-right">
                          <p className={`font-bold text-base ${
                            transaction.type === 'deposit'
                              ? 'text-emerald-600'
                              : 'text-slate-900'
                          }`}>
                            <span className="sr-only">
                              {transaction.type === 'deposit' ? 'Deposit of ' : 'Withdrawal of '}
                            </span>
                            {transaction.type === 'deposit' ? '+' : '-'}KES {formatKES(transaction.amount)}
                            <span className="sr-only"> Kenyan Shillings</span>
                          </p>
                        </td>
                        <td className="p-4 text-right">
                          <Badge
                            className={`${
                              transaction.status === 'completed'
                                ? 'bg-emerald-500/20 text-emerald-700 hover:bg-emerald-500/20'
                                : transaction.status === 'pending'
                                ? 'bg-yellow-500/20 text-yellow-700 hover:bg-yellow-500/20'
                                : 'bg-red-500/20 text-red-700 hover:bg-red-500/20'
                            } flex items-center gap-1 w-fit capitalize`}
                            aria-label={`Status: ${transaction.status}`}
                          >
                            {getStatusIcon(transaction.status)}
                            <span aria-hidden="true">
                              {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                            </span>
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </section>
        </div>
      </main>
    </div>
  );
}