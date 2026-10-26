import React, { useState } from 'react';
import { Product, ProductCategory } from '../types';
import { ProductCard } from '../components/ProductCard';
import { Search, ArrowRight, ShieldCheck, TrendingDown, Layers, Zap, Smartphone, Laptop, Headphones, Home, Watch } from 'lucide-react';

interface HomePageProps {
  products: Product[];
  onSelectProduct: (productId: string) => void;
  onNavigateToCategory: (category: ProductCategory) => void;
  onSearchSubmit: (query: string) => void;
  onToggleCompare: (productId: string) => void;
  comparedIds: string[];
  onToggleWatchlist: (productId: string) => void;
  watchlistIds: string[];
  onNavigatePage: (page: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  products,
  onSelectProduct,
  onNavigateToCategory,
  onSearchSubmit,
  onToggleCompare,
  comparedIds,
  onToggleWatchlist,
  watchlistIds,
  onNavigatePage
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearchSubmit(searchQuery.trim());
    } else {
      onNavigatePage('products');
    }
  };

  const categories: { name: ProductCategory; icon: React.ComponentType<{ className?: string }>; count: number }[] = [
    { name: 'Smartphones', icon: Smartphone, count: products.filter(p => p.category === 'Smartphones').length },
    { name: 'Laptops', icon: Laptop, count: products.filter(p => p.category === 'Laptops').length },
    { name: 'Electronics', icon: Headphones, count: products.filter(p => p.category === 'Electronics').length },
    { name: 'Home Appliances', icon: Home, count: products.filter(p => p.category === 'Home Appliances').length },
    { name: 'Accessories', icon: Watch, count: products.filter(p => p.category === 'Accessories').length }
  ];

  const bestDeals = products
    .filter(p => p.isBestDealToday || p.dealIntelligence.dealLabel === 'Potential Deal')
    .slice(0, 4);

  return (
    <div className="space-y-16 py-6">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-blue-900 via-indigo-950 to-slate-950 text-white p-8 sm:p-12 lg:p-16 shadow-lg shadow-indigo-950/20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.22),transparent_50%)] pointer-events-none" />
        
        <div className="relative max-w-3xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-blue-200 text-xs font-semibold backdrop-blur-xs border border-white/10">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>Deterministic Deal Intelligence Engine</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight" style={{ textWrap: 'balance' }}>
            Compare Smarter. Save Better.
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
            Stop overpaying on artificial discounts. DealWise compares verified offers across multiple stores, computes true historical medians, and reveals genuine price drops.
          </p>

          {/* Search Box */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto pt-2">
            <div className="relative flex items-center shadow-xl rounded-2xl overflow-hidden bg-white p-1.5 focus-within:ring-2 focus-within:ring-blue-400 transition-all">
              <Search className="w-5 h-5 text-slate-400 ml-3.5 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search smartphones, laptops, headphones, and more…"
                className="w-full px-3 py-2.5 text-sm sm:text-base text-slate-900 placeholder:text-slate-400 focus:outline-none"
              />
              <button
                type="submit"
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold rounded-xl transition-colors shrink-0 cursor-pointer shadow-sm shadow-blue-500/30"
              >
                Search Offers
              </button>
            </div>
            
            {/* Quick popular tags */}
            <div className="mt-3 flex items-center justify-center gap-2 text-xs text-slate-300 flex-wrap">
              <span className="text-slate-400 font-medium">Popular:</span>
              {['Nova Ultra', 'AstraBook', 'Noise Cancelling', 'OLED', 'Espresso'].map(tag => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => onSearchSubmit(tag)}
                  className="px-2 py-0.5 rounded bg-white/10 hover:bg-white/20 text-slate-200 text-[11px] transition-colors cursor-pointer"
                >
                  {tag}
                </button>
              ))}
            </div>
          </form>
        </div>

        {/* 3-Column Proof Metric Strip below Hero */}
        <div className="mt-12 pt-8 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold font-mono text-white tabular-nums">14+</div>
            <div className="text-xs text-slate-400 mt-0.5">Sample Tech Products</div>
          </div>
          <div>
            <div className="text-2xl font-bold font-mono text-white tabular-nums">42+</div>
            <div className="text-xs text-slate-400 mt-0.5">Live Store Offers</div>
          </div>
          <div>
            <div className="text-2xl font-bold font-mono text-white tabular-nums">90 Days</div>
            <div className="text-xs text-slate-400 mt-0.5">Price History Depth</div>
          </div>
          <div>
            <div className="text-2xl font-bold font-mono text-white tabular-nums">100%</div>
            <div className="text-xs text-slate-400 mt-0.5">Transparent Scoring</div>
          </div>
        </div>
      </section>

      {/* Popular Categories */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Popular Categories</h2>
            <p className="text-xs text-slate-500">Explore price trends across top consumer technology</p>
          </div>
          <button
            onClick={() => onNavigatePage('products')}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
          >
            <span>All Products</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {categories.map(cat => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.name}
                onClick={() => onNavigateToCategory(cat.name)}
                className="group p-4 bg-white rounded-xl border border-slate-200/90 hover:border-blue-400 hover:shadow-md transition-all text-left flex flex-col justify-between cursor-pointer"
              >
                <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white flex items-center justify-center transition-colors mb-3">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                    {cat.name}
                  </h3>
                  <span className="text-[11px] text-slate-500">
                    {cat.count} items tracked
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Best Deals Today Section */}
      <section className="space-y-4">
        <div className="flex items-baseline justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">Best Deals Today</h2>
              <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                Verified Drops
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Items currently listed significantly lower than their 90-day recorded historical median.
            </p>
          </div>

          <button
            onClick={() => onNavigatePage('products')}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
          >
            <span>View All Deals</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {bestDeals.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onViewDetails={onSelectProduct}
              onToggleCompare={onToggleCompare}
              isCompared={comparedIds.includes(product.id)}
              onToggleWatchlist={onToggleWatchlist}
              isWatchlisted={watchlistIds.includes(product.id)}
            />
          ))}
        </div>
      </section>

      {/* How It Works (3 Steps) */}
      <section className="bg-white rounded-2xl border border-slate-200/90 p-8 sm:p-12">
        <div className="max-w-2xl mx-auto text-center mb-10">
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            How Deal Intelligence Works
          </h2>
          <p className="text-xs text-slate-500 mt-2 leading-relaxed">
            Traditional deal websites hype fake MSRP discounts. DealWise applies an explainable rule-based algorithm to verify genuine pricing value.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Step 1 */}
          <div className="space-y-3 relative">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-sm shadow-xs">
              01
            </div>
            <h3 className="text-base font-bold text-slate-900">1. Search & Ingest</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              We aggregate and normalize prices, stock status, and delivery fees across competing authorized retailers into one structured feed.
            </p>
          </div>

          {/* Step 2 */}
          <div className="space-y-3 relative">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-sm shadow-xs">
              02
            </div>
            <h3 className="text-base font-bold text-slate-900">2. Deterministic Comparison</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Our rule engine evaluates the current price against 90-day recorded median prices. It flags fake list-price promotions and awards real drops.
            </p>
          </div>

          {/* Step 3 */}
          <div className="space-y-3 relative">
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 font-bold flex items-center justify-center text-sm shadow-xs">
              03
            </div>
            <h3 className="text-base font-bold text-slate-900">3. Save & Track</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Set target price notifications and add items to your watchlist. Buy with confidence from the verified retailer with the best total landed price.
            </p>
          </div>
        </div>

        {/* Action button */}
        <div className="mt-10 pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Rule-based logic: no opaque machine learning or fabricated observation claims.</span>
          </div>
          <button
            onClick={() => onNavigatePage('about')}
            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            Review Project Report Architecture &rarr;
          </button>
        </div>
      </section>
    </div>
  );
};
