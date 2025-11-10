"use client";

export interface Holding {
  assetId: string;
  symbol: string;
  shares: number;
  avgPrice: number;
  currentPrice: number;
}

export interface Property {
  id: string;
  symbol: string;
  name: string;
  city: string;
  location: string;
  address: string;
  type: 'Residential' | 'Commercial' | 'Holiday' | 'Hotels';
  currentPrice: number;
  priceChange24h: number;
  totalValue: number;
  availableShares: number;
  description?: string;
  yearBuilt?: number;
  sqft?: number;
  bedrooms?: number;
  bathrooms?: number;
  high24h?: number;
  low24h?: number;
  volume24h?: number;
  marketCap?: number;
  tokenSymbol?: string;
  pricePerSqft?: number;
  propertyType?: string;
  status?: 'For Sale' | 'For Rent' | 'Sold' | 'Off Market';
  features?: string[];
  images?: string[];
  agent?: {
    name: string;
    phone: string;
    email: string;
    avatar: string;
  };
}

export interface Transaction {
  id: string;
  date: Date;
  type: 'Buy' | 'Sell';
  symbol: string;
  amount: number;
  price?: number;
  total: number;
}

export const mockHoldings: Holding[] = [
  {
    assetId: '1',
    symbol: 'KAREN-VILLAS',
    shares: 12,
    avgPrice: 9500000,
    currentPrice: 10300000
  },
  {
    assetId: '2',
    symbol: 'WESTLANDS-TOWERS',
    shares: 6,
    avgPrice: 15000000,
    currentPrice: 16350000
  },
  {
    assetId: '3',
    symbol: 'DIANI-BEACH-HOMES',
    shares: 20,
    avgPrice: 4200000,
    currentPrice: 4650000
  },
  {
    assetId: '4',
    symbol: 'NAIVASHA-LAKESIDE',
    shares: 8,
    avgPrice: 7800000,
    currentPrice: 7850000
  },
  {
    assetId: '5',
    symbol: 'NANYUKI-MOUNTAIN-VIEW',
    shares: 15,
    avgPrice: 5400000,
    currentPrice: 5600000
  },
  {
    assetId: '6',
    symbol: 'SPRING-VALLEY-MANSION',
    shares: 3,
    avgPrice: 11800000,
    currentPrice: 12000000
  }
];

