import React from 'react';
import { 
  Cpu, Database, ShieldCheck, Code2, Server, CheckCircle2, 
  Layers, Terminal, FileText, ArrowRight, ExternalLink 
} from 'lucide-react';

interface AboutPageProps {
  onNavigatePage: (page: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigatePage }) => {
  return (
    <div className="space-y-12 py-6 max-w-5xl mx-auto">
      {/* Title Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-200">
          <FileText className="w-3.5 h-3.5" />
          <span>Computer Science & Engineering Project Report Documentation</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Smart Price Comparison & Deal Intelligence Platform
        </h1>
        <p className="text-sm text-slate-600 max-w-2xl mx-auto leading-relaxed">
          DealWise: An explainable multi-retailer price aggregator and temporal volatility analyzer designed to protect consumers from artificial discounts and deceptive online pricing.
        </p>
      </div>

      {/* 1. Problem Statement & Objectives */}
      <section className="bg-white rounded-2xl border border-slate-200/90 p-8 shadow-xs space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <span className="w-6 h-6 rounded-md bg-blue-600 text-white text-xs flex items-center justify-center font-bold">1</span>
            Problem Statement & Objectives
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-600 leading-relaxed">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2">
            <h3 className="font-bold text-slate-900 text-sm">The Problem</h3>
            <p>
              In contemporary e-commerce, consumers suffer from two major friction points:
            </p>
            <ul className="list-disc pl-4 space-y-1 text-slate-600">
              <li><strong>Artificial Reference Pricing:</strong> Retailers artificially inflate Manufacturer Suggested Retail Prices (MSRP) to proclaim fake 40%–50% flash discounts.</li>
              <li><strong>Fragmentation:</strong> Shoppers must manually cross-examine 5–10 browser tabs across competing retailers to determine true delivered costs (including hidden shipping fees).</li>
            </ul>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2">
            <h3 className="font-bold text-slate-900 text-sm">Project Objectives</h3>
            <p>
              This CSE capstone project establishes a transparent system with four core engineering goals:
            </p>
            <ul className="list-disc pl-4 space-y-1 text-slate-600">
              <li><strong>Unified Ingestion:</strong> Aggregate standardized offers across competing electronic and appliance retailers into a single canonical product model.</li>
              <li><strong>Deterministic Deal Intelligence:</strong> Develop an explainable rule-based algorithm that evaluates current offers against true 90-day historical medians.</li>
              <li><strong>Temporal Volatility Auditing:</strong> Render historical price curves with benchmark reference lines (historical floor vs. median).</li>
              <li><strong>Target Price Alerts:</strong> Provide user watchlists with target price thresholds.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* 2. System Architecture & Workflow */}
      <section className="bg-white rounded-2xl border border-slate-200/90 p-8 shadow-xs space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <span className="w-6 h-6 rounded-md bg-blue-600 text-white text-xs flex items-center justify-center font-bold">2</span>
            System Architecture & Data Pipeline
          </h2>
        </div>

        {/* Visual Architecture Flow */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center text-xs">
          <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center mx-auto font-bold">
              01
            </div>
            <h3 className="font-bold text-slate-900">Ingestion Layer</h3>
            <p className="text-slate-600 text-[11px]">
              Multi-store product feeds (price, shipping fee, stock, timestamp) received via REST endpoints.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-indigo-50/70 border border-indigo-200 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center mx-auto font-bold">
              02
            </div>
            <h3 className="font-bold text-slate-900">Normalization</h3>
            <p className="text-slate-600 text-[11px]">
              Canonical schema resolution: specifications matching, total landed cost computation (Total Price = Base Price + Delivery Fee).
            </p>
          </div>

          <div className="p-4 rounded-xl bg-purple-50/70 border border-purple-200 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-purple-600 text-white flex items-center justify-center mx-auto font-bold">
              03
            </div>
            <h3 className="font-bold text-slate-900">Rule Intelligence</h3>
            <p className="text-slate-600 text-[11px]">
              Statistical evaluation against 90-day median price, historical floor minimum price, and threshold classification.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center mx-auto font-bold">
              04
            </div>
            <h3 className="font-bold text-slate-900">Presentation Layer</h3>
            <p className="text-slate-600 text-[11px]">
              React 19 SPA, Recharts temporal charts, explainable rationale cards, and watchlist synchronization.
            </p>
          </div>
        </div>
      </section>

      {/* 3. Deal Intelligence Rule Formulation (Explainability) */}
      <section className="bg-white rounded-2xl border border-slate-200/90 p-8 shadow-xs space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <span className="w-6 h-6 rounded-md bg-blue-600 text-white text-xs flex items-center justify-center font-bold">3</span>
            Deal Intelligence Algorithm & Mathematical Formulation
          </h2>
        </div>

        <div className="space-y-4 text-xs text-slate-600 leading-relaxed">
          <p>
            Unlike opaque proprietary systems that claim black-box AI predictions, DealWise employs a <strong>deterministic, explainable rule engine</strong> adhering to strict consumer protection guidelines:
          </p>

          <div className="p-4 bg-slate-900 text-slate-100 rounded-xl font-mono text-xs space-y-3 overflow-x-auto">
            <div>// Step 1: Compute Statistical Baselines</div>
            <div>P_lowest  = min(RetailerOffers.price)</div>
            <div>P_median  = median(HistoricalPrices[past_90_days])</div>
            <div>P_min     = min(HistoricalPrices[past_90_days])</div>
            <div>Discount_hist = ((P_median - P_lowest) / P_median) * 100</div>
            <div><br />// Step 2: Deterministic Decision Matrix</div>
            <div>IF (history_samples &lt; 3) THEN Label = &apos;Insufficient Price History&apos;</div>
            <div>ELSE IF (P_lowest &le; P_min AND Discount_hist &ge; 8%) THEN Label = &apos;Potential Deal&apos; (Score: 80 - 96)</div>
            <div>ELSE IF (Discount_hist &ge; 5%) THEN Label = &apos;Price Drop&apos; (Score: 70 - 88)</div>
            <div>ELSE Label = &apos;Fair Market Value&apos; (Score: 40 - 65)</div>
          </div>

          <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl text-blue-900 text-xs">
            <strong>Anti-AI Slop & Transparency Guarantee:</strong> A product never receives a &apos;Potential Deal&apos; or &apos;Price Drop&apos; label based on nominal MSRP alone, completely neutralising artificial discount inflation tactics.
          </div>
        </div>
      </section>

      {/* 4. Implementation Matrix */}
      <section className="bg-white rounded-2xl border border-slate-200/90 p-8 shadow-xs space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <span className="w-6 h-6 rounded-md bg-blue-600 text-white text-xs flex items-center justify-center font-bold">4</span>
            Feature Implementation & Scope Demarcation
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold">
              <tr>
                <th className="py-2.5 px-4">Feature Component</th>
                <th className="py-2.5 px-4">Implementation Status</th>
                <th className="py-2.5 px-4">Technical Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="py-3 px-4 font-semibold text-slate-900">Multi-Store Search & Filtering</td>
                <td className="py-3 px-4 text-emerald-700 font-semibold">Implemented & Active</td>
                <td className="py-3 px-4 text-slate-600">Keyword search across titles, brands, categories, and technical specs</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold text-slate-900">Side-by-Side Product Comparison</td>
                <td className="py-3 px-4 text-emerald-700 font-semibold">Implemented & Active</td>
                <td className="py-3 px-4 text-slate-600">2 to 4 product comparative matrix comparing specs, offers, and savings</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold text-slate-900">Temporal Volatility Recharts</td>
                <td className="py-3 px-4 text-emerald-700 font-semibold">Implemented & Active</td>
                <td className="py-3 px-4 text-slate-600">Interactive SVG line charts with median and historical floor reference lines</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold text-slate-900">Deal Intelligence Scoring</td>
                <td className="py-3 px-4 text-emerald-700 font-semibold">Implemented & Active</td>
                <td className="py-3 px-4 text-slate-600">Deterministic algorithm with natural language plain-text explainability</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold text-slate-900">Target Price Alerts & Watchlist</td>
                <td className="py-3 px-4 text-emerald-700 font-semibold">Implemented & Active</td>
                <td className="py-3 px-4 text-slate-600">Watchlist dashboard with target met indicators and local/server sync</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold text-slate-900">Live Ingestion Testbench</td>
                <td className="py-3 px-4 text-emerald-700 font-semibold">Implemented & Active</td>
                <td className="py-3 px-4 text-slate-600">Interactive simulator to test real-time price updates during project viva</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold text-slate-900">Production Retailer Affiliate APIs</td>
                <td className="py-3 px-4 text-amber-700 font-semibold">External API Config Required</td>
                <td className="py-3 px-4 text-slate-600">Designed to consume Amazon PA-API, Best Buy Developer API, and eBay Buy APIs</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Action links */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 bg-slate-900 text-white rounded-2xl">
        <div>
          <h3 className="font-bold text-sm">Ready for Project Demonstration</h3>
          <p className="text-xs text-slate-400 mt-0.5">Explore the interactive analytics dashboard or test price updates live.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigatePage('analytics')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
          >
            Open Analytics & Simulator &rarr;
          </button>
        </div>
      </div>
    </div>
  );
};
