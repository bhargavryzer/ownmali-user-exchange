'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  ArrowLeft, 
  ArrowRight,
  ArrowUpRight, 
  ArrowDownRight, 
  Building2, 
  Home, 
  MapPin, 
  Calendar, 
  Maximize, 
  BedDouble, 
  Bath, 
  Ruler, 
  DollarSign, 
  TrendingUp,
  TrendingDown,
  Share2,
  Heart,
  Download,
  FileText,
  User,
  Phone,
  Mail
} from 'lucide-react';
import { mockProperties, mockTransactions } from '@/lib/mockData';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useState, useEffect } from 'react';

export default function PropertyDetails({ params }: { params: { propertyId: string } }) {
  const router = useRouter();
  const [property, setProperty] = useState<typeof mockProperties[0] | null>(null);
  const [loading, setLoading] = useState(true);
  const [shares, setShares] = useState(1);
  const [activeTab, setActiveTab] = useState('overview');
  const [favorite, setFavorite] = useState(false);

  // Simulate API fetch
  useEffect(() => {
    const timer = setTimeout(() => {
      const foundProperty = mockProperties.find(p => p.id === params.propertyId);
      setProperty(foundProperty || null);
      setLoading(false);
    }, 800); // Simulate network delay

    return () => clearTimeout(timer);
  }, [params.propertyId]);

  if (loading) {
    return <PropertyDetailsSkeleton />;
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-white p-8 flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4 text-foreground">Property Not Found</h1>
        <p className="text-muted-foreground mb-6">The property you're looking for doesn't exist or has been removed.</p>
        <Button 
          onClick={() => router.push('/markets')} 
          className="bg-emerald-600 hover:bg-emerald-700 text-white"
        >
          Back to Markets
        </Button>
      </div>
    );
  }

  const propertyImages: Record<string, string[]> = {
    '1': [
      'https://images.unsplash.com/photo-1600585154340-b0416ee54a2c?ixlib=rb-4.1.0&auto=format&fit=crop&w=1080&q=80',
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?ixlib=rb-4.1.0&auto=format&fit=crop&w=1080&q=80',
      'https://images.unsplash.com/photo-1600607687938-48e0f2e91b7f?ixlib=rb-4.1.0&auto=format&fit=crop&w=1080&q=80',
      'https://images.unsplash.com/photo-1600566752355-35792bedcfea?ixlib=rb-4.1.0&auto=format&fit=crop&w=1080&q=80'
    ],
    '2': [
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.1.0&auto=format&fit=crop&w=1080&q=80',
      'https://images.unsplash.com/photo-1480074568708-e7b720bb3f09?ixlib=rb-4.1.0&auto=format&fit=crop&w=1080&q=80',
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?ixlib=rb-4.1.0&auto=format&fit=crop&w=1080&q=80'
    ],
    '3': [
      'https://images.unsplash.com/photo-1501785888041-af3ef285b470?ixlib=rb-4.1.0&auto=format&fit=crop&w=1080&q=80',
      'https://images.unsplash.com/photo-1493809842364-78817add7ffb?ixlib=rb-4.1.0&auto=format&fit=crop&w=1080&q=80',
      'https://images.unsplash.com/photo-1502672260266-37c1adf9d9e3?ixlib=rb-4.1.0&auto=format&fit=crop&w=1080&q=80'
    ],
    '4': [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.1.0&auto=format&fit=crop&w=1080&q=80',
      'https://images.unsplash.com/photo-1512916194211-3f2b7f5f7f74?ixlib=rb-4.1.0&auto=format&fit=crop&w=1080&q=80',
      'https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?ixlib=rb-4.1.0&auto=format&fit=crop&w=1080&q=80'
    ],
    '5': [
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.1.0&auto=format&fit=crop&w=1080&q=80',
      'https://images.unsplash.com/photo-1480074568708-e7b720bb3f09?ixlib=rb-4.1.0&auto=format&fit=crop&w=1080&q=80',
      'https://images.unsplash.com/photo-1502672260266-37c1adf9d9e3?ixlib=rb-4.1.0&auto=format&fit=crop&w=1080&q=80'
    ],
    '6': [
      'https://images.unsplash.com/photo-1600607687938-48e0f2e91b7f?ixlib=rb-4.1.0&auto=format&fit=crop&w=1080&q=80',
      'https://images.unsplash.com/photo-1480074568708-e7b720bb3f09?ixlib=rb-4.1.0&auto=format&fit=crop&w=1080&q=80',
      'https://images.unsplash.com/photo-1502672260266-37c1adf9d9e3?ixlib=rb-4.1.0&auto=format&fit=crop&w=1080&q=80'
    ],
    '7': [
      'https://images.unsplash.com/photo-1518709268805-4e9042af2176?ixlib=rb-4.1.0&auto=format&fit=crop&w=1080&q=80',
      'https://images.unsplash.com/photo-1480074568708-e7b720bb3f09?ixlib=rb-4.1.0&auto=format&fit=crop&w=1080&q=80',
      'https://images.unsplash.com/photo-1502672260266-37c1adf9d9e3?ixlib=rb-4.1.0&auto=format&fit=crop&w=1080&q=80'
    ],
    '8': [
      'https://images.unsplash.com/photo-1501436513145-30f24e19fcc8?ixlib=rb-4.1.0&auto=format&fit=crop&w=1080&q=80',
      'https://images.unsplash.com/photo-1480074568708-e7b720bb3f09?ixlib=rb-4.1.0&auto=format&fit=crop&w=1080&q=80',
      'https://images.unsplash.com/photo-1502672260266-37c1adf9d9e3?ixlib=rb-4.1.0&auto=format&fit=crop&w=1080&q=80'
    ]
  };
  
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images = propertyImages[property.id] || [propertyImages['1'][0]];
  
  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };
  
  const prevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };
  
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: property.name,
        text: `Check out ${property.name} on RealEstateX - ${property.location}`,
        url: window.location.href,
      }).catch(console.error);
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };
  
  const handleAddToWatchlist = () => {
    setFavorite(!favorite);
    // Here you would typically make an API call to update the user's watchlist
  };
  
  const handleBuyShares = () => {
    // Implement buy shares logic
    alert(`Buying ${shares} shares of ${property.name}`);
  };
  
  const propertyTransactions = mockTransactions.filter(tx => tx.symbol === property.symbol);

  return (
    <div className="min-h-screen bg-white p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header with Back Button */}
        <Button 
          variant="ghost" 
          className="text-muted-foreground hover:text-foreground hover:bg-accent mb-6"
          onClick={() => router.back()}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Properties
        </Button>

        {/* Property Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{property.name}</h1>
            <div className="flex items-center text-gray-500 mt-1">
              <MapPin className="w-4 h-4 mr-1.5" />
              <span>{property.address}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-2"
              onClick={handleShare}
            >
              <Share2 className="w-4 h-4" />
              <span>Share</span>
            </Button>
            <Button 
              variant={favorite ? "default" : "outline"} 
              size="sm" 
              className="flex items-center gap-2"
              onClick={handleAddToWatchlist}
            >
              <Heart className={`w-4 h-4 ${favorite ? 'fill-white' : ''}`} />
              <span>{favorite ? 'Saved' : 'Save'}</span>
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Property Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Property Image */}
            <div className="relative rounded-xl overflow-hidden bg-gray-100 aspect-[4/3]">
              {images.length > 0 && (
                <Image
                  src={images[currentImageIndex]}
                  alt={`${property.name} - ${currentImageIndex + 1} of ${images.length}`}
                  fill
                  className="object-cover"
                  priority
                />
              )}
              
              {/* Navigation Arrows */}
              {images.length > 1 && (
                <>
                  <button 
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-900 p-2 rounded-full shadow-md transition-all"
                    aria-label="Previous image"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-900 p-2 rounded-full shadow-md transition-all"
                    aria-label="Next image"
                  >
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </>
              )}

              {/* Image Counter */}
              {images.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white text-xs px-3 py-1 rounded-full">
                  {currentImageIndex + 1} / {images.length}
                </div>
              )}
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="market">Market Data</TabsTrigger>
                <TabsTrigger value="transactions">Transactions</TabsTrigger>
                <TabsTrigger value="documents">Documents</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                {/* Property Information */}
                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="text-2xl">Property Information</CardTitle>
                    <CardDescription>Detailed information about the property</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="flex items-start gap-4">
                        <div className="p-2 bg-muted rounded-lg">
                          <MapPin className="w-5 h-5 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground mb-1">Location</p>
                          <p className="text-foreground">{property.location}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-4">
                        <div className="p-2 bg-muted rounded-lg">
                          <Building2 className="w-5 h-5 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground mb-1">Description</p>
                          <p className="text-foreground">
                            {property.description || 
                              `A beautiful ${property.type.toLowerCase()} property located in ${property.location}. ` + 
                              'This property offers a great investment opportunity with potential for appreciation. ' +
                              'Contact us for more details and to schedule a viewing.'}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-start gap-4">
                          <div className="p-2 bg-muted rounded-lg">
                            <Calendar className="w-5 h-5 text-muted-foreground" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-muted-foreground mb-1">Year Built</p>
                            <p className="text-foreground">{property.yearBuilt || '2020'}</p>
                          </div>
                        </div>

                        <div className="flex items-start gap-4">
                          <div className="p-2 bg-muted rounded-lg">
                            <Ruler className="w-5 h-5 text-muted-foreground" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-muted-foreground mb-1">Size</p>
                            <p className="text-foreground">
                              {property.sqft ? `${property.sqft.toLocaleString()} sq ft` : '2,500 sq ft'}
                            </p>
                          </div>
                        </div>

                        {property.bedrooms && (
                          <div className="flex items-start gap-4">
                            <div className="p-2 bg-muted rounded-lg">
                              <BedDouble className="w-5 h-5 text-muted-foreground" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-muted-foreground mb-1">Bedrooms</p>
                              <p className="text-foreground">{property.bedrooms}</p>
                            </div>
                          </div>
                        )}

                        {property.bathrooms && (
                          <div className="flex items-start gap-4">
                            <div className="p-2 bg-muted rounded-lg">
                              <Bath className="w-5 h-5 text-muted-foreground" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-muted-foreground mb-1">Bathrooms</p>
                              <p className="text-foreground">{property.bathrooms}</p>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      {/* Amenities */}
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-3">Amenities</h4>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                          {[
                            'Swimming Pool', 'Gym', 'Parking', 'Security', 'Garden', 'Balcony'
                          ].map((amenity) => (
                            <div key={amenity} className="flex items-center gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                              <span className="text-sm">{amenity}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Market Stats */}
                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="text-2xl">Market Statistics</CardTitle>
                    <CardDescription>Key metrics and performance data</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {[
                        { 
                          label: 'Current Price', 
                          value: formatCurrency(property.currentPrice), 
                          icon: <DollarSign className="w-4 h-4 text-muted-foreground" />,
                          change: property.priceChange24h
                        },
                        { 
                          label: '24h High', 
                          value: formatCurrency(property.high24h || property.currentPrice * 1.02),
                          icon: <TrendingUp className="w-4 h-4 text-muted-foreground" />
                        },
                        { 
                          label: '24h Low', 
                          value: formatCurrency(property.low24h || property.currentPrice * 0.98),
                          icon: <TrendingDown className="w-4 h-4 text-muted-foreground" />
                        },
                        { 
                          label: '24h Volume', 
                          value: property.volume24h ? `$${(property.volume24h / 1000).toFixed(0)}K` : '$0',
                          icon: <ArrowUpRight className="w-4 h-4 text-muted-foreground" />
                        },
                        { 
                          label: 'Market Cap', 
                          value: property.marketCap ? `$${(property.marketCap / 1000000).toFixed(1)}M` : 'N/A',
                          icon: <Building2 className="w-4 h-4 text-muted-foreground" />
                        },
                        { 
                          label: 'Available Shares', 
                          value: property.availableShares?.toLocaleString() || '0',
                          icon: <Home className="w-4 h-4 text-muted-foreground" />
                        }
                      ].map((stat, index) => (
                        <div key={index} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-background rounded-lg">
                              {stat.icon}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                              <p className="text-lg font-semibold text-foreground">{stat.value}</p>
                            </div>
                          </div>
                          {stat.change !== undefined && (
                            <span className={`text-sm font-medium ${
                              stat.change >= 0 ? 'text-emerald-500' : 'text-red-500'
                            }`}>
                              {stat.change >= 0 ? '+' : ''}{stat.change.toFixed(2)}%
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Market Data Tab */}
              <TabsContent value="market" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Price History</CardTitle>
                    <CardDescription>30-day price performance</CardDescription>
                  </CardHeader>
                  <CardContent className="h-80">
                    <div className="h-full flex items-center justify-center bg-muted/30 rounded-lg">
                      <p className="text-muted-foreground">Price chart will be displayed here</p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Key Metrics</CardTitle>
                    <CardDescription>Financial and performance indicators</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        { label: 'Dividend Yield', value: '3.5%' },
                        { label: 'P/E Ratio', value: '18.2' },
                        { label: 'ROI (1Y)', value: '12.4%' },
                        { label: 'Occupancy Rate', value: '95%' },
                        { label: 'Annual Rent', value: formatCurrency(property.currentPrice * 0.08) },
                        { label: 'Price per SqFt', value: formatCurrency(property.sqft ? property.currentPrice / property.sqft : 0) }
                      ].map((metric, index) => (
                        <div key={index} className="p-4 bg-muted/30 rounded-lg">
                          <p className="text-sm text-muted-foreground">{metric.label}</p>
                          <p className="text-lg font-semibold">{metric.value}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Transactions Tab */}
              <TabsContent value="transactions" className="space-y-6">
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle>Recent Transactions</CardTitle>
                        <CardDescription>Latest trades for {property.symbol}</CardDescription>
                      </div>
                      <Button variant="outline" size="sm" className="gap-2">
                        <Download className="w-4 h-4" />
                        <span>Export</span>
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {propertyTransactions.length > 0 ? (
                      <div className="border rounded-lg overflow-hidden">
                        <div className="grid grid-cols-12 bg-muted/50 p-3 text-sm font-medium text-muted-foreground">
                          <div className="col-span-3">Date</div>
                          <div className="col-span-3">Type</div>
                          <div className="col-span-2 text-right">Price</div>
                          <div className="col-span-2 text-right">Amount</div>
                          <div className="col-span-2 text-right">Total</div>
                        </div>
                        {propertyTransactions.map((tx) => (
                          <div key={tx.id} className="grid grid-cols-12 p-3 text-sm border-t">
                            <div className="col-span-3">
                              {new Date(tx.date).toLocaleDateString()}
                            </div>
                            <div className="col-span-3">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                tx.type === 'Buy' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                              }`}>
                                {tx.type}
                              </span>
                            </div>
                            <div className="col-span-2 text-right">
                              ${tx.price?.toLocaleString() || 'N/A'}
                            </div>
                            <div className="col-span-2 text-right">
                              {tx.amount.toLocaleString()}
                            </div>
                            <div className="col-span-2 text-right font-medium">
                              ${tx.total.toLocaleString()}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <p className="text-muted-foreground">No transactions found for this property</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Documents Tab */}
              <TabsContent value="documents" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Property Documents</CardTitle>
                    <CardDescription>Legal and financial documents</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        { name: 'Property Deed', type: 'PDF', size: '2.4 MB', date: '2025-10-15' },
                        { name: 'Title Report', type: 'PDF', size: '1.8 MB', date: '2025-10-10' },
                        { name: 'Financial Statements Q3 2025', type: 'XLSX', size: '3.1 MB', date: '2025-10-01' },
                        { name: 'Property Appraisal', type: 'PDF', size: '4.2 MB', date: '2025-09-20' },
                        { name: 'Rental Agreements', type: 'DOCX', size: '1.5 MB', date: '2025-09-15' },
                      ].map((doc, index) => (
                        <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-muted rounded-lg">
                              <FileText className="w-5 h-5 text-muted-foreground" />
                            </div>
                            <div>
                              <p className="font-medium text-foreground">{doc.name}</p>
                              <p className="text-sm text-muted-foreground">{doc.type} • {doc.size} • {doc.date}</p>
                            </div>
                          </div>
                          <Button variant="ghost" size="icon">
                            <Download className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
          
          {/* Right Column - Trading Card */}
          <div className="lg:col-span-1 lg:sticky lg:top-6 h-fit">
            <Card className="border border-gray-200 overflow-hidden shadow-sm">
              <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-6 text-white">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-2xl font-bold mb-1">{property.name}</h2>
                    <p className="text-emerald-100">{property.symbol}</p>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-white/80 hover:bg-white/10 hover:text-white"
                    onClick={handleAddToWatchlist}
                  >
                    <Heart className={`w-5 h-5 ${favorite ? 'fill-current' : ''}`} />
                  </Button>
                </div>

                <div className="mt-6">
                  <p className="text-sm text-emerald-100 mb-1">Current Share Price</p>
                  <div className="flex items-end justify-between">
                    <p className="text-3xl font-bold">
                      {formatCurrency(property.currentPrice)}
                    </p>
                    {property.priceChange24h !== undefined && (
                      <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-sm font-medium ${
                        property.priceChange24h >= 0 ? 'bg-white/10' : 'bg-white/5'
                      }`}>
                        {property.priceChange24h >= 0 ? (
                          <ArrowUpRight className="w-4 h-4" />
                        ) : (
                          <ArrowDownRight className="w-4 h-4" />
                        )}
                        {property.priceChange24h >= 0 ? '+' : ''}{property.priceChange24h.toFixed(2)}%
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Market Cap</span>
                    <span className="font-medium text-foreground">
                      {property.marketCap ? `$${(property.marketCap / 1000000).toFixed(1)}M` : 'N/A'}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Available Shares</span>
                    <span className="font-medium text-foreground">
                      {property.availableShares?.toLocaleString() || '0'}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Total Value</span>
                    <span className="font-medium text-foreground">
                      {property.totalValue ? `$${(property.totalValue / 1000000).toFixed(2)}M` : 'N/A'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Available Tokens</span>
                    <span className="font-medium text-foreground">
                      {property.availableShares?.toLocaleString() || 'N/A'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Property Type</span>
                    <span className="font-medium text-foreground">{property.type || 'N/A'}</span>
                  </div>
                </div>
              </div>

              <Button 
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white h-12 text-base font-semibold mb-3 shadow-md hover:shadow-lg transition-all"
                onClick={() => router.push(`/trade?propertyId=${property.id}`)}
              >
                <Building2 className="w-5 h-5 mr-2" />
                Invest Now
              </Button>

              <Button 
                variant="outline" 
                className="w-full border-border hover:bg-accent h-12 text-foreground"
                onClick={() => router.push('/markets')}
              >
                View All Properties
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

// Skeleton Loader Component
function PropertyDetailsSkeleton() {
  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Back Button Skeleton */}
        <Skeleton className="h-9 w-32 mb-6" />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column Skeleton */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Skeleton */}
            <Skeleton className="h-96 w-full rounded-lg" />
            
            {/* Property Info Skeleton */}
            <div className="space-y-6">
              <Skeleton className="h-8 w-48 mb-4" />
              <div className="space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-4/5" />
              </div>
              
              <div className="grid grid-cols-2 gap-4 pt-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-6 w-20" />
                  </div>
                ))}
              </div>
            </div>
            
            {/* Market Stats Skeleton */}
            <div>
              <Skeleton className="h-8 w-48 mb-4" />
              <div className="grid grid-cols-2 gap-4">
                {[...Array(4)].map((_, i) => (
                  <Skeleton key={i} className="h-20 w-full rounded-lg" />
                ))}
              </div>
            </div>
          </div>
          
          {/* Right Column Skeleton */}
          <div className="space-y-6">
            <Skeleton className="h-96 w-full rounded-lg" />
            <Skeleton className="h-64 w-full rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}