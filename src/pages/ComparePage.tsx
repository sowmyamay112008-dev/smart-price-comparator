import React, { useState } from 'react';
import { Product } from '../types';
import { DealBadge } from '../components/DealBadge';
import { ArrowLeftRight, X, Plus, Star, Check, Truck, ExternalLink, ArrowRight } from 'lucide-react';

interface ComparePageProps {
  products: Product[];
  comparedIds: string[];
  onRemoveCompare: (productId: string) => void;
  onAddCompare: (productId: string) => void;
  onSelectProduct: (productId: string) => void;
  onNavigatePage: (page: string) => void;
}

export const ComparePage: React.FC<ComparePageProps> = ({
  products,
  comparedIds,
  onRemoveCompare,
  onAddCompare,
  onSelectProduct,
  onNavigatePage
}) => {
  const [selectorOpen, setSelectorOpen] = useState(false);

  // Selected products for comparison
  const comparedProducts = products.filter(p => comparedIds.includes(p.id));
  const availableToAdd = products.filter(p => !comparedIds.includes(p.id));

  // Collect union of all spec keys
  const allSpecKeys = Array.from(
    new Set(comparedProducts.flatMap(p => Object.keys(p.specs)))
  );

  // Find lowest overall price among compared
  const lowestOverallPrice = comparedProducts.length > 0 
    ? Math.min(...comparedProducts.map(p => p.lowestPrice)) 
    : 0;

  return (
    <div className="space-y-8 py-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 mb-1">
            <ArrowLeftRight className="w-4 h-4" />
            <span>Side-by-Side Product Comparison</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Compare Prices & Specifications</h1>
          <p className="text-xs text-slate-500">
            Compare retailer pricing, shipping fees, specifications, and deal intelligence ratings side by side.
          </p>
        </div>

        {/* Action button to add items or clear */}
        <div className="flex items-center gap-3">
          {comparedProducts.length < 4 && availableToAdd.length > 0 && (
            <div className="relative">
              <button
                onClick={() => setSelectorOpen(!selectorOpen)}
                className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer shadow-xs"
              >
                <Plus className="w-3.5 h-3.5 text-blue-600" />
                <span>Add Product ({comparedProducts.length}/4)</span>
              </button>

              {/* Product selector dropdown */}
              {selectorOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-200 z-30 max-h-80 overflow-y-auto p-2 space-y-1">
                  <div className="text-[11px] font-semibold text-slate-400 px-2 py-1 uppercase tracking-wider">
                    Select Product to Add
                  </div>
                  {availableToAdd.map(p => (
                    <button
                      key={p.id}
                      onClick={() => {
                        onAddCompare(p.id);
                        setSelectorOpen(false);
                      }}
                      className="w-full text-left p-2 rounded-lg hover:bg-slate-50 flex items-center gap-2.5 transition-colors cursor-pointer"
                    >
                      <img src={p.imageUrl} alt="" className="w-8 h-8 object-contain shrink-0 rounded bg-slate-50 p-0.5" />
                      <div className="truncate text-xs">
                        <div className="font-semibold text-slate-900 truncate">{p.name}</div>
                        <div className="text-slate-500 font-mono">${p.lowestPrice} · {p.category}</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {comparedProducts.length > 0 && (
            <button
              onClick={() => comparedProducts.forEach(p => onRemoveCompare(p.id))}
              className="px-3 py-2 text-xs font-medium text-slate-600 hover:text-red-600 transition-colors cursor-pointer"
            >
              Clear All
            </button>
          )}
        </div>
      </div>

      {comparedProducts.length === 0 ? (
        /* Empty State */
        <div className="bg-white rounded-2xl border border-slate-200/90 p-12 text-center space-y-4 max-w-lg mx-auto">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
            <ArrowLeftRight className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-slate-900">No products selected for comparison</h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            Select at least two products from the catalogue or use the button below to add popular smartphones or laptops to evaluate side-by-side.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={() => {
                onAddCompare('prod-01');
                onAddCompare('prod-05');
              }}
              className="px-4 py-2 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors cursor-pointer"
            >
              Compare Smartphones (Nova vs PixelApex)
            </button>
            <button
              onClick={() => onNavigatePage('products')}
              className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors cursor-pointer"
            >
              Browse Catalogue
            </button>
          </div>
        </div>
      ) : (
        /* Comparison Matrix */
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            {/* Header Product Row */}
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/50">
                <th className="p-4 w-48 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Product Overview
                </th>
                {comparedProducts.map(product => {
                  const isLowest = product.lowestPrice === lowestOverallPrice && comparedProducts.length > 1;
                  return (
                    <th key={product.id} className="p-4 align-top min-w-[220px]">
                      <div className="space-y-3 relative">
                        {/* Remove button */}
                        <button
                          onClick={() => onRemoveCompare(product.id)}
                          className="absolute -top-1 -right-1 p-1 text-slate-400 hover:text-red-600 rounded-md hover:bg-slate-100 transition-colors"
                          title="Remove from comparison"
                        >
                          <X className="w-4 h-4" />
                        </button>

                        <div className="w-24 h-24 mx-auto bg-slate-50 rounded-lg p-2 border border-slate-100 flex items-center justify-center">
                          <img src={product.imageUrl} alt={product.name} className="w-full h-full object-contain" />
                        </div>

                        <div>
                          <div className="text-[11px] font-semibold text-slate-500 uppercase">{product.brand}</div>
                          <h3 
                            onClick={() => onSelectProduct(product.id)}
                            className="text-sm font-bold text-slate-900 hover:text-blue-600 transition-colors cursor-pointer line-clamp-2"
                          >
                            {product.name}
                          </h3>
                        </div>

                        {/* Price callout */}
                        <div className="pt-2 border-t border-slate-100">
                          <div className="flex items-baseline gap-2">
                            <span className="text-xl font-extrabold text-slate-900 font-mono tabular-nums">
                              ${product.lowestPrice}
                            </span>
                            {product.referenceMSRP > product.lowestPrice && (
                              <span className="text-xs text-slate-400 line-through font-mono">
                                ${product.referenceMSRP}
                              </span>
                            )}
                          </div>
                          {isLowest && (
                            <span className="inline-block mt-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                              Lowest Overall in Comparison
                            </span>
                          )}
                        </div>

                        <div>
                          <DealBadge label={product.dealIntelligence.dealLabel} size="sm" showScore score={product.dealIntelligence.score} />
                        </div>

                        <button
                          onClick={() => onSelectProduct(product.id)}
                          className="w-full py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors cursor-pointer text-center block"
                        >
                          View Full Details &rarr;
                        </button>
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>

            {/* Specification Rows */}
            <tbody className="divide-y divide-slate-100 text-xs">
              <tr className="bg-slate-100/70 font-semibold text-slate-800">
                <td colSpan={comparedProducts.length + 1} className="py-2.5 px-4 text-xs tracking-wide">
                  Technical Specifications
                </td>
              </tr>
              {allSpecKeys.map(key => (
                <tr key={key} className="hover:bg-slate-50/50">
                  <td className="p-4 font-semibold text-slate-700 bg-slate-50/30">
                    {key}
                  </td>
                  {comparedProducts.map(product => (
                    <td key={product.id} className="p-4 text-slate-800 font-mono text-[11px]">
                      {product.specs[key] || '—'}
                    </td>
                  ))}
                </tr>
              ))}

              {/* Deal Intelligence Rationale */}
              <tr className="bg-slate-100/70 font-semibold text-slate-800">
                <td colSpan={comparedProducts.length + 1} className="py-2.5 px-4 text-xs tracking-wide">
                  Deal Intelligence & Historical Evaluation
                </td>
              </tr>
              <tr>
                <td className="p-4 font-semibold text-slate-700 bg-slate-50/30">
                  90-Day Recorded Median
                </td>
                {comparedProducts.map(p => (
                  <td key={p.id} className="p-4 font-mono text-slate-800">
                    ${p.dealIntelligence.historicalMedian}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-4 font-semibold text-slate-700 bg-slate-50/30">
                  All-Time Recorded Floor
                </td>
                {comparedProducts.map(p => (
                  <td key={p.id} className="p-4 font-mono text-emerald-700 font-semibold">
                    ${p.dealIntelligence.historicalMin}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-4 font-semibold text-slate-700 bg-slate-50/30">
                  Explainable Analysis
                </td>
                {comparedProducts.map(p => (
                  <td key={p.id} className="p-4 text-[11px] text-slate-600 leading-relaxed">
                    {p.dealIntelligence.rationale}
                  </td>
                ))}
              </tr>

              {/* Multi-Store Comparison Rows */}
              <tr className="bg-slate-100/70 font-semibold text-slate-800">
                <td colSpan={comparedProducts.length + 1} className="py-2.5 px-4 text-xs tracking-wide">
                  Available Retailer Offers
                </td>
              </tr>
              <tr>
                <td className="p-4 font-semibold text-slate-700 bg-slate-50/30 align-top">
                  Competing Store Offers
                </td>
                {comparedProducts.map(product => (
                  <td key={product.id} className="p-4 align-top space-y-2">
                    {product.offers.map(offer => (
                      <div key={offer.id} className="p-2.5 rounded-lg border border-slate-200 bg-slate-50/60 text-xs space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-slate-900">{offer.retailerName}</span>
                          <span className="font-bold text-slate-900 font-mono">${offer.price}</span>
                        </div>
                        <div className="flex items-center justify-between text-[10px] text-slate-500">
                          <span>{offer.deliveryFee === 0 ? 'Free Shipping' : `+$${offer.deliveryFee}`}</span>
                          <span className="text-emerald-700 font-medium">{offer.inStock ? 'In Stock' : 'Backordered'}</span>
                        </div>
                      </div>
                    ))}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
