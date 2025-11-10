"use client";

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowUpRight, ArrowDownRight, TrendingUp, Wallet, ShoppingCart, Building2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

// Define interfaces for our data types
interface Holding {
  assetId: string;
  symbol: string;
  tokens: number;  // Changed from shares to tokens
  avgPrice: number;
  currentPrice: number;
}

interface Property {
  id: string;
  symbol: string;
  name: string;
  city: string;
  priceChange24h: number;
  currentPrice: number;
  type?: string;
  location?: string;
  availableShares?: number;
}

interface Transaction {
  id: string;
  date: Date;
  type: 'Buy' | 'Sell';
  symbol: string;
  amount: number;
  price?: number;
  total: number;
}

// Kenyan Property Data
const mockProperties: Property[] = [
  {
    id: '1',
    symbol: 'KILIFI',
    name: 'Kilifi Beachfront Villas',
    city: 'Kilifi',
    priceChange24h: 3.2,
    currentPrice: 8500,
    type: 'Luxury Villa',
    location: 'Vipingo',
    availableShares: 5000
  },
  {
    id: '2',
    symbol: 'KAREN',
    name: 'Karen Hills Estate',
    city: 'Nairobi',
    priceChange24h: 1.8,
    currentPrice: 12500,
    type: 'Gated Community',
    location: 'Karen',
    availableShares: 3200
  },
  {
    id: '3',
    symbol: 'MAASAI',
    name: 'Maasai Mara Safari Lodge',
    city: 'Narok',
    priceChange24h: 2.5,
    currentPrice: 6800,
    type: 'Tourism',
    location: 'Mara',
    availableShares: 2500
  },
  {
    id: '4',
    symbol: 'WESTY',
    name: 'Westlands Prime Apartments',
    city: 'Nairobi',
    priceChange24h: 1.2,
    currentPrice: 9800,
    type: 'Commercial',
    location: 'Westlands',
    availableShares: 1800
  },
  {
    id: '5',
    symbol: 'MTKENYA',
    name: 'Mount Kenya Resort',
    city: 'Nanyuki',
    priceChange24h: 0.8,
    currentPrice: 7200,
    type: 'Hospitality',
    location: 'Nanyuki',
    availableShares: 4200
  }
];

// User's token holdings
const mockHoldings: Holding[] = [
  {
    assetId: '1',
    symbol: 'KILIFI',
    tokens: 150,
    avgPrice: 8200,
    currentPrice: 8500
  },
  {
    assetId: '2',
    symbol: 'KAREN',
    tokens: 80,
    avgPrice: 12200,
    currentPrice: 12500
  },
  {
    assetId: '3',
    symbol: 'MAASAI',
    tokens: 200,
    avgPrice: 6500,
    currentPrice: 6800
  }
];

// Recent transactions
const mockTransactions: Transaction[] = [
  {
    id: '1',
    date: new Date('2025-11-07T14:30:00'),
    type: 'Buy',
    symbol: 'KILIFI',
    amount: 20,
    price: 8500,
    total: 170000
  },
  {
    id: '2',
    date: new Date('2025-11-06T10:15:00'),
    type: 'Sell',
    symbol: 'KAREN',
    amount: 10,
    price: 12400,
    total: 124000
  },
  {
    id: '3',
    date: new Date('2025-11-05T16:45:00'),
    type: 'Buy',
    symbol: 'MAASAI',
    amount: 50,
    price: 6750,
    total: 337500
  },
  {
    id: '4',
    date: new Date('2025-11-04T11:20:00'),
    type: 'Buy',
    symbol: 'WESTY',
    amount: 25,
    price: 9700,
    total: 242500
  },
  {
    id: '5',
    date: new Date('2025-11-03T09:30:00'),
    type: 'Sell',
    symbol: 'MTKENYA',
    amount: 15,
    price: 7150,
    total: 107250
  }
];

interface DashboardProps {
  onNavigate: (page: string) => void;
}