export const mockProperties: Property[] = [
  {
    id: '1',
    symbol: 'KAREN-VILLAS',
    name: 'Karen Villas',
    city: 'Nairobi',
    location: 'Karen, Nairobi',
    address: '123 Karen Road, Nairobi, Kenya',
    type: 'Residential',
    currentPrice: 25000000,
    priceChange24h: 2.4,
    totalValue: 50000000,
    availableShares: 25,
    description: 'Luxury villa in the heart of Karen with modern amenities and spacious living areas.',
    yearBuilt: 2018,
    sqft: 4500,
    bedrooms: 5,
    bathrooms: 4.5,
    pricePerSqft: 5555.56,
    propertyType: 'Villa',
    status: 'For Sale',
    features: ['Swimming Pool', 'Garden', 'Parking', 'Security', 'Gym'],
    agent: {
      name: 'John Doe',
      phone: '+254 712 345 678',
      email: 'john.doe@realestatex.com',
      avatar: 'https://randomuser.me/api/portraits/men/1.jpg'
    },
    images: [
      'https://images.unsplash.com/photo-1600585154340-b0416ee54a2c?ixlib=rb-4.1.0&auto=format&fit=crop&w=1080&q=80',
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?ixlib=rb-4.1.0&auto=format&fit=crop&w=1080&q=80',
      'https://images.unsplash.com/photo-1600607687938-48e0f2e91b7f?ixlib=rb-4.1.0&auto=format&fit=crop&w=1080&q=80',
      'https://images.unsplash.com/photo-1600566752355-35792bedcfea?ixlib=rb-4.1.0&auto=format&fit=crop&w=1080&q=80'
    ]
  },
  {
    id: '2',
    symbol: 'WESTLANDS-TOWERS',
    name: 'Westlands Towers',
    city: 'Nairobi',
    location: 'Westlands, Nairobi',
    address: '456 Westlands Road, Nairobi, Kenya',
    type: 'Commercial',
    currentPrice: 16350000,
    priceChange24h: 1.6,
    totalValue: 35000000,
    availableShares: 15,
    description: 'Modern commercial tower in the heart of Westlands business district.',
    yearBuilt: 2020,
    sqft: 25000,
    pricePerSqft: 654.00,
    propertyType: 'Office Tower',
    status: 'For Sale',
    features: ['24/7 Security', 'Elevator', 'Parking', 'Fiber Internet', 'Conference Rooms'],
    agent: {
      name: 'Jane Smith',
      phone: '+254 723 456 789',
      email: 'jane.smith@realestatex.com',
      avatar: 'https://randomuser.me/api/portraits/women/1.jpg'
    },
    images: [
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.1.0&auto=format&fit=crop&w=1080&q=80',
      'https://images.unsplash.com/photo-1497366811353-6870744d04b2?ixlib=rb-4.1.0&auto=format&fit=crop&w=1080&q=80',
      'https://images.unsplash.com/photo-1486401899868-0e435ed85128?ixlib=rb-4.1.0&auto=format&fit=crop&w=1080&q=80'
    ]
  },
  {
    id: '3',
    symbol: 'DIANI-BEACH-HOMES',
    name: 'Diani Beach Homes',
    city: 'Mombasa',
    location: 'Diani Beach, Mombasa',
    address: 'Beach Road, Diani, Mombasa, Kenya',
    type: 'Residential',
    currentPrice: 4650000,
    priceChange24h: 3.9,
    totalValue: 28000000,
    availableShares: 40,
    description: 'Beachfront properties with stunning ocean views and modern amenities.',
    yearBuilt: 2019,
    sqft: 3500,
    bedrooms: 4,
    bathrooms: 3.5,
    pricePerSqft: 1328.57,
    propertyType: 'Beach House',
    status: 'For Sale',
    features: ['Ocean View', 'Private Beach Access', 'Swimming Pool', 'Garden', 'Parking'],
    agent: {
      name: 'Michael Johnson',
      phone: '+254 700 987 654',
      email: 'michael.j@realestatex.com',
      avatar: 'https://randomuser.me/api/portraits/men/2.jpg'
    },
    images: [
      'https://images.unsplash.com/photo-1501785888041-af3ef285b470?ixlib=rb-4.1.0&auto=format&fit=crop&w=1080&q=80',
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.1.0&auto=format&fit=crop&w=1080&q=80',
      'https://images.unsplash.com/photo-1578631611389-15db67586624?ixlib=rb-4.1.0&auto=format&fit=crop&w=1080&q=80'
    ]
  },
  {
    id: '4',
    symbol: 'NAIVASHA-LAKESIDE',
    name: 'Naivasha Lakeside',
    city: 'Naivasha',
    location: 'Lake Naivasha',
    address: 'Lakeside Drive, Naivasha, Kenya',
    type: 'Residential',
    currentPrice: 7850000,
    priceChange24h: 2.1,
    totalValue: 32000000,
    availableShares: 30,
    description: 'Tranquil lakeside properties with stunning views of Lake Naivasha.',
    yearBuilt: 2017,
    sqft: 4200,
    bedrooms: 4,
    bathrooms: 3,
    pricePerSqft: 1869.05,
    propertyType: 'Lake House',
    status: 'For Sale',
    features: ['Lake View', 'Private Dock', 'Garden', 'Parking', 'Boat Access'],
    agent: {
      name: 'Sarah Williams',
      phone: '+254 711 234 567',
      email: 'sarah.w@realestatex.com',
      avatar: 'https://randomuser.me/api/portraits/women/2.jpg'
    },
    images: [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.1.0&auto=format&fit=crop&w=1080&q=80',
      'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.1.0&auto=format&fit=crop&w=1080&q=80',
      'https://images.unsplash.com/photo-1571003118755-17e193e53323?ixlib=rb-4.1.0&auto=format&fit=crop&w=1080&q=80'
    ]
  },
  {
    id: '5',
    symbol: 'NANYUKI-MOUNTAIN-VIEW',
    name: 'Nanyuki Mountain View',
    city: 'Nanyuki',
    location: 'Mount Kenya',
    address: 'Mountain View Estate, Nanyuki, Kenya',
    type: 'Residential',
    currentPrice: 5600000,
    priceChange24h: 4.7,
    totalValue: 22000000,
    availableShares: 50,
    description: 'Luxury homes with breathtaking views of Mount Kenya.',
    yearBuilt: 2019,
    sqft: 3800,
    bedrooms: 4,
    bathrooms: 3,
    pricePerSqft: 1473.68,
    propertyType: 'Mountain Villa',
    status: 'For Sale',
    features: ['Mountain View', 'Garden', 'Parking', 'Fireplace', 'Security'],
    agent: {
      name: 'David Kimani',
      phone: '+254 722 345 678',
      email: 'david.k@realestatex.com',
      avatar: 'https://randomuser.me/api/portraits/men/3.jpg'
    },
    images: [
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.1.0&auto=format&fit=crop&w=1080&q=80',
      'https://images.unsplash.com/photo-1540979388789-6cee28a1cdc9?ixlib=rb-4.1.0&auto=format&fit=crop&w=1080&q=80'
    ]
  },
  {
    id: '6',
    symbol: 'SPRING-VALLEY-MANSION',
    name: 'Spring Valley Mansion',
    city: 'Nairobi',
    location: 'Spring Valley, Nairobi',
    address: 'Spring Valley Road, Nairobi, Kenya',
    type: 'Residential',
    currentPrice: 12000000,
    priceChange24h: 1.2,
    totalValue: 120000000,
    availableShares: 10,
    description: 'Luxurious mansion in the exclusive Spring Valley neighborhood.',
    yearBuilt: 2020,
    sqft: 8000,
    bedrooms: 6,
    bathrooms: 6.5,
    pricePerSqft: 1500.00,
    propertyType: 'Mansion',
    status: 'For Sale',
    features: ['Swimming Pool', 'Home Theater', 'Wine Cellar', 'Gym', 'Staff Quarters'],
    agent: {
      name: 'Elizabeth Wanjiku',
      phone: '+254 733 456 789',
      email: 'elizabeth.w@realestatex.com',
      avatar: 'https://randomuser.me/api/portraits/women/3.jpg'
    },
    images: [
      'https://images.unsplash.com/photo-1600607687938-48e0f2e91b7f?ixlib=rb-4.1.0&auto=format&fit=crop&w=1080&q=80',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.1.0&auto=format&fit=crop&w=1080&q=80'
    ]
  },
  {
    id: '7',
    symbol: 'KILIFI-BEACH-VILLA',
    name: 'Kilifi Beach Villa',
    city: 'Kilifi',
    location: 'Kilifi Coast',
    address: 'Beach Road, Kilifi, Kenya',
    type: 'Residential',
    currentPrice: 11700000,
    priceChange24h: 2.5,
    totalValue: 117000000,
    availableShares: 10,
    description: 'Luxury beachfront villa with private beach access and stunning ocean views.',
    yearBuilt: 2021,
    sqft: 5500,
    bedrooms: 5,
    bathrooms: 4.5,
    pricePerSqft: 2127.27,
    propertyType: 'Beach Villa',
    status: 'For Sale',
    features: ['Beach Front', 'Infinity Pool', 'Private Beach', 'Garden', 'Parking'],
    agent: {
      name: 'James Mwangi',
      phone: '+254 700 123 456',
      email: 'james.m@realestatex.com',
      avatar: 'https://randomuser.me/api/portraits/men/4.jpg'
    },
    images: [
      'https://images.unsplash.com/photo-1518709268805-4e9042af2176?ixlib=rb-4.1.0&auto=format&fit=crop&w=1080&q=80',
      'https://images.unsplash.com/photo-1564507592333-cdeefa5b7c9a?ixlib=rb-4.1.0&auto=format&fit=crop&w=1080&q=80'
    ]
  },
  {
    id: '8',
    symbol: 'SIAYA-PARK-PENTHOUSE',
    name: 'Siaya Park Penthouse',
    city: 'Nairobi',
    location: 'Siaya Park, Nairobi',
    address: 'Siaya Park Road, Nairobi, Kenya',
    type: 'Residential',
    currentPrice: 5700000,
    priceChange24h: 3.1,
    totalValue: 57000000,
    availableShares: 10,
    description: 'Luxury penthouse in the heart of Siaya Park with panoramic city views.',
    yearBuilt: 2020,
    sqft: 3200,
    bedrooms: 3,
    bathrooms: 3.5,
    pricePerSqft: 1781.25,
    propertyType: 'Penthouse',
    status: 'For Sale',
    features: ['City View', 'Balcony', 'Concierge', 'Gym', 'Parking'],
    agent: {
      name: 'Grace Atieno',
      phone: '+254 722 987 654',
      email: 'grace.a@realestatex.com',
      avatar: 'https://randomuser.me/api/portraits/women/4.jpg'
    },
    images: [
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?ixlib=rb-4.1.0&auto=format&fit=crop&w=1080&q=80',
      'https://images.unsplash.com/photo-1600585154340-b0616ee54a2c?ixlib=rb-4.1.0&auto=format&fit=crop&w=1080&q=80'
    ]
  },
  {
    id: '9',
    symbol: 'THIKA-GREENS',
    name: 'Thika Greens',
    city: 'Thika',
    location: 'Thika Road',
    address: 'Thika Greens Estate, Thika, Kenya',
    type: 'Residential',
    currentPrice: 8000000,
    priceChange24h: 1.9,
    totalValue: 40000000,
    availableShares: 5,
    description: 'Gated community with modern homes and green spaces in Thika.',
    yearBuilt: 2019,
    sqft: 4500,
    bedrooms: 4,
    bathrooms: 3,
    pricePerSqft: 1777.78,
    propertyType: 'Gated Community',
    status: 'For Sale',
    features: ['Gated Community', 'Swimming Pool', 'Playground', '24/7 Security', 'Parking'],
    agent: {
      name: 'Peter Kamau',
      phone: '+254 711 876 543',
      email: 'peter.k@realestatex.com',
      avatar: 'https://randomuser.me/api/portraits/men/5.jpg'
    },
    images: [
      'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.1.0&auto=format&fit=crop&w=1080&q=80',
      'https://images.unsplash.com/photo-1571003118755-17e193e53323?ixlib=rb-4.1.0&auto=format&fit=crop&w=1080&q=80'
    ]
  },
  {
    id: '10',
    symbol: 'MALINDI-PARADISE',
    name: 'Malindi Paradise',
    city: 'Malindi',
    location: 'Malindi Beach',
    address: 'Beach Road, Malindi, Kenya',
    type: 'Commercial',
    currentPrice: 9500000,
    priceChange24h: 2.8,
    totalValue: 47500000,
    availableShares: 20,
    description: 'Beachfront commercial property with restaurant and retail spaces.',
    yearBuilt: 2018,
    sqft: 6000,
    pricePerSqft: 1583.33,
    propertyType: 'Mixed-Use',
    status: 'For Sale',
    features: ['Beach Front', 'Restaurant Space', 'Retail Space', 'Parking', 'Security'],
    agent: {
      name: 'Lucy Wanjiru',
      phone: '+254 733 654 321',
      email: 'lucy.w@realestatex.com',
      avatar: 'https://randomuser.me/api/portraits/women/5.jpg'
    },
    images: [
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.1.0&auto=format&fit=crop&w=1080&q=80',
      'https://images.unsplash.com/photo-1497366811353-6870744d04b2?ixlib=rb-4.1.0&auto=format&fit=crop&w=1080&q=80'
    ]
  }
];

