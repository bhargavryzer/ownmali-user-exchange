"use client";

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, ArrowUpRight, ArrowDownRight, Building2, Home, TrendingUp, MapPin, Sparkles, Filter, X, ArrowLeft, ArrowRight, ExternalLink, Bed, Activity } from 'lucide-react';
import type { Property } from '@/lib/mockData';
import { mockProperties } from '@/lib/mockData';
import { ImageWithFallback } from '@/app/figma/ImageWithFallback';

interface PropertyExtended extends Property {
  availableTokens: number;
  tokenSymbol: string;
  currency: string;
}

interface MarketsProps {
  onNavigate: (page: string, assetId?: string) => void;
}

export default function Markets() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [cityFilter, setCityFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState<Record<string, number>>({});
  const [mounted, setMounted] = useState(false);
  const [autoRotate, setAutoRotate] = useState<Record<string, NodeJS.Timeout>>({});

  // Get unique cities for filter
  const cities = ['all', ...new Set(mockProperties.map(p => p.city))] as const;
  const hasActiveFilters = searchQuery || cityFilter !== 'all' || typeFilter !== 'all';

  useEffect(() => {
    setMounted(true);
    return () => {
      setMounted(false);
      // Clear all intervals on unmount
      Object.values(autoRotate).forEach(interval => clearInterval(interval));
    };
  }, [autoRotate]);

  const filteredProperties = mockProperties.map(property => ({
    ...property,
    // Convert shares to tokens
    availableTokens: property.availableShares,
    tokenSymbol: 'TKN',
    currency: 'KES'
  } as PropertyExtended)).filter((property) => {
      const matchesSearch = property.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        property.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
        property.city.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCity = cityFilter === 'all' || property.city === cityFilter;
      const matchesType = typeFilter === 'all' || property.type === typeFilter;
      
      return matchesSearch && matchesCity && matchesType;
    });

  // Property images organized by property ID with proper typing
  const propertyImages: Record<string, string[]> = {
    // Karen Villas (Residential)
    '1': [
      'https://images.unsplash.com/photo-1600585154340-b0416ee54a2c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600607686527-6fb886090705?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=1200&q=80'
    ],
    // Westlands Towers (Commercial)
    '2': [
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1486401899868-0e435ed85128?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1200&q=80'
    ],
    
    
    // Diani Beach Homes (Residential)
    '3': [
      'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1578631611389-15db67586624?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1578631611389-15db67586624?auto=format&fit=crop&w=1200&q=80'
    ],
    // Naivasha Lakeside (Residential)
    '4': [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1571003118755-17e193e53323?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1571003118755-17e193e53323?auto=format&fit=crop&w=1200&q=80'
    ],
    // Nanyuki Mountain View (Residential)
    '5': [
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1540979388789-6cee28a1cdc9?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1540979388789-6cee28a1cdc9?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1200&q=80'
    ],
    // Spring Valley Mansion (Residential)
    '6': [
      'https://images.unsplash.com/photo-1600607687938-48e0f2e91b7f?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=1200&q=80'
    ],
    // Kilifi Beach Villa (Residential)
    '7': [
      'https://images.unsplash.com/photo-1518709268805-4e9042af2176?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1564507592333-cdeefa5b7c9a?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1501436513145-30f24e19fcc8?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1564507592333-cdeefa5b7c9a?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1501436513145-30f24e19fcc8?auto=format&fit=crop&w=1200&q=80'
    ],
    // Siaya Park Penthouse (Residential)
    '8': [
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600585154340-b0616ee54a2c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600585154340-b0616ee54a2c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80'
    ],
    // Thika Greens (Residential)
    '9': [
      'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1571003118755-17e193e53323?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1571003118755-17e193e53323?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80'
    ],
    // Malindi Paradise (Commercial)
    '10': [
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1486401899868-0e435ed85128?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1486401899868-0e435ed85128?auto=format&fit=crop&w=1200&q=80'
    ]
  };
  
  // Carousel control functions
  const nextImage = useCallback((propertyId: string) => {
    setCurrentImageIndex(prev => {
      const currentIndex = prev[propertyId] || 0;
      const images = propertyImages[propertyId] || [];
      return {
        ...prev,
        [propertyId]: (currentIndex + 1) % (images.length || 1)
      };
    });
    // Reset auto-rotate timer on manual navigation
    stopAutoRotate(propertyId);
    startAutoRotate(propertyId);
  }, [propertyImages]);

  const prevImage = useCallback((propertyId: string) => {
    setCurrentImageIndex(prev => {
      const currentIndex = prev[propertyId] || 0;
      const images = propertyImages[propertyId] || [];
      const maxIndex = (images.length || 1) - 1;
      const newIndex = currentIndex <= 0 ? maxIndex : currentIndex - 1;
      return {
        ...prev,
        [propertyId]: newIndex
      };
    });
    // Reset auto-rotate timer on manual navigation
    stopAutoRotate(propertyId);
    startAutoRotate(propertyId);
  }, [propertyImages]);

  const startAutoRotate = useCallback((propertyId: string) => {
    if (autoRotate[propertyId]) {
      clearInterval(autoRotate[propertyId]);
    }
    
    const interval = setInterval(() => {
      nextImage(propertyId);
    }, 5000);
    
    setAutoRotate(prev => ({
      ...prev,
      [propertyId]: interval
    }));
    
    return () => clearInterval(interval);
  }, [autoRotate, nextImage]);
  
  const stopAutoRotate = useCallback((propertyId: string) => {
    if (autoRotate[propertyId]) {
      clearInterval(autoRotate[propertyId]);
      setAutoRotate(prev => {
        const newState = {...prev};
        delete newState[propertyId];
        return newState;
      });
    }
  }, [autoRotate]);
  
  // Initialize auto-rotate for all properties
  useEffect(() => {
    if (!mounted) return;
    
    // Only update if properties have changed
    const propertyIds = filteredProperties.map(p => p.id);
    
    // Start auto-rotate for new properties
    propertyIds.forEach(id => {
      if (!autoRotate[id]) {
        startAutoRotate(id);
      }
    });
    
    // Clean up intervals for removed properties
    Object.keys(autoRotate).forEach(id => {
      if (!propertyIds.includes(id) && autoRotate[id]) {
        clearInterval(autoRotate[id]);
        setAutoRotate(prev => {
          const newState = {...prev};
          delete newState[id];
          return newState;
        });
      }
    });
    
    // Cleanup all intervals on unmount
    return () => {
      Object.values(autoRotate).forEach(interval => {
        if (interval) clearInterval(interval);
      });
    };
  }, [filteredProperties, startAutoRotate, autoRotate, mounted]);
  
  // Format currency to KES
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      maximumFractionDigits: 0
    }).format(value);
  };
  
  // Format token amount
  const formatTokens = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      maximumFractionDigits: 2
    }).format(value);
  };

  // Clear all filters function
  const clearAllFilters = useCallback(() => {
    setSearchQuery('');
    setCityFilter('all');
    setTypeFilter('all');
  }, []);

  // Handle keyboard navigation for carousel
  const handleKeyDown = useCallback((e: React.KeyboardEvent, propertyId: string, action: 'prev' | 'next' | 'goto', index?: number) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (action === 'prev') prevImage(propertyId);
      else if (action === 'next') nextImage(propertyId);
      else if (action === 'goto' && index !== undefined) {
        setCurrentImageIndex(prev => ({
          ...prev,
          [propertyId]: index
        }));
      }
    }
  }, [prevImage, nextImage]);

  return (
    <div 
      className="min-h-screen bg-white p-4 md:p-6 lg:p-8"
      role="main"
      aria-label="Real Estate Marketplace"
    >
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Enhanced Header with Gradient */}
        <div className="mb-8 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-cyan-500/10 rounded-3xl blur-3xl -z-10"></div>
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 md:p-8 border border-emerald-100 shadow-lg">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-slate-900 via-emerald-800 to-teal-700 bg-clip-text text-transparent">
                    Explore Properties
                  </h1>
                </div>
                <p className="text-slate-600 text-lg ml-14">Discover premium tokenized real estate investments</p>
              </div>
              <Badge className="hidden md:flex items-center gap-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-4 py-2 text-sm">
                <Sparkles className="w-4 h-4" />
                {filteredProperties.length} Properties
              </Badge>
            </div>
          </div>
        </div>

        {/* Enhanced Search and Filters */}
        <div className="mb-8">
          <Card className="bg-white/90 backdrop-blur-sm border-slate-200 shadow-md overflow-hidden">
            <div className="p-5 sm:p-6">
              <div className="flex flex-col md:flex-row gap-4">
                {/* Search Bar */}
                <div className="flex-1 relative group">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-emerald-600 transition-colors" />
                  <Input
                    id="property-search"
                    placeholder="Search by name, symbol, or city..."
                    className="pl-12 pr-10 bg-white border-slate-200 text-slate-900 placeholder:text-slate-500 h-12 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 transition-all"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    aria-label="Search properties"
                    aria-describedby="search-help"
                  />
                  <p id="search-help" className="sr-only">Search for properties by name, symbol, or city</p>
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-slate-100 rounded-full transition-colors"
                    >
                      <X className="w-4 h-4 text-slate-400" />
                    </button>
                  )}
                </div>
                
                {/* City Filter */}
                <Select 
                  value={cityFilter} 
                  onValueChange={setCityFilter}
                >
                  <SelectTrigger 
                    className="w-full md:w-52 bg-white border-slate-200 h-12 rounded-xl hover:border-emerald-500 transition-colors focus:ring-2 focus:ring-emerald-600 focus:ring-offset-2"
                    aria-label="Filter by city"
                  >
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-slate-500" />
                      <SelectValue placeholder="Filter by city" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Cities</SelectItem>
                    {cities.filter((c: string) => c !== 'all').map((city: string) => (
                      <SelectItem key={city} value={city}>{city}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Type Filter */}
                <Select 
                  value={typeFilter} 
                  onValueChange={setTypeFilter}
                >
                  <SelectTrigger 
                    className="w-full md:w-52 bg-white border-slate-200 h-12 rounded-xl hover:border-emerald-500 transition-colors focus:ring-2 focus:ring-emerald-600 focus:ring-offset-2"
                    aria-label="Filter by property type"
                  >
                    <div className="flex items-center gap-2">
                      <Filter className="w-4 h-4 text-slate-500" />
                      <SelectValue placeholder="Property type" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="Residential">
                      <div className="flex items-center gap-2">
                        <Home className="w-4 h-4" />
                        Residential
                      </div>
                    </SelectItem>
                    <SelectItem value="Commercial">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4" />
                        Commercial
                      </div>
                    </SelectItem>
                    <SelectItem value="Hotels">
                      <div className="flex items-center gap-2">
                        <Bed className="w-4 h-4" />
                        Hotels
                      </div>
                    </SelectItem>
                    <SelectItem value="Hospitals">
                      <div className="flex items-center gap-2">
                        <Activity className="w-4 h-4" />
                        Hospitals
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Active Filters Display */}
              {hasActiveFilters && (
                <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-200">
                  <span className="text-sm text-slate-600">Active filters:</span>
                  <div className="flex flex-wrap gap-2">
                    {searchQuery && (
                      <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                        Search: "{searchQuery}"
                      </Badge>
                    )}
                    {cityFilter !== 'all' && (
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                        City: {cityFilter}
                      </Badge>
                    )}
                    {typeFilter !== 'all' && (
                      <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                        Type: {typeFilter}
                      </Badge>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearAllFilters}
                    className="ml-auto text-slate-700 hover:text-slate-900 hover:bg-slate-100 focus:ring-2 focus:ring-emerald-600 focus:ring-offset-2"
                    aria-label="Clear all filters"
                  >
                    <X className="w-4 h-4 mr-1" />
                    Clear all
                  </Button>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Properties Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProperties.map((property) => (
            <Card
              key={property.id}
              className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-200 hover:border-emerald-300"
              role="article"
              aria-labelledby={`property-${property.id}-heading`}
            >
              <div className="relative h-56 bg-slate-100 overflow-hidden group" tabIndex={0}>
                <ImageWithFallback
                  src={propertyImages[property.id]?.[currentImageIndex[property.id] || 0] || '/placeholder-property.jpg'}
                  alt={`${property.name} - ${property.location}`}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover transition-all duration-500 ease-in-out group-hover:scale-105"
                  priority={currentImageIndex[property.id] === 0}
                  loading={currentImageIndex[property.id] > 0 ? 'lazy' : 'eager'}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Navigation Arrows */}
                <button 
                  onClick={(e) => { e.stopPropagation(); prevImage(property.id); }}
                  onKeyDown={(e) => handleKeyDown(e, property.id, 'prev')}
                  className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-slate-800 p-2.5 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-slate-900/20"
                  aria-label="Previous image"
                  tabIndex={0}
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span className="sr-only">Previous image</span>
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); nextImage(property.id); }}
                  onKeyDown={(e) => handleKeyDown(e, property.id, 'next')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-slate-800 p-2.5 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-slate-900/20"
                  aria-label="Next image"
                  tabIndex={0}
                >
                  <ArrowRight className="w-4 h-4" />
                  <span className="sr-only">Next image</span>
                </button>
                
                {/* Pagination Dots */}
                <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2 px-2" role="tablist" aria-label="Image navigation">
                  {propertyImages[property.id]?.map((_, index) => (
                    <button
                      key={index}
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrentImageIndex(prev => ({
                          ...prev,
                          [property.id]: index
                        }));
                      }}
                      onKeyDown={(e) => handleKeyDown(e, property.id, 'goto', index)}
                      role="tab"
                      aria-selected={(currentImageIndex[property.id] || 0) === index}
                      aria-label={`Image ${index + 1}`}
                      tabIndex={0}
                      className={`h-1.5 rounded-full transition-all ${
                        (currentImageIndex[property.id] || 0) === index 
                          ? 'bg-white w-6' 
                          : 'bg-white/50 hover:bg-white/75 w-2'
                      }`}
                    />
                  ))}
                </div>
              </div>
              <div className="p-5 flex-1 flex flex-col" onMouseEnter={() => setHoveredCard(property.id)} onMouseLeave={() => setHoveredCard(null)}>
                <div className="flex justify-between items-start mb-3.5">
                  <div className="pr-2">
                    <h3 id={`property-${property.id}-heading`} className="font-semibold text-lg text-slate-900 leading-tight mb-1 line-clamp-1">{property.name}</h3>
                    <p className="text-sm text-slate-500 flex items-center">
                      <MapPin className="w-3.5 h-3.5 mr-1.5 flex-shrink-0" />
                      <span className="truncate">{property.location}</span>
                    </p>
                  </div>
                  <Badge 
                    variant="outline" 
                    className={`px-2.5 py-1 text-xs font-medium ${
                      property.type === 'Residential' 
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                        : property.type === 'Commercial'
                        ? 'bg-blue-50 text-blue-700 border-blue-200'
                        : 'bg-purple-50 text-purple-700 border-purple-200'
                    }`}
                  >
                    {property.type}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-4 my-4">
                  <div className="bg-slate-50 rounded-lg p-3">
                    <p className="text-xs text-slate-500 mb-1.5">Price</p>
                    <p className="font-semibold text-slate-900 text-lg">
                      {formatCurrency(property.currentPrice)}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">per token</p>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-3">
                    <p className="text-xs text-slate-500 mb-1.5">Available</p>
                    <p className="font-semibold text-slate-900 text-lg">
                      {formatTokens(property.availableTokens)}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">{property.tokenSymbol} tokens</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 mt-4">
                  <Button 
                    variant="outline"
                    className="w-full h-11 border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 hover:text-slate-900 transition-all duration-200 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-emerald-500"
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/markets/${property.id}`);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        router.push(`/markets/${property.id}`);
                      }
                    }}
                    role="link"
                    tabIndex={0}
                    aria-label={`View details for ${property.name} property`}
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View Details
                  </Button>
                  <Button 
                    className={`w-full h-11 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-medium shadow-md shadow-emerald-500/20 hover:shadow-lg hover:shadow-emerald-500/30 transition-all duration-300 group/btn focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-emerald-500 ${
                      hoveredCard === property.id ? 'transform -translate-y-0.5' : ''
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/trade?propertyId=${property.id}`);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        router.push(`/trade?propertyId=${property.id}`);
                      }
                    }}
                    role="button"
                    tabIndex={0}
                    aria-label={`Invest in ${property.name} property`}
                    onMouseEnter={() => setHoveredCard(property.id)}
                    onMouseLeave={() => setHoveredCard(null)}
                  >
                    <Building2 className="w-4 h-4 mr-2 transition-transform duration-300 group-hover/btn:rotate-12" />
                    Trade Now
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Enhanced Empty State */}
        {filteredProperties.length === 0 && (
          <div className="col-span-full">
            <Card className="bg-white border-slate-200 shadow-lg">
              <div className="text-center py-16 px-6">
                <div className="relative inline-block mb-6">
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-full blur-2xl"></div>
                  <div className="relative bg-gradient-to-br from-slate-100 to-slate-50 p-6 rounded-full">
                    <Building2 className="w-16 h-16 text-slate-400" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">No properties found</h3>
                <p className="text-slate-600 mb-8 max-w-md mx-auto">
                  We couldn't find any properties matching your criteria. Try adjusting your filters or search terms.
                </p>
                <Button 
                  className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-8 h-12 rounded-xl font-semibold shadow-lg focus:ring-2 focus:ring-offset-2 focus:ring-emerald-600 focus:outline-none"
                  onClick={clearAllFilters}
                  aria-label="Clear all filters"
                >
                  <X className="w-4 h-4 mr-2" />
                  Clear All Filters
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}