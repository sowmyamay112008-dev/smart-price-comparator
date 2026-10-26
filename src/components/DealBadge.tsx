import React from 'react';
import { DealLabel } from '../types';
import { Sparkles, TrendingDown, CheckCircle2, HelpCircle } from 'lucide-react';

interface DealBadgeProps {
  label: DealLabel;
  score?: number;
  size?: 'sm' | 'md' | 'lg';
  showScore?: boolean;
}

export const DealBadge: React.FC<DealBadgeProps> = ({
  label,
  score,
  size = 'md',
  showScore = false
}) => {
  const getBadgeConfig = () => {
    switch (label) {
      case 'Potential Deal':
        return {
          textColor: 'text-emerald-700',
          bgColor: 'bg-emerald-50',
          borderColor: 'border-emerald-200',
          dotColor: 'text-emerald-600',
          icon: Sparkles,
          description: 'Verified Below 90-Day Median'
        };
      case 'Price Drop':
        return {
          textColor: 'text-blue-700',
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
          dotColor: 'text-blue-600',
          icon: TrendingDown,
          description: 'Notable Downward Trend'
        };
      case 'Fair Market Value':
        return {
          textColor: 'text-slate-700',
          bgColor: 'bg-slate-100',
          borderColor: 'border-slate-200',
          dotColor: 'text-slate-500',
          icon: CheckCircle2,
          description: 'Typical Market Level'
        };
      case 'Insufficient Price History':
      default:
        return {
          textColor: 'text-amber-700',
          bgColor: 'bg-amber-50',
          borderColor: 'border-amber-200',
          dotColor: 'text-amber-600',
          icon: HelpCircle,
          description: '< 3 Price Records'
        };
    }
  };

  const config = getBadgeConfig();
  const Icon = config.icon;

  const sizeClasses = {
    sm: 'text-[11px] py-0.5 px-2 gap-1.5',
    md: 'text-xs py-1 px-2.5 gap-1.5',
    lg: 'text-sm py-1.5 px-3 gap-2 font-medium'
  };

  return (
    <span
      className={`inline-flex items-center font-medium rounded-md border ${config.bgColor} ${config.textColor} ${config.borderColor} ${sizeClasses[size]} whitespace-nowrap`}
    >
      <Icon className={`${size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} ${config.dotColor} shrink-0`} />
      <span>{label}</span>
      {showScore && score !== undefined && (
        <span className="font-mono text-[10px] opacity-75 tabular-nums">
          ({score}/100)
        </span>
      )}
    </span>
  );
};
