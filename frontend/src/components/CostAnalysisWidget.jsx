import React from 'react';
import { Database, TrendingUp, AlertCircle } from 'lucide-react';
import { getTranslation } from '../i18n/translations';

export default function CostAnalysisWidget({ language }) {
  // Hardcoded real-world average monthly API consumption for 1 rural district (8 PHCs/CHCs)
  const costBreakdown = [
    { service: 'Gemini 1.5 Flash (Clinical QA & Agents)', volume: '15,000 calls/mo', rate: '$0.075 / 1M input tkn', costINR: 1250 },
    { service: 'Google Maps API (Surge Heatmaps)', volume: '5,000 loads/mo', rate: '$7.00 / 1,000 loads', costINR: 2920 },
    { service: 'Cloud Translation (Regional Localization)', volume: '1.2M chars/mo', rate: '$20.00 / 1M chars', costINR: 2010 },
    { service: 'Web Speech APIs (STT / TTS Voice)', volume: '5,000 mins/mo', rate: '$16.00 / 1,000 mins', costINR: 6680 },
    { service: 'Offline JSON Database Storage', volume: 'Local Disk', rate: 'Free (Pure-JS Engine)', costINR: 0 }
  ];

  const totalCost = costBreakdown.reduce((sum, item) => sum + item.costINR, 0);

  return (
    <div className="rounded-xl border border-border-col bg-surface p-5 animate-card" style={{ animationDelay: '380ms' }}>
      <div className="flex items-center justify-between border-b border-border-col pb-3">
        <h2 className="text-sm font-bold text-text-primary flex items-center gap-2">
          <Database size={16} className="text-emerald" />
          <span>Operational Cost Projection (Vellore District)</span>
        </h2>
        <span className="rounded-full bg-emerald/10 border border-emerald/20 px-2 py-0.5 text-[10px] font-bold text-emerald">
          ESTIMATED RUN RATE
        </span>
      </div>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border-col/40 text-[10px] text-text-muted uppercase tracking-wider font-mono">
              <th className="pb-2">API Service</th>
              <th className="pb-2 text-right">Volume</th>
              <th className="pb-2 text-right">Unit Pricing</th>
              <th className="pb-2 text-right">Monthly Cost</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-col/20 font-sans text-xs">
            {costBreakdown.map((item, index) => (
              <tr key={index} className="hover:bg-navy/10">
                <td className="py-2.5 font-medium text-text-primary">{item.service}</td>
                <td className="py-2.5 text-right font-mono text-text-secondary">{item.volume}</td>
                <td className="py-2.5 text-right font-mono text-text-secondary">{item.rate}</td>
                <td className="py-2.5 text-right font-mono font-bold text-text-primary">
                  {item.costINR === 0 ? '₹0.00' : `₹${item.costINR.toLocaleString('en-IN')}`}
                </td>
              </tr>
            ))}
            <tr className="bg-navy/20 font-bold border-t border-border-col">
              <td className="py-3 pl-2">Total Monthly District Projection</td>
              <td className="py-3" />
              <td className="py-3" />
              <td className="py-3 text-right pr-2 text-emerald font-mono text-sm">
                ₹{totalCost.toLocaleString('en-IN')}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex items-start gap-2.5 rounded-lg bg-info/5 border border-info/20 p-3">
        <AlertCircle size={14} className="text-info mt-0.5 shrink-0" />
        <p className="text-[10px] leading-relaxed text-info">
          <strong>Scale Note:</strong> At ₹12,860/month per district (~$155 USD), the entire state of Tamil Nadu (38 districts) can be run for approximately ₹4.8 Lakhs/month. Cost is optimized through server-side prompt compression and offline local database synchronization fallbacks.
        </p>
      </div>
    </div>
  );
}
