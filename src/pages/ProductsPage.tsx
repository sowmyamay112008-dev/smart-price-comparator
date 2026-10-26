import React, { useState, useMemo } from 'react';
import { Product, ProductCategory, DealLabel } from '../types';
import { ProductCard } from '../components/ProductCard';
import { Search, Filter, SlidersHorizontal, ArrowUpDown, X, ArrowLeftRight, Check, RotateCcw } from 'lucide-react';

interface ProductsPageProps {
  products: Product[];
  initialCategory?: ProductCategory | 'All';
  initialSearchQuery?: string;
  onSelectProduct: (productId: string) => void;
  onToggleCompare: (productId: string) => void;
  comparedIds: string[];
  onToggleWatchlist: (productId: string) => void;
  watchlistIds: string[];
  onNavigatePage: (page: string) => void;
}

export const ProductsPage: React.FC<ProductsPageProps> = ({
  products,
  initialCategory = 'All',
  initialSearchQuery = '',
  onSelectProduct,
  onToggleCompare,
  comparedIds,
  onToggleWatchlist,
  watchlistIds,
  onNavigatePage
}) => {
  const [search, setSearch] = useState(initialSearchQuery);
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'All'>(initialCategory);
  const [selectedBrand, setSelectedBrand] = useState<string>('All');
  const [selectedDealLabel, setSelectedDealLabel] = useState<DealLabel | 'All'>('All');
  const [sortBy, setSortBy] = useState<string>('recommended');
  const [maxPrice, setMaxPrice] = useState<number>(2000);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Extract distinct brands
  const brands = useMemo(() => {
    return ['All', ...Array.from(new Set(products.map(p => p.brand)))];
  }, [products]);

  const categories: (ProductCategory | 'All')[] = [
    'All',
    'Smartphones',
    'Laptops',
    'Electronics',
    'Home Appliances',
    'Accessories'
  ];

  const dealLabels: (DealLabel | 'All')[] = [
    'All',
    'Potential Deal',
    'Price Drop',
    'Fair Market Value',
    'Insufficient Price History'
  ];

  // Client-side filtering & sorting
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      // Search
      if (search.trim()) {
        const query = search.toLowerCase().trim();
        const matchesName = p.name.toLowerCase().includes(query);
        const matchesBrand = p.brand.toLowerCase().includes(query);
        const matchesCategory = p.category.toLowerCase().includes(query);
        const matchesSpecs = Object.values(p.specs).some(val => val.toLowerCase().includes(query));
        if (!matchesName && !matchesBrand && !matchesCategory && !matchesSpecs) return false;
      }

      // Category
      if (selectedCategory !== 'All' && p.category !== selectedCategory) return false;

      // Brand
      if (selectedBrand !== 'All' && p.brand !== selectedBrand) return false;

      // Deal label
      if (selectedDealLabel !== 'All' && p.dealIntelligence.dealLabel !== selectedDealLabel) return false;

      // Price limit
      if (p.lowestPrice > maxPrice) return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price_asc') return a.lowestPrice - b.lowestPrice;
      if (sortBy === 'price_desc') return b.lowestPrice - a.lowestPrice;
      if (sortBy === 'discount_desc') return b.dealIntelligence.nominalDiscountPercent - a.dealIntelligence.nominalDiscountPercent;
      if (sortBy === 'rating_desc') return b.rating - a.rating;
      if (sortBy === 'deal_score') return b.dealIntelligence.score - a.dealIntelligence.score;
      // Default: best deals first
      return (b.isBestDealToday ? 1 : 0) - (a.isBestDealToday ? 1 : 0);
    });
  }, [products, search, selectedCategory, selectedBrand, selectedDealLabel, maxPrice, sortBy]);

  const resetFilters = () => {
    setSearch('');
    setSelectedCategory('All');
    setSelectedBrand('All');
    setSelectedDealLabel('All');
    setMaxPrice(2000);
    setSortBy('recommended');
  };

  const hasActiveFilters = search || selectedCategory !== 'All' || selectedBrand !== 'All' || selectedDealLabel !== 'All' || maxPrice < 2000;

  return (
    <div className="space-y-6 py-4">
      {/* Page Title & Search Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Compare All Products</h1>
          <p className="text-xs text-slate-500">
            Real-time price aggregation across verified retailer catalogues.
          </p>
        </div>

        {/* Global Search Bar */}
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter by keyword, model, or specs…"
            className="w-full pl-9 pr-9 py-2 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-xs"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Main Grid: Sidebar Filters & Results */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Left Filter Sidebar (Desktop) */}
        <aside className="hidden lg:block bg-white p-5 rounded-xl border border-slate-200/90 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-900">
              <SlidersHorizontal className="w-4 h-4 text-blue-600" />
              <span>Filters</span>
            </div>
            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="text-[11px] font-medium text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            )}
          </div>

          {/* Category Filter */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-700 block">Category</label>
            <div className="space-y-1">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`w-full text-left px-2.5 py-1.5 text-xs rounded-lg transition-colors cursor-pointer flex items-center justify-between ${
                    selectedCategory === cat
                      ? 'bg-blue-50 text-blue-700 font-semibold'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span>{cat}</span>
                  {cat !== 'All' && (
                    <span className="text-[10px] text-slate-400 tabular-nums">
                      {products.filter(p => p.category === cat).length}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Brand Filter */}
          <div className="space-y-2 pt-3 border-t border-slate-100">
            <label className="text-xs font-semibold text-slate-700 block">Brand</label>
            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="w-full px-2.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              {brands.map(brand => (
                <option key={brand} value={brand}>{brand}</option>
              ))}
            </select>
          </div>

          {/* Deal Intelligence Label Filter */}
          <div className="space-y-2 pt-3 border-t border-slate-100">
            <label className="text-xs font-semibold text-slate-700 block">Deal Status</label>
            <div className="space-y-1">
              {dealLabels.map(label => (
                <button
                  key={label}
                  onClick={() => setSelectedDealLabel(label)}
                  className={`w-full text-left px-2.5 py-1.5 text-xs rounded-lg transition-colors cursor-pointer flex items-center justify-between ${
                    selectedDealLabel === label
                      ? 'bg-indigo-50 text-indigo-700 font-semibold'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span className="truncate">{label}</span>
                  {label !== 'All' && (
                    <span className="text-[10px] text-slate-400 tabular-nums">
                      {products.filter(p => p.dealIntelligence.dealLabel === label).length}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Max Price Slider */}
          <div className="space-y-2 pt-3 border-t border-slate-100">
            <div className="flex items-center justify-between text-xs">
              <label className="font-semibold text-slate-700">Max Budget:</label>
              <span className="font-bold text-slate-900 font-mono tabular-nums">${maxPrice}</span>
            </div>
            <input
              type="range"
              min="50"
              max="2000"
              step="50"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-blue-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>$50</span>
              <span>$2,000</span>
            </div>
          </div>
        </aside>

        {/* Right Content Area: Results and Controls */}
        <main className="lg:col-span-3 space-y-4">
          {/* Top Sort & Summary Bar */}
          <div className="bg-white p-3.5 rounded-xl border border-slate-200/90 shadow-xs flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span>Showing <strong className="text-slate-900 font-mono">{filteredProducts.length}</strong> of <span className="font-mono">{products.length}</span> products</span>
              {hasActiveFilters && (
                <span className="text-blue-600 font-medium">· Filtered</span>
              )}
            </div>

            <div className="flex items-center gap-3">
              {/* Mobile Filter Button */}
              <button
                onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
                className="lg:hidden flex items-center gap-1.5 px-3 py-1.5 text-xs border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                <Filter className="w-3.5 h-3.5 text-blue-600" />
                <span>Filters</span>
              </button>

              {/* Sort Dropdown */}
              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-500 hidden sm:inline">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                >
                  <option value="recommended">Best Deals & Score</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="discount_desc">Highest % Discount</option>
                  <option value="rating_desc">Highest Customer Rating</option>
                </select>
              </div>
            </div>
          </div>

          {/* Mobile Filter Dropdown Drawer */}
          {mobileFilterOpen && (
            <div className="lg:hidden p-4 bg-white rounded-xl border border-slate-200 space-y-4 shadow-sm">
              <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-900">Mobile Filters</span>
                <button onClick={resetFilters} className="text-xs text-blue-600 font-medium">Reset</button>
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-slate-500 mb-1">Category</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value as any)}
                    className="w-full p-2 border border-slate-200 rounded-lg bg-slate-50 text-xs"
                  >
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-500 mb-1">Brand</label>
                  <select
                    value={selectedBrand}
                    onChange={(e) => setSelectedBrand(e.target.value)}
                    className="w-full p-2 border border-slate-200 rounded-lg bg-slate-50 text-xs"
                  >
                    {brands.map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Product Cards Grid */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {filteredProducts.map(product => (
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
          ) : (
            /* Empty State */
            <div className="p-12 text-center bg-white rounded-2xl border border-slate-200/90 space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">No matching products found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                No items match your active filters or search terms. Try loosening the price budget or category filters.
              </p>
              <button
                onClick={resetFilters}
                className="mt-2 px-4 py-2 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors cursor-pointer"
              >
                Clear all filters
              </button>
            </div>
          )}
        </main>
      </div>

      {/* Floating Compare Action Bar when items selected */}
      {comparedIds.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-4 border border-slate-700 animate-in fade-in slide-in-from-bottom-4">
          <div className="flex items-center gap-2 text-xs">
            <ArrowLeftRight className="w-4 h-4 text-blue-400" />
            <span>
              <strong className="font-bold text-white">{comparedIds.length}</strong> {comparedIds.length === 1 ? 'product' : 'products'} selected for comparison (max 4)
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigatePage('compare')}
              className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer shadow-sm shadow-blue-500/25"
            >
              Compare Now &rarr;
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