export default function Dashboard() {
  const router = useRouter();
  
  // Navigation handler
  const handleNavigate = (path: string) => {
    router.push(`/${path.toLowerCase()}`);
  };

  // Calculate portfolio metrics
  const totalInvested = mockHoldings.reduce((sum: number, holding: Holding) => {
    return sum + (holding.tokens * holding.currentPrice);
  }, 0);

  const availableCash = 12450.50;
  const totalBalance = totalInvested + availableCash;
  
  const totalReturn = mockHoldings.reduce((sum: number, holding: Holding) => {
    const costBasis = holding.tokens * holding.avgPrice;
    const currentValue = holding.tokens * holding.currentPrice;
    return sum + (currentValue - costBasis);
  }, 0);
  
  const returnPercentage = totalInvested > 0 ? (totalReturn / totalInvested) * 100 : 0;

  // Top performers
  const topPerformers = [...mockProperties]
    .sort((a: Property, b: Property) => b.priceChange24h - a.priceChange24h)
    .slice(0, 5);

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-2">Welcome back! Here's your portfolio overview</p>
      </div>

        {/* Portfolio Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Total Balance */}
          <Card className="bg-gradient-to-br from-emerald-600 to-emerald-700 border-0 p-4 md:p-6">
            <div className="flex items-start justify-between mb-3 md:mb-4">
              <div>
                <p className="text-emerald-50 text-sm md:text-base mb-1 md:mb-2">Total Balance</p>
                <p className="text-2xl md:text-4xl text-white">KES {totalBalance.toLocaleString('en-KE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
              </div>
              <TrendingUp className="w-5 h-5 md:w-6 md:h-6 text-emerald-50 mt-1" />
            </div>
            <p className="text-emerald-50 text-sm md:text-base">
              {returnPercentage >= 0 ? '+' : ''}{returnPercentage.toFixed(2)}% total return
            </p>
          </Card>

          {/* Available Cash */}
          <Card className="bg-card border-border p-4 md:p-6">
            <div className="flex items-start justify-between mb-3 md:mb-4">
              <div>
                <p className="text-muted-foreground text-sm md:text-base mb-1 md:mb-2">Available Cash</p>
                <p className="text-2xl md:text-4xl text-foreground">KES {availableCash.toLocaleString('en-KE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
              </div>
              <Wallet className="w-5 h-5 md:w-6 md:h-6 text-muted-foreground mt-1" />
            </div>
            <Button 
              size="sm" 
              variant="outline" 
              className="w-full text-sm md:text-base border-border hover:bg-accent hover:text-accent-foreground"
              onClick={() => handleNavigate('wallet')}
            >
              Manage Funds
            </Button>
          </Card>

          {/* Total Invested */}
          <Card className="bg-card border-border p-4 md:p-6">
            <div className="flex items-start justify-between mb-3 md:mb-4">
              <div>
                <p className="text-muted-foreground text-sm md:text-base mb-1 md:mb-2">Total Invested</p>
                <p className="text-2xl md:text-4xl text-foreground">KES {totalInvested.toLocaleString('en-KE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
              </div>
              <Building2 className="w-5 h-5 md:w-6 md:h-6 text-muted-foreground mt-1" />
            </div>
            <p className="text-emerald-500 flex items-center gap-1 text-sm md:text-base">
              <ArrowUpRight className="w-4 h-4" />
              KES {totalReturn.toLocaleString('en-KE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} gain
            </p>
          </Card>

          {/* Active Holdings */}
          <Card className="bg-card border-border p-4 md:p-6">
            <div className="flex items-start justify-between mb-3 md:mb-4">
              <div>
                <p className="text-muted-foreground text-sm md:text-base mb-1 md:mb-2">Active Holdings</p>
                <p className="text-4xl md:text-6xl text-foreground">{mockHoldings.length}</p>
              </div>
              <ShoppingCart className="w-6 h-6 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground">Properties owned</p>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Holdings Table */}
          <Card className="bg-card border-border">
            <div className="p-6 border-b border-border">
              <h2 className="text-foreground text-xl font-semibold">My Holdings</h2>
              <p className="text-muted-foreground mt-1">Your current property positions</p>
            </div>
            
            <div className="p-6 space-y-4">
              {mockHoldings.map((holding) => {
                const totalValue = holding.tokens * holding.currentPrice;
                const costBasis = holding.tokens * holding.avgPrice;
                const returnAmount = totalValue - costBasis;
                const returnPercent = (returnAmount / costBasis) * 100;

                return (
                  <div 
                    key={holding.assetId} 
                    className="flex items-center justify-between p-4 bg-muted rounded-lg hover:bg-accent transition-colors cursor-pointer"
                    onClick={() => handleNavigate('trade')}
                  >
                    <div className="flex-1">
                      <p className="text-foreground font-medium mb-1">{holding.symbol}</p>
                      <p className="text-muted-foreground text-sm">{holding.tokens} tokens @ KES {holding.avgPrice.toLocaleString('en-KE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-foreground mb-1">KES {totalValue.toLocaleString('en-KE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                      <div className={`flex items-center gap-1 justify-end text-sm ${returnAmount >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                        {returnAmount >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                        {returnAmount >= 0 ? '+' : ''}{returnPercent.toFixed(2)}%
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="p-6 border-t border-border">
              <Button 
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                onClick={() => handleNavigate('markets')}
              >
                Explore More Properties
              </Button>
            </div>
          </Card>

          {/* Top Performers */}
          <Card className="bg-card border-border">
            <div className="p-6 border-b border-border">
              <h2 className="text-foreground text-xl font-semibold">Top Performers (24h)</h2>
              <p className="text-muted-foreground mt-1">Best performing properties today</p>
            </div>

            <div className="p-6 space-y-4">
              {topPerformers.map((property, index) => (
                <div 
                  key={property.id} 
                  className="flex items-center justify-between p-4 bg-muted rounded-lg hover:bg-accent transition-colors cursor-pointer"
                  onClick={() => handleNavigate('markets')}
                >
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-8 h-8 bg-emerald-600/20 rounded flex items-center justify-center text-emerald-500">
                      {index + 1}
                    </div>
                    <div>
                      <p className="text-foreground font-medium">{property.symbol}</p>
                      <p className="text-muted-foreground text-sm">{property.city}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-foreground mb-1">KES {property.currentPrice.toLocaleString('en-KE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                    <p className={`text-sm flex items-center gap-1 justify-end ${
                      property.priceChange24h >= 0 ? 'text-emerald-500' : 'text-red-500'
                    }`}>
                      {property.priceChange24h >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                      {property.priceChange24h >= 0 ? '+' : ''}{property.priceChange24h.toFixed(2)}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="bg-card border-border">
          <div className="p-6 border-b border-border">
            <h2 className="text-foreground text-xl font-semibold">Recent Activity</h2>
            <p className="text-muted-foreground mt-1">Your latest transactions</p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-4 text-muted-foreground text-sm font-medium">Date</th>
                  <th className="text-left p-4 text-muted-foreground text-sm font-medium">Type</th>
                  <th className="text-left p-4 text-muted-foreground text-sm font-medium">Property</th>
                  <th className="text-right p-4 text-muted-foreground text-sm font-medium">Shares</th>
                  <th className="text-right p-4 text-muted-foreground text-sm font-medium">Price</th>
                  <th className="text-right p-4 text-muted-foreground text-sm font-medium">Total</th>
                </tr>
              </thead>
              <tbody>
                {mockTransactions.slice(0, 5).map((transaction) => (
                  <tr 
                    key={transaction.id} 
                    className="border-b border-border hover:bg-accent transition-colors"
                  >
                    <td className="p-4">
                      <p className="text-foreground text-sm">{transaction.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                      <p className="text-muted-foreground text-xs">{transaction.date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</p>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1 ${
                        transaction.type === 'Buy' ? 'text-emerald-500' : 'text-red-500'
                      }`}>
                        {transaction.type === 'Buy' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                        {transaction.type}
                      </span>
                    </td>
                    <td className="p-4">
                      <p className="text-foreground text-sm">{transaction.symbol}</p>
                    </td>
                    <td className="p-4 text-right">
                      <p className="text-foreground text-sm">{transaction.amount}</p>
                    </td>
                    <td className="p-4 text-right">
                      <p className="text-foreground text-sm">KES {transaction.price?.toLocaleString('en-KE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                    </td>
                    <td className="p-4 text-right">
                      <p className="text-foreground text-sm">KES {transaction.total.toLocaleString('en-KE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-6 border-t border-border">
            <Button 
              variant="outline" 
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
              onClick={() => handleNavigate('orders')}
            >
              View All Transactions
            </Button>
          </div>
        </Card>
      </div>
  );
}
