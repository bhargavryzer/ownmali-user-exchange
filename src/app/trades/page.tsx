'use client';

import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ArrowUpRight, ArrowDownRight, TrendingUp, ArrowLeft, BarChart2, LineChart as LineChartIcon, Eye, EyeOff, Star, Smile, Meh, Frown } from 'lucide-react';
import { StockChart } from '@/components/StockChart';
import { format } from 'date-fns';
import { toast } from 'sonner';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from 'recharts';

// Define the stock data point interface
interface StockDataPoint {
  date: Date;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

// Move mock data generation to client-side only
const generateMockData = (days: number, basePrice: number = 100): StockDataPoint[] => {
  const data: StockDataPoint[] = [];
  const now = new Date();
  
  // Ensure we have at least one data point
  if (days < 1) days = 1;
  
  // Initial price
  let currentPrice = basePrice;
  
  // Generate data points for the specified number of days
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    // Generate random price movements
    const open = i === days - 1 
      ? basePrice 
      : data[data.length - 1].close;
      
    const close = open * (1 + (Math.random() * 0.02 - 0.01)); // Random change between -1% and +1%
    const high = Math.max(open, close) * (1 + Math.random() * 0.01); // Slightly higher than open/close
    const low = Math.min(open, close) * (1 - Math.random() * 0.01); // Slightly lower than open/close
    const volume = 1000 + Math.floor(Math.random() * 2000);
    
    data.push({
      date: date,
      open: parseFloat(open.toFixed(2)),
      high: parseFloat(high.toFixed(2)),
      low: parseFloat(low.toFixed(2)),
      close: parseFloat(close.toFixed(2)),
      volume: parseFloat(volume.toFixed(2))
    });
  }
  
  return data;
};

interface Property {
  id: number;
  symbol: string;
  name: string;
  type: string;
  currentPrice: number;
  priceChange24h: number;
  high24h: number;
  low24h: number;
  volume24h: number;
  marketCap: number;
}

interface TradesData {
  properties: Property[];
}

// Fallback data in case of fetch failure
const fallbackData: TradesData = {
  properties: [
    {
      id: 1,
      symbol: 'PROP1',
      name: 'Sunset Villa Estate',
      type: 'Residential',
      currentPrice: 125000,
      priceChange24h: 2.5,
      high24h: 127500,
      low24h: 123000,
      volume24h: 450000,
      marketCap: 15000000
    }
  ]
};

// Mock order book data
const generateOrderBook = (basePrice: number) => {
  const asks = [];
  const bids = [];
  
  for (let i = 0; i < 10; i++) {
    const askPrice = basePrice + (i + 1) * 100;
    const bidPrice = basePrice - (i + 1) * 100;
    const amount = 1 + Math.random() * 5;
    
    asks.push({
      price: askPrice,
      amount,
      total: askPrice * amount,
    });
    
    bids.push({
      price: bidPrice,
      amount,
      total: bidPrice * amount,
    });
  }
  
  return { 
    asks: asks.sort((a, b) => a.price - b.price), 
    bids: bids.sort((a, b) => b.price - a.price) 
  };
};

