import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import { SAMPLE_PRODUCTS, calculateDealMetrics } from './src/data/sampleProducts.ts';
import { Product, WatchlistItem, AnalyticsSummary } from './src/types/index.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// In-memory data store with initial sample data for live demonstration
let products: Product[] = [...SAMPLE_PRODUCTS];
let watchlist: WatchlistItem[] = [
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

// 1. GET /api/products - Search, Filter, Sort
app.get('/api/products', (req: Request, res: Response) => {
  const { q, category, brand, minPrice, maxPrice, sort, dealLabel } = req.query;

  let filtered = [...products];

  // Search keyword (name, brand, specs, category)
  if (q && typeof q === 'string' && q.trim().length > 0) {
    const query = q.toLowerCase().trim();
    filtered = filtered.filter(p => 
      p.name.toLowerCase().includes(query) ||
      p.brand.toLowerCase().includes(query) ||
      p.category.toLowerCase().includes(query) ||
      Object.values(p.specs).some(val => val.toLowerCase().includes(query))
    );
  }

  // Category filter
  if (category && typeof category === 'string' && category !== 'All') {
    filtered = filtered.filter(p => p.category.toLowerCase() === category.toLowerCase());
  }

  // Brand filter
  if (brand && typeof brand === 'string' && brand !== 'All') {
    filtered = filtered.filter(p => p.brand.toLowerCase() === brand.toLowerCase());
  }

  // Deal label filter
  if (dealLabel && typeof dealLabel === 'string' && dealLabel !== 'All') {
    filtered = filtered.filter(p => p.dealIntelligence.dealLabel === dealLabel);
  }

  // Price range filter
  if (minPrice && !isNaN(Number(minPrice))) {
    filtered = filtered.filter(p => p.lowestPrice >= Number(minPrice));
  }
  if (maxPrice && !isNaN(Number(maxPrice))) {
    filtered = filtered.filter(p => p.lowestPrice <= Number(maxPrice));
  }

  // Sort order
  if (sort && typeof sort === 'string') {
    switch (sort) {
      case 'price_asc':
        filtered.sort((a, b) => a.lowestPrice - b.lowestPrice);
        break;
      case 'price_desc':
        filtered.sort((a, b) => b.lowestPrice - a.lowestPrice);
        break;
      case 'discount_desc':
        filtered.sort((a, b) => b.dealIntelligence.nominalDiscountPercent - a.dealIntelligence.nominalDiscountPercent);
        break;
      case 'rating_desc':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'deal_score':
        filtered.sort((a, b) => b.dealIntelligence.score - a.dealIntelligence.score);
        break;
      default:
        // Default popular / best deals first
        filtered.sort((a, b) => (b.isBestDealToday ? 1 : 0) - (a.isBestDealToday ? 1 : 0));
        break;
    }
  }

  res.json({
    total: filtered.length,
    products: filtered,
    availableBrands: Array.from(new Set(products.map(p => p.brand))),
    availableCategories: Array.from(new Set(products.map(p => p.category)))
  });
});

// 2. GET /api/products/:id - Single Product Details & Evaluation
app.get('/api/products/:id', (req: Request, res: Response) => {
  const product = products.find(p => p.id === req.params.id);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }

  // Recalculate transparent rule-based deal metrics
  const freshDealMetrics = calculateDealMetrics(product.offers, product.priceHistory, product.referenceMSRP);
  res.json({
    ...product,
    dealIntelligence: freshDealMetrics
  });
});

// 3. GET /api/compare - Compare multiple products side-by-side
app.get('/api/compare', (req: Request, res: Response) => {
  const idsQuery = req.query.ids;
  if (!idsQuery || typeof idsQuery !== 'string') {
    return res.status(400).json({ error: 'Please supply comma-separated product ids in ?ids=...' });
  }

  const ids = idsQuery.split(',').map(id => id.trim()).filter(Boolean);
  const matched = products.filter(p => ids.includes(p.id));

  // Extract all distinct specification keys across compared products
  const allSpecKeys = Array.from(
    new Set(matched.flatMap(p => Object.keys(p.specs)))
  );

  res.json({
    products: matched,
    specKeys: allSpecKeys,
    lowestOverallPrice: matched.length > 0 ? Math.min(...matched.map(p => p.lowestPrice)) : 0
  });
});

// 4. GET /api/watchlist - Retrieve user's watchlist with active target alerts
app.get('/api/watchlist', (_req: Request, res: Response) => {
  const enrichedWatchlist = watchlist.map(item => {
    const product = products.find(p => p.id === item.productId);
    const currentPrice = product ? product.lowestPrice : item.initialLowestPrice;
    const targetMet = item.targetPrice ? currentPrice <= item.targetPrice : false;
    const savingsSinceAdded = item.initialLowestPrice - currentPrice;

    return {
      ...item,
      product,
      currentPrice,
      targetMet,
      savingsSinceAdded
    };
  }).filter(item => item.product !== undefined);

  res.json({
    count: enrichedWatchlist.length,
    items: enrichedWatchlist
  });
});

// 5. POST /api/watchlist - Add or Update Watchlist item
app.post('/api/watchlist', (req: Request, res: Response) => {
  const { productId, targetPrice } = req.body;
  if (!productId) {
    return res.status(400).json({ error: 'productId is required' });
  }

  const product = products.find(p => p.id === productId);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }

  const existingIndex = watchlist.findIndex(w => w.productId === productId);
  if (existingIndex >= 0) {
    // Update target price
    watchlist[existingIndex].targetPrice = targetPrice ? Number(targetPrice) : undefined;
    return res.json({ message: 'Watchlist item updated', item: watchlist[existingIndex] });
  }

  const newItem: WatchlistItem = {
    productId,
    targetPrice: targetPrice ? Number(targetPrice) : undefined,
    addedAt: new Date().toISOString(),
    initialLowestPrice: product.lowestPrice
  };

  watchlist.push(newItem);
  res.status(201).json({ message: 'Product added to watchlist', item: newItem });
});

