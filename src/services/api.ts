import { Product, WatchlistItem, AnalyticsSummary } from '../types';
import { SAMPLE_PRODUCTS, calculateDealMetrics } from '../data/sampleProducts';

// Local storage keys for client fallback and demo persistence
const WATCHLIST_STORAGE_KEY = 'dealwise_watchlist_v1';

function getLocalWatchlist(): WatchlistItem[] {
  try {
    const raw = localStorage.getItem(WATCHLIST_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to read local watchlist', e);
  }
  return [
    {
      productId: 'prod-01',
      targetPrice: 820,
      addedAt: '2026-10-20T10:00:00Z',
      initialLowestPrice: 879
    },
    {
      productId: 'prod-03',
      targetPrice: 250,
      addedAt: '2026-10-22T14:30:00Z',
      initialLowestPrice: 279
    }
  ];
}

function saveLocalWatchlist(list: WatchlistItem[]) {
  try {
    localStorage.setItem(WATCHLIST_STORAGE_KEY, JSON.stringify(list));
  } catch (e) {
    console.error('Failed to save local watchlist', e);
  }
}

export const api = {
  async getProducts(params?: {
    q?: string;
    category?: string;
    brand?: string;
    sort?: string;
    minPrice?: number;
    maxPrice?: number;
    dealLabel?: string;
  }): Promise<{ products: Product[]; total: number; availableBrands: string[]; availableCategories: string[] }> {
    try {
      const queryParams = new URLSearchParams();
      if (params?.q) queryParams.set('q', params.q);
      if (params?.category) queryParams.set('category', params.category);
      if (params?.brand) queryParams.set('brand', params.brand);
      if (params?.sort) queryParams.set('sort', params.sort);
      if (params?.dealLabel) queryParams.set('dealLabel', params.dealLabel);
      if (params?.minPrice !== undefined) queryParams.set('minPrice', params.minPrice.toString());
      if (params?.maxPrice !== undefined) queryParams.set('maxPrice', params.maxPrice.toString());

      const res = await fetch(`/api/products?${queryParams.toString()}`);
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Fallback to local filtering
    }

    // Client-side fallback
    let filtered = [...SAMPLE_PRODUCTS];
    if (params?.q) {
      const query = params.q.toLowerCase().trim();
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(query) ||
        p.brand.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query)
      );
    }
    if (params?.category && params.category !== 'All') {
      filtered = filtered.filter(p => p.category.toLowerCase() === params.category?.toLowerCase());
    }
    if (params?.brand && params.brand !== 'All') {
      filtered = filtered.filter(p => p.brand.toLowerCase() === params.brand?.toLowerCase());
    }
    if (params?.dealLabel && params.dealLabel !== 'All') {
      filtered = filtered.filter(p => p.dealIntelligence.dealLabel === params.dealLabel);
    }
    if (params?.minPrice !== undefined) {
      filtered = filtered.filter(p => p.lowestPrice >= params.minPrice!);
    }
    if (params?.maxPrice !== undefined) {
      filtered = filtered.filter(p => p.lowestPrice <= params.maxPrice!);
    }

    if (params?.sort === 'price_asc') filtered.sort((a, b) => a.lowestPrice - b.lowestPrice);
    else if (params?.sort === 'price_desc') filtered.sort((a, b) => b.lowestPrice - a.lowestPrice);
    else if (params?.sort === 'discount_desc') filtered.sort((a, b) => b.dealIntelligence.nominalDiscountPercent - a.dealIntelligence.nominalDiscountPercent);
    else if (params?.sort === 'rating_desc') filtered.sort((a, b) => b.rating - a.rating);

    return {
      products: filtered,
      total: filtered.length,
      availableBrands: Array.from(new Set(SAMPLE_PRODUCTS.map(p => p.brand))),
      availableCategories: Array.from(new Set(SAMPLE_PRODUCTS.map(p => p.category)))
    };
  },

  async getProductById(id: string): Promise<Product | null> {
    try {
      const res = await fetch(`/api/products/${id}`);
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Fallback
    }
    const found = SAMPLE_PRODUCTS.find(p => p.id === id);
    if (!found) return null;
    return {
      ...found,
      dealIntelligence: calculateDealMetrics(found.offers, found.priceHistory, found.referenceMSRP)
    };
  },

  async getComparison(ids: string[]): Promise<{ products: Product[]; specKeys: string[]; lowestOverallPrice: number }> {
    try {
      const res = await fetch(`/api/compare?ids=${ids.join(',')}`);
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Fallback
    }
    const matched = SAMPLE_PRODUCTS.filter(p => ids.includes(p.id));
    const allSpecKeys = Array.from(new Set(matched.flatMap(p => Object.keys(p.specs))));
    return {
      products: matched,
      specKeys: allSpecKeys,
      lowestOverallPrice: matched.length > 0 ? Math.min(...matched.map(p => p.lowestPrice)) : 0
    };
  },

  async getWatchlist(): Promise<{
    count: number;
    items: Array<WatchlistItem & { product: Product; currentPrice: number; targetMet: boolean; savingsSinceAdded: number }>;
  }> {
    try {
      const res = await fetch('/api/watchlist');
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Fallback
    }

    const localItems = getLocalWatchlist();
    const enriched = localItems.map(item => {
      const prod = SAMPLE_PRODUCTS.find(p => p.id === item.productId);
      const curPrice = prod ? prod.lowestPrice : item.initialLowestPrice;
      return {
        ...item,
        product: prod!,
        currentPrice: curPrice,
        targetMet: item.targetPrice ? curPrice <= item.targetPrice : false,
        savingsSinceAdded: item.initialLowestPrice - curPrice
      };
    }).filter(i => Boolean(i.product));

    return { count: enriched.length, items: enriched };
  },

  async toggleWatchlist(productId: string, targetPrice?: number): Promise<boolean> {
    try {
      const res = await fetch('/api/watchlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, targetPrice })
      });
      if (res.ok) {
        // Also update local storage cache
        const local = getLocalWatchlist();
        const existing = local.find(w => w.productId === productId);
        if (existing) {
          existing.targetPrice = targetPrice;
        } else {
          local.push({
            productId,
            targetPrice,
            addedAt: new Date().toISOString(),
            initialLowestPrice: SAMPLE_PRODUCTS.find(p => p.id === productId)?.lowestPrice || 0
          });
        }
        saveLocalWatchlist(local);
        return true;
      }
    } catch {
      // Fallback
    }

    const local = getLocalWatchlist();
    const idx = local.findIndex(w => w.productId === productId);
    if (idx >= 0) {
      local[idx].targetPrice = targetPrice;
    } else {
      local.push({
        productId,
        targetPrice,
        addedAt: new Date().toISOString(),
        initialLowestPrice: SAMPLE_PRODUCTS.find(p => p.id === productId)?.lowestPrice || 0
      });
    }
    saveLocalWatchlist(local);
    return true;
  },

  async removeFromWatchlist(productId: string): Promise<boolean> {
    try {
      const res = await fetch(`/api/watchlist/${productId}`, { method: 'DELETE' });
      if (res.ok) {
        const local = getLocalWatchlist().filter(w => w.productId !== productId);
        saveLocalWatchlist(local);
        return true;
      }
    } catch {
      // Fallback
    }
    const local = getLocalWatchlist().filter(w => w.productId !== productId);
    saveLocalWatchlist(local);
    return true;
  },

  async getAnalytics(): Promise<AnalyticsSummary> {
    try {
      const res = await fetch('/api/analytics');
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Fallback
    }

    // Client fallback
    const totalProducts = SAMPLE_PRODUCTS.length;
    const totalOffers = SAMPLE_PRODUCTS.reduce((acc, p) => acc + p.offers.length, 0);
    const priceDropCount = SAMPLE_PRODUCTS.filter(p => p.dealIntelligence.dealLabel === 'Price Drop').length;
    const potentialDealsCount = SAMPLE_PRODUCTS.filter(p => p.dealIntelligence.dealLabel === 'Potential Deal').length;
    const totalDiscount = SAMPLE_PRODUCTS.reduce((acc, p) => acc + p.dealIntelligence.nominalDiscountPercent, 0);

    return {
      totalProducts,
      totalOffers,
      watchlistCount: getLocalWatchlist().length,
      priceDropCount,
      potentialDealsCount,
      averageDiscountPercent: Math.round(totalDiscount / totalProducts),
      categoryCounts: [
        { category: 'Smartphones', count: 3, avgPrice: 662 },
        { category: 'Laptops', count: 3, avgPrice: 1326 },
        { category: 'Electronics', count: 3, avgPrice: 176 },
        { category: 'Home Appliances', count: 3, avgPrice: 312 },
        { category: 'Accessories', count: 2, avgPrice: 169 }
      ],
      retailerShare: [
        { retailer: 'ElectroMart', offerCount: 11, avgLowestCount: 5 },
        { retailer: 'CyberDepot', offerCount: 10, avgLowestCount: 4 },
        { retailer: 'TechVault', offerCount: 6, avgLowestCount: 3 },
        { retailer: 'ApexRetail', offerCount: 12, avgLowestCount: 0 },
        { retailer: 'HomeTech Central', offerCount: 3, avgLowestCount: 3 }
      ],
      recentUpdates: SAMPLE_PRODUCTS.slice(0, 5).map(p => ({
        productId: p.id,
        productName: p.name,
        retailer: p.offers[0].retailerName,
        price: p.lowestPrice,
        changeType: 'drop' as const,
        timestamp: p.lastUpdated
      }))
    };
  },

  async simulatePriceUpdate(productId: string, newPrice: number, retailerName: string) {
    try {
      const res = await fetch('/api/retailer-offers/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, newPrice, retailerName })
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // ignore
    }
    return null;
  }
};
