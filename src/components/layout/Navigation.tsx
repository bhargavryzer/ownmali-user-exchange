"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Wallet, ChevronDown, LogOut, Settings, Key, User, History, HelpCircle, Shield, Bell, Copy, ExternalLink } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const NAV_ITEMS = [
  { title: "Dashboard", href: "/dashboard" },
  { title: "Markets", href: "/markets" },
  { title: "Trades", href: "/trades" },
  { title: "Orders", href: "/orders" },
  { title: "Wallet", href: "/wallet" },
] as const;

export function Navigation() {
  const router = useRouter();
  const pathname = usePathname();
  const isConnected = true; // You can manage this state with your wallet connection logic
  const walletBalance = 12450.50; // KES amount
  const walletAddress = '0x1f3a...e4f5'; // Truncated for display
  const fullWalletAddress = '0x1f3a7b9c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1';
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // You might want to add a toast notification here
  };
  
  const formatKES = (amount: number): string => {
    return amount.toLocaleString('en-KE', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    });
  };

  return (
    <div className="bg-white border-b">
      <div className="container flex h-16 items-center px-4">
        {/* Logo */}
        <div className="flex-1">
          <Link href="/" className="flex items-center space-x-2">
            <img 
              src="/logo.png" 
              alt="OwnMali" 
              className="h-8 w-auto"
              onError={(e) => {
                // Fallback to text if image fails to load
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                target.nextElementSibling?.classList.remove('hidden');
              }}
            />
            <span className="text-xl font-bold text-gray-900 hidden">
              OwnMali
            </span>
          </Link>
        </div>

        {/* Main Navigation - Centered */}
        <nav className="hidden md:flex items-center justify-center flex-1">
          <div className="flex space-x-8">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-blue-600",
                pathname === item.href
                  ? "text-blue-600"
                  : "text-gray-600 hover:text-gray-900"
              )}
            >
              {item.title}
            </Link>
          ))}
          </div>
        </nav>

        {/* Wallet & User Section */}
        <div className="flex-1 flex justify-end items-center space-x-4">
          {isConnected ? (
            <>
              <div className="hidden md:flex items-center space-x-2 bg-gray-100 rounded-lg px-3 py-2">
                <Wallet className="h-4 w-4 text-gray-600" />
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-900">
                    KES {formatKES(walletBalance)}
                  </span>
                  <span className="text-xs text-gray-500">
                    Available Balance
                  </span>
                </div>
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="bg-white border-gray-200 hover:bg-gray-50 text-gray-700 hover:text-gray-900 h-9"
                  >
                    <div className="flex items-center space-x-2">
                      <div className="h-2 w-2 rounded-full bg-emerald-500" aria-hidden="true"></div>
                      <span className="font-mono" title={fullWalletAddress}>{walletAddress}</span>
                      <ChevronDown className="h-4 w-4 text-gray-500" />
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-64 bg-white border border-gray-200 text-gray-900 shadow-lg rounded-lg overflow-hidden">
                  <div className="p-4 border-b border-gray-100">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-gray-500">Connected with MetaMask</span>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6 text-gray-500 hover:bg-gray-100"
                        onClick={(e) => {
                          e.stopPropagation();
                          copyToClipboard(fullWalletAddress);
                        }}
                        title="Copy address"
                      >
                        <Copy className="h-3.5 w-3.5" />
                        <span className="sr-only">Copy wallet address</span>
                      </Button>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
                      <span className="font-mono text-sm">{walletAddress}</span>
                    </div>
                  </div>
                  <div className="p-1">
                    <DropdownMenuItem 
                      className="rounded-md focus:bg-gray-100 focus:text-gray-900 cursor-pointer px-3 py-2 text-sm"
                      onClick={() => router.push('/profile')}
                    >
                      <User className="mr-3 h-4 w-4 text-gray-500" />
                      <span>My Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      className="rounded-md focus:bg-gray-100 focus:text-gray-900 cursor-pointer px-3 py-2 text-sm"
                      onClick={() => router.push('/wallet')}
                    >
                      <Wallet className="mr-3 h-4 w-4 text-gray-500" />
                      <span>Wallet</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      className="rounded-md focus:bg-gray-100 focus:text-gray-900 cursor-pointer px-3 py-2 text-sm"
                      onClick={() => router.push('/transactions')}
                    >
                      <History className="mr-3 h-4 w-4 text-gray-500" />
                      <span>Transaction History</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="my-1 bg-gray-100" />
                    <DropdownMenuItem 
                      className="rounded-md focus:bg-gray-100 focus:text-gray-900 cursor-pointer px-3 py-2 text-sm"
                      onClick={() => router.push('/settings')}
                    >
                      <Settings className="mr-3 h-4 w-4 text-gray-500" />
                      <span>Settings</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      className="rounded-md focus:bg-gray-100 focus:text-gray-900 cursor-pointer px-3 py-2 text-sm"
                      onClick={() => router.push('/security')}
                    >
                      <Shield className="mr-3 h-4 w-4 text-gray-500" />
                      <span>Security</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      className="rounded-md focus:bg-gray-100 focus:text-gray-900 cursor-pointer px-3 py-2 text-sm"
                      onClick={() => router.push('/api-keys')}
                    >
                      <Key className="mr-3 h-4 w-4 text-gray-500" />
                      <span>API Management</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="my-1 bg-gray-100" />
                    <DropdownMenuItem 
                      className="rounded-md focus:bg-gray-100 focus:text-gray-900 cursor-pointer px-3 py-2 text-sm"
                      onClick={() => router.push('/help')}
                    >
                      <HelpCircle className="mr-3 h-4 w-4 text-gray-500" />
                      <span>Help & Support</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="my-1 bg-gray-100" />
                    <DropdownMenuItem 
                      className="rounded-md text-red-500 focus:bg-red-50 focus:text-red-600 cursor-pointer px-3 py-2 text-sm"
                      onClick={() => {}}
                    >
                      <LogOut className="mr-3 h-4 w-4" />
                      <span>Sign Out</span>
                    </DropdownMenuItem>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <div className="flex items-center space-x-3">
              <Button 
                variant="outline"
                size="sm"
                className="border-gray-200 text-gray-700 hover:bg-gray-50 h-9"
                onClick={() => router.push('/help')}
              >
                <HelpCircle className="mr-2 h-4 w-4" />
                Help
              </Button>
              <Button 
                className="bg-blue-600 hover:bg-blue-700 text-white h-9"
                onClick={() => {}}
              >
                <Wallet className="mr-2 h-4 w-4" />
                Connect Wallet
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
