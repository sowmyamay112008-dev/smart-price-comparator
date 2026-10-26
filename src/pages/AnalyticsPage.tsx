import React, { useState, useEffect } from 'react';
import { AnalyticsSummary, Product } from '../types';
import { api } from '../services/api';
import { 
  BarChart3, TrendingDown, Layers, Store, Bookmark, CheckCircle2, 
  RefreshCw, Play, ShieldCheck, ArrowUpRight, Zap
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend,
  PieChart, Pie, Cell
} from 'recharts';

interface AnalyticsPageProps {
  products: Product[];
  watchlistCount: number;
  onRefreshProducts: () => void;
  onSelectProduct: (productId: string) => void;
}

export const AnalyticsPage: React.FC<AnalyticsPageProps> = ({
  products,
  watchlistCount,
  onRefreshProducts,
  onSelectProduct
}) => {
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);
  const [loading, setLoading] = useState(true);

  // Simulation form states for live CSE evaluation
  const [simProduct, setSimProduct] = useState(products[0]?.id || 'prod-01');
  const [simPrice, setSimPrice] = useState('799');
  const [simRetailer, setSimRetailer] = useState('ElectroMart');
  const [simStatus, setSimStatus] = useState<string | null>(null);

  useEffect(() => {
    loadAnalytics();
  }, [products, watchlistCount]);

  const loadAnalytics = async () => {
    setLoading(true);
    const data = await api.getAnalytics();
    setAnalytics(data);
    setLoading(false);
  };

  const handleSimulate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSimStatus('Submitting price check update to backend API...');
    const res = await api.simulatePriceUpdate(simProduct, parseFloat(simPrice), simRetailer);
    if (res) {
      setSimStatus('Simulated price ingest confirmed! Deal Intelligence re-evaluated.');
      onRefreshProducts();
      loadAnalytics();
      setTimeout(() => setSimStatus(null), 3500);
    } else {
      setSimStatus('Simulation complete locally.');
      setTimeout(() => setSimStatus(null), 2000);
    }
  };

  if (loading || !analytics) {
    return (
      <div className="py-20 text-center space-y-3">
        <RefreshCw className="w-8 h-8 text-blue-600 animate-spin mx-auto" />
        <p className="text-xs text-slate-500">Computing catalogue metrics and price distribution...</p>
      </div>
    );
  }

  // Colors for charts
  const CHART_COLORS = ['#2563eb', '#7c3aed', '#059669', '#d97706', '#dc2626'];

  // Deal label breakdown
  const dealLabelCounts = [
    { name: 'Potential Deal', value: products.filter(p => p.dealIntelligence.dealLabel === 'Potential Deal').length, color: '#10b981' },
    { name: 'Price Drop', value: products.filter(p => p.dealIntelligence.dealLabel === 'Price Drop').length, color: '#2563eb' },
    { name: 'Fair Value', value: products.filter(p => p.dealIntelligence.dealLabel === 'Fair Market Value').length, color: '#64748b' },
    { name: 'Low History', value: products.filter(p => p.dealIntelligence.dealLabel === 'Insufficient Price History').length, color: '#f59e0b' }
  ];

  return (
    <div className="space-y-8 py-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 mb-1">
            <BarChart3 className="w-4 h-4" />
            <span>Catalogue Intelligence & System Performance</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">System Analytics & Deal Intelligence</h1>
          <p className="text-xs text-slate-500">
            Real-time telemetry on aggregate pricing, retailer distribution, and rule-based deal classifications.
          </p>
        </div>

        <button
          onClick={loadAnalytics}
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer shadow-xs"
        >
          <RefreshCw className="w-3.5 h-3.5 text-blue-600" />
          <span>Refresh Metrics</span>
        </button>
      </div>

      {/* Top 5 KPI Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="p-4 bg-white rounded-xl border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Catalogue Items</span>
            <Layers className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-extrabold font-mono text-slate-900 mt-1 tabular-nums">
            {analytics.totalProducts}
          </div>
          <span className="text-[10px] text-slate-500 mt-0.5 block">Across 5 tech categories</span>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Store Offers</span>
            <Store className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-2xl font-extrabold font-mono text-slate-900 mt-1 tabular-nums">
            {analytics.totalOffers}
          </div>
          <span className="text-[10px] text-slate-500 mt-0.5 block">Avg {(analytics.totalOffers / analytics.totalProducts).toFixed(1)} offers/product</span>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Potential Deals</span>
            <Zap className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-extrabold font-mono text-emerald-700 mt-1 tabular-nums">
            {analytics.potentialDealsCount}
          </div>
          <span className="text-[10px] text-emerald-600 mt-0.5 block">Below 90-day median</span>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Watchlist Tracks</span>
            <Bookmark className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-2xl font-extrabold font-mono text-slate-900 mt-1 tabular-nums">
            {watchlistCount}
          </div>
          <span className="text-[10px] text-slate-500 mt-0.5 block">Active price alert monitors</span>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200/90 shadow-xs col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Average Discount</span>
            <TrendingDown className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-extrabold font-mono text-slate-900 mt-1 tabular-nums">
            {analytics.averageDiscountPercent}%
          </div>
          <span className="text-[10px] text-slate-500 mt-0.5 block">Versus reference MSRP</span>
        </div>
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Breakdown Bar Chart */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Average Price by Category</h3>
            <p className="text-xs text-slate-500">Benchmark median item pricing across technology domains ($ USD)</p>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics.categoryCounts}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="category" tick={{ fontSize: 10 }} stroke="#64748b" />
                <YAxis tick={{ fontSize: 10 }} stroke="#64748b" tickFormatter={(v) => `$${v}`} />
                <Tooltip 
                  formatter={(val: any) => [`$${val}`, 'Average Price']}
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff', fontSize: '11px' }}
                />
                <Bar dataKey="avgPrice" fill="#2563eb" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Retailer Share & Best-Price Competitiveness */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Retailer Competitiveness</h3>
            <p className="text-xs text-slate-500">Total catalog offers vs. Number of times offering the absolute lowest price</p>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics.retailerShare}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="retailer" tick={{ fontSize: 10 }} stroke="#64748b" />
                <YAxis tick={{ fontSize: 10 }} stroke="#64748b" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff', fontSize: '11px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Bar dataKey="offerCount" name="Total Offers" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                <Bar dataKey="avgLowestCount" name="Lowest Price Won" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Deal Classification Distribution & Live CSE Simulation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Deal Classification Pie Chart */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Deal Intelligence Classification</h3>
            <p className="text-xs text-slate-500">Breakdown of active catalogue products by rule-based label</p>
          </div>

          <div className="h-56 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={dealLabelCounts}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {dealLabelCounts.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(val: any) => [`${val} Products`, 'Count']}
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff', fontSize: '11px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            {dealLabelCounts.map(item => (
              <div key={item.name} className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                <span className="text-slate-600 truncate">{item.name}:</span>
                <strong className="text-slate-900 font-mono">{item.value}</strong>
              </div>
            ))}
          </div>
        </div>

        {/* Live CSE Project Demonstration Simulator */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Play className="w-4 h-4 text-blue-600" />
              <h3 className="text-sm font-bold text-slate-900">Live CSE Project Demo: Ingestion & Rule Simulator</h3>
            </div>
            <span className="text-[10px] font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded">
              Interactive Test Bench
            </span>
          </div>

          <p className="text-xs text-slate-500 leading-relaxed">
            Simulate a real-time retailer price update feed. Enter a lower price for any product to witness the Deal Intelligence engine re-evaluate discounts, median spreads, and deal classifications instantly.
          </p>

          <form onSubmit={handleSimulate} className="space-y-3 bg-slate-50/70 p-4 rounded-xl border border-slate-200/80">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Target Product</label>
                <select
                  value={simProduct}
                  onChange={(e) => {
                    setSimProduct(e.target.value);
                    const p = products.find(prod => prod.id === e.target.value);
                    if (p) setSimPrice(Math.round(p.lowestPrice * 0.9).toString());
                  }}
                  className="w-full p-2 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs focus:ring-2 focus:ring-blue-500"
                >
                  {products.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name} (Current: ${p.lowestPrice})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Reporting Retailer</label>
                <select
                  value={simRetailer}
                  onChange={(e) => setSimRetailer(e.target.value)}
                  className="w-full p-2 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs focus:ring-2 focus:ring-blue-500"
                >
                  <option value="ElectroMart">ElectroMart</option>
                  <option value="CyberDepot">CyberDepot</option>
                  <option value="TechVault">TechVault</option>
                  <option value="HomeTech Central">HomeTech Central</option>
                  <option value="ApexRetail">ApexRetail</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">New Simulated Price ($)</label>
                <input
                  type="number"
                  step="1"
                  min="1"
                  value={simPrice}
                  onChange={(e) => setSimPrice(e.target.value)}
                  className="w-full p-2 bg-white border border-slate-200 rounded-lg text-slate-800 font-mono text-xs focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <span className="text-[11px] text-slate-500">
                Triggers server route: <code className="font-mono text-blue-600">POST /api/retailer-offers/simulate</code>
              </span>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer shadow-sm shadow-blue-500/20"
              >
                Execute Test Price Check &rarr;
              </button>
            </div>
          </form>

          {simStatus && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{simStatus}</span>
            </div>
          )}
        </div>
      </div>

      {/* Recently Updated Feed Table */}
      <section className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">Recent Price Updates Audit</h3>
            <p className="text-xs text-slate-500">Real-time log of retailer offer validations and price drops.</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/70 border-b border-slate-200/80 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Product Name</th>
                <th className="py-3 px-4">Reporting Store</th>
                <th className="py-3 px-4">Effective Price</th>
                <th className="py-3 px-4">Status Change</th>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4 text-right">Inspect</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {analytics.recentUpdates.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50/70">
                  <td className="py-3.5 px-4 font-semibold text-slate-900">{item.productName}</td>
                  <td className="py-3.5 px-4 text-slate-700">{item.retailer}</td>
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-900">${item.price}</td>
                  <td className="py-3.5 px-4">
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                      Verified Drop
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-500 font-mono text-[11px]">
                    {new Date(item.timestamp).toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => onSelectProduct(item.productId)}
                      className="text-xs text-blue-600 hover:text-blue-800 font-semibold cursor-pointer"
                    >
                      View &rarr;
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};
