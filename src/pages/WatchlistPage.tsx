import React, { useState } from 'react';
import { Product, WatchlistItem } from '../types';
import { DealBadge } from '../components/DealBadge';
import { TargetPriceModal } from '../components/TargetPriceModal';
import { 
  Bookmark, Bell, Trash2, ArrowUpRight, TrendingDown, CheckCircle2, AlertCircle, ShoppingBag, ArrowRight
} from 'lucide-react';

interface WatchlistPageProps {
  products: Product[];
  watchlistItems: WatchlistItem[];
  onRemoveWatchlist: (productId: string) => void;
  onUpdateTargetPrice: (productId: string, targetPrice: number) => void;
  onSelectProduct: (productId: string) => void;
  onNavigatePage: (page: string) => void;
}

export const WatchlistPage: React.FC<WatchlistPageProps> = ({
  products,
  watchlistItems,
  onRemoveWatchlist,
  onUpdateTargetPrice,
  onSelectProduct,
  onNavigatePage
}) => {
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Enrich items with live product data
  const enriched = watchlistItems.map(item => {
    const prod = products.find(p => p.id === item.productId);
    const curPrice = prod ? prod.lowestPrice : item.initialLowestPrice;
    const targetMet = item.targetPrice ? curPrice <= item.targetPrice : false;
    const savingsSinceAdded = item.initialLowestPrice - curPrice;

    return {
      ...item,
      product: prod,
      currentPrice: curPrice,
      targetMet,
      savingsSinceAdded
    };
  }).filter(item => Boolean(item.product));

  const totalTrackedSavings = enriched.reduce((acc, item) => acc + Math.max(0, item.savingsSinceAdded), 0);
  const targetMetCount = enriched.filter(item => item.targetMet).length;

  return (
    <div className="space-y-8 py-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 mb-1">
            <Bookmark className="w-4 h-4 fill-current" />
            <span>Target Price Drop Monitor</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Your Saved Watchlist</h1>
          <p className="text-xs text-slate-500">
            Track price drops and target-price alerts across your favorite technology products.
          </p>
        </div>

        {enriched.length > 0 && (
          <button
            onClick={() => onNavigatePage('products')}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer shadow-xs"
          >
            <ShoppingBag className="w-3.5 h-3.5 text-blue-600" />
            <span>Explore More Items</span>
          </button>
        )}
      </div>

      {/* Overview Stat Cards */}
      {enriched.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 bg-white rounded-xl border border-slate-200/90 shadow-xs">
            <span className="text-xs text-slate-400 font-medium">Tracked Items</span>
            <div className="text-2xl font-bold font-mono text-slate-900 mt-1 tabular-nums">
              {enriched.length}
            </div>
          </div>

          <div className="p-4 bg-white rounded-xl border border-slate-200/90 shadow-xs">
            <span className="text-xs text-slate-400 font-medium">Active Price Drops</span>
            <div className="text-2xl font-bold font-mono text-emerald-700 mt-1 tabular-nums">
              {targetMetCount}
            </div>
            <span className="text-[11px] text-emerald-600 mt-0.5 block">Reached or beat target price</span>
          </div>

          <div className="p-4 bg-white rounded-xl border border-slate-200/90 shadow-xs">
            <span className="text-xs text-slate-400 font-medium">Potential Price Drop Savings</span>
            <div className="text-2xl font-bold font-mono text-blue-600 mt-1 tabular-nums">
              ${totalTrackedSavings}
            </div>
            <span className="text-[11px] text-slate-500 mt-0.5 block">Saved since adding to watchlist</span>
          </div>
        </div>
      )}

      {/* Watchlist Items List */}
      {enriched.length === 0 ? (
        /* Empty State */
        <div className="bg-white rounded-2xl border border-slate-200/90 p-12 text-center max-w-md mx-auto space-y-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
            <Bookmark className="w-6 h-6" />
          </div>
          <h2 className="text-base font-bold text-slate-900">Your watchlist is empty</h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            Save any smartphone, laptop, or gadget to receive automated target price notifications and track price movements.
          </p>
          <button
            onClick={() => onNavigatePage('products')}
            className="px-5 py-2.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors cursor-pointer shadow-sm shadow-blue-500/20 inline-flex items-center gap-1.5"
          >
            <span>Browse Catalog</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {enriched.map((item) => {
            const prod = item.product!;
            const lowestOffer = prod.offers.reduce((prev, curr) => curr.price < prev.price ? curr : prev, prod.offers[0]);

            return (
              <div
                key={item.productId}
                className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs hover:shadow-md transition-shadow flex flex-col md:flex-row items-center justify-between gap-6"
              >
                {/* Media & Title */}
                <div className="flex items-center gap-4 w-full md:w-auto">
                  <div className="w-16 h-16 bg-slate-50 rounded-xl p-2 border border-slate-100 shrink-0 flex items-center justify-center">
                    <img src={prod.imageUrl} alt={prod.name} className="w-full h-full object-contain" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 text-xs text-slate-500 mb-0.5">
                      <span className="font-semibold text-slate-700">{prod.brand}</span>
                      <span>·</span>
                      <span>{prod.category}</span>
                      <span>·</span>
                      <DealBadge label={prod.dealIntelligence.dealLabel} size="sm" />
                    </div>
                    <h3
                      onClick={() => onSelectProduct(prod.id)}
                      className="text-sm font-bold text-slate-900 hover:text-blue-600 transition-colors cursor-pointer line-clamp-1"
                    >
                      {prod.name}
                    </h3>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      Added on {new Date(item.addedAt).toLocaleDateString()} (Initial: ${item.initialLowestPrice})
                    </div>
                  </div>
                </div>

                {/* Pricing & Target Status */}
                <div className="flex flex-wrap items-center gap-6 w-full md:w-auto justify-between md:justify-end">
                  {/* Current Price */}
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-medium block">Current Best</span>
                    <div className="text-xl font-extrabold text-slate-900 font-mono tabular-nums">
                      ${prod.lowestPrice}
                    </div>
                    <span className="text-[10px] text-slate-500 block truncate max-w-[130px]">
                      at {lowestOffer.retailerName}
                    </span>
                  </div>

                  {/* Target Price Alert Status */}
                  <div className="min-w-[160px]">
                    <span className="text-[10px] text-slate-400 uppercase font-medium block">Target Alert</span>
                    {item.targetPrice ? (
                      <div>
                        <div className="flex items-center gap-1.5 font-mono text-sm font-bold text-slate-900">
                          <Bell className="w-3.5 h-3.5 text-amber-500" />
                          <span>${item.targetPrice}</span>
                        </div>
                        {item.targetMet ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700">
                            <CheckCircle2 className="w-3 h-3" /> Target Met!
                          </span>
                        ) : (
                          <span className="text-[11px] text-slate-500">
                            ${prod.lowestPrice - item.targetPrice} away from target
                          </span>
                        )}
                      </div>
                    ) : (
                      <button
                        onClick={() => setEditingProduct(prod)}
                        className="text-xs text-blue-600 hover:text-blue-800 font-medium inline-flex items-center gap-1 cursor-pointer"
                      >
                        <Bell className="w-3 h-3" /> Set Target Alert
                      </button>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setEditingProduct(prod)}
                      className="p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
                      title="Update target price"
                    >
                      <Bell className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => onRemoveWatchlist(prod.id)}
                      className="p-2 text-slate-400 hover:text-red-600 rounded-lg hover:bg-slate-100 transition-colors"
                      title="Remove from watchlist"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => onSelectProduct(prod.id)}
                      className="px-3.5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <span>View Deal</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Target Price Alert Edit Modal */}
      {editingProduct && (
        <TargetPriceModal
          product={editingProduct}
          isOpen={Boolean(editingProduct)}
          onClose={() => setEditingProduct(null)}
          currentTargetPrice={watchlistItems.find(w => w.productId === editingProduct.id)?.targetPrice}
          onSaveAlert={(prodId, target) => {
            onUpdateTargetPrice(prodId, target);
          }}
        />
      )}
    </div>
  );
};