// 6. DELETE /api/watchlist/:productId - Remove from Watchlist
app.delete('/api/watchlist/:productId', (req: Request, res: Response) => {
  const { productId } = req.params;
  const initialCount = watchlist.length;
  watchlist = watchlist.filter(w => w.productId !== productId);

  if (watchlist.length === initialCount) {
    return res.status(404).json({ error: 'Item was not in watchlist' });
  }

  res.json({ message: 'Item removed from watchlist', removedId: productId });
});

// 7. GET /api/analytics - Dataset and platform intelligence metrics
app.get('/api/analytics', (_req: Request, res: Response) => {
  const totalProducts = products.length;
  const totalOffers = products.reduce((acc, p) => acc + p.offers.length, 0);
  const priceDropCount = products.filter(p => p.dealIntelligence.dealLabel === 'Price Drop').length;
  const potentialDealsCount = products.filter(p => p.dealIntelligence.dealLabel === 'Potential Deal').length;

  const totalDiscount = products.reduce((acc, p) => acc + p.dealIntelligence.nominalDiscountPercent, 0);
  const averageDiscountPercent = totalProducts > 0 ? Math.round(totalDiscount / totalProducts) : 0;

  // Category counts and average price
  const categories: Product['category'][] = ['Smartphones', 'Laptops', 'Electronics', 'Home Appliances', 'Accessories'];
  const categoryCounts = categories.map(cat => {
    const catProducts = products.filter(p => p.category === cat);
    const count = catProducts.length;
    const avgPrice = count > 0 ? Math.round(catProducts.reduce((sum, p) => sum + p.lowestPrice, 0) / count) : 0;
    return { category: cat, count, avgPrice };
  });

  // Retailer offers and best price frequency
  const retailerStatsMap = new Map<string, { offerCount: number; avgLowestCount: number }>();
  products.forEach(p => {
    p.offers.forEach(o => {
      const existing = retailerStatsMap.get(o.retailerName) || { offerCount: 0, avgLowestCount: 0 };
      existing.offerCount += 1;
      if (o.price === p.lowestPrice) {
        existing.avgLowestCount += 1;
      }
      retailerStatsMap.set(o.retailerName, existing);
    });
  });

  const retailerShare = Array.from(retailerStatsMap.entries()).map(([retailer, stats]) => ({
    retailer,
    offerCount: stats.offerCount,
    avgLowestCount: stats.avgLowestCount
  }));

  // Recent price updates log
  const recentUpdates = products.slice(0, 6).map((p, idx) => ({
    productId: p.id,
    productName: p.name,
    retailer: p.offers[0]?.retailerName || 'Primary Store',
    price: p.lowestPrice,
    changeType: (idx % 2 === 0 ? 'drop' : 'unchanged') as 'drop' | 'unchanged' | 'rise',
    timestamp: p.lastUpdated
  }));

  const summary: AnalyticsSummary = {
    totalProducts,
    totalOffers,
    watchlistCount: watchlist.length,
    priceDropCount,
    potentialDealsCount,
    averageDiscountPercent,
    categoryCounts,
    retailerShare,
    recentUpdates
  };

  res.json(summary);
});

// 8. POST /api/retailer-offers/simulate - Simulation & Integration testing endpoint for Project Demo
app.post('/api/retailer-offers/simulate', (req: Request, res: Response) => {
  const { productId, newPrice, retailerName } = req.body;
  if (!productId || !newPrice || !retailerName) {
    return res.status(400).json({ error: 'productId, newPrice, and retailerName are required' });
  }

  const product = products.find(p => p.id === productId);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }

  const parsedPrice = parseFloat(newPrice);
  const now = new Date().toISOString();

  // Find or create retailer offer
  const existingOffer = product.offers.find(o => o.retailerName.toLowerCase() === retailerName.toLowerCase());
  if (existingOffer) {
    existingOffer.price = parsedPrice;
  } else {
    product.offers.push({
      id: `off-${Date.now()}`,
      retailerName,
      price: parsedPrice,
      originalPrice: product.referenceMSRP,
      deliveryFee: 0,
      deliveryTime: '2-3 Business Days',
      rating: 4.8,
      ratingCount: 120,
      inStock: true,
      productUrl: `https://example.com/${encodeURIComponent(retailerName.toLowerCase())}/${product.id}`
    });
  }

  // Update product lowest price
  product.lowestPrice = Math.min(...product.offers.map(o => o.price));
  product.highestPrice = Math.max(...product.offers.map(o => o.price));
  product.lastUpdated = now;

  // Add to price history
  product.priceHistory.push({
    date: now.split('T')[0],
    price: parsedPrice,
    retailer: retailerName
  });

  // Re-evaluate deal intelligence
  product.dealIntelligence = calculateDealMetrics(product.offers, product.priceHistory, product.referenceMSRP);

  res.json({
    message: 'Price feed simulation successful. Offer updated and intelligence model re-computed.',
    updatedProduct: product
  });
});

// Setup Vite or Static File Serving
async function initServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`DealWise Server running on http://0.0.0.0:${PORT}`);
  });
}

initServer().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
