import React, { useState } from 'react';
import { Product } from '../types';
import { DealBadge } from '../components/DealBadge';
import { TargetPriceModal } from '../components/TargetPriceModal';
import { 
  History, Calendar, TrendingDown, DollarSign, Bell, Bookmark, ArrowUpRight, ShieldAlert, Check
} from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine, CartesianGrid 
} from 'recharts';

interface PriceHistoryPageProps {
  products: Product[];
  selectedProductId?: string;
  onToggleWatchlist: (productId: string, targetPrice?: number) => void;
  isWatchlisted: (productId: string) => boolean;
  onViewProduct: (productId: string) => void;
}

export const PriceHistoryPage: React.FC<PriceHistoryPageProps> = ({
  products,
  selectedProductId,
  onToggleWatchlist,
  isWatchlisted,
  onViewProduct
}) => {
  const [activeProductId, setActiveProductId] = useState<string>(
    selectedProductId || products[0]?.id || 'prod-01'
  );
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);

  const product = products.find(p => p.id === activeProductId) || products[0];

  if (!product) {
    return <div className="p-8 text-center text-slate-500">No product found for price history.</div>;
  }

  const { priceHistory, dealIntelligence } = product;

  // Compute delta between consecutive price points
  const historyWithDelta = priceHistory.map((point, index) => {
    const prev = index > 0 ? priceHistory[index - 1].price : point.price;
    const delta = point.price - prev;
    return {
      ...point,
      delta,
      percentFromMSRP: product.referenceMSRP > 0 
        ? Math.round(((product.referenceMSRP - point.price) / product.referenceMSRP) * 100) 
        : 0
    };
  });

  return (
    <div className="space-y-8 py-4">
      {/* Page Header & Product Picker */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 mb-1">
            <History className="w-4 h-4" />
            <span>Temporal Price Volatility Tracker</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Price History Analysis</h1>
          <p className="text-xs text-slate-500">
            Audit 90-day recorded price movements to distinguish authentic price drops from artificial manufacturer markups.
          </p>
        </div>

        {/* Product Selector Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-medium hidden sm:inline">Select Product:</span>
          <select
            value={activeProductId}
            onChange={(e) => setActiveProductId(e.target.value)}
            className="px-3 py-2 text-xs font-semibold bg-white border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-xs cursor-pointer max-w-xs"
          >
            {products.map(p => (
              <option key={p.id} value={p.id}>
                {p.name} (${p.lowestPrice})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Selected Product Summary Header */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 bg-slate-50 rounded-xl p-2 border border-slate-100 shrink-0 flex items-center justify-center">
            <img src={product.imageUrl} alt={product.name} className="w-full h-full object-contain" />
          </div>
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
              <span className="font-semibold text-slate-700">{product.brand}</span>
              <span>·</span>
              <span>{product.category}</span>
              <span>·</span>
              <DealBadge label={dealIntelligence.dealLabel} size="sm" />
            </div>
            <h2 className="text-lg font-bold text-slate-900 leading-snug">{product.name}</h2>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black font-mono text-slate-900 tabular-nums">${product.lowestPrice}</span>
              {product.referenceMSRP > product.lowestPrice && (
                <span className="text-xs text-slate-400 line-through font-mono">${product.referenceMSRP}</span>
              )}
              <span className="text-xs text-emerald-700 font-semibold font-mono">
                -{dealIntelligence.nominalDiscountPercent}% MSRP
              </span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-2.5 shrink-0 w-full md:w-auto">
          <button
            onClick={() => onToggleWatchlist(product.id)}
            className={`flex-1 md:flex-initial px-3.5 py-2 text-xs font-semibold rounded-lg border transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
              isWatchlisted(product.id)
                ? 'bg-blue-50 text-blue-700 border-blue-200'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Bookmark className={`w-3.5 h-3.5 ${isWatchlisted(product.id) ? 'fill-current text-blue-600' : ''}`} />
            <span>{isWatchlisted(product.id) ? 'Watchlisted' : 'Add to Watchlist'}</span>
          </button>

          <button
            onClick={() => setIsAlertModalOpen(true)}
            className="flex-1 md:flex-initial px-3.5 py-2 text-xs font-semibold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Bell className="w-3.5 h-3.5 text-amber-500" />
            <span>Price Alert</span>
          </button>

          <button
            onClick={() => onViewProduct(product.id)}
            className="flex-1 md:flex-initial px-4 py-2 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-sm shadow-blue-500/20"
          >
            <span>View Offers</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 4-Stat Mathematical Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded-xl border border-slate-200/90 shadow-xs">
          <span className="text-xs text-slate-400 font-medium block">Current Lowest Price</span>
          <div className="text-2xl font-black font-mono text-slate-900 mt-1 tabular-nums">
            ${dealIntelligence.currentLowestPrice}
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">Active across verified stores</span>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200/90 shadow-xs">
          <span className="text-xs text-slate-400 font-medium block">90-Day Recorded Median</span>
          <div className="text-2xl font-bold font-mono text-slate-700 mt-1 tabular-nums">
            ${dealIntelligence.historicalMedian}
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">Statistical benchmark baseline</span>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200/90 shadow-xs">
          <span className="text-xs text-slate-400 font-medium block">Recorded Historical Floor</span>
          <div className="text-2xl font-black font-mono text-emerald-700 mt-1 tabular-nums">
            ${dealIntelligence.historicalMin}
          </div>
          <span className="text-[11px] text-emerald-600 font-medium mt-1 block">All-time recorded low</span>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200/90 shadow-xs">
          <span className="text-xs text-slate-400 font-medium block">Recorded Historical Peak</span>
          <div className="text-2xl font-bold font-mono text-slate-700 mt-1 tabular-nums">
            ${dealIntelligence.historicalMax}
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">Upper bound sample observation</span>
        </div>
      </div>

      {/* Interactive Line Chart */}
      <section className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900">Recorded Price History Curve</h3>
            <p className="text-xs text-slate-500">Timeline with Median (Grey line) & Historical Low (Emerald line) reference baselines</p>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono">
            <span className="flex items-center gap-1.5 text-blue-600">
              <span className="w-3 h-0.5 bg-blue-600 inline-block" /> Recorded Price
            </span>
            <span className="flex items-center gap-1.5 text-slate-400">
              <span className="w-3 h-0.5 bg-slate-400 border-dashed inline-block" /> 90d Median (${dealIntelligence.historicalMedian})
            </span>
          </div>
        </div>

        <div className="h-72 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={priceHistory} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="#64748b" />
              <YAxis domain={['auto', 'auto']} tick={{ fontSize: 11 }} stroke="#64748b" tickFormatter={(v) => `$${v}`} />
              <Tooltip 
                formatter={(val: any) => [`$${val}`, 'Recorded Price']}
                labelFormatter={(lbl) => `Sample Date: ${lbl}`}
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
              />
              <ReferenceLine y={dealIntelligence.historicalMedian} stroke="#94a3b8" strokeDasharray="4 4" label={{ value: 'Median', fill: '#94a3b8', fontSize: 10 }} />
              <ReferenceLine y={dealIntelligence.historicalMin} stroke="#10b981" strokeDasharray="2 2" label={{ value: 'Min', fill: '#10b981', fontSize: 10 }} />
              <Line 
                type="monotone" 
                dataKey="price" 
                stroke="#2563eb" 
                strokeWidth={3} 
                dot={{ r: 5, fill: '#2563eb', strokeWidth: 2, stroke: '#fff' }}
                activeDot={{ r: 7, fill: '#1d4ed8' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Date-wise Price History Audit Table */}
      <section className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">Observation Audit Trail</h3>
            <p className="text-xs text-slate-500">Every price record captured in the demonstration dataset.</p>
          </div>
          <span className="text-xs text-slate-400 font-mono">{priceHistory.length} checkpoints</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/70 border-b border-slate-200/80 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Observation Date</th>
                <th className="py-3 px-4">Retailer Feed</th>
                <th className="py-3 px-4">Recorded Price</th>
                <th className="py-3 px-4">Change from Previous</th>
                <th className="py-3 px-4">Discount from MSRP</th>
                <th className="py-3 px-4">Status vs Floor</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {historyWithDelta.map((row, idx) => {
                const isFloor = row.price === dealIntelligence.historicalMin;
                return (
                  <tr key={idx} className="hover:bg-slate-50/70">
                    <td className="py-3.5 px-4 font-mono font-medium text-slate-800 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{row.date}</span>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-800">{row.retailer}</td>
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900 tabular-nums">
                      ${row.price}
                    </td>
                    <td className="py-3.5 px-4 font-mono tabular-nums">
                      {idx === 0 ? (
                        <span className="text-slate-400">Baseline entry</span>
                      ) : row.delta < 0 ? (
                        <span className="text-emerald-700 font-semibold">-${Math.abs(row.delta)} (Price Drop)</span>
                      ) : row.delta > 0 ? (
                        <span className="text-amber-700 font-semibold">+${row.delta}</span>
                      ) : (
                        <span className="text-slate-500">Unchanged ($0)</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-700">
                      {row.percentFromMSRP}% off
                    </td>
                    <td className="py-3.5 px-4">
                      {isFloor ? (
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                          Historical Low
                        </span>
                      ) : (
                        <span className="text-slate-400 text-[11px]">—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
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
