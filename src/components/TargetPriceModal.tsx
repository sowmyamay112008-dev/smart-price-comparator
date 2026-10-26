import React, { useState } from 'react';
import { Product } from '../types';
import { Bell, X, Check, AlertCircle } from 'lucide-react';

interface TargetPriceModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
  currentTargetPrice?: number;
  onSaveAlert: (productId: string, targetPrice: number) => void;
}

export const TargetPriceModal: React.FC<TargetPriceModalProps> = ({
  product,
  isOpen,
  onClose,
  currentTargetPrice,
  onSaveAlert
}) => {
  const [targetPrice, setTargetPrice] = useState<string>(
    currentTargetPrice ? currentTargetPrice.toString() : Math.round(product.lowestPrice * 0.95).toString()
  );
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(targetPrice);
    if (isNaN(val) || val <= 0) {
      setError('Please enter a valid positive target price amount.');
      return;
    }
    if (val > product.lowestPrice * 1.5) {
      setError(`Target price cannot exceed 150% of the current price ($${Math.round(product.lowestPrice * 1.5)}).`);
      return;
    }

    setError(null);
    onSaveAlert(product.id, val);
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      onClose();
    }, 1200);
  };

  const parsedVal = parseFloat(targetPrice);
  const difference = !isNaN(parsedVal) ? product.lowestPrice - parsedVal : 0;
  const isLowerThanCurrent = difference > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-md w-full overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Bell className="w-4 h-4" />
            </div>
            <span>Set Target Price Alert</span>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-md"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <span className="text-xs text-slate-500 font-medium">{product.brand}</span>
            <h4 className="text-sm font-semibold text-slate-900 line-clamp-1">{product.name}</h4>
          </div>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 grid grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-slate-500">Current Lowest:</span>
              <p className="text-base font-bold text-slate-900 font-mono tabular-nums">
                ${product.lowestPrice}
              </p>
            </div>
            <div>
              <span className="text-slate-500">Historical Low:</span>
              <p className="text-base font-semibold text-emerald-700 font-mono tabular-nums">
                ${product.dealIntelligence.historicalMin}
              </p>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Notify me when price drops to or below ($ USD):
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-mono">$</span>
              <input
                type="number"
                step="1"
                min="10"
                value={targetPrice}
                onChange={(e) => setTargetPrice(e.target.value)}
                className="w-full pl-8 pr-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent tabular-nums"
                placeholder="e.g. 799"
              />
            </div>
          </div>

          {/* Helper projection */}
          {!isNaN(parsedVal) && parsedVal > 0 && (
            <div className="text-xs text-slate-600">
              {isLowerThanCurrent ? (
                <p className="text-slate-600">
                  You will save <strong className="text-emerald-700 font-mono">${difference.toFixed(0)}</strong> ({Math.round((difference / product.lowestPrice) * 100)}%) when the target is triggered.
                </p>
              ) : (
                <p className="text-amber-700 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>Target price is already above or equal to current offer (${product.lowestPrice}). Alert will trigger immediately!</span>
                </p>
              )}
            </div>
          )}

          {error && (
            <div className="p-2.5 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700">
              {error}
            </div>
          )}

          {success && (
            <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-700 flex items-center gap-1.5">
              <Check className="w-4 h-4" />
              <span>Target price alert saved successfully!</span>
            </div>
          )}

          <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 rounded-lg cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors cursor-pointer shadow-sm shadow-blue-500/20"
            >
              Save Alert
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
