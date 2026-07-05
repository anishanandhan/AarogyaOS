import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { getTranslation } from '../i18n/translations';
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
  Stethoscope,
  CheckCircle,
  Mic,
  Map,
  MessageSquare,
  Zap,
  Brain
} from 'lucide-react';

export default function DashboardPage() {
  const {
    centres,
    stock,
    asha,
    activeAlerts,
    dismissAlert,
    criticalCount,
    language,
    transfers,
    approveTransfer,
    userRole
  } = useApp();
  const navigate = useNavigate();
  const [approvedTransfers, setApprovedTransfers] = useState([]);

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

  const handleApproveTransfer = (suggestion) => {
    approveTransfer(suggestion);
    setApprovedTransfers([...approvedTransfers, `${suggestion.from}-${suggestion.to}-${suggestion.medicine}`]);
  };

  // Check if user can see WhatsApp feature (only District Admin)
  const canSeeWhatsApp = userRole === 'District Admin';

  // Check if user can see alerts (not ASHA Worker)
  const canSeeAlerts = userRole !== 'ASHA Worker';

  return (
    <div className="space-y-6">
      {/* AI-Powered Epic Features Section */}
      <div className={`grid grid-cols-1 ${canSeeWhatsApp ? 'md:grid-cols-3' : 'md:grid-cols-2'} gap-6 mb-8`}>
        
        {/* Voice AI Agent Card */}
        <div 
          onClick={() => {
            const vaaniBtn = document.querySelector('[title="Ask VaaniBot - AI Agent"]');
            if (vaaniBtn) vaaniBtn.click();
          }}
          className="group cursor-pointer rounded-2xl bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 p-6 border border-amber-200/50 shadow-lg hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 relative overflow-hidden"
        >
          {/* AI Badge */}
          <div className="absolute top-4 right-4 flex items-center gap-1 bg-amber-600 text-white px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wide">
            <Brain size={10} />
            <span>AI-Powered</span>
          </div>
          
          {/* Icon */}
          <div className="flex items-center justify-center mb-4">
            <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-lg">
              <Mic size={32} strokeWidth={2.5} />
              <div className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-yellow-400 text-amber-900">
                <Zap size={10} />
              </div>
            </div>
          </div>
          
          {/* Title */}
          <h3 className="text-lg font-extrabold text-slate-900 text-center mb-2 tracking-tight">
            Voice AI Agent
          </h3>
          
          {/* Description */}
          <p className="text-xs text-slate-600 text-center font-medium leading-relaxed">
            Multi-modal AI assistant with natural language voice commands and real-time action execution
          </p>
          
          {/* Tech Stack Indicator */}
          <div className="mt-4 pt-3 border-t border-amber-200/50 flex items-center justify-center gap-1.5 text-[9px] text-amber-700 font-semibold">
            <Sparkles size={10} />
            <span>Gemini AI • Speech-to-Text</span>
          </div>
        </div>

        {/* Live Map Card */}
        <div 
          onClick={() => navigate('/map')}
          className="group cursor-pointer rounded-2xl bg-gradient-to-br from-blue-50 via-cyan-50 to-indigo-50 p-6 border border-blue-200/50 shadow-lg hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 relative overflow-hidden"
        >
          {/* Live Badge */}
          <div className="absolute top-4 right-4 flex items-center gap-1 bg-blue-600 text-white px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wide">
            <span className="flex h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse"></span>
            <span>Live Data</span>
          </div>
          
          {/* Icon */}
          <div className="flex items-center justify-center mb-4">
            <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-600 text-white shadow-lg">
              <Map size={32} strokeWidth={2.5} />
            </div>
          </div>
          
          {/* Title */}
          <h3 className="text-lg font-extrabold text-slate-900 text-center mb-2 tracking-tight">
            Government Data Map
          </h3>
          
          {/* Description */}
          <p className="text-xs text-slate-600 text-center font-medium leading-relaxed">
            Real-time geospatial visualization of 500+ health facilities with data.gov.in integration
          </p>
          
          {/* Tech Stack Indicator */}
          <div className="mt-4 pt-3 border-t border-blue-200/50 flex items-center justify-center gap-1.5 text-[9px] text-blue-700 font-semibold">
            <Sparkles size={10} />
            <span>Google Maps • Earth Engine</span>
          </div>
        </div>

        {/* WhatsApp Alerts Card - Only for District Admin */}
        {canSeeWhatsApp && (
          <div
            onClick={() => navigate('/whatsapp')}
            className="group cursor-pointer rounded-2xl bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 p-6 border border-emerald-200/50 shadow-lg hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 relative overflow-hidden"
          >
            {/* Cloud Badge */}
            <div className="absolute top-4 right-4 flex items-center gap-1 bg-emerald-600 text-white px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wide">
              <Zap size={10} />
              <span>Cloud API</span>
            </div>

            {/* Icon */}
            <div className="flex items-center justify-center mb-4">
              <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 text-white shadow-lg">
                <MessageSquare size={32} strokeWidth={2.5} />
              </div>
            </div>

            {/* Title */}
            <h3 className="text-lg font-extrabold text-slate-900 text-center mb-2 tracking-tight">
              WhatsApp Alert System
            </h3>

            {/* Description */}
            <p className="text-xs text-slate-600 text-center font-medium leading-relaxed">
              Automated bulk notification system reaching 1000+ healthcare workers via WhatsApp Business API
            </p>

            {/* Tech Stack Indicator */}
            <div className="mt-4 pt-3 border-t border-emerald-200/50 flex items-center justify-center gap-1.5 text-[9px] text-emerald-700 font-semibold">
              <Sparkles size={10} />
              <span>WhatsApp Business API</span>
            </div>
          </div>
        )}

      </div>

      {/* 1. KPI Telemetry Row */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
        
        {/* Active Alerts */}
        <div className="rounded-xl bg-surface border-l-4 border-danger border-y border-r border-border-col p-4 animate-card" style={{ animationDelay: '0ms' }}>
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold text-text-secondary uppercase tracking-wider">{getTranslation('activeAlerts', language)}</span>
            <AlertCircle className="text-danger" size={16} />
          </div>
          <p className="mt-2 text-2xl font-bold font-mono text-text-primary">{activeAlerts.length}</p>
          <p className="mt-1 text-[10px] text-text-muted font-mono">{criticalCount} {getTranslation('criticalStatus', language)}</p>
        </div>

        {/* Beds Available */}
        <div className="rounded-xl bg-surface border-l-4 border-emerald border-y border-r border-border-col p-4 animate-card" style={{ animationDelay: '50ms' }}>
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold text-text-secondary uppercase tracking-wider">{getTranslation('bedsAvailable', language)}</span>
            <Bed className="text-emerald" size={16} />
          </div>
          <p className="mt-2 text-2xl font-bold font-mono text-text-primary">{bedsAvailable}</p>
          <p className="mt-1 text-[10px] text-text-muted font-mono">{bedsOccupied}/{bedsTotal} {getTranslation('occupied', language)}</p>
        </div>

        {/* Stock-outs */}
        <div className="rounded-xl bg-surface border-l-4 border-warning border-y border-r border-border-col p-4 animate-card" style={{ animationDelay: '100ms' }}>
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold text-text-secondary uppercase tracking-wider">{getTranslation('stockWarnings', language)}</span>
            <AlertTriangle className="text-warning" size={16} />
          </div>
          <p className="mt-2 text-2xl font-bold font-mono text-text-primary">{totalStockouts}</p>
          <p className="mt-1 text-[10px] text-text-muted font-mono">{getTranslation('daysStockLeft', language)}</p>
        </div>

        {/* Flagged Centres */}
        <div className="rounded-xl bg-surface border-l-4 border-danger border-y border-r border-border-col p-4 animate-card" style={{ animationDelay: '150ms' }}>
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold text-text-secondary uppercase tracking-wider">{getTranslation('centresFlagged', language)}</span>
            <Hospital className="text-danger" size={16} />
          </div>
          <p className="mt-2 text-2xl font-bold font-mono text-text-primary">{flaggedCentres.length}</p>
          <p className="mt-1 text-[10px] text-text-muted font-mono">{getTranslation('healthScoreLessThan40', language)}</p>
        </div>

        {/* ASHA Visits */}
        <div className="rounded-xl bg-surface border-l-4 border-info border-y border-r border-border-col p-4 col-span-2 md:col-span-1 animate-card" style={{ animationDelay: '200ms' }}>
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold text-text-secondary uppercase tracking-wider">{getTranslation('ashaWorkersFlagged', language)}</span>
            <Activity className="text-info" size={16} />
          </div>
          <p className="mt-2 text-2xl font-bold font-mono text-text-primary">{ashaFlaggedCount}</p>
          <p className="mt-1 text-[10px] text-text-muted font-mono">{getTranslation('suspiciousLogsOrIdle', language)}</p>
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
              {getTranslation('districtAITelemetry', language)}
            </h3>
            <p className="mt-1.5 text-xs font-mono leading-relaxed text-text-secondary">
              {getTranslation('telemetrySummaryPrefix', language).replace('{count}', flaggedCentres.length)}
              {flaggedCentres.map((c, i) => (
                <span key={c.id} className="font-bold text-text-primary">
                  {c.name}{i < flaggedCentres.length - 1 ? ', ' : ''}
                </span>
              ))}
              {getTranslation('telemetrySummarySuffix', language)
                .replace('{stockouts}', totalStockouts)
                .replace('{transfers}', transfers.length)}
            </p>
          </div>
        </div>
      </div>

      {/* 3. Redistribution Suggestions Strip */}
      <div className="space-y-2 animate-card" style={{ animationDelay: '300ms' }}>
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold text-text-secondary uppercase tracking-widest flex items-center gap-1.5">
            <ArrowRightLeft size={14} className="text-emerald" />
            <span>{getTranslation('aiStockRedistributionSuggestions', language)}</span>
          </h2>
          <button 
            onClick={() => navigate('/stock')} 
            className="text-[10px] font-semibold text-emerald hover:underline flex items-center gap-0.5"
          >
            <span>{getTranslation('configureTransfers', language)}</span>
            <ChevronRight size={10} />
          </button>
        </div>
        
        {/* Horizontal scroll grid */}
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-none">
          {transfers.map((s, index) => {
            const isApproved = approvedTransfers.includes(`${s.from}-${s.to}-${s.medicine}`);
            return (
              <div
                key={index}
                className={`flex min-w-[280px] flex-col rounded-xl border bg-surface p-3.5 shadow-md transition-all ${
                  isApproved ? 'border-emerald/40 bg-emerald/5' : 'border-border-col'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`rounded px-1.5 py-0.5 text-[8px] font-bold ${
                    s.urgency === 'CRITICAL' ? 'bg-danger text-white' :
                    s.urgency === 'HIGH' ? 'bg-warning text-navy' : 'bg-info text-white'
                  }`}>
                    {s.urgency}
                  </span>
                  <span className="text-[10px] font-mono text-text-muted">{getTranslation('transferSuggestion', language)}</span>
                </div>

                <div className="mt-2.5 flex items-center justify-between text-xs font-mono">
                  <span className="font-semibold text-text-primary">{s.from}</span>
                  <ArrowRight size={12} className="text-text-muted mx-1" />
                  <span className="font-semibold text-text-primary">{s.to}</span>
                </div>

                <div className="mt-3 flex items-end justify-between border-t border-border-col/40 pt-2.5">
                  <div>
                    <p className="text-[10px] text-text-muted font-sans">{getTranslation('medicineQuantity', language)}</p>
                    <p className="text-xs font-bold text-emerald font-mono mt-0.5">{s.medicine}</p>
                  </div>
                  <span className="font-mono text-xs font-bold text-text-primary bg-navy px-2 py-0.5 rounded border border-border-col">
                    {s.quantity} {getTranslation('units', language)}
                  </span>
                </div>

                {/* Approve Button */}
                <button
                  onClick={() => handleApproveTransfer(s)}
                  disabled={isApproved}
                  className={`mt-3 w-full rounded-lg py-2 text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
                    isApproved
                      ? 'bg-emerald/20 text-emerald border border-emerald/30 cursor-not-allowed'
                      : 'bg-emerald hover:bg-emerald/90 text-white border border-emerald cursor-pointer'
                  }`}
                >
                  {isApproved ? (
                    <>
                      <CheckCircle size={14} />
                      <span>{getTranslation('transferApproved', language)}</span>
                    </>
                  ) : (
                    <>
                      <span>{getTranslation('approveTransfer', language)}</span>
                      <ArrowRight size={14} />
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. District Heatmap (SIGNATURE ELEMENT) */}
      <div className="space-y-3 animate-card" style={{ animationDelay: '350ms' }}>
        <h2 className="text-xs font-bold text-text-secondary uppercase tracking-widest">
          {getTranslation('districtHealthHeatmap', language)}
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
                        <span>{getTranslation('bedsOccupancy', language)}</span>
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
                        <span>{getTranslation('doctorsPresent', language)}</span>
                      </span>
                      <span className={`font-bold ${c.doctorsPresent === 0 ? 'text-danger font-bold animate-pulse' : 'text-text-primary'}`}>
                        {c.doctorsPresent} / {c.doctorsOnRoll}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-border-col/10 pt-3 text-[9px] text-text-muted font-mono">
                  <span>{getTranslation('lastUpdate', language)}: {new Date(c.lastUpdated).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                  <span className="text-emerald opacity-0 group-hover:opacity-100 transition-opacity">{getTranslation('drillDown', language)} &rarr;</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. Recent Alerts Panel - Hidden for ASHA Workers */}
      {canSeeAlerts && (
        <div className="rounded-xl border border-border-col bg-surface p-5 animate-card" style={{ animationDelay: '400ms' }}>
          <div className="flex items-center justify-between border-b border-border-col pb-3">
            <h2 className="text-xs font-bold text-text-primary uppercase tracking-wider flex items-center gap-1.5">
              <AlertCircle size={14} className="text-danger" />
              <span>{getTranslation('telemetryAlertsFeed', language)}</span>
            </h2>
            <button
              onClick={() => navigate('/alerts')}
              className="text-[10px] font-semibold text-emerald hover:underline"
            >
              {getTranslation('allWarnings', language)} ({activeAlerts.length})
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
                    {getTranslation('dismiss', language)}
                  </button>
                </div>
              </div>
            ))}
            {activeAlerts.length === 0 && (
              <p className="py-4 text-center text-xs text-text-muted font-mono">{getTranslation('noActiveWarnings', language)}</p>
            )}
          </div>
        </div>
      )}


    </div>
  );
}