export const mockTransactions: Transaction[] = [
  {
    id: '1',
    date: new Date('2025-11-07T10:30:00'),
    type: 'Buy',
    symbol: 'KAREN-VILLAS',
    amount: 4,
    price: 10200000,
    total: 40800000
  },
  {
    id: '2',
    date: new Date('2025-11-06T14:15:00'),
    type: 'Sell',
    symbol: 'WESTLANDS-TOWERS',
    amount: 2,
    price: 16200000,
    total: 32400000
  },
  {
    id: '3',
    date: new Date('2025-11-05T09:45:00'),
    type: 'Buy',
    symbol: 'DIANI-BEACH-HOMES',
    amount: 10,
    price: 4500000,
    total: 45000000
  },
  {
    id: '4',
    date: new Date('2025-11-04T16:20:00'),
    type: 'Buy',
    symbol: 'NAIVASHA-LAKESIDE',
    amount: 5,
    price: 7800000,
    total: 39000000
  },
  {
    id: '5',
    date: new Date('2025-11-03T11:10:00'),
    type: 'Sell',
    symbol: 'NANYUKI-MOUNTAIN-VIEW',
    amount: 3,
    price: 5550000,
    total: 16650000
  },
  {
    id: '6',
    date: new Date('2025-11-02T13:45:00'),
    type: 'Buy',
    symbol: 'NAIVASHA-LAKESIDE',
    amount: 3,
    price: 7750000,
    total: 23250000
  },
  {
    id: '7',
    date: new Date('2025-11-01T15:20:00'),
    type: 'Buy',
    symbol: 'SPRING-VALLEY-MANSION',
    amount: 1,
    price: 11800000,
    total: 11800000
  },
  {
    id: '8',
    date: new Date('2025-10-31T08:30:00'),
    type: 'Sell',
    symbol: 'DIANI-BEACH-HOMES',
    amount: 5,
    price: 4400000,
    total: 22000000
  },
  {
    id: '9',
    date: new Date('2025-10-30T12:00:00'),
    type: 'Buy',
    symbol: 'KILIFI-BEACH-VILLA',
    amount: 2,
    price: 11600000,
    total: 23200000
  },
  {
    id: '10',
    date: new Date('2025-10-29T17:15:00'),
    type: 'Buy',
    symbol: 'SIAYA-PARK-PENTHOUSE',
    amount: 4,
    price: 5650000,
    total: 22600000
  }
];