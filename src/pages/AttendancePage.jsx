import { useApp } from '../context/AppContext';
import { CalendarDays, AlertCircle, RefreshCw, Stethoscope } from 'lucide-react';

export default function AttendancePage() {
  const { attendance, logAttendance, centres } = useApp();

  // Sorting: ABSENT doctors first, then by consecutiveAbsent descending, then present
  const sortedRoster = [...attendance].sort((a, b) => {
    if (a.status === 'ABSENT' && b.status === 'PRESENT') return -1;
    if (a.status === 'PRESENT' && b.status === 'ABSENT') return 1;
    if (a.status === 'ABSENT' && b.status === 'ABSENT') {
      return b.consecutiveAbsent - a.consecutiveAbsent;
    }
    return a.doctor.localeCompare(b.doctor);
  });

  // Identify doctors with 3+ days of consecutive absence
  const absentEscalations = attendance.filter(a => a.status === 'ABSENT' && a.consecutiveAbsent >= 3);

  // Suggest replacements from same block or nearby centres
  const getReplacementRecommendation = (absentDoc) => {
    const absentCentre = centres.find(c => c.name === absentDoc.centreName);
    if (!absentCentre) return 'Check district roster';

    // Find doctors in the same block who are PRESENT today
    const availableDocs = attendance.filter(a => 
      a.centreId !== absentDoc.centreId && 
      a.status === 'PRESENT' && 
      a.specialization === absentDoc.specialization
    );

    if (availableDocs.length > 0) {
      return `Reassign ${availableDocs[0].doctor} from ${availableDocs[0].centreName} temporarily.`;
    }

    // Secondary search: Any GENERAL MEDICINE doctor present in the block
    const fallbackDocs = attendance.filter(a => 
      a.centreId !== absentDoc.centreId && 
      a.status === 'PRESENT'
    );

    if (fallbackDocs.length > 0) {
      return `Deploy ${fallbackDocs[0].doctor} (${fallbackDocs[0].specialization}) from ${fallbackDocs[0].centreName} as relief.`;
    }

    return 'No available doctors in nearby blocks. Request district pool mobilization.';
  };

  // Staff-to-patient ratio: doctorsPresent : today's OPD
  const getStaffRatio = (c) => {
    // Get OPD (use static values or approximate based on seeded mock data)
    const opdMap = {
      "phc-001": 143,
      "phc-002": 68,
      "phc-006": 90,
      "phc-003": 75,
      "phc-004": 82,
      "phc-005": 58,
      "chc-001": 195,
      "chc-002": 150
    };
    const opd = opdMap[c.id] || 60;
    const ratio = c.doctorsPresent > 0 ? Math.round(opd / c.doctorsPresent) : opd;
    return {
      ratioText: `${c.doctorsPresent} present : ${opd} OPD`,
      severityClass: c.doctorsPresent === 0 ? 'text-danger font-bold' : ratio > 60 ? 'text-warning font-semibold' : 'text-emerald',
      loadText: c.doctorsPresent === 0 ? 'CRITICAL (No Doctor)' : ratio > 60 ? 'High load' : 'Optimal load'
    };
  };

  return (
    <div className="space-y-6">
      
      {/* 2-Column Split */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-10">
        
        {/* Left: Check-in Sheet (70%) */}
        <div className="rounded-xl border border-border-col bg-surface p-5 lg:col-span-7 space-y-4 animate-card" style={{ animationDelay: '0ms' }}>
          <h2 className="text-xs font-bold text-text-primary uppercase tracking-wider flex items-center gap-1.5 border-b border-border-col/40 pb-3">
            <CalendarDays size={14} className="text-emerald" />
            <span>District Doctor Check-in sheet</span>
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-navy/80 text-text-secondary uppercase text-[10px]">
                <tr>
                  <th className="p-3">Doctor</th>
                  <th className="p-3">Centre</th>
                  <th className="p-3">Specialization</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Absence Streak</th>
                  <th className="p-3 text-right">Roster Toggle</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-col/40">
                {sortedRoster.map((doc) => {
                  const isAbsent = doc.status === 'ABSENT';
                  return (
                    <tr key={`${doc.centreId}-${doc.doctor}`} className="hover:bg-white/5 transition-colors">
                      <td className="p-3 font-bold text-text-primary">{doc.doctor}</td>
                      <td className="p-3 text-text-secondary">{doc.centreName}</td>
                      <td className="p-3 text-text-muted">{doc.specialization}</td>
                      <td className="p-3">
                        <span className={`rounded-full px-2 py-0.5 text-[8px] font-bold ${
                          isAbsent ? 'bg-danger/10 text-danger border border-danger/25' : 'bg-emerald/10 text-emerald border border-emerald/25'
                        }`}>
                          {doc.status}
                        </span>
                      </td>
                      <td className={`p-3 font-bold ${isAbsent && doc.consecutiveAbsent >= 3 ? 'text-danger animate-pulse' : 'text-text-muted'}`}>
                        {doc.consecutiveAbsent > 0 ? `${doc.consecutiveAbsent} days` : '-'}
                      </td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => logAttendance(doc.centreId, doc.doctor, isAbsent ? 'PRESENT' : 'ABSENT')}
                          className="rounded border border-border-col bg-navy px-2.5 py-1 text-[10px] hover:bg-white/5 hover:text-white transition-all cursor-pointer"
                        >
                          Mark {isAbsent ? 'Present' : 'Absent'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Escalations & Staff Ratios (30%) */}
        <div className="space-y-6 lg:col-span-3">
          
          {/* Active absence crises */}
          <div className="rounded-xl border border-border-col bg-surface p-5 space-y-4 animate-card" style={{ animationDelay: '100ms' }}>
            <h2 className="text-xs font-bold text-text-primary uppercase tracking-wider flex items-center gap-1.5 border-b border-border-col/40 pb-3">
              <AlertCircle size={14} className="text-danger animate-pulse" />
              <span>Absence Escalations</span>
            </h2>

            <div className="space-y-4 max-h-[220px] overflow-y-auto pr-1">
              {absentEscalations.map((doc, idx) => (
                <div 
                  key={idx} 
                  className="rounded-lg border border-danger/35 bg-danger/5 p-3.5 space-y-2 text-xs font-mono"
                >
                  <div className="flex items-center justify-between text-danger font-bold">
                    <span>STREAK: {doc.consecutiveAbsent} DAYS</span>
                    <AlertCircle size={12} />
                  </div>
                  
                  <div>
                    <h3 className="font-bold text-text-primary">{doc.doctor}</h3>
                    <p className="text-[10px] text-text-secondary mt-0.5">{doc.centreName} · {doc.specialization}</p>
                  </div>

                  <div className="border-t border-border-col/40 pt-2.5 mt-2 space-y-1">
                    <span className="text-[8px] font-semibold text-warning uppercase font-sans">
                      AI Replacement Recommendation
                    </span>
                    <p className="text-[10px] text-text-secondary leading-relaxed font-sans font-medium">
                      {getReplacementRecommendation(doc)}
                    </p>
                  </div>
                </div>
              ))}

              {absentEscalations.length === 0 && (
                <p className="text-center text-xs text-text-muted font-mono py-4">No critical doctor absences detected. Roster stable.</p>
              )}
            </div>
          </div>

          {/* Staff to Patient Ratio indicator */}
          <div className="rounded-xl border border-border-col bg-surface p-5 space-y-4 animate-card" style={{ animationDelay: '150ms' }}>
            <h2 className="text-xs font-bold text-text-primary uppercase tracking-wider flex items-center gap-1.5 border-b border-border-col/40 pb-3">
              <Stethoscope size={14} className="text-emerald" />
              <span>Staffing-to-Patient Load</span>
            </h2>

            <div className="space-y-3 max-h-[240px] overflow-y-auto pr-1">
              {centres.map((c) => {
                const ratio = getStaffRatio(c);
                return (
                  <div key={c.id} className="flex items-center justify-between rounded-lg bg-navy/30 p-2.5 border border-border-col/40 text-xs font-mono">
                    <div>
                      <span className="font-bold text-text-primary">{c.name}</span>
                      <p className="text-[9px] text-text-muted mt-0.5">{ratio.ratioText}</p>
                    </div>
                    <span className={`text-[10px] font-bold ${ratio.severityClass}`}>
                      {ratio.loadText}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
