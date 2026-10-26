import React, { useState } from 'react';
import { ArrowLeftRight, Bookmark, Search, Menu, X, ShieldAlert } from 'lucide-react';

interface NavbarProps {
  activePage: string;
  setActivePage: (page: string) => void;
  watchlistCount: number;
  compareCount: number;
  onOpenSearch?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activePage,
  setActivePage,
  watchlistCount,
  compareCount
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'products', label: 'Products' },
    { id: 'compare', label: `Compare${compareCount > 0 ? ` (${compareCount})` : ''}` },
    { id: 'history', label: 'Price History' },
    { id: 'analytics', label: 'Analytics' },
    { id: 'about', label: 'About Project' }
  ];

  const handleNav = (id: string) => {
    setActivePage(id);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80">
      {/* Sample Data & Academic Project Disclaimer Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 text-white text-xs font-medium py-1.5 px-4 text-center flex items-center justify-center gap-2">
        <ShieldAlert className="w-3.5 h-3.5 shrink-0 opacity-90" />
        <span>Academic Demonstration System: Verified Rule-Based Intelligence Engine with Standardized Sample Retailer Feeds</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Single text wordmark */}
          <button
            onClick={() => handleNav('home')}
            className="flex items-center gap-2.5 text-left focus:outline-none group shrink-0"
          >
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold shadow-sm shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <span className="text-base tracking-tighter">DW</span>
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors whitespace-nowrap">
                DealWise
              </span>
              <span className="hidden sm:inline-block ml-2 text-xs font-normal text-slate-500">
                Price Intelligence
              </span>
            </div>
          </button>

          {/* Zone 2: 4-5 single-line clean text links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600">
            {navLinks.map(link => {
              const isActive = activePage === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleNav(link.id)}
                  className={`relative py-1 transition-colors whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'text-blue-600 font-semibold'
                      : 'hover:text-slate-900'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: 1 primary action */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Quick Compare Indicator if active */}
            {compareCount > 0 && activePage !== 'compare' && (
              <button
                onClick={() => handleNav('compare')}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200/80 rounded-lg hover:bg-indigo-100 transition-colors whitespace-nowrap"
                title="View Side-by-Side Product Comparison"
              >
                <ArrowLeftRight className="w-3.5 h-3.5" />
                <span>Compare ({compareCount})</span>
              </button>
            )}

            <button
              onClick={() => handleNav('watchlist')}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
                activePage === 'watchlist'
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/25'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200/90'
              }`}
            >
              <Bookmark className={`w-3.5 h-3.5 ${watchlistCount > 0 ? 'fill-current' : ''}`} />
              <span>Watchlist</span>
              {watchlistCount > 0 && (
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold tabular-nums ${
                  activePage === 'watchlist' ? 'bg-white text-blue-600' : 'bg-blue-600 text-white'
                }`}>
                  {watchlistCount}
                </span>
              )}
            </button>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-600 hover:text-slate-900 focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-5 space-y-2">
          {navLinks.map(link => (
            <button
              key={link.id}
              onClick={() => handleNav(link.id)}
              className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                activePage === link.id
                  ? 'bg-blue-50 text-blue-600 font-semibold'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              {link.label}
            </button>
          ))}
          <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
            <button
              onClick={() => handleNav('contact')}
              className="text-left px-3 py-2 text-xs font-medium text-slate-500 hover:text-slate-900"
            >
              Contact & Evaluation Disclaimer
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
