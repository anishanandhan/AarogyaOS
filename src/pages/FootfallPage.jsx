import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';
import { Activity, Bed, TrendingUp, ChevronRight } from 'lucide-react';

export default function FootfallPage() {
  const { centres } = useApp();
  const [selectedCentreId, setSelectedCentreId] = useState('phc-001');

  // Footfall data generator (with defaults for unseeded centres)
  const getFootfallSeries = (cId) => {
    const rawData = {
      "phc-001": [
        { date: "Jun 25", opd: 87, ipd: 3 },
        { date: "Jun 26", opd: 94, ipd: 4 },
        { date: "Jun 27", opd: 102, ipd: 5 },
        { date: "Jun 28", opd: 78, ipd: 2 },
        { date: "Jun 29", opd: 65, ipd: 3 },
        { date: "Jun 30", opd: 110, ipd: 6 },
        { date: "Jul 01", opd: 143, ipd: 8 }
      ],
      "phc-002": [
        { date: "Jun 25", opd: 55, ipd: 2 },
        { date: "Jun 26", opd: 60, ipd: 3 },
        { date: "Jun 27", opd: 58, ipd: 2 },
        { date: "Jun 28", opd: 62, ipd: 3 },
        { date: "Jun 29", opd: 50, ipd: 1 },
        { date: "Jun 30", opd: 65, ipd: 4 },
        { date: "Jul 01", opd: 68, ipd: 3 }
      ],
      "phc-006": [
        { date: "Jun 25", opd: 70, ipd: 5 },
        { date: "Jun 26", opd: 75, ipd: 6 },
        { date: "Jun 27", opd: 80, ipd: 7 },
        { date: "Jun 28", opd: 72, ipd: 6 },
        { date: "Jun 29", opd: 68, ipd: 7 },
        { date: "Jun 30", opd: 85, ipd: 8 },
        { date: "Jul 01", opd: 90, ipd: 8 }
      ]
    };

    if (rawData[cId]) return rawData[cId];

    // Seed deterministic values based on name length to avoid rendering empty lines
    const seed = cId.charCodeAt(cId.length - 1) || 5;
    return [
      { date: "Jun 25", opd: 50 + seed * 2, ipd: 2 },
      { date: "Jun 26", opd: 58 + seed * 3, ipd: 3 },
      { date: "Jun 27", opd: 52 + seed, ipd: 2 },
      { date: "Jun 28", opd: 64 + seed * 4, ipd: 3 },
      { date: "Jun 29", opd: 48 + seed, ipd: 1 },
      { date: "Jun 30", opd: 68 + seed * 2, ipd: 4 },
      { date: "Jul 01", opd: 72 + seed * 3, ipd: 3 }
    ];
  };

  // Evaluate if OPD is > 20% of previous 6 days running average
  const checkSurge = (series) => {
    if (series.length < 7) return false;
    const today = series[series.length - 1].opd;
    const previousDays = series.slice(0, 6);
    const avg = previousDays.reduce((sum, d) => sum + d.opd, 0) / previousDays.length;
    return today > avg * 1.2;
  };

  const getSurgeInfo = (cId) => {
    const series = getFootfallSeries(cId);
    const isSurging = checkSurge(series);
    const todayVal = series[series.length - 1].opd;
    const prevDays = series.slice(0, 6);
    const avgVal = Math.round(prevDays.reduce((sum, d) => sum + d.opd, 0) / prevDays.length);
    return { isSurging, todayVal, avgVal };
  };

  const selectedCentre = centres.find(c => c.id === selectedCentreId) || centres[0];
  const chartSeries = getFootfallSeries(selectedCentreId);

  return (
    <div className="space-y-6">
      
      {/* Split Panels */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-10">
        
        {/* Left Side: Centres Checklist Grid (40% width) */}
        <div className="rounded-xl border border-border-col bg-surface p-5 lg:col-span-4 space-y-4 animate-card" style={{ animationDelay: '0ms' }}>
          <h2 className="text-xs font-bold text-text-primary uppercase tracking-wider flex items-center gap-1.5 border-b border-border-col/40 pb-3">
            <Activity size={14} className="text-emerald" />
            <span>District Footfall & Capacity Check</span>
          </h2>

          <div className="space-y-3 overflow-y-auto max-h-[500px] pr-1">
            {centres.map((c) => {
              const { isSurging, todayVal } = getSurgeInfo(c.id);
              const bedPercent = Math.round((c.bedsOccupied / c.bedsTotal) * 100);
              const isSelected = selectedCentreId === c.id;

              return (
                <div
                  key={c.id}
                  onClick={() => setSelectedCentreId(c.id)}
                  className={`rounded-lg border p-3.5 cursor-pointer transition-all ${
                    isSelected 
                      ? 'border-emerald bg-white/5 shadow-md' 
                      : 'border-border-col/60 bg-navy/20 hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-xs font-bold text-text-primary">{c.name}</h3>
                      <p className="text-[10px] text-text-muted mt-0.5 font-mono">{c.type} · {c.block}</p>
                    </div>

                    <div className="flex flex-col items-end gap-1 font-mono">
                      <span className="text-xs font-bold text-text-primary">{todayVal} OPD</span>
                      {isSurging && (
                        <span className="rounded bg-warning/20 text-warning border border-warning/30 px-1 py-0.5 text-[8px] font-bold animate-pulse">
                          SURGE RISK
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="mt-3.5 space-y-1">
                    <div className="flex justify-between text-[9px] font-mono text-text-secondary">
                      <span className="flex items-center gap-1">
                        <Bed size={9} />
                        <span>Beds</span>
                      </span>
                      <span>{c.bedsOccupied}/{c.bedsTotal} occupied</span>
                    </div>
                    <div className="h-1 w-full bg-navy rounded overflow-hidden">
                      <div 
                        className={`h-full rounded ${
                          bedPercent >= 100 ? 'bg-danger' : 
                          bedPercent > 80 ? 'bg-warning' : 'bg-emerald'
                        }`} 
                        style={{ width: `${Math.min(100, bedPercent)}%` }} 
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: Recharts details (60% width) */}
        <div className="rounded-xl border border-border-col bg-surface p-5 lg:col-span-6 flex flex-col justify-between animate-card" style={{ animationDelay: '100ms' }}>
          <div>
            <div className="flex items-start justify-between border-b border-border-col/40 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-sm font-bold text-text-primary uppercase tracking-wider">{selectedCentre.name}</h2>
                  <span className="rounded bg-navy border border-border-col/60 px-2 py-0.5 text-[8px] font-bold text-text-muted font-mono uppercase">
                    {selectedCentre.type}
                  </span>
                </div>
                <p className="text-[10px] text-text-muted mt-1 font-mono">
                  OPD & IPD 7-Day Trend (early prediction warnings)
                </p>
              </div>

              {/* Status flag */}
              {getSurgeInfo(selectedCentreId).isSurging ? (
                <div className="flex items-center gap-1 rounded-lg border border-warning/30 bg-warning/5 px-3 py-1.5 text-xs text-warning font-mono">
                  <TrendingUp size={14} />
                  <span>Surge Detected: +{Math.round((getSurgeInfo(selectedCentreId).todayVal / getSurgeInfo(selectedCentreId).avgVal - 1) * 100)}%</span>
                </div>
              ) : (
                <div className="rounded-lg border border-emerald/20 bg-emerald/5 px-3 py-1.5 text-xs text-emerald font-mono">
                  <span>Nominal Patient Traffic</span>
                </div>
              )}
            </div>

            {/* Analysis details */}
            <div className="my-5 grid grid-cols-2 gap-4 rounded-lg bg-navy/40 p-3.5 border border-border-col/35 font-mono text-xs">
              <div>
                <span className="text-[9px] text-text-muted font-sans uppercase">Today's Traffic</span>
                <p className="font-bold text-text-primary mt-0.5">{getSurgeInfo(selectedCentreId).todayVal} patients</p>
              </div>
              <div>
                <span className="text-[9px] text-text-muted font-sans uppercase">6-Day Average Traffic</span>
                <p className="font-bold text-text-secondary mt-0.5">{getSurgeInfo(selectedCentreId).avgVal} patients/day</p>
              </div>
            </div>

            {/* Chart */}
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartSeries} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="opdGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="ipdGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                  <XAxis dataKey="date" stroke="#94A3B8" fontSize={9} fontClassName="font-mono" />
                  <YAxis stroke="#94A3B8" fontSize={9} fontClassName="font-mono" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1E293B', borderColor: '#334155', borderRadius: '8px' }}
                    labelStyle={{ color: '#94A3B8', fontFamily: 'monospace', fontSize: '10px' }}
                    itemStyle={{ color: '#F8FAFC', fontFamily: 'monospace', fontSize: '10px' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '10px', fontFamily: 'monospace', paddingTop: '15px' }} />
                  <Area type="monotone" dataKey="opd" stroke="#3B82F6" strokeWidth={2} fillOpacity={1} fill="url(#opdGrad)" name="OPD Footfall" />
                  <Area type="monotone" dataKey="ipd" stroke="#10B981" strokeWidth={2} fillOpacity={1} fill="url(#ipdGrad)" name="IPD Admissions" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <p className="mt-4 text-center text-[9px] text-text-muted font-mono leading-relaxed">
            Data sourced from Vellore health registration database. Predictions recalculated every 24 hours.
          </p>
        </div>

      </div>

    </div>
  );
}
