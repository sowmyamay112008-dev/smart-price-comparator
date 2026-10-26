export type ProductCategory = 
  | 'Smartphones' 
  | 'Laptops' 
  | 'Electronics' 
  | 'Home Appliances' 
  | 'Accessories';

export type DealLabel = 
  | 'Potential Deal' 
  | 'Price Drop' 
  | 'Fair Market Value' 
  | 'Insufficient Price History';

export interface RetailerOffer {
  id: string;
  retailerName: string;
  retailerLogo?: string;
  price: number;
  originalPrice?: number;
  deliveryFee: number;
  deliveryTime: string;
  rating: number;
  ratingCount: number;
  inStock: boolean;
  productUrl: string;
  isLowestPrice?: boolean;
}

export interface PricePoint {
  date: string; // ISO date YYYY-MM-DD
  price: number;
  retailer: string;
}

export interface ProductSpecs {
  [key: string]: string;
}

export interface DealIntelligence {
  dealLabel: DealLabel;
  score: number; // 0 to 100
  historicalMedian: number;
  historicalMin: number;
  historicalMax: number;
  currentLowestPrice: number;
  nominalDiscountPercent: number; // vs MSRP
  historicalDiscountPercent: number; // vs median
  rationale: string;
  confidenceRating: 'High' | 'Medium' | 'Low';
  lastEvaluated: string;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: ProductCategory;
  imageUrl: string;
  referenceMSRP: number;
  lowestPrice: number;
  highestPrice: number;
  rating: number;
  reviewCount: number;
  specs: ProductSpecs;
  offers: RetailerOffer[];
  priceHistory: PricePoint[];
  dealIntelligence: DealIntelligence;
  lastUpdated: string;
  isPopular?: boolean;
  isBestDealToday?: boolean;
}

export interface WatchlistItem {
  productId: string;
  targetPrice?: number;
  addedAt: string;
  initialLowestPrice: number;
}

export interface AnalyticsSummary {
  totalProducts: number;
  totalOffers: number;
  watchlistCount: number;
  priceDropCount: number;
  potentialDealsCount: number;
  averageDiscountPercent: number;
  categoryCounts: { category: ProductCategory; count: number; avgPrice: number }[];
  retailerShare: { retailer: string; offerCount: number; avgLowestCount: number }[];
  recentUpdates: {
    productId: string;
    productName: string;
    retailer: string;
    price: number;
    changeType: 'drop' | 'unchanged' | 'rise';
    timestamp: string;
  }[];
}