// Mock recent trades
const generateRecentTrades = (basePrice: number, count: number = 10) => {
  return Array.from({ length: count }, (_, i) => {
    const isBuy = Math.random() > 0.5;
    const price = basePrice + (Math.random() - 0.5) * 200;
    const amount = 1 + Math.random() * 5;
    const time = new Date(Date.now() - i * 5 * 60 * 1000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    
    return {
      id: `trade-${i}`,
      price,
      amount,
      time,
      type: isBuy ? 'buy' as const : 'sell' as const
    };
  });
};

interface OrderBookEntry {
  price: number;
  amount: number;
  total: number;
}

interface RecentTrade {
  price: number;
  amount: number;
  time: string;
  type: 'buy' | 'sell';
}

interface WatchlistItem {
  id: number;
  symbol: string;
  name: string;
  price: number;
  change: number;
  isWatched: boolean;
}

export default function Trading() {
  const [tradesData, setTradesData] = useState<TradesData>({ properties: [] });
  const [orderType, setOrderType] = useState<'buy' | 'sell'>('buy');
  const [price, setPrice] = useState('');
  const [amount, setAmount] = useState('');
  const [total, setTotal] = useState('');
  const [currentAsset, setCurrentAsset] = useState<Property | null>(null);
  const [timeframe, setTimeframe] = useState<'1D' | '1W' | '1M' | '1Y'>('1M');
  const [chartData, setChartData] = useState<any[]>([]);
  const [orderBook, setOrderBook] = useState<{ asks: OrderBookEntry[], bids: OrderBookEntry[] }>({ asks: [], bids: [] });
  const [recentTrades, setRecentTrades] = useState<RecentTrade[]>([]);
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [sentiment, setSentiment] = useState({ bullish: 65, bearish: 20, neutral: 15 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Format chart data for the line chart (simplified for the small chart)
  const simplifiedChartData = useMemo(() => {
    return chartData.length > 0
      ? chartData
          .filter((_, index) => index % Math.ceil(chartData.length / 20) === 0 || index === chartData.length - 1)
          .map(item => ({
            date: format(item.date, 'MMM dd'),
            price: item.close
          }))
      : [];
  }, [chartData]);
  
  // Fetch trades data from JSON
  useEffect(() => {
    const fetchTradesData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/data/trades.json');
        if (!response.ok) {
          throw new Error('Failed to fetch trades data');
        }
        const data = await response.json();
        setTradesData(data);
        
        if (data.properties.length > 0) {
          setCurrentAsset(data.properties[0]);
          
          const initialWatchlist = data.properties.map((prop: Property, index: number) => ({
            id: prop.id,
            symbol: prop.symbol,
            name: prop.name,
            price: prop.currentPrice,
            change: prop.priceChange24h,
            isWatched: index < 3 // First 3 items watched by default
          }));
          setWatchlist(initialWatchlist);
          
          const days = timeframe === '1D' ? 1 : 
                      timeframe === '1W' ? 7 :
                      timeframe === '1M' ? 30 : 365;
          
          const priceData = generateMockData(days, data.properties[0].currentPrice / 1000);
          // Ensure priceData is an array and properly formatted
          if (Array.isArray(priceData) && priceData.length > 0) {
            const formattedData = priceData.map(item => ({
              date: new Date(item.date),
              open: Number(item.open),
              high: Number(item.high),
              low: Number(item.low),
              close: Number(item.close),
              volume: Number(item.volume)
            }));
            setChartData(formattedData);
          } else {
            console.error('Invalid price data generated:', priceData);
            setChartData([]);
          }
          
          setOrderBook(generateOrderBook(data.properties[0].currentPrice));
          setRecentTrades(generateRecentTrades(data.properties[0].currentPrice));
          setPrice(data.properties[0].currentPrice.toFixed(2));
        }
      } catch (err) {
        console.error('Error fetching trades data:', err);
        setError('Failed to load trades data. Using fallback data.');
        setTradesData(fallbackData);
        
        if (fallbackData.properties.length > 0) {
          setCurrentAsset(fallbackData.properties[0]);
          // ... rest of the fallback initialization
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchTradesData();
  }, [timeframe]);

  // Update chart data when timeframe or currentAsset changes
  useEffect(() => {
    if (isLoading || !currentAsset) return;
    
    const days = timeframe === '1D' ? 1 : 
                timeframe === '1W' ? 7 :
                timeframe === '1M' ? 30 : 365;
    
    const priceData = generateMockData(days, currentAsset.currentPrice / 1000);
    // Ensure priceData is an array and properly formatted
    if (Array.isArray(priceData) && priceData.length > 0) {
      const formattedData = priceData.map(item => ({
        date: new Date(item.date),
        open: Number(item.open),
        high: Number(item.high),
        low: Number(item.low),
        close: Number(item.close),
        volume: Number(item.volume)
      }));
      setChartData(formattedData);
    } else {
      console.error('Invalid price data generated:', priceData);
      setChartData([]);
    }
    
    if (currentAsset) {
      setOrderBook(generateOrderBook(currentAsset.currentPrice));
      setRecentTrades(generateRecentTrades(currentAsset.currentPrice));
    }
  }, [timeframe, currentAsset, isLoading]);

  // Handle market price button click
  const handleMarketPrice = () => {
    if (!currentAsset) {
      toast.error('No asset selected');
      return;
    }
    setPrice(currentAsset.currentPrice.toFixed(2));
  };

  // Handle max amount button click
  const handleMaxAmount = () => {
    if (!currentAsset) {
      toast.error('No asset selected');
      return;
    }
    const maxAmount = Math.floor(availableBalance / currentAsset.currentPrice);
    setAmount(maxAmount.toString());
    setPrice(currentAsset.currentPrice.toString());
  };

  // Calculate total when price or amount changes
  useEffect(() => {
    if (!currentAsset) return;
    
    if (price && amount) {
      const calculatedTotal = parseFloat(price) * parseFloat(amount);
      setTotal(calculatedTotal.toFixed(2));
    } else {
      setTotal('');
    }
  }, [price, amount, currentAsset]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading trading data...</div>
      </div>
    );
  }

  const availableBalance = 10000.00;

  const handlePlaceOrder = () => {
    if (!currentAsset) {
      toast.error('No asset selected');
      return;
    }
    
    if (!amount || parseFloat(amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    const orderTotal = parseFloat(total);
    if (isNaN(orderTotal)) {
      toast.error('Invalid order total');
      return;
    }

    if (orderType === 'buy' && orderTotal > availableBalance) {
      toast.error('Insufficient balance');
      return;
    }

    toast.success(`${orderType === 'buy' ? 'Buy' : 'Sell'} order placed successfully for ${amount} shares of ${currentAsset.symbol}`);
    setAmount('');
    setTotal('');
  };

  // Format currency in Kenyan Shillings (KES)
  const formatCurrency = (value?: number) => {
    if (value === undefined) return 'KES 0.00';
    return `KES ${value.toLocaleString('en-KE', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
  };

  const toggleWatchlist = (id: number) => {
    setWatchlist(prev => prev.map(item => 
      item.id === id ? { ...item, isWatched: !item.isWatched } : item
    ));
    const item = watchlist.find(w => w.id === id);
    if (item) {
      toast.success(item.isWatched ? `Removed ${item.symbol} from watchlist` : `Added ${item.symbol} to watchlist`);
    }
  };

  const sentimentData = [
    { name: 'Bullish', value: sentiment.bullish, color: '#10b981' },
    { name: 'Bearish', value: sentiment.bearish, color: '#ef4444' },
    { name: 'Neutral', value: sentiment.neutral, color: '#6b7280' }
  ];

  return (
    <div className="min-h-screen bg-white p-4 sm:p-6 lg:p-8" role="main" aria-label="Trading Platform">
      <div className="max-w-[1600px] mx-auto">
        {/* Back Button */}
        <Button 
          variant="outline" 
          className="mb-6 text-gray-700 bg-white hover:bg-gray-50 hover:text-gray-900 border-gray-200 shadow-sm transition-all"
          onClick={() => window.history.back()}
          aria-label="Go back to markets"
        >
          <ArrowLeft className="w-4 h-4 mr-2" aria-hidden="true" />
          Back to Markets
        </Button>

        {/* Asset Header */}
        <div className="mb-8 p-6 bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="flex-1">
              {currentAsset ? (
                <>
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">{currentAsset.symbol}</h1>
                    <Badge className="bg-blue-50 text-blue-700 hover:bg-blue-50 border border-blue-200 px-3 py-1">
                      {currentAsset.type}
                    </Badge>
                  </div>
                  <p className="text-gray-600 text-base">{currentAsset.name}</p>
                </>
              ) : (
                <div className="animate-pulse">
                  <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              )}
            </div>
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-5 rounded-xl border border-gray-200 min-w-[280px]" aria-live="polite">
              <p className="text-gray-600 text-xs font-semibold tracking-wide mb-2 uppercase">Current Price</p>
              {currentAsset ? (
                <div className="flex items-baseline gap-4">
                  <p className="text-3xl sm:text-4xl font-bold text-gray-900">{formatCurrency(currentAsset.currentPrice)}</p>
                  <span 
                    className={`flex items-center gap-1.5 text-sm font-semibold px-3 py-1.5 rounded-lg ${
                      currentAsset.priceChange24h >= 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                    }`}
                    aria-label={`24 hour change: ${currentAsset.priceChange24h >= 0 ? 'up' : 'down'} ${Math.abs(currentAsset.priceChange24h).toFixed(2)} percent`}
                  >
                    {currentAsset.priceChange24h >= 0 ? (
                      <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
                    ) : (
                      <ArrowDownRight className="w-3.5 h-3.5" aria-hidden="true" />
                    )}
                    {Math.abs(currentAsset.priceChange24h).toFixed(2)}%
                  </span>
                </div>
              ) : (
                <div className="animate-pulse">
                  <div className="h-10 bg-gray-200 rounded w-3/4 mb-2"></div>
                </div>
              )}
              <p className="text-gray-500 text-xs mt-2 font-medium">24h Change</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Left Column - Chart and Stats */}
          <div className="lg:col-span-2 space-y-6">
            {/* Price Chart */}
            <Card className="border border-gray-200 bg-white shadow-sm">
              <CardHeader className="pb-3 px-6 pt-5 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2.5">
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <LineChartIcon className="w-5 h-5 text-blue-600" />
                    </div>
                    Price Chart
                  </h2>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="h-9 px-4 text-xs font-medium bg-white border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-gray-900" 
                      onClick={() => setTimeframe('1D')}
                      aria-label="View 1 day chart"
                    >
                      1D
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="h-9 px-4 text-xs font-medium bg-white border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-gray-900" 
                      onClick={() => setTimeframe('1W')}
                      aria-label="View 1 week chart"
                    >
                      1W
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="h-9 px-4 text-xs font-medium bg-white border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-gray-900" 
                      onClick={() => setTimeframe('1M')}
                      aria-label="View 1 month chart"
                    >
                      1M
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="h-9 px-4 text-xs font-medium bg-white border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-gray-900" 
                      onClick={() => setTimeframe('1Y')}
                      aria-label="View 1 year chart"
                    >
                      1Y
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="h-[500px] px-6 py-6">
                  <div className="w-full">
                    <StockChart 
                      data={chartData} 
                      width={800} 
                      height={500}
                      ratio={1} 
                      type="hybrid"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Key Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="border border-gray-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
                <p className="text-gray-600 text-xs font-semibold mb-2 uppercase tracking-wide">24H High</p>
                <p className="text-xl font-bold text-gray-900">
                  {currentAsset ? formatCurrency(currentAsset.high24h || currentAsset.currentPrice * 1.02) : 'KES 0.00'}
                </p>
              </Card>
              <Card className="border border-gray-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
                <p className="text-gray-600 text-xs font-semibold mb-2 uppercase tracking-wide">24H Low</p>
                <p className="text-xl font-bold text-gray-900">
                  {currentAsset ? formatCurrency(currentAsset.low24h || currentAsset.currentPrice * 0.98) : 'KES 0.00'}
                </p>
              </Card>
              <Card className="border border-gray-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
                <p className="text-gray-600 text-xs font-semibold mb-2 uppercase tracking-wide">24H Volume</p>
                <p className="text-xl font-bold text-gray-900">
                  {currentAsset 
                    ? `KES ${currentAsset.volume24h ? (currentAsset.volume24h / 1000).toFixed(1) : '0.0'}K`
                    : 'KES 0.0K'}
                </p>
              </Card>
              <Card className="border border-gray-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
                <p className="text-gray-600 text-xs font-semibold mb-2 uppercase tracking-wide">Market Cap</p>
                <p className="text-xl font-bold text-gray-900">
                  {currentAsset
                    ? `KES ${currentAsset.marketCap ? (currentAsset.marketCap / 1000000).toFixed(1) : '0.0'}M`
                    : 'KES 0.0M'}
                </p>
              </Card>
            </div>

            {/* Order Book */}
            <Card className="border border-gray-200 bg-white shadow-sm">
              <CardHeader className="pb-3 px-6 pt-5 border-b border-gray-100">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2.5">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <BarChart2 className="w-5 h-5 text-blue-600" />
                  </div>
                  Order Book
                </h2>
              </CardHeader>
              <CardContent className="px-6 py-5">
                <div className="grid grid-cols-2 gap-6">
                  {/* Asks */}
                  <div>
                    <div className="grid grid-cols-3 gap-3 text-gray-600 text-xs font-semibold mb-3 pb-2 border-b border-gray-200 uppercase tracking-wide">
                      <div>Price</div>
                      <div className="text-right">Amount</div>
                      <div className="text-right">Total</div>
                    </div>
                    <div className="space-y-1" role="grid" aria-label="Sell orders">
                      {orderBook.asks.slice(0, 8).reverse().map((ask, index) => (
                        <div 
                          key={`ask-${index}`} 
                          className="grid grid-cols-3 gap-3 text-sm hover:bg-red-50 p-2 rounded-lg transition-colors"
                          role="row"
                          aria-label={`Sell order ${index + 1}`}
                        >
                          <div className="text-red-600 font-semibold" role="cell">{formatCurrency(ask.price)}</div>
                          <div className="text-right text-gray-900 font-medium" role="cell">{ask.amount.toFixed(4)}</div>
                          <div className="text-right text-gray-700" role="cell">{formatCurrency(ask.total)}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Bids */}
                  <div>
                    <div className="grid grid-cols-3 gap-3 text-gray-600 text-xs font-semibold mb-3 pb-2 border-b border-gray-200 uppercase tracking-wide">
                      <div>Price</div>
                      <div className="text-right">Amount</div>
                      <div className="text-right">Total</div>
                    </div>
                    <div className="space-y-1" role="grid" aria-label="Buy orders">
                      {orderBook.bids.slice(0, 8).map((bid, index) => (
                        <div 
                          key={`bid-${index}`} 
                          className="grid grid-cols-3 gap-3 text-sm hover:bg-emerald-50 p-2 rounded-lg transition-colors"
                          role="row"
                          aria-label={`Buy order ${index + 1}`}
                        >
                          <div className="text-emerald-600 font-semibold" role="cell">{formatCurrency(bid.price)}</div>
                          <div className="text-right text-gray-900 font-medium" role="cell">{bid.amount.toFixed(4)}</div>
                          <div className="text-right text-gray-700" role="cell">{formatCurrency(bid.total)}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="mt-5 pt-5 border-t border-gray-200 text-center bg-gray-50 rounded-lg p-4">
                  <p className="text-sm">
                    <span className="text-gray-600 font-medium">Last Price: </span>
                    <span className="text-2xl font-bold text-gray-900 ml-2">{formatCurrency(currentAsset?.currentPrice || 0)}</span>
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Recent Trades */}
            <Card className="border border-gray-200 bg-white shadow-sm">
              <CardHeader className="pb-3 px-6 pt-5 border-b border-gray-100">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2.5">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <TrendingUp className="w-5 h-5 text-blue-600" />
                  </div>
                  Recent Trades
                </h2>
              </CardHeader>
              <CardContent className="px-6 py-5">
                <div className="grid grid-cols-12 gap-2 text-gray-600 text-xs font-semibold mb-3 pb-2 border-b border-gray-200 uppercase tracking-wide px-2">
                  <div className="col-span-5">Price (KES)</div>
                  <div className="col-span-4 text-right">Amount</div>
                  <div className="col-span-3 text-right">Time</div>
                </div>
                <div className="space-y-1 max-h-80 overflow-y-auto pr-1" role="grid" aria-label="Recent trades">
                  {recentTrades.map((trade, index) => (
                    <div 
                      key={`trade-${index}`} 
                      className="grid grid-cols-12 gap-2 text-sm py-2 hover:bg-gray-50 rounded-lg px-2 transition-colors items-center"
                      role="row"
                      aria-label={`${trade.type === 'buy' ? 'Buy' : 'Sell'} order at ${trade.time}`}
                    >
                      <div className={`col-span-5 font-medium ${trade.type === 'buy' ? 'text-emerald-600' : 'text-red-600'}`} role="cell">
                        {formatCurrency(trade.price)}
                      </div>
                      <div className="col-span-4 text-right font-mono text-gray-900" role="cell">
                        {parseFloat(trade.amount.toFixed(4))}
                      </div>
                      <div className="col-span-3 text-right text-gray-500 text-xs" role="cell">
                        {trade.time}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Order Placement, Watchlist, and Sentiment */}
          <div className="space-y-6">
            {/* Place Order */}
            <Card className="border border-gray-200 bg-white shadow-sm">
              <CardHeader className="pb-4 px-6 pt-5 border-b border-gray-100">
                <h2 className="text-xl font-semibold text-gray-900">Place Order</h2>
              </CardHeader>
              <CardContent className="px-6 py-5">
                <Tabs 
                  value={orderType} 
                  onValueChange={(value) => setOrderType(value as 'buy' | 'sell')}
                  className="w-full"
                >
                  <TabsList className="w-full bg-gray-100 border border-gray-200 p-1 rounded-lg mb-5 h-12">
                    <TabsTrigger 
                      value="buy" 
                      className="flex-1 h-10 text-sm font-semibold data-[state=active]:bg-white data-[state=active]:text-emerald-600 data-[state=active]:shadow-sm rounded-md transition-all"
                    >
                      Buy
                    </TabsTrigger>
                    <TabsTrigger 
                      value="sell" 
                      className="flex-1 h-10 text-sm font-semibold data-[state=active]:bg-white data-[state=active]:text-red-600 data-[state=active]:shadow-sm rounded-md transition-all"
                    >
                      Sell
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="buy" className="space-y-5 mt-0">
                    <div>
                      <label htmlFor="buy-price" className="block text-sm font-semibold text-gray-700 mb-2">Price (KES)</label>
                      <Input
                        id="buy-price"
                        type="number"
                        placeholder="0.00"
                        className="w-full h-11 border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        aria-label="Price in KES"
                        min="0"
                        step="0.01"
                      />
                    </div>

                    <div>
                      <label htmlFor="buy-amount" className="block text-sm font-semibold text-gray-700 mb-2">
                        Amount ({currentAsset?.symbol || 'TOKEN'})
                      </label>
                      <Input
                        id="buy-amount"
                        type="number"
                        placeholder="0.00"
                        className="w-full h-11 border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        aria-label={`Amount of ${currentAsset?.symbol || 'token'}`}
                        min="0"
                        step="0.0001"
                      />
                    </div>

                    <div>
                      <label htmlFor="buy-total" className="block text-sm font-semibold text-gray-700 mb-2">Total (KES)</label>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={handleMarketPrice}
                        className="text-blue-600 hover:text-blue-700 text-xs font-medium"
                        disabled={!currentAsset}
                      >
                        Market Price
                      </Button>
                      <Input
                        id="buy-total"
                        type="text"
                        placeholder="0.00"
                        className="w-full h-11 bg-gray-50 border-gray-300"
                        value={total}
                        readOnly
                        aria-label="Total amount in KES"
                        aria-readonly="true"
                      />
                    </div>

                    <div className="flex items-center justify-between py-3 px-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200">
                      <span className="text-sm font-semibold text-gray-700">Available Balance</span>
                      <span className="text-sm font-bold text-gray-900">
                        {formatCurrency(availableBalance)}
                      </span>
                    </div>

                    <Button 
                      className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white h-12 text-base font-semibold shadow-md hover:shadow-lg transition-all"
                      onClick={handlePlaceOrder}
                      aria-label={`Buy ${currentAsset?.symbol || 'token'}`}
                      disabled={!currentAsset}
                    >
                      Buy {currentAsset?.symbol || 'Token'}
                    </Button>
                  </TabsContent>

                  <TabsContent value="sell" className="space-y-5 mt-0">
                    <div>
                      <label htmlFor="sell-price" className="block text-sm font-semibold text-gray-700 mb-2">Price (KES)</label>
                      <Input
                        id="sell-price"
                        type="number"
                        placeholder="0.00"
                        className="w-full h-11 border-gray-300 focus:border-red-500 focus:ring-red-500"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        aria-label="Price in KES"
                        min="0"
                        step="0.01"
                      />
                    </div>

                    <div>
                      <label htmlFor="sell-amount" className="block text-sm font-semibold text-gray-700 mb-2">
                        Amount ({currentAsset?.symbol || 'TOKEN'})
                      </label>
                      <Input
                        id="sell-amount"
                        type="number"
                        placeholder="0.00"
                        className="w-full h-11 border-gray-300 focus:border-red-500 focus:ring-red-500"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        aria-label={`Amount of ${currentAsset?.symbol || 'token'}`}
                        min="0"
                        step="0.0001"
                      />
                    </div>

                    <div>
                      <label htmlFor="sell-total" className="block text-sm font-semibold text-gray-700 mb-2">Total (KES)</label>
                      <Input
                        id="sell-total"
                        type="text"
                        placeholder="0.00"
                        className="w-full h-11 bg-gray-50 border-gray-300"
                        value={total}
                        readOnly
                        aria-label="Total amount in KES"
                        aria-readonly="true"
                      />
                    </div>

                    <div className="flex items-center justify-between py-3 px-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200">
                      <span className="text-sm font-semibold text-gray-700">Available Balance</span>
                      <span className="text-sm font-bold text-gray-900">
                        {formatCurrency(availableBalance)}
                      </span>
                    </div>

                    <Button 
                      className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white h-12 text-base font-semibold shadow-md hover:shadow-lg transition-all"
                      onClick={handlePlaceOrder}
                      aria-label={`Sell ${currentAsset?.symbol || 'token'}`}
                      disabled={!currentAsset}
                    >
                      Sell {currentAsset?.symbol || 'Token'}
                    </Button>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* Watchlist */}
            <Card className="border border-gray-200 bg-white shadow-sm">
              <CardHeader className="pb-4 px-6 pt-5 border-b border-gray-100">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2.5">
                  <div className="p-2 bg-amber-50 rounded-lg">
                    <Star className="w-5 h-5 text-amber-600" />
                  </div>
                  Watchlist
                </h2>
              </CardHeader>
              <CardContent className="px-0 py-4">
                <div className="space-y-1">
                  {watchlist.filter(item => item.isWatched).length === 0 ? (
                    <div className="text-center py-8 px-6">
                      <p className="text-gray-500 text-sm">No assets in watchlist</p>
                      <p className="text-gray-400 text-xs mt-1">Click the eye icon to add assets</p>
                    </div>
                  ) : (
                    watchlist.filter(item => item.isWatched).map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between px-6 py-3 hover:bg-gray-50 transition-colors group"
                      >
                        <div className="flex items-center gap-3 flex-1">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                            <span className="text-blue-700 font-bold text-sm">
                              {item.symbol.charAt(0)}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-gray-900 text-sm truncate">{item.symbol}</p>
                            <p className="text-xs text-gray-500 truncate">{item.name}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <p className="text-sm font-bold text-gray-900">
                              {formatCurrency(item.price)}
                            </p>
                            <div 
                              className={`inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-full ${
                                item.change >= 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
                              }`}
                              aria-label={`Change: ${item.change >= 0 ? 'up' : 'down'} ${Math.abs(item.change).toFixed(2)}%`}
                            >
                              {item.change >= 0 ? (
                                <ArrowUpRight className="w-3 h-3 mr-0.5" aria-hidden="true" />
                              ) : (
                                <ArrowDownRight className="w-3 h-3 mr-0.5" aria-hidden="true" />
                              )}
                              {Math.abs(item.change).toFixed(2)}%
                            </div>
                          </div>
                          <button
                            onClick={() => toggleWatchlist(item.id)}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                            aria-label={`Remove ${item.symbol} from watchlist`}
                          >
                            <EyeOff className="w-4 h-4 text-gray-600" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                
                {/* All Assets Section */}
                <div className="mt-4 pt-4 border-t border-gray-200 px-6">
                  <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-3">All Assets</p>
                  <div className="space-y-1">
                    {watchlist.filter(item => !item.isWatched).map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between py-2 hover:bg-gray-50 rounded-lg px-2 transition-colors group"
                      >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                            <span className="text-gray-600 font-semibold text-xs">
                              {item.symbol.charAt(0)}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-gray-900 text-sm truncate">{item.symbol}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="text-right">
                            <p className="text-xs font-bold text-gray-900">
                              {formatCurrency(item.price)}
                            </p>
                          </div>
                          <button
                            onClick={() => toggleWatchlist(item.id)}
                            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                            aria-label={`Add ${item.symbol} to watchlist`}
                          >
                            <Eye className="w-4 h-4 text-gray-600" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Sentiment Analysis */}
            <Card className="border border-gray-200 bg-white shadow-sm">
              <CardHeader className="pb-4 px-6 pt-5 border-b border-gray-100">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2.5">
                  <div className="p-2 bg-purple-50 rounded-lg">
                    <TrendingUp className="w-5 h-5 text-purple-600" />
                  </div>
                  Market Sentiment
                </h2>
              </CardHeader>
              <CardContent className="px-6 py-5">
                {/* Pie Chart */}
                <div className="flex justify-center mb-6">
                  <div className="w-48 h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={sentimentData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={2}
                          dataKey="value"
                        >
                          {sentimentData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#ffffff', 
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px',
                            fontSize: '12px',
                            padding: '8px 12px'
                          }}
                          formatter={(value: number) => [`${value.toFixed(1)}%`, '']}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Sentiment Breakdown */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg border border-emerald-100">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-emerald-100 rounded-lg">
                        <Smile className="w-5 h-5 text-emerald-700" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-emerald-900">Bullish</p>
                        <p className="text-xs text-emerald-700">Positive outlook</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-emerald-700">{sentiment.bullish.toFixed(0)}%</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-100">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-red-100 rounded-lg">
                        <Frown className="w-5 h-5 text-red-700" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-red-900">Bearish</p>
                        <p className="text-xs text-red-700">Negative outlook</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-red-700">{sentiment.bearish.toFixed(0)}%</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gray-100 rounded-lg">
                        <Meh className="w-5 h-5 text-gray-700" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">Neutral</p>
                        <p className="text-xs text-gray-700">Waiting & watching</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-gray-700">{sentiment.neutral.toFixed(0)}%</p>
                    </div>
                  </div>
                </div>

                {/* Sentiment Summary */}
                <div className="mt-5 pt-5 border-t border-gray-200">
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border border-blue-100">
                    <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">Overall Sentiment</p>
                    <p className="text-lg font-bold text-gray-900">
                      {sentiment.bullish > 50 ? 'Strong Buy Signal' : 
                       sentiment.bearish > 40 ? 'Caution Advised' : 
                       'Mixed Signals'}
                    </p>
                    <p className="text-xs text-gray-600 mt-2">
                      Based on community analysis and market indicators
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}