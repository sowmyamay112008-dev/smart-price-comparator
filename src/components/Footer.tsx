import React from 'react';
import { ShieldCheck, Cpu, ExternalLink, Database } from 'lucide-react';

interface FooterProps {
  setActivePage: (page: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ setActivePage }) => {
  const navigate = (page: string) => {
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-900 text-slate-400 text-sm mt-20 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand info */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm">
                DW
              </div>
              <span className="text-lg font-bold text-white tracking-tight">DealWise</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              “Compare Smarter. Save Better.”
            </p>
            <p className="text-xs text-slate-500 leading-relaxed">
              A computer science and engineering project demonstrating rule-based deal intelligence, multi-retailer price aggregation, and historical price volatility tracking.
            </p>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-3">
              Platform Features
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => navigate('products')} className="hover:text-white transition-colors cursor-pointer">
                  Browse All Products
                </button>
              </li>
              <li>
                <button onClick={() => navigate('compare')} className="hover:text-white transition-colors cursor-pointer">
                  Multi-Store Price Comparison
                </button>
              </li>
              <li>
                <button onClick={() => navigate('history')} className="hover:text-white transition-colors cursor-pointer">
                  Price History & Volatility Charts
                </button>
              </li>
              <li>
                <button onClick={() => navigate('watchlist')} className="hover:text-white transition-colors cursor-pointer">
                  Target Price Drop Watchlist
                </button>
              </li>
              <li>
                <button onClick={() => navigate('analytics')} className="hover:text-white transition-colors cursor-pointer">
                  Retailer Analytics & Simulation
                </button>
              </li>
            </ul>
          </div>

          {/* Academic Architecture */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-3">
              CSE Architecture
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span>Deterministic Deal Scoring Engine</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                <span>Multi-Vendor Ingestion Layer</span>
              </li>
              <li className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Transparent Explainable Rationale</span>
              </li>
              <li>
                <button onClick={() => navigate('about')} className="text-blue-400 hover:text-blue-300 font-medium inline-flex items-center gap-1 mt-1 cursor-pointer">
                  View Technical Report Details &rarr;
                </button>
              </li>
            </ul>
          </div>

          {/* Disclaimer & Transparency */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-3">
              Academic Disclaimer
            </h4>
            <div className="p-3 bg-slate-800/80 rounded-lg border border-slate-700/60 text-[11px] text-slate-400 leading-normal space-y-2">
              <p>
                <strong className="text-slate-300">Sample Demonstration Data:</strong> All retailer offers and price records are clearly labeled as sample data for academic evaluation.
              </p>
              <p>
                Does not violate terms of service or scrape unauthorized production retailer endpoints. Designed for authorized affiliate API ingestion feeds.
              </p>
              <button
                onClick={() => navigate('contact')}
                className="text-indigo-400 hover:text-indigo-300 font-medium inline-flex items-center gap-1 pt-1 cursor-pointer"
              >
                Read Full Disclaimer & Contact <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} DealWise Project — Computer Science and Engineering Capstone Demonstration.</p>
          <div className="flex items-center gap-6">
            <button onClick={() => navigate('about')} className="hover:text-slate-300 transition-colors cursor-pointer">
              About
            </button>
            <button onClick={() => navigate('contact')} className="hover:text-slate-300 transition-colors cursor-pointer">
              Contact & Project Viva
            </button>
            <button onClick={() => navigate('analytics')} className="hover:text-slate-300 transition-colors cursor-pointer">
              System Metrics
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
