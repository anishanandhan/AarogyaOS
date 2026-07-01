import { useState } from 'react';
import { useApp } from '../context/AppContext';
import HealthScoreRing from '../components/HealthScoreRing';
import { verifyVisitPhoto } from '../services/gemini';
import { 
  Heart, 
  MapPin, 
  Table, 
  AlertTriangle, 
  UploadCloud, 
  Camera, 
  CheckCircle,
  HelpCircle,
  FileSpreadsheet
} from 'lucide-react';

export default function AshaPage() {
  const { asha, visits, submitVisitLog } = useApp();

  // Local state for the verification upload form
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedWorkerId, setSelectedWorkerId] = useState('asha-001');
  const [householdId, setHouseholdId] = useState('HH-1049');
  const [visitType, setVisitType] = useState('ANC Checkup');
  const [notes, setNotes] = useState('Routine blood sugar test and vitamins supply.');
  const [imageFile, setImageFile] = useState(null);
  const [base64Image, setBase64Image] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  
  // Results modal state
  const [verificationResult, setVerificationResult] = useState(null);

  // Section 2: Block coverage aggregation
  const blocks = [
    { name: 'Tambaram', ashaCount: 2, visits: 23, coverage: 78, hasZeroVisitWorker: false },
    { name: 'Kanchipuram', ashaCount: 1, visits: 22, coverage: 95, hasZeroVisitWorker: false },
    { name: 'Vellore', ashaCount: 1, visits: 18, coverage: 82, hasZeroVisitWorker: false },
    { name: 'Gudiyatham', ashaCount: 1, visits: 25, coverage: 94, hasZeroVisitWorker: false },
    { name: 'Ranipet', ashaCount: 1, visits: 30, coverage: 98, hasZeroVisitWorker: false },
    { name: 'Walajah', ashaCount: 2, visits: 21, coverage: 42, hasZeroVisitWorker: true } // Walajah has Radha M (0 visits)
  ];

  // Section 4: Fake reporting alerts & inactive workers
  const flaggedWorkers = asha.filter(w => w.suspiciousVisits > 3 || w.visitsThisWeek === 0);

  // Handle image conversion to base64
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      // Get raw base64 string
      const base64String = reader.result.split(',')[1];
      setBase64Image(base64String);
    };
    reader.readAsDataURL(file);
  };

  const handleVerifySubmit = async (e) => {
    e.preventDefault();
    if (!base64Image) {
      alert("Please upload a photo for verification.");
      return;
    }

    setIsVerifying(true);
    const workerName = asha.find(w => w.id === selectedWorkerId)?.name || 'ASHA Worker';

    try {
      const result = await verifyVisitPhoto(base64Image, workerName, householdId);
      setVerificationResult(result);
      
      // Submit the log to AppContext state to update metrics and recalculate score
      submitVisitLog({
        workerId: selectedWorkerId,
        workerName,
        householdId,
        visitType,
        notes,
        photoSubmitted: true,
        verificationStatus: result.status,
        suspicionReason: result.status === 'SUSPICIOUS' ? result.reason : null
      });

    } catch (error) {
      console.error(error);
      alert("Multimodal verification failed.");
    } finally {
      setIsVerifying(false);
    }
  };

  const closeModals = () => {
    setShowUploadModal(false);
    setVerificationResult(null);
    setBase64Image('');
    setImageFile(null);
  };

  return (
    <div className="space-y-8">
      
      {/* SECTION 1: WORKER OVERVIEW */}
      <div className="space-y-3 animate-card" style={{ animationDelay: '0ms' }}>
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold text-text-secondary uppercase tracking-widest flex items-center gap-1.5">
            <Heart size={14} className="text-danger" />
            <span>ASHA Worker Registry & Performance</span>
          </h2>
          <button
            onClick={() => setShowUploadModal(true)}
            className="flex items-center gap-1 rounded bg-emerald text-navy px-3 py-1.5 text-xs font-bold hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            <Camera size={14} />
            <span>Verify Visit Photo</span>
          </button>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {asha.map((w) => {
            const hasSuspicious = w.suspiciousVisits > 3;
            const hasZero = w.visitsThisWeek === 0;

            return (
              <div 
                key={w.id} 
                className="rounded-xl border border-border-col bg-surface p-5 flex flex-col justify-between shadow-md"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-sm text-text-primary">{w.name}</h3>
                    <p className="text-[10px] text-text-muted mt-0.5 font-mono">
                      Village: {w.village} · {w.block} Block
                    </p>
                  </div>
                  <HealthScoreRing score={w.workerScore} size={48} />
                </div>

                <div className="mt-4 border-t border-border-col/20 pt-3 space-y-2 font-mono text-[10px] text-text-secondary">
                  <div className="flex justify-between">
                    <span>Visits completed</span>
                    <span className="font-bold text-text-primary">{w.visitsThisWeek} / {w.visitsRequired}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Verification logs</span>
                    <div>
                      <span className="text-emerald">{w.verifiedVisits} Ver</span>
                      <span className="mx-1 text-text-muted">/</span>
                      <span className={w.suspiciousVisits > 0 ? 'text-warning font-bold' : 'text-text-muted'}>
                        {w.suspiciousVisits} Susp
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-border-col/10 flex items-center gap-1.5 flex-wrap">
                  {hasSuspicious && (
                    <span className="rounded bg-danger/10 border border-danger/25 text-danger px-1.5 py-0.5 text-[8px] font-bold animate-pulse">
                      SUSPICIOUS ACTION
                    </span>
                  )}
                  {hasZero && (
                    <span className="rounded bg-warning/15 border border-warning/25 text-warning px-1.5 py-0.5 text-[8px] font-bold">
                      ZERO VISITS STREAK
                    </span>
                  )}
                  {!hasSuspicious && !hasZero && (
                    <span className="rounded bg-emerald/10 border border-emerald/25 text-emerald px-1.5 py-0.5 text-[8px] font-bold">
                      STANDING NOMINAL
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 2: UNDERSERVED ZONES */}
      <div className="space-y-3 animate-card" style={{ animationDelay: '50ms' }}>
        <h2 className="text-xs font-bold text-text-secondary uppercase tracking-widest flex items-center gap-1.5">
          <MapPin size={14} className="text-emerald" />
          <span>Underserved Zones Map (Vellore Block Telemetry)</span>
        </h2>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-6">
          {blocks.map((b) => (
            <div
              key={b.name}
              className={`rounded-xl border p-4 text-center font-mono space-y-1.5 transition-all ${
                b.hasZeroVisitWorker 
                  ? 'bg-danger/5 border-danger/40 animate-critical-pulse' 
                  : 'bg-surface border-border-col'
              }`}
            >
              <p className="font-bold text-text-primary text-xs">{b.name}</p>
              <div className="text-[10px] text-text-secondary">
                <p>{b.ashaCount} ASHA Workers</p>
                <p className="mt-1 font-bold text-text-primary">{b.visits} visits</p>
              </div>
              <p className={`text-xs font-bold ${b.coverage < 50 ? 'text-danger' : b.coverage < 80 ? 'text-warning' : 'text-emerald'}`}>
                {b.coverage}% coverage
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 3: VISIT LOGS TABLE */}
      <div className="rounded-xl border border-border-col bg-surface p-5 space-y-4 animate-card" style={{ animationDelay: '100ms' }}>
        <h2 className="text-xs font-bold text-text-primary uppercase tracking-wider flex items-center gap-1.5">
          <FileSpreadsheet size={14} className="text-emerald" />
          <span>ASHA Household Visit Audit Logs</span>
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-navy/80 text-text-secondary uppercase text-[10px]">
              <tr>
                <th className="p-3">ASHA Worker</th>
                <th className="p-3">Household ID</th>
                <th className="p-3">Visit Type</th>
                <th className="p-3">Proof Upload</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-col/40">
              {visits.map((log) => {
                let statusClass = 'bg-emerald/10 text-emerald border border-emerald/20';
                if (log.verificationStatus === 'SUSPICIOUS') {
                  statusClass = 'bg-warning/15 text-warning border border-warning/25';
                } else if (log.verificationStatus === 'UNVERIFIED') {
                  statusClass = 'bg-white/5 text-text-muted border border-border-col/50';
                }

                return (
                  <tr key={log.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-3 font-bold text-text-primary">{log.workerName}</td>
                    <td className="p-3 text-text-secondary">{log.householdId}</td>
                    <td className="p-3 text-text-secondary">{log.visitType}</td>
                    <td className="p-3 text-text-muted">
                      {log.photoSubmitted ? 'JPEG image uploaded' : 'No photo uploaded'}
                    </td>
                    <td className="p-3">
                      <span className={`rounded-full px-2 py-0.5 text-[8px] font-bold ${statusClass}`}>
                        {log.verificationStatus}
                      </span>
                      {log.suspicionReason && (
                        <p className="mt-1 text-[9px] text-danger max-w-[200px] leading-tight font-sans">
                          * {log.suspicionReason}
                        </p>
                      )}
                    </td>
                    <td className="p-3 text-right text-text-muted">
                      {new Date(log.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* SECTION 4: FAKE REPORTING ALERTS */}
      <div className="rounded-xl border border-border-col bg-surface p-5 space-y-4 animate-card" style={{ animationDelay: '150ms' }}>
        <h2 className="text-xs font-bold text-text-primary uppercase tracking-wider flex items-center gap-1.5">
          <AlertTriangle size={14} className="text-warning animate-pulse" />
          <span>ASHA Verification Integrity flags</span>
        </h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {flaggedWorkers.map((w) => (
            <div 
              key={w.id} 
              className="rounded-lg border border-border-col bg-navy/40 p-4 flex gap-3 text-xs font-mono"
            >
              <AlertTriangle className="text-warning shrink-0" size={16} />
              <div className="space-y-1.5">
                <h3 className="font-bold text-text-primary">{w.name} ({w.village})</h3>
                <p className="text-[10px] text-text-secondary">
                  Issues: {w.visitsThisWeek === 0 ? 'Zero visits submitted in past 7 days.' : `${w.suspiciousVisits} suspicious visits flagged.`}
                </p>
                <div className="rounded bg-navy border border-border-col p-2 mt-2">
                  <p className="text-[8px] font-semibold text-emerald uppercase font-sans">Recommended audit action</p>
                  <p className="mt-0.5 text-[10px] text-text-secondary leading-normal font-sans">
                    {w.visitsThisWeek === 0 
                      ? 'Dispatch supervisor to verify wellness and check device connectivity.' 
                      : 'Conduct manual verification audit for the village households logged.'}
                  </p>
                </div>
              </div>
            </div>
          ))}
          {flaggedWorkers.length === 0 && (
            <p className="col-span-full text-center text-xs text-text-muted font-mono">No integrity audits flagged. ASHA worker registries normal.</p>
          )}
        </div>
      </div>

      {/* MODAL: VERIFY VISIT PHOTO FORM */}
      {showUploadModal && !verificationResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-xl border border-border-col bg-surface p-6 shadow-2xl animate-card">
            <div className="flex items-center justify-between border-b border-border-col pb-3">
              <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider">
                Gemini Multimodal visit Audit
              </h3>
              <button onClick={closeModals} className="text-text-muted hover:text-white">
                <XCircle size={18} />
              </button>
            </div>

            <form onSubmit={handleVerifySubmit} className="mt-4 space-y-4 font-mono text-xs">
              <div>
                <label className="block text-text-secondary mb-1 font-sans">Select Worker</label>
                <select
                  value={selectedWorkerId}
                  onChange={(e) => setSelectedWorkerId(e.target.value)}
                  className="w-full rounded border border-border-col bg-navy px-3 py-2 text-text-primary outline-none focus:border-emerald"
                >
                  {asha.map(w => (
                    <option key={w.id} value={w.id}>{w.name} ({w.village})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-text-secondary mb-1 font-sans">Household ID</label>
                  <input
                    type="text"
                    required
                    value={householdId}
                    onChange={(e) => setHouseholdId(e.target.value)}
                    className="w-full rounded border border-border-col bg-navy px-3 py-2 text-text-primary outline-none focus:border-emerald"
                  />
                </div>
                <div>
                  <label className="block text-text-secondary mb-1 font-sans">Visit Type</label>
                  <input
                    type="text"
                    required
                    value={visitType}
                    onChange={(e) => setVisitType(e.target.value)}
                    className="w-full rounded border border-border-col bg-navy px-3 py-2 text-text-primary outline-none focus:border-emerald"
                  />
                </div>
              </div>

              <div>
                <label className="block text-text-secondary mb-1 font-sans">Field Notes</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={2}
                  className="w-full rounded border border-border-col bg-navy px-3 py-2 text-text-primary outline-none focus:border-emerald"
                />
              </div>

              {/* Photo Proof Upload */}
              <div>
                <label className="block text-text-secondary mb-1.5 font-sans">Upload Visit Photo Proof</label>
                <div className="relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border-col/80 bg-navy/30 py-5 px-4 text-center hover:bg-navy/50 transition-colors">
                  <UploadCloud size={24} className="text-text-muted mb-2" />
                  <span className="text-[10px] text-text-secondary mb-1">JPEG or PNG format</span>
                  <input
                    type="file"
                    accept="image/*"
                    required
                    onChange={handleImageChange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  {imageFile && (
                    <span className="text-[10px] text-emerald font-bold truncate mt-1">
                      File: {imageFile.name}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-border-col/40">
                <button
                  type="button"
                  onClick={closeModals}
                  className="rounded border border-border-col px-3.5 py-1.5 font-sans font-bold text-text-secondary hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isVerifying}
                  className="rounded bg-emerald text-navy px-4 py-1.5 font-sans font-bold hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-1 cursor-pointer"
                >
                  {isVerifying ? (
                    <>
                      <span className="h-3 w-3 animate-spin rounded-full border-2 border-navy border-t-transparent" />
                      <span>Auditing...</span>
                    </>
                  ) : (
                    <>
                      <Camera size={12} />
                      <span>Analyze Photo</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: VERIFICATION RESULTS PANEL */}
      {verificationResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy/60 backdrop-blur-sm p-4 font-mono">
          <div className="w-full max-w-md rounded-xl border border-border-col bg-surface p-6 shadow-2xl animate-card">
            <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider border-b border-border-col pb-3 flex items-center gap-1.5">
              <Camera size={14} className="text-emerald" />
              <span>Gemini Audit Result</span>
            </h3>

            <div className="mt-4 space-y-4 text-xs">
              <div className="flex items-center justify-between">
                <span>Verification Status:</span>
                <span className={`rounded-full px-2.5 py-0.5 font-bold ${
                  verificationResult.status === 'VERIFIED' ? 'bg-emerald text-navy' : 
                  verificationResult.status === 'SUSPICIOUS' ? 'bg-warning text-navy animate-pulse' : 'bg-white/10 text-text-muted'
                }`}>
                  {verificationResult.status}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span>Confidence Rating:</span>
                <span className="font-bold text-text-primary">{verificationResult.confidence}%</span>
              </div>

              <div className="rounded-lg bg-navy/60 p-3 border border-border-col/40 space-y-1">
                <span className="text-[8px] text-text-muted font-sans font-semibold uppercase">Verification summary</span>
                <p className="text-[11px] text-text-secondary leading-relaxed font-sans">
                  {verificationResult.reason}
                </p>
              </div>

              <div className="flex justify-end pt-3 border-t border-border-col/40">
                <button
                  onClick={closeModals}
                  className="rounded bg-emerald text-navy px-5 py-1.5 font-sans font-bold hover:scale-105 transition-all cursor-pointer"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
