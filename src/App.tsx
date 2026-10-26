import React, { useState, useEffect } from 'react';
import { Product, ProductCategory, WatchlistItem } from './types';
import { api } from './services/api';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { ProductsPage } from './pages/ProductsPage';
import { ComparePage } from './pages/ComparePage';
import { ProductDetailsPage } from './pages/ProductDetailsPage';
import { PriceHistoryPage } from './pages/PriceHistoryPage';
import { WatchlistPage } from './pages/WatchlistPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { Check, AlertCircle, RefreshCw } from 'lucide-react';

export default function App() {
  const [activePage, setActivePage] = useState<string>('home');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedProductId, setSelectedProductId] = useState<string>('prod-01');
  const [comparedProductIds, setComparedProductIds] = useState<string[]>(['prod-01', 'prod-02']);
  const [watchlistItems, setWatchlistItems] = useState<WatchlistItem[]>([]);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'info' } | null>(null);

  // Filters passed from Home to Products
  const [targetCategory, setTargetCategory] = useState<ProductCategory | 'All'>('All');
  const [targetSearchQuery, setTargetSearchQuery] = useState<string>('');

  useEffect(() => {
    fetchInitialData();
  }, []);

  const showNotification = (message: string, type: 'success' | 'info' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 2800);
  };

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const prodRes = await api.getProducts();
      setProducts(prodRes.products);

      const watchRes = await api.getWatchlist();
      setWatchlistItems(watchRes.items);
    } catch (err) {
      console.error('Failed to load products', err);
    } finally {
      setLoading(false);
    }
  };

  // Toggle compare list
  const handleToggleCompare = (productId: string) => {
    if (comparedProductIds.includes(productId)) {
      setComparedProductIds(comparedProductIds.filter(id => id !== productId));
      showNotification('Removed from comparison', 'info');
    } else {
      if (comparedProductIds.length >= 4) {
        showNotification('Maximum 4 products can be compared at once', 'info');
        return;
      }
      setComparedProductIds([...comparedProductIds, productId]);
      showNotification('Added to comparison matrix', 'success');
    }
  };

  const handleAddCompare = (productId: string) => {
    if (!comparedProductIds.includes(productId) && comparedProductIds.length < 4) {
      setComparedProductIds([...comparedProductIds, productId]);
      showNotification('Product added to comparison', 'success');
    }
  };

  const handleRemoveCompare = (productId: string) => {
    setComparedProductIds(comparedProductIds.filter(id => id !== productId));
    showNotification('Product removed from comparison', 'info');
  };

  // Toggle watchlist
  const handleToggleWatchlist = async (productId: string, targetPrice?: number) => {
    const isCurrentlyIn = watchlistItems.some(w => w.productId === productId);
    if (isCurrentlyIn && targetPrice === undefined) {
      // Remove
      await api.removeFromWatchlist(productId);
      setWatchlistItems(watchlistItems.filter(w => w.productId !== productId));
      showNotification('Removed from watchlist', 'info');
    } else {
      // Add or update target
      await api.toggleWatchlist(productId, targetPrice);
      const updated = await api.getWatchlist();
      setWatchlistItems(updated.items);
      showNotification(
        targetPrice ? `Target alert saved at $${targetPrice}` : 'Product saved to watchlist',
        'success'
      );
    }
  };

  const handleUpdateTargetPrice = async (productId: string, targetPrice: number) => {
    await api.toggleWatchlist(productId, targetPrice);
    const updated = await api.getWatchlist();
    setWatchlistItems(updated.items);
    showNotification(`Target price alert updated to $${targetPrice}`, 'success');
  };

  const handleRemoveWatchlist = async (productId: string) => {
    await api.removeFromWatchlist(productId);
    setWatchlistItems(watchlistItems.filter(w => w.productId !== productId));
    showNotification('Item removed from watchlist', 'info');
  };

  // Navigation helpers
  const handleSelectProduct = (productId: string) => {
    setSelectedProductId(productId);
    setActivePage('details');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateToCategory = (category: ProductCategory) => {
    setTargetCategory(category);
    setTargetSearchQuery('');
    setActivePage('products');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearchSubmit = (query: string) => {
    setTargetSearchQuery(query);
    setTargetCategory('All');
    setActivePage('products');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateToHistory = (productId: string) => {
    setSelectedProductId(productId);
    setActivePage('history');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const selectedProduct = products.find(p => p.id === selectedProductId) || products[0];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-blue-600 selection:text-white">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-semibold shadow-2xl border border-slate-700 animate-in fade-in slide-in-from-top-3">
          {notification.type === 'success' ? (
            <Check className="w-4 h-4 text-emerald-400" />
          ) : (
            <AlertCircle className="w-4 h-4 text-blue-400" />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Primary Top Bar Contract */}
      <Navbar
        activePage={activePage}
        setActivePage={(page) => {
          if (page === 'products') {
            setTargetCategory('All');
            setTargetSearchQuery('');
          }
          setActivePage(page);
        }}
        watchlistCount={watchlistItems.length}
        compareCount={comparedProductIds.length}
      />

      {/* Main Page View Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
        {loading ? (
          <div className="py-24 text-center space-y-3">
            <RefreshCw className="w-8 h-8 text-blue-600 animate-spin mx-auto" />
            <p className="text-xs text-slate-500 font-medium">Loading DealWise multi-retailer platform...</p>
          </div>
        ) : (
          <>
            {activePage === 'home' && (
              <HomePage
                products={products}
                onSelectProduct={handleSelectProduct}
                onNavigateToCategory={handleNavigateToCategory}
                onSearchSubmit={handleSearchSubmit}
                onToggleCompare={handleToggleCompare}
                comparedIds={comparedProductIds}
                onToggleWatchlist={(id) => handleToggleWatchlist(id)}
                watchlistIds={watchlistItems.map(w => w.productId)}
                onNavigatePage={(p) => setActivePage(p)}
              />
            )}

            {activePage === 'products' && (
              <ProductsPage
                products={products}
                initialCategory={targetCategory}
                initialSearchQuery={targetSearchQuery}
                onSelectProduct={handleSelectProduct}
                onToggleCompare={handleToggleCompare}
                comparedIds={comparedProductIds}
                onToggleWatchlist={(id) => handleToggleWatchlist(id)}
                watchlistIds={watchlistItems.map(w => w.productId)}
                onNavigatePage={(p) => setActivePage(p)}
              />
            )}

            {activePage === 'compare' && (
              <ComparePage
                products={products}
                comparedIds={comparedProductIds}
                onRemoveCompare={handleRemoveCompare}
                onAddCompare={handleAddCompare}
                onSelectProduct={handleSelectProduct}
                onNavigatePage={(p) => setActivePage(p)}
              />
            )}

            {activePage === 'details' && selectedProduct && (
              <ProductDetailsPage
                product={selectedProduct}
                onBack={() => setActivePage('products')}
                onToggleCompare={handleToggleCompare}
                isCompared={comparedProductIds.includes(selectedProduct.id)}
                onToggleWatchlist={(id, target) => handleToggleWatchlist(id, target)}
                isWatchlisted={watchlistItems.some(w => w.productId === selectedProduct.id)}
                onNavigateToHistory={handleNavigateToHistory}
              />
            )}

            {activePage === 'history' && (
              <PriceHistoryPage
                products={products}
                selectedProductId={selectedProductId}
                onToggleWatchlist={(id, target) => handleToggleWatchlist(id, target)}
                isWatchlisted={(id) => watchlistItems.some(w => w.productId === id)}
                onViewProduct={handleSelectProduct}
              />
            )}

            {activePage === 'watchlist' && (
              <WatchlistPage
                products={products}
                watchlistItems={watchlistItems}
                onRemoveWatchlist={handleRemoveWatchlist}
                onUpdateTargetPrice={handleUpdateTargetPrice}
                onSelectProduct={handleSelectProduct}
                onNavigatePage={(p) => setActivePage(p)}
              />
            )}

            {activePage === 'analytics' && (
              <AnalyticsPage
                products={products}
                watchlistCount={watchlistItems.length}
                onRefreshProducts={fetchInitialData}
                onSelectProduct={handleSelectProduct}
              />
            )}

            {activePage === 'about' && (
              <AboutPage onNavigatePage={(p) => setActivePage(p)} />
            )}

            {activePage === 'contact' && (
              <ContactPage />
            )}
          </>
        )}
      </main>

      {/* Global Footer */}
      <Footer setActivePage={(page) => setActivePage(page)} />
    </div>
  );
}
