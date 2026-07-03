import { useApp } from '../context/AppContext';
import { getTranslation } from '../i18n/translations';
import { labTests } from '../data/mockData';
import { Beaker, Check, X, Calendar, AlertTriangle } from 'lucide-react';

export default function LabsPage() {
  const { labs, centres, language } = useApp();

  // Helper to compute number of available tests for a centre
  const getAvailableCount = (centreId) => {
    const centreLabs = labs[centreId] || {};
    return Object.keys(centreLabs).filter(k => k !== 'lastAudit' && centreLabs[k] === true).length;
  };

  // Helper to compute column totals (how many centres have this test)
  const getTestDistrictTotal = (testName) => {
    let total = 0;
    centres.forEach(c => {
      const centreLabs = labs[c.id] || {};
      if (centreLabs[testName] === true) total++;
    });
    return total;
  };

  // Helper to check if an audit is overdue (days since lastAudit > 30)
  const checkAuditOverdue = (lastAuditStr) => {
    if (!lastAuditStr) return { overdue: true, days: 999 };
    const auditDate = new Date(lastAuditStr);
    const today = new Date();
    const diffTime = Math.abs(today - auditDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return { overdue: diffDays > 30, days: diffDays };
  };

  return (
    <div className="space-y-8">
      
      {/* SECTION 1: DISTRICT MATRIX */}
      <div className="rounded-xl border border-border-col bg-surface p-5 space-y-4 animate-card" style={{ animationDelay: '0ms' }}>
        <div className="border-b border-border-col/40 pb-3">
          <h2 className="text-xs font-bold text-text-primary uppercase tracking-wider flex items-center gap-1.5">
            <Beaker size={14} className="text-emerald" />
            <span>{getTranslation('districtDiagnosticAvailabilityMatrix', language)}</span>
          </h2>
          <p className="text-[10px] text-text-muted mt-1 font-mono">
            {getTranslation('crossGridAuditMapping', language)}
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono border-collapse">
            <thead>
              <tr className="bg-navy/80 text-text-secondary uppercase text-[9px] border-b border-border-col/50">
                <th className="p-3 text-left min-w-[150px]">{getTranslation('centre', language)}</th>
                {labTests.map(t => (
                  <th key={t} className="p-3 text-center text-[8px] max-w-[65px] font-sans truncate" title={t}>
                    {t.split(' ')[0]}
                  </th>
                ))}
                <th className="p-3 text-right">{getTranslation('available', language)}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-col/40">
              {centres.map((c) => {
                const centreLabs = labs[c.id] || {};
                const count = getAvailableCount(c.id);
                
                return (
                  <tr key={c.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-3 font-bold text-text-primary">{c.name}</td>
                    {labTests.map((t) => {
                      const avail = centreLabs[t] === true;
                      return (
                        <td key={t} className="p-3 text-center">
                          <div className="flex justify-center">
                            {avail ? (
                              <div className="flex h-5 w-5 items-center justify-center rounded bg-emerald/10 text-emerald">
                                <Check size={12} />
                              </div>
                            ) : (
                              <div className="flex h-5 w-5 items-center justify-center rounded bg-danger/10 text-danger">
                                <X size={10} />
                              </div>
                            )}
                          </div>
                        </td>
                      );
                    })}
                    <td className="p-3 text-right font-bold text-text-primary">{count} / 10</td>
                  </tr>
                );
              })}

              {/* DISTRICT TOTALS ROW */}
              <tr className="bg-navy/50 font-bold border-t border-border-col">
                <td className="p-3 text-text-secondary uppercase text-[9px]">{getTranslation('districtTotals', language)}</td>
                {labTests.map(t => {
                  const tot = getTestDistrictTotal(t);
                  return (
                    <td key={t} className="p-3 text-center text-text-primary">
                      {tot} / {centres.length}
                    </td>
                  );
                })}
                <td className="p-3 text-right text-emerald">
                  {Math.round(centres.reduce((sum, c) => sum + getAvailableCount(c.id), 0) / (centres.length * 10) * 100)}%
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* SECTION 2: CENTRE CARDS & OVERDUE AUDITS */}
      <div className="space-y-3 animate-card" style={{ animationDelay: '50ms' }}>
        <h2 className="text-xs font-bold text-text-secondary uppercase tracking-widest">
          {getTranslation('labAuditRegistryOverdueFlags', language)}
        </h2>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {centres.map((c) => {
            const count = getAvailableCount(c.id);
            const auditDate = labs[c.id]?.lastAudit || '2025-06-01';
            const { overdue, days } = checkAuditOverdue(auditDate);

            return (
              <div 
                key={c.id} 
                className={`rounded-xl border p-4 flex flex-col justify-between shadow-md transition-all ${
                  overdue 
                    ? 'bg-danger/5 border-danger/40 animate-critical-pulse' 
                    : 'bg-surface border-border-col'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between">
                    <h3 className="font-bold text-xs text-text-primary">{c.name}</h3>
                    <span className={`rounded-full px-2 py-0.5 text-[8.5px] font-bold ${
                      count < 5 ? 'bg-danger text-white' : count < 8 ? 'bg-warning text-navy' : 'bg-emerald text-navy'
                    }`}>
                      {count}/10
                    </span>
                  </div>

                  <p className="mt-2 text-[10px] text-text-secondary font-mono">
                    {getTranslation('testsStatus', language)}: {count === 10 ? getTranslation('fullyEquipped', language) : `${10 - count} ${getTranslation('testKitsMissing', language)}`}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-border-col/20 flex items-center justify-between text-[9px] font-mono">
                  <span className="text-text-muted flex items-center gap-1">
                    <Calendar size={10} />
                    <span>{getTranslation('audited', language)} {days}{getTranslation('dAgo', language)}</span>
                  </span>

                  {overdue ? (
                    <span className="rounded bg-danger/10 border border-danger/35 text-danger px-1.5 py-0.5 text-[8px] font-bold animate-pulse flex items-center gap-0.5">
                      <AlertTriangle size={8} />
                      <span>{getTranslation('overdue', language)}</span>
                    </span>
                  ) : (
                    <span className="text-emerald font-bold">{getTranslation('nominal', language)}</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
