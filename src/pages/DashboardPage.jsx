import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { redistributionSuggestions } from '../data/mockData';
import HealthScoreRing from '../components/HealthScoreRing';
import { 
  Sparkles, 
  ArrowRight, 
  AlertCircle, 
  Bed, 
  AlertTriangle, 
  Hospital, 
  Activity,
  ArrowRightLeft,
  ChevronRight,
  Stethoscope
} from 'lucide-react';

export default function DashboardPage() {
  const { 
    centres, 
    stock, 
    asha, 
    activeAlerts, 
    dismissAlert, 
    criticalCount 
  } = useApp();
  const navigate = useNavigate();

  // Dynamic Telemetry Calculations
  const bedsTotal = centres.reduce((sum, c) => sum + c.bedsTotal, 0);
  const bedsOccupied = centres.reduce((sum, c) => sum + c.bedsOccupied, 0);
  const bedsAvailable = bedsTotal - bedsOccupied;

  const totalStockouts = Object.values(stock)
    .flat()
    .filter(s => s.currentStock / s.dailyConsumption < 7).length;

  const flaggedCentres = centres.filter(c => c.healthScore < 40);

  const ashaFlaggedCount = asha.filter(w => w.workerScore < 40 || w.suspiciousVisits > 3).length;

  // Render score tint backgrounds
  const getCardBg = (score) => {
    if (score < 40) return 'bg-danger/5 border-danger/40 animate-critical-pulse';
    if (score < 70) return 'bg-warning/5 border-warning/30 hover:border-warning/60';
    return 'bg-emerald/5 border-emerald/30 hover:border-emerald/60';
  };

  const getScoreColorClass = (score) => {
    if (score < 40) return 'text-danger';
    if (score < 70) return 'text-warning';
    return 'text-emerald';
  };

  return (
    <div className="space-y-6">
      
      {/* 1. KPI Telemetry Row */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
        
        {/* Active Alerts */}
        <div className="rounded-xl bg-surface border-l-4 border-danger border-y border-r border-border-col p-4 animate-card" style={{ animationDelay: '0ms' }}>
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold text-text-secondary uppercase tracking-wider">Active Alerts</span>
            <AlertCircle className="text-danger" size={16} />
          </div>
          <p className="mt-2 text-2xl font-bold font-mono text-text-primary">{activeAlerts.length}</p>
          <p className="mt-1 text-[10px] text-text-muted font-mono">{criticalCount} Critical status</p>
        </div>

        {/* Beds Available */}
        <div className="rounded-xl bg-surface border-l-4 border-emerald border-y border-r border-border-col p-4 animate-card" style={{ animationDelay: '50ms' }}>
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold text-text-secondary uppercase tracking-wider">Beds Available</span>
            <Bed className="text-emerald" size={16} />
          </div>
          <p className="mt-2 text-2xl font-bold font-mono text-text-primary">{bedsAvailable}</p>
          <p className="mt-1 text-[10px] text-text-muted font-mono">{bedsOccupied}/{bedsTotal} Occupied</p>
        </div>

        {/* Stock-outs */}
        <div className="rounded-xl bg-surface border-l-4 border-warning border-y border-r border-border-col p-4 animate-card" style={{ animationDelay: '100ms' }}>
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold text-text-secondary uppercase tracking-wider">Stock Warnings</span>
            <AlertTriangle className="text-warning" size={16} />
          </div>
          <p className="mt-2 text-2xl font-bold font-mono text-text-primary">{totalStockouts}</p>
          <p className="mt-1 text-[10px] text-text-muted font-mono">&lt; 7 Days stock left</p>
        </div>

        {/* Flagged Centres */}
        <div className="rounded-xl bg-surface border-l-4 border-danger border-y border-r border-border-col p-4 animate-card" style={{ animationDelay: '150ms' }}>
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold text-text-secondary uppercase tracking-wider">Centres Flagged</span>
            <Hospital className="text-danger" size={16} />
          </div>
          <p className="mt-2 text-2xl font-bold font-mono text-text-primary">{flaggedCentres.length}</p>
          <p className="mt-1 text-[10px] text-text-muted font-mono">Health Score &lt; 40</p>
        </div>

        {/* ASHA Visits */}
        <div className="rounded-xl bg-surface border-l-4 border-info border-y border-r border-border-col p-4 col-span-2 md:col-span-1 animate-card" style={{ animationDelay: '200ms' }}>
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold text-text-secondary uppercase tracking-wider">ASHA Workers Flagged</span>
            <Activity className="text-info" size={16} />
          </div>
          <p className="mt-2 text-2xl font-bold font-mono text-text-primary">{ashaFlaggedCount}</p>
          <p className="mt-1 text-[10px] text-text-muted font-mono">Suspicious logs or idle</p>
        </div>

      </div>

      {/* 2. AI Insight Banner */}
      <div className="rounded-xl border border-emerald/30 bg-emerald/5 p-4 animate-card" style={{ animationDelay: '250ms' }}>
        <div className="flex items-start gap-3">
          <div className="mt-0.5 rounded-lg bg-emerald/20 p-2 text-emerald">
            <Sparkles size={16} />
          </div>
          <div className="flex-1">
            <h3 className="text-xs font-bold text-emerald uppercase tracking-wider font-sans">
              District AI Daily Telemetry Analysis
            </h3>
            <p className="mt-1.5 text-xs font-mono leading-relaxed text-text-secondary">
              Vellore health grid: {flaggedCentres.length} centres (
              {flaggedCentres.map((c, i) => (
                <span key={c.id} className="font-bold text-text-primary">
                  {c.name}{i < flaggedCentres.length - 1 ? ', ' : ''}
                </span>
              ))}
              ) require immediate multi-system intervention. We flagged {totalStockouts} medicine shortages and recommended {redistributionSuggestions.length} stock redistribution transfers. Open VaaniBot at bottom-right for custom queries.
            </p>
          </div>
        </div>
      </div>

      {/* 3. Redistribution Suggestions Strip */}
      <div className="space-y-2 animate-card" style={{ animationDelay: '300ms' }}>
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold text-text-secondary uppercase tracking-widest flex items-center gap-1.5">
            <ArrowRightLeft size={14} className="text-emerald" />
            <span>AI stock Redistribution Suggestions</span>
          </h2>
          <button 
            onClick={() => navigate('/stock')} 
            className="text-[10px] font-semibold text-emerald hover:underline flex items-center gap-0.5"
          >
            <span>Configure transfers</span>
            <ChevronRight size={10} />
          </button>
        </div>
        
        {/* Horizontal scroll grid */}
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-none">
          {redistributionSuggestions.map((s, index) => (
            <div 
              key={index} 
              className="flex min-w-[280px] flex-col rounded-xl border border-border-col bg-surface p-3.5 shadow-md"
            >
              <div className="flex items-center justify-between">
                <span className={`rounded px-1.5 py-0.5 text-[8px] font-bold ${
                  s.urgency === 'CRITICAL' ? 'bg-danger text-white' : 
                  s.urgency === 'HIGH' ? 'bg-warning text-navy' : 'bg-info text-white'
                }`}>
                  {s.urgency}
                </span>
                <span className="text-[10px] font-mono text-text-muted">Transfer suggestion</span>
              </div>
              
              <div className="mt-2.5 flex items-center justify-between text-xs font-mono">
                <span className="font-semibold text-text-primary">{s.from}</span>
                <ArrowRight size={12} className="text-text-muted mx-1" />
                <span className="font-semibold text-text-primary">{s.to}</span>
              </div>
              
              <div className="mt-3 flex items-end justify-between border-t border-border-col/40 pt-2.5">
                <div>
                  <p className="text-[10px] text-text-muted font-sans">Medicine & Quantity</p>
                  <p className="text-xs font-bold text-emerald font-mono mt-0.5">{s.medicine}</p>
                </div>
                <span className="font-mono text-xs font-bold text-text-primary bg-navy px-2 py-0.5 rounded border border-border-col">
                  {s.quantity} units
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. District Heatmap (SIGNATURE ELEMENT) */}
      <div className="space-y-3 animate-card" style={{ animationDelay: '350ms' }}>
        <h2 className="text-xs font-bold text-text-secondary uppercase tracking-widest">
          District Health Heatmap (PHCs/CHCs)
        </h2>
        
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {centres.map((c, index) => {
            const bedPercent = Math.round((c.bedsOccupied / c.bedsTotal) * 100);
            
            return (
              <div
                key={c.id}
                onClick={() => navigate(`/centres/${c.id}`)}
                className={`group flex flex-col justify-between rounded-xl border p-5 shadow-lg cursor-pointer hover:scale-[1.02] transition-all duration-300 ${getCardBg(c.healthScore)}`}
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-sm text-text-primary group-hover:text-emerald transition-colors">
                        {c.name}
                      </h3>
                      <span className="mt-1 inline-flex rounded bg-navy px-1.5 py-0.5 text-[8px] font-bold text-text-muted font-mono">
                        {c.type} · {c.block}
                      </span>
                    </div>
                    <HealthScoreRing score={c.healthScore} size={56} />
                  </div>

                  {/* Telemetry info */}
                  <div className="mt-5 space-y-3 border-t border-border-col/20 pt-4">
                    {/* Beds */}
                    <div>
                      <div className="flex justify-between text-[10px] font-mono text-text-secondary">
                        <span>Beds Occupancy</span>
                        <span>{c.bedsOccupied}/{c.bedsTotal} ({bedPercent}%)</span>
                      </div>
                      <div className="mt-1.5 h-1.5 w-full rounded bg-navy overflow-hidden">
                        <div 
                          className={`h-full rounded transition-all duration-500 ${
                            bedPercent >= 100 ? 'bg-danger' : 
                            bedPercent > 80 ? 'bg-warning' : 'bg-emerald'
                          }`}
                          style={{ width: `${Math.min(100, bedPercent)}%` }}
                        />
                      </div>
                    </div>

                    {/* Doctors */}
                    <div className="flex items-center justify-between text-[10px] font-mono">
                      <span className="text-text-secondary flex items-center gap-1">
                        <Stethoscope size={10} className="text-text-muted" />
                        <span>Doctors Present</span>
                      </span>
                      <span className={`font-bold ${c.doctorsPresent === 0 ? 'text-danger font-bold animate-pulse' : 'text-text-primary'}`}>
                        {c.doctorsPresent} / {c.doctorsOnRoll}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-border-col/10 pt-3 text-[9px] text-text-muted font-mono">
                  <span>Last update: {new Date(c.lastUpdated).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                  <span className="text-emerald opacity-0 group-hover:opacity-100 transition-opacity">Drill Down &rarr;</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. Recent Alerts Panel */}
      <div className="rounded-xl border border-border-col bg-surface p-5 animate-card" style={{ animationDelay: '400ms' }}>
        <div className="flex items-center justify-between border-b border-border-col pb-3">
          <h2 className="text-xs font-bold text-text-primary uppercase tracking-wider flex items-center gap-1.5">
            <AlertCircle size={14} className="text-danger" />
            <span>Telemetry Alerts Feed (Last 4)</span>
          </h2>
          <button 
            onClick={() => navigate('/alerts')} 
            className="text-[10px] font-semibold text-emerald hover:underline"
          >
            All warnings ({activeAlerts.length})
          </button>
        </div>

        <div className="mt-4 divide-y divide-border-col/50">
          {activeAlerts.slice(0, 4).map((alert) => (
            <div key={alert.id} className="flex flex-col gap-2 py-3 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className={`rounded px-1.5 py-0.5 text-[8px] font-bold ${
                    alert.severity === 'CRITICAL' ? 'bg-danger/20 text-danger border border-danger/30' : 'bg-warning/20 text-warning border border-warning/30'
                  }`}>
                    {alert.severity}
                  </span>
                  <span className="text-xs font-bold text-text-primary font-mono">{alert.centreName}</span>
                  <span className="text-[9px] text-text-muted font-mono">
                    {new Date(alert.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </span>
                </div>
                <p className="mt-1 text-xs text-text-secondary leading-relaxed font-sans">{alert.message}</p>
              </div>
              
              <div className="flex items-center gap-3">
                <button
                  onClick={() => dismissAlert(alert.id)}
                  className="rounded border border-border-col bg-navy px-2.5 py-1 text-[10px] font-semibold text-text-secondary hover:bg-white/5 hover:text-text-primary transition-all cursor-pointer"
                >
                  Dismiss
                </button>
              </div>
            </div>
          ))}
          {activeAlerts.length === 0 && (
            <p className="py-4 text-center text-xs text-text-muted font-mono">No active warnings across district. System nominal.</p>
          )}
        </div>
      </div>

    </div>
  );
}
