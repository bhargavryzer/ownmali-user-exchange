"use client";

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { X, ArrowUpRight, ArrowDownRight, Building2, MapPin, TrendingUp, Clock, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import ordersMock from '@/data/orders.json';

type OrderStatus = 'filled' | 'cancelled' | 'partial' | 'pending';

interface Order {
  id: string;
  symbol: string;
  propertyName: string;
  location: string;
  type: 'Buy' | 'Sell';
  price: number;
  amount: number;
  filled?: number;
  category?: string;
  total: number;
  status: OrderStatus;
  date: string;
  tokenValue: string;
}

interface OrdersData {
  openOrders: Order[];
  orderHistory: Order[];
}

// Fallback data in case of fetch failure
const fallbackData: OrdersData = {
  openOrders: [
    {
      id: 'ORD-2024-001',
      symbol: 'KAREN-RES-01',
      propertyName: 'Karen Luxury Apartments',
      location: 'Karen, Nairobi',
      type: 'Buy',
      price: 125000,
      amount: 50,
      filled: 25,
      total: 6250000,
      status: 'partial',
      date: '2024-11-05T10:30:00',
      tokenValue: 'KES 125,000 per token',
      category: 'Hotels',
    },
  ],
  orderHistory: [
    {
      id: 'ORD-2024-H001',
      symbol: 'LAVINGTON-RES-05',
      propertyName: 'Lavington Garden Suites',
      location: 'Lavington, Nairobi',
      type: 'Buy',
      price: 150000,
      amount: 40,
      total: 6000000,
      status: 'filled',
      date: '2024-10-28T13:20:00',
      tokenValue: 'KES 150,000 per token',
      category: 'Hotels',
    },
  ],
};

export default function Orders() {
  const [ordersData, setOrdersData] = useState<OrdersData>(ordersMock as OrdersData);
  const [isLoading] = useState(false);
  const [error] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('open');

  const { openOrders, orderHistory } = ordersData;

  const handleCancelOrder = (orderId: string, symbol: string): void => {
    setOrdersData(prev => ({
      ...prev,
      openOrders: prev.openOrders.filter(order => order.id !== orderId)
    }));
    console.log(`Order ${orderId} for ${symbol} has been cancelled`);
  };

  const formatKES = (amount: number): string => {
    return `KES ${amount.toLocaleString('en-KE', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  };

  const getStatusIcon = (status: OrderStatus): React.ReactNode => {
    switch(status) {
      case 'filled':
        return <CheckCircle2 className="w-3 h-3" aria-hidden="true" />;
      case 'cancelled':
        return <XCircle className="w-3 h-3" aria-hidden="true" />;
      case 'partial':
      case 'pending':
        return <Clock className="w-3 h-3" aria-hidden="true" />;
      default:
        return <Clock className="w-3 h-3" aria-hidden="true" />;
    }
  };

  // Format date to be more readable
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }).format(date);
  };

  // Format large numbers with K/M/B suffixes using KES
  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return `KES ${(num / 1000000).toFixed(1)}M`;
    }
    if (num >= 1000) {
      return `KES ${(num / 1000).toFixed(1)}K`;
    }
    return `KES ${num.toLocaleString('en-KE')}`;
  };

  return (
    <div className="min-h-screen bg-white p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Enhanced Header */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-100">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-emerald-500/10 rounded-xl" aria-hidden="true">
              <Building2 className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900" id="page-title">Order Management</h1>
              <p className="text-slate-600 mt-1">Track your tokenized real estate investments</p>
            </div>
          </div>
          
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <Card className="bg-white border-slate-100 hover:shadow-md transition-shadow">
              <div className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-500">Active Orders</p>
                    <p className="text-2xl font-bold text-slate-900 mt-2">
                      {isLoading ? (
                        <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
                      ) : (
                        <>{openOrders?.length || 0} <span className="text-sm font-normal text-slate-400">orders</span></>
                      )}
                    </p>
                  </div>
                  <div className="p-3 bg-blue-500/10 rounded-lg" aria-hidden="true">
                    <TrendingUp className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </div>
            </Card>
            
            <Card className="bg-white border-slate-100 hover:shadow-md transition-shadow">
              <div className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-500">Total Value</p>
                    <p className="text-2xl font-bold text-slate-900 mt-1">
                      {isLoading ? (
                        <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
                      ) : (
                        <>
                          {formatNumber(
                            (openOrders?.reduce((sum: number, o: Order) => sum + o.total, 0) || 0) +
                            (orderHistory?.reduce((sum: number, o: Order) => sum + o.total, 0) || 0)
                          )}
                          <span className="text-sm font-normal text-slate-400 ml-1">total</span>
                        </>
                      )}
                    </p>
                  </div>
                  <div className="p-3 bg-emerald-500/10 rounded-lg" aria-hidden="true">
                    <Building2 className="w-6 h-6 text-emerald-600" />
                  </div>
                </div>
              </div>
            </Card>
            
            <Card className="bg-white border-slate-100 hover:shadow-md transition-shadow">
              <div className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-500">Completed Orders</p>
                    <p className="text-2xl font-bold text-slate-900 mt-1">
                      {isLoading ? (
                        <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
                      ) : (
                        <span className="text-2xl font-bold text-slate-900 mt-2">
                          {orderHistory?.filter((order: Order) => order.status === 'filled').length || 0}
                          <span className="text-sm font-normal text-slate-500 ml-1">total</span>
                        </span>
                      )}
                    </p>
                  </div>
                  <div className="p-3 bg-purple-500/10 rounded-lg" aria-hidden="true">
                    <CheckCircle2 className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Enhanced Tabs */}
        <Tabs 
          value={activeTab} 
          onValueChange={setActiveTab} 
          className="w-full bg-white rounded-xl shadow-sm border border-slate-100 p-2"
          aria-labelledby="page-title"
        >
          <TabsList className="bg-slate-50 p-1 w-full md:w-auto rounded-lg" role="tablist">
            <TabsTrigger 
              value="open" 
              className="data-[state=active]:bg-white data-[state=active]:text-emerald-600 data-[state=active]:shadow-sm px-6 py-2 rounded-md transition-all text-slate-800 hover:text-emerald-600 data-[state=active]:font-semibold"
              role="tab"
              aria-selected={activeTab === 'open'}
              tabIndex={activeTab === 'open' ? 0 : -1}
            >
              <Clock className="w-4 h-4 mr-2" />
              Open Orders ({isLoading ? '-' : openOrders?.length || 0})
            </TabsTrigger>
            <TabsTrigger 
              value="history" 
              className="data-[state=active]:bg-white data-[state=active]:text-emerald-600 data-[state=active]:shadow-sm px-6 py-2 rounded-md transition-all text-slate-800 hover:text-emerald-600 data-[state=active]:font-semibold"
              role="tab"
              aria-selected={activeTab === 'history'}
              tabIndex={activeTab === 'history' ? 0 : -1}
            >
              <CheckCircle2 className="w-4 h-4 mr-2" />
              History
            </TabsTrigger>
          </TabsList>

          {/* Open Orders Tab */}
          <TabsContent value="open" role="tabpanel" tabIndex={0}>
            <Card className="bg-white border-slate-100 overflow-hidden shadow-sm">
              <div className="p-6 border-b border-slate-100">
                <h2 className="text-xl font-semibold text-slate-900">Active Orders</h2>
                <p className="text-slate-500 mt-1">
                  {isLoading ? (
                    <span className="inline-flex items-center">
                      Loading orders <Loader2 className="w-4 h-4 ml-2 animate-spin text-slate-400" />
                    </span>
                  ) : (
                    `Orders awaiting execution • ${openOrders?.length || 0} total`
                  )}
                </p>
              </div>

              {isLoading ? (
                <div className="p-8 text-center">
                  <Loader2 className="w-8 h-8 animate-spin mx-auto text-slate-400" />
                  <p className="text-slate-500 mt-2">Loading orders...</p>
                </div>
              ) : openOrders?.length ? (
                <div className="overflow-x-auto">
                  <table className="w-full divide-y divide-slate-100">
                    <thead>
                      <tr className="bg-slate-50">
                        <th className="text-left p-4 text-xs font-medium text-slate-500 uppercase tracking-wider">Property</th>
                        <th className="text-left p-4 text-xs font-medium text-slate-500 uppercase tracking-wider">Category</th>
                        <th className="text-left p-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Type</th>
                        <th className="text-right p-4 text-xs font-medium text-slate-500 uppercase tracking-wider">Price/Token</th>
                        <th className="text-right p-4 text-xs font-medium text-slate-500 uppercase tracking-wider">Tokens</th>
                        <th scope="col" className="text-right p-4 text-xs font-medium text-slate-500 uppercase tracking-wider">Progress</th>
                        <th className="text-right p-4 text-xs font-medium text-slate-500 uppercase tracking-wider">Total</th>
                        <th className="text-right p-4 text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                        <th scope="col" className="text-right p-4 text-xs font-medium text-slate-500 uppercase tracking-wider">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {openOrders.map((order, index) => (
                        <tr 
                          key={order.id} 
                          className="hover:bg-slate-50/50 transition-colors"
                          aria-rowindex={index + 2}
                        >
                          <td className="p-4">
                            <div className="flex items-start gap-3">
                              <div className="p-2 bg-emerald-500/10 rounded-lg flex-shrink-0">
                                <Building2 className="w-5 h-5 text-emerald-600" />
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <p className="font-semibold text-slate-900">{order.propertyName}</p>
                                  <span className="text-xs px-2 py-0.5 bg-slate-100 text-slate-500 rounded">{order.symbol}</span>
                                </div>
                                <span className="text-sm text-slate-500">{new Date(order.date).toLocaleDateString()}</span>
                                <div className="text-sm text-slate-500 flex items-center gap-1 mt-1">
                                  <MapPin className="w-3 h-3 flex-shrink-0" aria-hidden="true" />
                                  <span className="truncate">{order.location}</span>
                                </div>
                                <p className="text-xs text-slate-400 mt-1">
                                  {formatDate(order.date)}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <p className="text-sm text-slate-600">{order.category || '—'}</p>
                          </td>
                          <td className="p-4">
                            <div className="flex flex-col items-start">
                              <Badge 
                                className={`${
                                  order.type === 'Buy' 
                                    ? 'bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/20' 
                                    : 'bg-red-500/10 text-red-700 hover:bg-red-500/20'
                                } flex items-center gap-1 w-fit font-medium`}
                              >
                                {order.type === 'Buy' ? (
                                  <ArrowUpRight className="w-3 h-3" />
                                ) : (
                                  <ArrowDownRight className="w-3 h-3" />
                                )}
                                {order.type}
                              </Badge>
                              <span className="text-xs text-slate-400 mt-1">
                                {order.tokenValue}
                              </span>
                            </div>
                          </td>
                          <td className="p-4 text-right">
                            <div className="flex flex-col items-end">
                              <p className="font-semibold text-slate-900">{formatNumber(order.price)}</p>
                              <p className="text-xs text-slate-400">per token</p>
                            </div>
                          </td>
                          <td className="p-4 text-right">
                            <div className="flex flex-col items-end">
                              <p className="font-semibold text-slate-900">{order.amount}</p>
                              <p className="text-xs text-slate-400">tokens</p>
                            </div>
                          </td>
                          <td className="p-4 text-right">
                            <div className="flex flex-col items-end">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium text-slate-900">
                                  {Math.round(((order.filled || 0) / order.amount) * 100)}%
                                </span>
                                <span className="text-xs text-slate-400">
                                  ({order.filled || 0}/{order.amount})
                                </span>
                              </div>
                              <div className="w-20 h-1.5 bg-slate-100 rounded-full overflow-hidden mt-1.5">
                                <div 
                                  className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500 transition-all duration-500"
                                  style={{ width: `${((order.filled || 0) / order.amount) * 100}%` }}
                                />
                              </div>
                            </div>
                          </td>
                          <td className="p-4 text-right">
                            <div className="flex flex-col items-end">
                              <p className="font-semibold text-slate-900">{formatNumber(order.total)}</p>
                              <p className="text-xs text-slate-400">
                                {Math.round(order.total / order.amount)} × {order.amount}
                              </p>
                            </div>
                          </td>
                          <td className="p-4 text-right">
                            <div className="flex justify-end">
                              <Badge 
                                className={`${
                                  order.status === 'partial' 
                                    ? 'bg-amber-500/10 text-amber-700 hover:bg-amber-500/20' 
                                    : order.status === 'pending'
                                    ? 'bg-blue-500/10 text-blue-700 hover:bg-blue-500/20'
                                    : 'bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/20'
                                } flex items-center gap-1.5 w-fit font-medium capitalize`}
                              >
                                {getStatusIcon(order.status as OrderStatus)}
                                {order.status}
                              </Badge>
                            </div>
                          </td>
                          <td className="p-4 text-right">
                            <div className="flex justify-end">
                              <Button
                                size="sm"
                                variant="ghost"
                                className="text-red-600 hover:text-red-700 hover:bg-red-50 focus:ring-2 focus:ring-offset-2 focus:ring-red-500 h-8 px-3"
                                onClick={() => handleCancelOrder(order.id, order.symbol)}
                                aria-label={`Cancel order for ${order.propertyName}`}
                                onKeyDown={(e) => {
                                  if (e.key === ' ' || e.key === 'Enter' || e.key === 'Spacebar') {
                                    e.preventDefault();
                                    handleCancelOrder(order.id, order.symbol);
                                  }
                                }}
                              >
                                <X className="w-3.5 h-3.5 mr-1.5" />
                                <span className="text-sm">Cancel</span>
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="py-16 px-4 text-center" role="status" aria-live="polite">
                  <div className="inline-flex p-5 bg-slate-50 rounded-2xl mb-5" aria-hidden="true">
                    <Building2 className="w-10 h-10 text-slate-300" />
                  </div>
                  <h3 className="text-lg font-medium text-slate-800 mb-2">No active orders</h3>
                  <p className="text-slate-500 mb-6 max-w-md mx-auto">
                    You don't have any active orders at the moment. Start investing in tokenized real estate today.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button 
                      className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                      aria-label="Explore available properties"
                    >
                      <TrendingUp className="w-4 h-4 mr-2" />
                      Explore Properties
                    </Button>
                    <Button 
                      variant="outline"
                      className="border-slate-200 hover:bg-slate-50 text-slate-700 px-6 py-2.5"
                    >
                      Learn How It Works
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          </TabsContent>

          {/* Order History Tab */}
          <TabsContent value="history" role="tabpanel" tabIndex={0}>
            <Card className="bg-white border-slate-100 overflow-hidden shadow-sm">
              <div className="p-6 border-b border-slate-100">
                <h2 className="text-xl font-semibold text-slate-900">Order History</h2>
                <p className="text-slate-600 mt-1">Your completed and cancelled orders</p>
              </div>

              {isLoading ? (
                <div className="p-8 text-center">
                  <Loader2 className="w-8 h-8 animate-spin mx-auto text-slate-400" />
                  <p className="text-slate-500 mt-2">Loading order history...</p>
                </div>
              ) : !orderHistory?.length ? (
                <div className="py-16 px-4 text-center">
                  <div className="inline-flex p-5 bg-slate-50 rounded-2xl mb-5">
                    <Building2 className="w-10 h-10 text-slate-300" />
                  </div>
                  <h3 className="text-lg font-medium text-slate-800 mb-2">No order history</h3>
                  <p className="text-slate-500">Your completed orders will appear here.</p>
                </div>
              ) : (
                  <table className="w-full">
                    <thead>
                                            <tr className="border-b border-slate-200 bg-slate-50">
                        <th className="text-left p-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Property</th>
                        <th className="text-left p-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Category</th>
                        <th className="text-left p-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Type</th>
                        <th className="text-right p-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Price/Token</th>
                        <th className="text-right p-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Tokens</th>
                        <th className="text-right p-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Total Value</th>
                        <th className="text-right p-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orderHistory?.map((order: Order) => (
                      <tr 
                        key={order.id} 
                        className="border-b border-slate-200 hover:bg-slate-50 transition-colors"
                      >
                        <td className="p-4">
                          <div className="flex items-start gap-3">
                            <div className="p-2 bg-slate-100 rounded-lg">
                              <Building2 className="w-5 h-5 text-slate-600" />
                            </div>
                            <div>
                              <p className="font-semibold text-slate-900">{order.propertyName}</p>
                              <p className="text-sm text-slate-600 flex items-center gap-1 mt-1">
                                <MapPin className="w-3 h-3" />
                                {order.location}
                              </p>
                              <p className="text-xs text-slate-500 mt-1">{order.symbol}</p>
                              <p className="text-xs text-slate-400 mt-0.5">
                                {new Date(order.date).toLocaleString('en-KE', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <p className="text-sm text-slate-600">{order.category || '—'}</p>
                        </td>
                        <td className="p-4">
                          <Badge 
                            className={`${
                              order.type === 'Buy' 
                                ? 'bg-emerald-500/20 text-emerald-700 hover:bg-emerald-500/20' 
                                : 'bg-red-500/20 text-red-700 hover:bg-red-500/20'
                            } flex items-center gap-1 w-fit`}
                          >
                            {order.type === 'Buy' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                            {order.type}
                          </Badge>
                        </td>
                        <td className="p-4 text-right">
                          <p className="font-semibold text-slate-900">{formatKES(order.price)}</p>
                        </td>
                        <td className="p-4 text-right">
                          <p className="font-medium text-slate-900">{order.amount}</p>
                        </td>
                        <td className="p-4 text-right">
                          <p className="font-bold text-slate-900">{formatKES(order.total)}</p>
                        </td>
                        <td className="p-4 text-right">
                          <Badge 
                            className={`${
                              order.status === 'filled' 
                                ? 'bg-emerald-500/20 text-emerald-700 hover:bg-emerald-500/20' 
                                : 'bg-slate-200 text-slate-700 hover:bg-slate-200'
                            } flex items-center gap-1 w-fit ml-auto`}
                          >
                            {getStatusIcon(order.status as OrderStatus)}
                            {order.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}