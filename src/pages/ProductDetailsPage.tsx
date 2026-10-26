import React, { useState } from 'react';
import { Product } from '../types';
import { DealBadge } from '../components/DealBadge';
import { TargetPriceModal } from '../components/TargetPriceModal';
import { 
  Star, Truck, Bookmark, Bell, ArrowLeftRight, ExternalLink, 
  ShieldCheck, ArrowLeft, Check, TrendingDown, HelpCircle, AlertCircle, Share2
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface ProductDetailsPageProps {
  product: Product;
  onBack: () => void;
  onToggleCompare: (productId: string) => void;
  isCompared: boolean;
  onToggleWatchlist: (productId: string, targetPrice?: number) => void;
  isWatchlisted: boolean;
  onNavigateToHistory: (productId: string) => void;
}

export const ProductDetailsPage: React.FC<ProductDetailsPageProps> = ({
  product,
  onBack,
  onToggleCompare,
  isCompared,
  onToggleWatchlist,
  isWatchlisted,
  onNavigateToHistory
}) => {
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [copyFeedback, setCopyFeedback] = useState(false);

  // Lowest offer
  const lowestOffer = product.offers.reduce((prev, curr) => 
    curr.price < prev.price ? curr : prev
  , product.offers[0]);

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopyFeedback(true);
    setTimeout(() => setCopyFeedback(false), 2000);
  };

  return (
    <div className="space-y-8 py-4">
      {/* Breadcrumb / Back button */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Products</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            className="p-2 text-slate-500 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer text-xs flex items-center gap-1"
            title="Share this deal"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{copyFeedback ? 'Link Copied!' : 'Share'}</span>
          </button>
        </div>
      </div>

      {/* Main 2-Column Split: Product Media/Specs Left + Contiguous Purchase Module Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Image & Specifications */}
        <div className="lg:col-span-7 space-y-6">
          {/* Hero Visual Card */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-8 flex items-center justify-center relative overflow-hidden shadow-xs">
            <div className="absolute top-4 left-4">
              <DealBadge label={product.dealIntelligence.dealLabel} size="md" showScore score={product.dealIntelligence.score} />
            </div>

            <img
              src={product.imageUrl}
              alt={product.name}
              className="max-h-80 w-auto object-contain mix-blend-multiply transition-transform hover:scale-105 duration-300"
            />
          </div>

          {/* Specifications Matrix */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 space-y-4 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">Technical Specifications</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {Object.entries(product.specs).map(([key, val]) => (
                <div key={key} className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex flex-col justify-center">
                  <span className="text-slate-400 font-medium text-[11px]">{key}</span>
                  <span className="text-slate-900 font-semibold font-mono mt-0.5">{val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Contiguous Purchase Module & Intelligence */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm space-y-5">
            <div>
              {/* Unboxed metadata */}
              <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                <span className="font-bold text-slate-800">{product.brand}</span>
                <span aria-hidden="true">·</span>
                <span>{product.category}</span>
                <span aria-hidden="true">·</span>
                <span className="inline-flex items-center gap-1 text-amber-600 font-medium">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span>{product.rating}</span>
                  <span className="text-slate-400 tabular-nums">({product.reviewCount} verified reviews)</span>
                </span>
              </div>

              <h1 className="text-xl font-bold text-slate-900 leading-snug">
                {product.name}
              </h1>
            </div>

            {/* Price Box */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2">
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-xs text-slate-500 font-medium block">Best Current Offer:</span>
                  <div className="flex items-baseline gap-2.5">
                    <span className="text-3xl font-extrabold text-slate-900 font-mono tabular-nums">
                      ${product.lowestPrice}
                    </span>
                    {product.referenceMSRP > product.lowestPrice && (
                      <span className="text-sm text-slate-400 line-through font-mono">
                        ${product.referenceMSRP}
                      </span>
                    )}
                  </div>
                </div>

                {product.dealIntelligence.nominalDiscountPercent > 0 && (
                  <div className="text-right">
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-100/80 px-2.5 py-1 rounded-md font-mono">
                      {product.dealIntelligence.nominalDiscountPercent}% OFF MSRP
                    </span>
                  </div>
                )}
              </div>

              <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs text-slate-600">
                <span>Sold by <strong className="text-slate-900">{lowestOffer?.retailerName}</strong></span>
                <span className="flex items-center gap-1 text-slate-700">
                  <Truck className="w-3.5 h-3.5 text-slate-400" />
                  <span>{lowestOffer?.deliveryFee === 0 ? 'Free Shipping' : `+$${lowestOffer?.deliveryFee}`}</span>
                </span>
              </div>
            </div>

            {/* Primary Action Buttons */}
            <div className="space-y-2.5">
              <a
                href={lowestOffer?.productUrl || '#'}
                target="_blank"
                rel="noreferrer noopener"
                className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-sm shadow-blue-500/25 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>View Deal at {lowestOffer?.retailerName}</span>
                <ExternalLink className="w-4 h-4" />
              </a>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => onToggleWatchlist(product.id)}
                  className={`py-2 px-3 text-xs font-semibold rounded-lg border transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
                    isWatchlisted
                      ? 'bg-blue-50 text-blue-700 border-blue-200'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <Bookmark className={`w-3.5 h-3.5 ${isWatchlisted ? 'fill-current text-blue-600' : ''}`} />
                  <span>{isWatchlisted ? 'On Watchlist' : 'Add to Watchlist'}</span>
                </button>

                <button
                  onClick={() => setIsAlertModalOpen(true)}
                  className="py-2 px-3 text-xs font-semibold rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Bell className="w-3.5 h-3.5 text-amber-500" />
                  <span>Set Price Alert</span>
                </button>
              </div>

              <button
                onClick={() => onToggleCompare(product.id)}
                className={`w-full py-2 px-3 text-xs font-semibold rounded-lg border transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
                  isCompared
                    ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                    : 'text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <ArrowLeftRight className="w-3.5 h-3.5" />
                <span>{isCompared ? 'Added to Comparison' : 'Add to Product Comparison'}</span>
              </button>
            </div>
          </div>

          {/* Explainable Deal Intelligence Card */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-indigo-600" />
                <h3 className="text-sm font-bold text-slate-900">Explainable Deal Intelligence</h3>
              </div>
              <span className="text-[11px] font-mono text-slate-400">Score: {product.dealIntelligence.score}/100</span>
            </div>

            {/* Score Bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-slate-700">Deal Value Rating:</span>
                <span className="font-bold text-indigo-700 font-mono">{product.dealIntelligence.dealLabel}</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${
                    product.dealIntelligence.score >= 85 ? 'bg-emerald-500' :
                    product.dealIntelligence.score >= 70 ? 'bg-blue-500' : 'bg-slate-400'
                  }`}
                  style={{ width: `${product.dealIntelligence.score}%` }}
                />
              </div>
            </div>

            {/* Plain-text Rationale */}
            <div className="p-3 bg-indigo-50/50 rounded-xl border border-indigo-100 text-xs text-slate-700 leading-relaxed">
              <p className="font-semibold text-indigo-950 mb-1">Why this assessment:</p>
              <p>{product.dealIntelligence.rationale}</p>
            </div>

            {/* Statistical baseline breakdown */}
            <div className="grid grid-cols-3 gap-2 text-center pt-2">
              <div className="p-2 bg-slate-50 rounded-lg">
                <span className="text-[10px] text-slate-400 block uppercase">90-Day Median</span>
                <span className="text-xs font-bold text-slate-800 font-mono">${product.dealIntelligence.historicalMedian}</span>
              </div>
              <div className="p-2 bg-slate-50 rounded-lg">
                <span className="text-[10px] text-slate-400 block uppercase">Historical Low</span>
                <span className="text-xs font-bold text-emerald-700 font-mono">${product.dealIntelligence.historicalMin}</span>
              </div>
              <div className="p-2 bg-slate-50 rounded-lg">
                <span className="text-[10px] text-slate-400 block uppercase">Confidence</span>
                <span className="text-xs font-bold text-slate-800">{product.dealIntelligence.confidenceRating}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Multi-Store Retailer Offers Table */}
      <section className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-base font-bold text-slate-900 tracking-tight">
              All Competing Store Offers ({product.offers.length})
            </h2>
            <p className="text-xs text-slate-500">
              Prices, delivery charges, and availability checked across verified retail vendors.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/70 border-b border-slate-200/80 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Retailer Store</th>
                <th className="py-3 px-4">Listed Price</th>
                <th className="py-3 px-4">Shipping / Delivery</th>
                <th className="py-3 px-4">Estimated Arrival</th>
                <th className="py-3 px-4">Store Rating</th>
                <th className="py-3 px-4">Stock Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {product.offers.map((offer) => {
                const isLowest = offer.price === product.lowestPrice;
                return (
                  <tr key={offer.id} className={`hover:bg-slate-50/70 ${isLowest ? 'bg-blue-50/30' : ''}`}>
                    <td className="py-3.5 px-4 font-semibold text-slate-900 flex items-center gap-2">
                      <span>{offer.retailerName}</span>
                      {isLowest && (
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                          Lowest Price
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900 text-sm tabular-nums">
                      ${offer.price}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">
                      {offer.deliveryFee === 0 ? (
                        <span className="text-emerald-700 font-medium">Free Delivery</span>
                      ) : (
                        `+$${offer.deliveryFee.toFixed(2)}`
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">{offer.deliveryTime}</td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 font-medium text-slate-700">
                        <Star className="w-3 h-3 text-amber-500 fill-current" />
                        <span>{offer.rating}</span>
                        <span className="text-slate-400 text-[10px] tabular-nums">({offer.ratingCount})</span>
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      {offer.inStock ? (
                        <span className="text-emerald-700 font-medium inline-flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" /> In Stock
                        </span>
                      ) : (
                        <span className="text-amber-700 font-medium">Backordered</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <a
                        href={offer.productUrl}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-700 font-semibold rounded-lg transition-colors cursor-pointer text-xs"
                      >
                        <span>Visit Store</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* Mini Price History Preview Section */}
      <section className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-slate-900">Recorded Price History Timeline</h3>
            <p className="text-xs text-slate-500">Historical observation records over the past 90 days.</p>
          </div>
          <button
            onClick={() => onNavigateToHistory(product.id)}
            className="px-4 py-2 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors cursor-pointer"
          >
            Open Full Interactive History View &rarr;
          </button>
        </div>

        <div className="h-48 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={product.priceHistory}>
              <XAxis dataKey="date" tick={{ fontSize: 10 }} stroke="#94a3b8" />
              <YAxis domain={['auto', 'auto']} tick={{ fontSize: 10 }} stroke="#94a3b8" tickFormatter={(v) => `$${v}`} />
              <Tooltip 
                formatter={(val: any) => [`$${val}`, 'Recorded Price']}
                labelFormatter={(lbl) => `Observation Date: ${lbl}`}
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff', fontSize: '11px' }}
              />
              <Line type="monotone" dataKey="price" stroke="#2563eb" strokeWidth={2.5} dot={{ r: 4, fill: '#2563eb' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Target Price Alert Modal */}
      <TargetPriceModal
        product={product}
        isOpen={isAlertModalOpen}
        onClose={() => setIsAlertModalOpen(false)}
        onSaveAlert={(prodId, target) => {
          onToggleWatchlist(prodId, target);
        }}
      />
    </div>
  );
};
