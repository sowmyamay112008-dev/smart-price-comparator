import React, { useState } from 'react';
import { Product } from '../types';
import { DealBadge } from './DealBadge';
import { Star, Truck, ArrowLeftRight, Bookmark, ArrowUpRight, Check, ImageOff } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onViewDetails: (productId: string) => void;
  onToggleCompare: (productId: string) => void;
  isCompared: boolean;
  onToggleWatchlist: (productId: string) => void;
  isWatchlisted: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onViewDetails,
  onToggleCompare,
  isCompared,
  onToggleWatchlist,
  isWatchlisted
}) => {
  const [imgError, setImgError] = useState(false);

  // Find lowest price offer
  const lowestOffer = product.offers.reduce((prev, curr) => 
    curr.price < prev.price ? curr : prev
  , product.offers[0]);

  // Delivery string
  const deliveryText = lowestOffer?.deliveryFee === 0 
    ? 'Free delivery' 
    : lowestOffer?.deliveryFee 
      ? `+$${lowestOffer.deliveryFee.toFixed(2)} delivery` 
      : 'Delivery charges vary';

  return (
    <div className="group bg-white rounded-xl border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.05)] hover:shadow-md hover:border-slate-300 transition-all duration-200 flex flex-col justify-between overflow-hidden">
      {/* Top Media & Actions */}
      <div className="relative aspect-[4/3] bg-slate-50 border-b border-slate-100 overflow-hidden flex items-center justify-center p-4">
        {!imgError ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
            className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 bg-slate-100 rounded-lg p-4 text-center">
            <ImageOff className="w-8 h-8 mb-2 opacity-60" />
            <span className="text-xs font-medium text-slate-500">{product.name}</span>
            <span className="text-[10px] text-slate-400">Sample product preview</span>
          </div>
        )}

        {/* Floating Quick Action Buttons */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleWatchlist(product.id);
            }}
            className={`p-2 rounded-lg backdrop-blur-sm transition-all cursor-pointer ${
              isWatchlisted
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-white/85 text-slate-600 hover:text-blue-600 hover:bg-white shadow-sm'
            }`}
            title={isWatchlisted ? 'Remove from Watchlist' : 'Add to Watchlist'}
            aria-label={isWatchlisted ? 'Remove from Watchlist' : 'Add to Watchlist'}
          >
            <Bookmark className={`w-3.5 h-3.5 ${isWatchlisted ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Deal Intelligence Tag */}
        <div className="absolute bottom-3 left-3 z-10">
          <DealBadge label={product.dealIntelligence.dealLabel} size="sm" />
        </div>
      </div>

      {/* Product Content Body */}
      <div className="p-4 flex-1 flex flex-col justify-between gap-3">
        <div>
          {/* Metadata: Brand · Category · Verified Rating (anti-pill clean text) */}
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <span className="font-semibold text-slate-700">{product.brand}</span>
            <span aria-hidden="true">·</span>
            <span>{product.category}</span>
            <span aria-hidden="true">·</span>
            <span className="inline-flex items-center gap-1 text-amber-600 font-medium">
              <Star className="w-3 h-3 fill-current" />
              <span>{product.rating}</span>
              <span className="text-slate-400 tabular-nums">({product.reviewCount})</span>
            </span>
          </div>

          {/* Product Name */}
          <h3 
            onClick={() => onViewDetails(product.id)}
            className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2 cursor-pointer leading-snug"
          >
            {product.name}
          </h3>

          {/* Key Spec Snippet */}
          <div className="mt-2 text-[11px] text-slate-500 line-clamp-2 space-y-0.5 bg-slate-50 p-2 rounded-md border border-slate-100">
            {Object.entries(product.specs).slice(0, 2).map(([key, val]) => (
              <div key={key} className="flex justify-between gap-2 truncate">
                <span className="text-slate-400 font-medium shrink-0">{key}:</span>
                <span className="text-slate-700 truncate font-mono text-[10px]">{val}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing & Retailer Offer Box */}
        <div className="pt-2 border-t border-slate-100">
          <div className="flex items-baseline justify-between">
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-extrabold text-slate-900 font-mono tabular-nums">
                ${product.lowestPrice}
              </span>
              {product.referenceMSRP > product.lowestPrice && (
                <div className="flex items-center gap-1.5 text-xs">
                  <span className="text-slate-400 line-through font-mono tabular-nums">
                    ${product.referenceMSRP}
                  </span>
                  <span className="text-emerald-700 font-semibold font-mono text-[11px]">
                    -{product.dealIntelligence.nominalDiscountPercent}%
                  </span>
                </div>
              )}
            </div>

            <span className="text-[11px] text-slate-500">
              {product.offers.length} store offers
            </span>
          </div>

          {/* Lowest Retailer & Delivery info */}
          <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1">
            <span className="truncate">
              at <strong className="text-slate-700">{lowestOffer?.retailerName || 'Primary Store'}</strong>
            </span>
            <span className="flex items-center gap-1 text-slate-600 shrink-0">
              <Truck className="w-3 h-3 text-slate-400" />
              <span>{deliveryText}</span>
            </span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          {/* Compare toggle */}
          <button
            onClick={() => onToggleCompare(product.id)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs rounded-lg transition-colors cursor-pointer border ${
              isCompared
                ? 'bg-indigo-50 text-indigo-700 border-indigo-200 font-semibold'
                : 'text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            {isCompared ? <Check className="w-3.5 h-3.5 text-indigo-600" /> : <ArrowLeftRight className="w-3.5 h-3.5" />}
            <span className="text-[11px]">{isCompared ? 'Comparing' : 'Compare'}</span>
          </button>

          {/* View Deal */}
          <button
            onClick={() => onViewDetails(product.id)}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors cursor-pointer shadow-sm shadow-blue-500/20"
          >
            <span>View Deal</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
