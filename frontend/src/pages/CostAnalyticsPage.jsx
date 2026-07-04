import React from 'react';
import { Database, TrendingUp, AlertCircle, LineChart, ShieldCheck, IndianRupee } from 'lucide-react';
import { getTranslation } from '../i18n/translations';
import { useApp } from '../context/AppContext';

export default function CostAnalyticsPage() {
  const { language } = useApp();

  const phcMonthlyCost = [
    { service: 'Gemini 1.5 Flash API', vol: '1,800 calls', rate: '$0.075 / 1M input', cost: 150 },
    { service: 'Google Maps JS API', vol: '600 loads', rate: '$7.00 / 1,000 loads', cost: 350 },
    { service: 'Cloud Translation API', vol: 150000, rate: '$20.00 / 1M chars', cost: 250 },
    { service: 'TTS / STT Voice APIs', vol: '600 minutes', rate: '$16.00 / 1,000 mins', cost: 800 },
    { service: 'JSON Database Storage', vol: 'Local File', rate: 'Zero Cost', cost: 0 }
  ];

  const districtMonthlyCost = phcMonthlyCost.map(item => ({
    ...item,
    vol: typeof item.vol === 'number' ? item.vol * 8 : '8x baseline',
    cost: item.cost * 8
  }));

  const stateMonthlyCost = phcMonthlyCost.map(item => ({
    ...item,
    vol: typeof item.vol === 'number' ? item.vol * 300 : '300x baseline',
    cost: item.cost * 300
  }));

  const totalPhc = phcMonthlyCost.reduce((s, i) => s + i.cost, 0);
  const totalDistrict = districtMonthlyCost.reduce((s, i) => s + i.cost, 0);
  const totalState = stateMonthlyCost.reduce((s, i) => s + i.cost, 0);

  const roiMetrics = [
    { benefit: 'ASHA Field Fraud Prevention', description: 'Photo-audit checks flagging location mismatches', monthlySavings: 45000, color: 'text-emerald' },
    { benefit: 'Prevented Drug Expirations', description: 'AI Stock redistribution transferring near-expiry drugs', monthlySavings: 65000, color: 'text-emerald' },
    { benefit: 'Prevented Stock-Out Emergencies', description: 'Early threshold alerts avoiding emergency local buying', monthlySavings: 80000, color: 'text-emerald' },
    { benefit: 'Optimized Staffing Roster Costs', description: 'Automated attendance escalations reducing pool doctor hires', monthlySavings: 35000, color: 'text-emerald' }
  ];

  const totalSavings = roiMetrics.reduce((s, i) => s + i.monthlySavings, 0);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between border-b border-border-col pb-4">
        <div>
          <h1 className="text-xl font-bold text-text-primary">System ROI & Cost Projections</h1>
          <p className="text-xs text-text-secondary mt-1">Detailed operational costs and estimated savings at district scale</p>
        </div>
        <div className="flex items-center gap-2 rounded-full bg-emerald/10 border border-emerald/20 px-3 py-1 text-xs font-semibold text-emerald">
          <ShieldCheck size={14} />
          <span>15x Cost-to-Savings Ratio</span>
        </div>
      </div>

      {/* Grid of Scales */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Single PHC */}
        <div className="rounded-xl border border-border-col bg-surface p-5 space-y-4">
          <div className="flex justify-between items-center border-b border-border-col pb-3">
            <h3 className="text-sm font-bold text-text-primary">1. Single PHC / CHC</h3>
            <span className="text-[10px] font-bold text-text-secondary">BASELINE</span>
          </div>
          <div className="text-2xl font-mono font-bold text-emerald">
            ₹{totalPhc.toLocaleString('en-IN')}<span className="text-xs text-text-muted">/mo</span>
          </div>
          <div className="space-y-2 text-xs">
            {phcMonthlyCost.map((item, idx) => (
              <div key={idx} className="flex justify-between py-1 border-b border-border-col/20 font-mono">
                <span className="text-text-secondary">{item.service}</span>
                <span className="font-bold text-text-primary">₹{item.cost}</span>
              </div>
            ))}
          </div>
        </div>

        {/* District Scale */}
        <div className="rounded-xl border border-border-col bg-surface p-5 space-y-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-emerald text-navy text-[8px] font-bold px-2 py-0.5 uppercase tracking-wide">
            RECOMMENDED FOR PILOT
          </div>
          <div className="flex justify-between items-center border-b border-border-col pb-3">
            <h3 className="text-sm font-bold text-text-primary">2. District (8 PHCs)</h3>
            <span className="text-[10px] font-bold text-emerald">ACTIVE TARGET</span>
          </div>
          <div className="text-2xl font-mono font-bold text-emerald">
            ₹{totalDistrict.toLocaleString('en-IN')}<span className="text-xs text-text-muted">/mo</span>
          </div>
          <div className="space-y-2 text-xs">
            {districtMonthlyCost.map((item, idx) => (
              <div key={idx} className="flex justify-between py-1 border-b border-border-col/20 font-mono">
                <span className="text-text-secondary">{item.service}</span>
                <span className="font-bold text-text-primary">₹{item.cost}</span>
              </div>
            ))}
          </div>
        </div>

        {/* State Scale */}
        <div className="rounded-xl border border-border-col bg-surface p-5 space-y-4">
          <div className="flex justify-between items-center border-b border-border-col pb-3">
            <h3 className="text-sm font-bold text-text-primary">3. State-wide (300 PHCs)</h3>
            <span className="text-[10px] font-bold text-text-secondary">SCALED</span>
          </div>
          <div className="text-2xl font-mono font-bold text-emerald">
            ₹{totalState.toLocaleString('en-IN')}<span className="text-xs text-text-muted">/mo</span>
          </div>
          <div className="space-y-2 text-xs">
            {stateMonthlyCost.map((item, idx) => (
              <div key={idx} className="flex justify-between py-1 border-b border-border-col/20 font-mono">
                <span className="text-text-secondary">{item.service}</span>
                <span className="font-bold text-text-primary">₹{item.cost}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ROI & Benefit Matrix */}
      <div className="rounded-xl border border-border-col bg-surface p-5">
        <div className="flex items-center gap-2 border-b border-border-col pb-3 mb-4">
          <LineChart size={16} className="text-emerald" />
          <h2 className="text-sm font-bold text-text-primary">Return on Investment (ROI) Projections</h2>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Benefit Cards */}
          <div className="space-y-3">
            {roiMetrics.map((m, idx) => (
              <div key={idx} className="rounded-lg border border-border-col bg-navy/30 p-3.5 flex justify-between items-center">
                <div>
                  <h4 className="text-xs font-bold text-text-primary">{m.benefit}</h4>
                  <p className="text-[10px] text-text-secondary mt-0.5">{m.description}</p>
                </div>
                <div className="text-right font-mono font-bold text-emerald text-xs shrink-0">
                  +₹{m.monthlySavings.toLocaleString('en-IN')}/mo
                </div>
              </div>
            ))}
          </div>

          {/* ROI Chart Mock & Summary */}
          <div className="rounded-lg border border-border-col bg-navy/20 p-4 flex flex-col justify-between">
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-text-primary flex items-center gap-1.5">
                <TrendingUp size={14} className="text-emerald" />
                <span>Financial Impact Summary</span>
              </h4>
              <p className="text-[11px] text-text-secondary leading-relaxed">
                By deploying AarogyaOS at a district scale (8 PHCs/CHCs), the total operational cost of **₹12,860/month** is offset by **₹2,25,000/month** in direct savings. This represents a net saving of **₹2.12 Lakhs/month** for the district administration.
              </p>
            </div>
            
            <div className="mt-4 border-t border-border-col/40 pt-3 flex justify-between items-center text-xs">
              <div>
                <span className="text-[10px] text-text-secondary font-sans uppercase">Total Savings Target</span>
                <p className="text-lg font-mono font-bold text-emerald">₹2,25,000<span className="text-xs font-normal text-text-muted">/mo</span></p>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-text-secondary font-sans uppercase">Net Monthly Gain</span>
                <p className="text-lg font-mono font-bold text-emerald">+₹2,12,140<span className="text-xs font-normal text-text-muted">/mo</span></p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-5 flex items-start gap-2.5 rounded-lg bg-info/5 border border-info/20 p-3 text-xs text-info">
          <AlertCircle size={14} className="mt-0.5 shrink-0" />
          <p className="leading-relaxed text-[11px]">
            <strong>Scalability Note:</strong> Moving to the PWA Offline database architecture decreases API billing by caching repeat queries locally and batching ASHA photo-verification loads, reducing GCloud resource requirements by up to 60%.
          </p>
        </div>
      </div>
    </div>
  );
}
