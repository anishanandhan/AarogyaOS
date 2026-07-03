import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { getTranslation } from '../i18n/translations';
import { medicines, labTests } from '../data/mockData';
import HealthScoreRing from '../components/HealthScoreRing';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { 
  Package, 
  Activity, 
  Bed, 
  UserSquare2, 
  Heart, 
  Beaker,
  CheckCircle,
  XCircle,
  FileSpreadsheet,
  AlertTriangle,
  History,
  Plus
} from 'lucide-react';

export default function CentreProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    centres,
    stock,
    attendance,
    asha,
    visits,
    labs,
    updateStock,
    logAttendance,
    updateLabAudit,
    setCentres,
    language
  } = useApp();

  const [activeTab, setActiveTab] = useState('stock');

  // Modal states for inputs
  const [showStockModal, setShowStockModal] = useState(false);
  const [selectedMed, setSelectedMed] = useState('m1');
  const [newStockQty, setNewStockQty] = useState('');

  const [showBedModal, setShowBedModal] = useState(false);
  const [newBedsOccupied, setNewBedsOccupied] = useState('');

  const [showLabModal, setShowLabModal] = useState(false);

  // Find the centre
  const centre = centres.find(c => c.id === id);
  if (!centre) {
    return (
      <div className="rounded-xl border border-border-col bg-surface p-8 text-center">
        <p className="text-sm text-text-secondary font-mono">{getTranslation('healthCentreNotFound', language)} {id}</p>
        <button onClick={() => navigate('/centres')} className="mt-4 rounded bg-emerald px-4 py-2 text-xs font-bold text-navy">
          {getTranslation('backToList', language)}
        </button>
      </div>
    );
  }

  // Derived sub-scores out of 20 points
  const getSubscores = () => {
    // 1. Stock subscore
    const cStocks = stock[centre.id] || [];
    const criticalStocks = cStocks.filter(s => s.currentStock / s.dailyConsumption < 7).length;
    const stockScore = Math.max(0, 20 - (criticalStocks * 4));

    // 2. Bed subscore
    const bedPercent = centre.bedsOccupied / centre.bedsTotal;
    const bedScore = bedPercent >= 1.0 ? 5 : bedPercent > 0.8 ? 12 : 20;

    // 3. Doctor subscore
    const doctorsOn = attendance.filter(a => a.centreId === centre.id);
    const presentD = doctorsOn.filter(a => a.status === 'PRESENT').length;
    const totalD = doctorsOn.length || 1;
    const doctorScore = Math.round((presentD / totalD) * 20);

    // 4. ASHA subscore
    const cAsha = asha.filter(w => w.centreId === centre.id);
    const avgAshaScore = cAsha.length 
      ? cAsha.reduce((sum, w) => sum + w.workerScore, 0) / cAsha.length
      : 80;
    const ashaScore = Math.round((avgAshaScore / 100) * 20);

    // 5. Lab subscore
    const cLabs = labs[centre.id] || {};
    const availableTests = Object.keys(cLabs).filter(k => k !== 'lastAudit' && cLabs[k] === true).length;
    const labScore = Math.round((availableTests / 10) * 20);

    return [
      { name: getTranslation('stockInventory', language), score: stockScore, icon: Package },
      { name: getTranslation('bedLogistics', language), score: bedScore, icon: Bed },
      { name: getTranslation('doctorsAttendance', language), score: doctorScore, icon: UserSquare2 },
      { name: getTranslation('ashaCoverage', language), score: ashaScore, icon: Heart },
      { name: getTranslation('labDiagnostics', language), score: labScore, icon: Beaker }
    ];
  };

  const subscores = getSubscores();

  // Tab configuration
  const tabs = [
    { id: 'stock', label: getTranslation('stockSense', language), icon: Package },
    { id: 'footfall', label: getTranslation('flowAiOpd', language), icon: Activity },
    { id: 'beds', label: getTranslation('bedsTracker', language), icon: Bed },
    { id: 'doctors', label: getTranslation('doctorsAttendance', language), icon: UserSquare2 },
    { id: 'asha', label: getTranslation('ashaWorkers', language), icon: Heart },
    { id: 'labs', label: getTranslation('labCheckups', language), icon: Beaker }
  ];

  // Plausible Footfall Data generator if missing
  const getFootfallData = () => {
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
    return rawData[centre.id] || [
      { date: "Jun 25", opd: 60, ipd: 2 },
      { date: "Jun 26", opd: 70, ipd: 3 },
      { date: "Jun 27", opd: 65, ipd: 2 },
      { date: "Jun 28", opd: 80, ipd: 4 },
      { date: "Jun 29", opd: 55, ipd: 1 },
      { date: "Jun 30", opd: 75, ipd: 3 },
      { date: "Jul 01", opd: 82, ipd: 5 }
    ];
  };

  const chartData = getFootfallData();

  // Stock operations
  const handleStockUpdateSubmit = (e) => {
    e.preventDefault();
    if (!newStockQty) return;
    updateStock(centre.id, selectedMed, newStockQty);
    setNewStockQty('');
    setShowStockModal(false);
  };

  // Bed operations
  const handleBedUpdateSubmit = (e) => {
    e.preventDefault();
    if (!newBedsOccupied) return;
    
    // Direct state mutation triggers AppContext calculation
    setCentres(prev => prev.map(c => {
      if (c.id === centre.id) {
        return {
          ...c,
          bedsOccupied: Math.min(c.bedsTotal, Number(newBedsOccupied)),
          lastUpdated: new Date().toISOString()
        };
      }
      return c;
    }));
    
    setNewBedsOccupied('');
    setShowBedModal(false);
  };

  // Lab audit operations
  const toggleLabTest = (testName) => {
    const currentTests = labs[centre.id] || {};
    const updated = {
      ...currentTests,
      [testName]: !currentTests[testName]
    };
    updateLabAudit(centre.id, updated, new Date().toISOString().split('T')[0]);
  };

  return (
    <div className="space-y-6">
      
      {/* Header Profile Dashboard */}
      <div className="rounded-xl border border-border-col bg-surface p-6 animate-card" style={{ animationDelay: '0ms' }}>
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <HealthScoreRing score={centre.healthScore} size={90} />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-extrabold text-white">{centre.name}</h1>
                <span className="rounded bg-navy border border-border-col/85 px-2 py-0.5 text-[8px] font-bold text-text-secondary font-mono">
                  {centre.type}
                </span>
              </div>
              
              <p className="text-xs text-text-muted mt-1 font-mono">
                {getTranslation('blockAssignment', language)}: {centre.block} Block · Vellore District, Tamil Nadu
              </p>

              <p className="text-[10px] text-text-secondary mt-2 flex items-center gap-1.5 font-mono">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald" />
                <span>{getTranslation('lastTelemetrySync', language)}: {new Date(centre.lastUpdated).toLocaleString()}</span>
              </p>
            </div>
          </div>

          {/* Quick Action buttons */}
          <div className="flex flex-wrap gap-2.5">
            <button
              onClick={() => { setActiveTab('stock'); setShowStockModal(true); }}
              className="rounded bg-navy border border-border-col px-3 py-2 text-xs font-bold text-text-secondary hover:bg-white/5 hover:text-white transition-all cursor-pointer"
            >
              {getTranslation('logStockUpdate', language)}
            </button>
            <button
              onClick={() => { setActiveTab('doctors'); }}
              className="rounded bg-navy border border-border-col px-3 py-2 text-xs font-bold text-text-secondary hover:bg-white/5 hover:text-white transition-all cursor-pointer"
            >
              {getTranslation('manageAttendance', language)}
            </button>
            <button
              onClick={() => { setActiveTab('labs'); setShowLabModal(true); }}
              className="rounded bg-emerald text-navy px-3.5 py-2 text-xs font-bold hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              {getTranslation('updateLabAudit', language)}
            </button>
          </div>
        </div>

        {/* 5 pillars score breakdown */}
        <div className="mt-6 border-t border-border-col/40 pt-5">
          <p className="text-[9px] font-semibold text-text-muted uppercase tracking-wider font-mono mb-3">
            {getTranslation('fiveHealthPillarsScoreBreakdown', language)}
          </p>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
            {subscores.map((pillar, index) => {
              const SubIcon = pillar.icon;
              return (
                <div key={index} className="flex items-center gap-2.5 rounded-lg bg-navy/40 p-2.5 border border-border-col/40">
                  <div className={`flex h-8 w-8 items-center justify-center rounded bg-surface border border-border-col/80 ${
                    pillar.score < 8 ? 'text-danger' : 
                    pillar.score < 14 ? 'text-warning' : 'text-emerald'
                  }`}>
                    <SubIcon size={16} />
                  </div>
                  <div>
                    <p className="text-[9px] text-text-muted font-sans font-medium leading-none">{pillar.name}</p>
                    <p className="mt-1 text-xs font-bold text-text-primary font-mono">{pillar.score} <span className="text-[10px] text-text-muted">/ 20</span></p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Tabs list */}
      <div className="flex border-b border-border-col overflow-x-auto scrollbar-none animate-card" style={{ animationDelay: '50ms' }}>
        {tabs.map((tab) => {
          const TabIcon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-xs font-bold transition-all border-b-2 cursor-pointer ${
                isActive 
                  ? 'border-emerald text-emerald bg-white/5' 
                  : 'border-transparent text-text-secondary hover:text-white hover:border-border-col'
              }`}
            >
              <TabIcon size={14} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      <div className="animate-card" style={{ animationDelay: '100ms' }}>
        
        {/* TAB 1: STOCK */}
        {activeTab === 'stock' && (
          <div className="rounded-xl border border-border-col bg-surface p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold text-text-primary uppercase tracking-wider">
                {getTranslation('medicineStockConsumptionRegistry', language)}
              </h2>
              <button
                onClick={() => setShowStockModal(true)}
                className="flex items-center gap-1 rounded bg-emerald/10 border border-emerald/20 px-2.5 py-1.5 text-[10px] font-bold text-emerald hover:bg-emerald hover:text-navy transition-all cursor-pointer"
              >
                <Plus size={10} />
                <span>{getTranslation('logInventoryLevels', language)}</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-navy/80 text-text-secondary uppercase text-[10px]">
                  <tr>
                    <th className="p-3">{getTranslation('medicine', language)}</th>
                    <th className="p-3">{getTranslation('currentStock', language)}</th>
                    <th className="p-3">{getTranslation('dailyUse', language)}</th>
                    <th className="p-3">{getTranslation('daysLeft', language)}</th>
                    <th className="p-3 text-right">{getTranslation('status', language)}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-col/40">
                  {(stock[centre.id] || []).map((s) => {
                    const medInfo = medicines.find(m => m.id === s.medicineId) || {};
                    const daysRemaining = Math.floor(s.currentStock / s.dailyConsumption);
                    
                    let statusLabel = getTranslation('ok', language);
                    let statusClass = 'bg-emerald/15 text-emerald border border-emerald/20';
                    if (daysRemaining < 7) {
                      statusLabel = 'CRITICAL';
                      statusClass = 'bg-danger/20 text-danger border border-danger/30';
                    } else if (daysRemaining < 14) {
                      statusLabel = getTranslation('low', language);
                      statusClass = 'bg-warning/20 text-warning border border-warning/30';
                    }

                    return (
                      <tr key={s.medicineId} className="hover:bg-white/5 transition-colors">
                        <td className="p-3 font-bold text-text-primary">{medInfo.name} <span className="text-[10px] text-text-muted">({medInfo.unit})</span></td>
                        <td className="p-3 text-text-secondary">{s.currentStock} {getTranslation('units', language)}</td>
                        <td className="p-3 text-text-secondary">{s.dailyConsumption}/{getTranslation('day', language)}</td>
                        <td className={`p-3 font-bold ${daysRemaining < 7 ? 'text-danger' : daysRemaining < 14 ? 'text-warning' : 'text-emerald'}`}>
                          {daysRemaining} {getTranslation('days', language)}
                        </td>
                        <td className="p-3 text-right">
                          <span className={`rounded-full px-2 py-0.5 text-[8px] font-bold ${statusClass}`}>
                            {statusLabel}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: FOOTFALL (SURGE TRACKING) */}
        {activeTab === 'footfall' && (
          <div className="rounded-xl border border-border-col bg-surface p-5 space-y-4">
            <div>
              <h2 className="text-xs font-bold text-text-primary uppercase tracking-wider">
                {getTranslation('sevenDayOpdPatientFootfallTrend', language)}
              </h2>
              <p className="text-[10px] text-text-muted mt-1 font-mono">
                {getTranslation('tracksPatientSurgeRisks', language)}
              </p>
            </div>

            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorOpd" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                  <XAxis dataKey="date" stroke="#94A3B8" fontSize={10} fontClassName="font-mono" />
                  <YAxis stroke="#94A3B8" fontSize={10} fontClassName="font-mono" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1E293B', borderColor: '#334155', borderRadius: '8px' }}
                    labelStyle={{ color: '#94A3B8', fontFamily: 'monospace', fontSize: '10px' }}
                    itemStyle={{ color: '#F8FAFC', fontFamily: 'monospace', fontSize: '10px' }}
                  />
                  <Area type="monotone" dataKey="opd" stroke="#3B82F6" strokeWidth={2} fillOpacity={1} fill="url(#colorOpd)" name={getTranslation('opdPatientRegistrations', language)} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* TAB 3: BEDS */}
        {activeTab === 'beds' && (
          <div className="rounded-xl border border-border-col bg-surface p-5 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xs font-bold text-text-primary uppercase tracking-wider">
                  {getTranslation('bedOccupancyTracker', language)}
                </h2>
                <p className="text-[10px] text-text-muted mt-1 font-mono">
                  {getTranslation('districtRoutingOperate', language)}
                </p>
              </div>
              <button
                onClick={() => setShowBedModal(true)}
                className="rounded bg-navy border border-border-col px-3 py-1.5 text-[10px] font-bold text-text-secondary hover:text-white transition-all cursor-pointer"
              >
                {getTranslation('logBedsOccupancy', language)}
              </button>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {/* Total */}
              <div className="rounded-lg bg-navy/40 p-4 border border-border-col/40 text-center font-mono">
                <p className="text-[9px] text-text-muted uppercase tracking-wider font-sans">{getTranslation('totalBeds', language)}</p>
                <p className="mt-1 text-2xl font-bold text-text-primary">{centre.bedsTotal}</p>
              </div>
              {/* Occupied */}
              <div className="rounded-lg bg-navy/40 p-4 border border-border-col/40 text-center font-mono">
                <p className="text-[9px] text-text-muted uppercase tracking-wider font-sans">{getTranslation('occupiedBeds', language)}</p>
                <p className="mt-1 text-2xl font-bold text-warning">{centre.bedsOccupied}</p>
              </div>
              {/* Available */}
              <div className="rounded-lg bg-navy/40 p-4 border border-border-col/40 text-center font-mono">
                <p className="text-[9px] text-text-muted uppercase tracking-wider font-sans">{getTranslation('availableBeds', language)}</p>
                <p className="mt-1 text-2xl font-bold text-emerald">{centre.bedsTotal - centre.bedsOccupied}</p>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-mono text-text-secondary mb-2">
                <span>{getTranslation('occupancyLoad', language)}</span>
                <span>{Math.round((centre.bedsOccupied / centre.bedsTotal) * 100)}% {getTranslation('capacity', language)}</span>
              </div>
              <div className="h-4 w-full rounded-md bg-navy overflow-hidden p-0.5 border border-border-col">
                <div 
                  className={`h-full rounded transition-all duration-500 ${
                    centre.bedsOccupied === centre.bedsTotal ? 'bg-danger' : 
                    (centre.bedsOccupied / centre.bedsTotal) > 0.8 ? 'bg-warning' : 'bg-emerald'
                  }`}
                  style={{ width: `${(centre.bedsOccupied / centre.bedsTotal) * 100}%` }}
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: DOCTORS ATTENDANCE */}
        {activeTab === 'doctors' && (
          <div className="rounded-xl border border-border-col bg-surface p-5 space-y-4">
            <h2 className="text-xs font-bold text-text-primary uppercase tracking-wider">
              {getTranslation('staffDoctorCheckInSheet', language)}
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-navy/80 text-text-secondary uppercase text-[10px]">
                  <tr>
                    <th className="p-3">{getTranslation('doctorName', language)}</th>
                    <th className="p-3">{getTranslation('specialization', language)}</th>
                    <th className="p-3">{getTranslation('consecutiveAbsences', language)}</th>
                    <th className="p-3">{getTranslation('status', language)}</th>
                    <th className="p-3 text-right">{getTranslation('dutyOverride', language)}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-col/40">
                  {attendance.filter(a => a.centreId === centre.id).map((doc) => {
                    const isAbsent = doc.status === 'ABSENT';
                    return (
                      <tr key={doc.doctor} className="hover:bg-white/5 transition-colors">
                        <td className="p-3 font-bold text-text-primary">{doc.doctor}</td>
                        <td className="p-3 text-text-secondary">{doc.specialization}</td>
                        <td className={`p-3 font-bold ${isAbsent && doc.consecutiveAbsent >= 3 ? 'text-danger animate-pulse' : 'text-text-muted'}`}>
                          {doc.consecutiveAbsent} {getTranslation('days', language)}
                        </td>
                        <td className="p-3">
                          <span className={`rounded-full px-2 py-0.5 text-[8px] font-bold ${
                            isAbsent ? 'bg-danger/10 text-danger border border-danger/20' : 'bg-emerald/10 text-emerald border border-emerald/20'
                          }`}>
                            {doc.status}
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => logAttendance(centre.id, doc.doctor, isAbsent ? 'PRESENT' : 'ABSENT')}
                            className="rounded border border-border-col bg-navy px-2 py-1 text-[10px] hover:bg-white/5 hover:text-white transition-all cursor-pointer"
                          >
                            {getTranslation('set', language)} {isAbsent ? getTranslation('present', language) : getTranslation('absent', language)}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 5: ASHA WORKERS */}
        {activeTab === 'asha' && (
          <div className="rounded-xl border border-border-col bg-surface p-5 space-y-4">
            <h2 className="text-xs font-bold text-text-primary uppercase tracking-wider">
              ASHA Workers Performance (Vellore Block roster)
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-navy/80 text-text-secondary uppercase text-[10px]">
                  <tr>
                    <th className="p-3">Worker Name</th>
                    <th className="p-3">Village Assigned</th>
                    <th className="p-3">Visits/Required</th>
                    <th className="p-3">Verified / Suspicious</th>
                    <th className="p-3 text-right">Integrity Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-col/40">
                  {asha.filter(w => w.centreId === centre.id).map((w) => {
                    return (
                      <tr key={w.id} className="hover:bg-white/5 transition-colors">
                        <td className="p-3 font-bold text-text-primary">{w.name}</td>
                        <td className="p-3 text-text-secondary">{w.village}</td>
                        <td className="p-3 text-text-secondary">{w.visitsThisWeek} / {w.visitsRequired}</td>
                        <td className="p-3 text-text-secondary">
                          <span className="text-emerald">{w.verifiedVisits} verified</span>
                          <span className="text-text-muted mx-1">/</span>
                          <span className={`${w.suspiciousVisits > 3 ? 'text-danger font-bold' : 'text-text-muted'}`}>{w.suspiciousVisits} suspicious</span>
                        </td>
                        <td className="p-3 text-right">
                          <span className={`rounded-full px-2 py-0.5 text-[8px] font-bold ${
                            w.workerScore < 40 ? 'bg-danger/20 text-danger border border-danger/30 animate-pulse' :
                            w.workerScore < 70 ? 'bg-warning/20 text-warning border border-warning/30' :
                            'bg-emerald/15 text-emerald border border-emerald/20'
                          }`}>
                            {w.workerScore} / 100
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 6: LABS CHECKLIST */}
        {activeTab === 'labs' && (
          <div className="rounded-xl border border-border-col bg-surface p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-border-col/40 pb-3">
              <div>
                <h2 className="text-xs font-bold text-text-primary uppercase tracking-wider">
                  Diagnostics Test Availability Audit
                </h2>
                <p className="text-[10px] text-text-muted mt-1 font-mono">
                  Toggle availability checkmarks. Changes submit audit updates automatically.
                </p>
              </div>
              <div className="text-right font-mono">
                <span className="text-[10px] text-text-muted">Last Audit Date:</span>
                <p className="text-xs font-bold text-text-primary mt-0.5">{(labs[centre.id] || {}).lastAudit || 'Never'}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {labTests.map((test) => {
                const isAvailable = (labs[centre.id] || {})[test] === true;
                return (
                  <div 
                    key={test}
                    onClick={() => toggleLabTest(test)}
                    className="flex items-center justify-between rounded-lg bg-navy/40 p-3 border border-border-col/40 hover:bg-white/5 transition-all cursor-pointer select-none"
                  >
                    <span className="text-xs font-mono text-text-secondary">{test}</span>
                    <button className="focus:outline-none">
                      {isAvailable ? (
                        <CheckCircle size={18} className="text-emerald" />
                      ) : (
                        <XCircle size={18} className="text-text-muted" />
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>

      {/* MODAL 1: STOCK UPDATE */}
      {showStockModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-xl border border-border-col bg-surface p-6 shadow-2xl animate-card">
            <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider border-b border-border-col pb-3">
              Log Medicine Stock Update
            </h3>
            
            <form onSubmit={handleStockUpdateSubmit} className="mt-4 space-y-4 font-mono text-xs">
              <div>
                <label className="block text-text-secondary mb-1.5 font-sans">Select Medicine</label>
                <select
                  value={selectedMed}
                  onChange={(e) => setSelectedMed(e.target.value)}
                  className="w-full rounded border border-border-col bg-navy px-3 py-2 text-text-primary outline-none focus:border-emerald"
                >
                  {medicines.map(m => (
                    <option key={m.id} value={m.id}>{m.name} ({m.unit})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-text-secondary mb-1.5 font-sans">Current Stock Count (Units)</label>
                <input
                  type="number"
                  required
                  value={newStockQty}
                  onChange={(e) => setNewStockQty(e.target.value)}
                  placeholder="e.g. 250"
                  className="w-full rounded border border-border-col bg-navy px-3 py-2 text-text-primary placeholder:text-text-muted outline-none focus:border-emerald"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-border-col/40">
                <button
                  type="button"
                  onClick={() => setShowStockModal(false)}
                  className="rounded border border-border-col px-3.5 py-1.5 font-sans font-bold text-text-secondary hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded bg-emerald text-navy px-4 py-1.5 font-sans font-bold hover:scale-105 transition-all"
                >
                  Update Stock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: BEDS UPDATE */}
      {showBedModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-xl border border-border-col bg-surface p-6 shadow-2xl animate-card">
            <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider border-b border-border-col pb-3">
              Update Bed Occupancy
            </h3>
            
            <form onSubmit={handleBedUpdateSubmit} className="mt-4 space-y-4 font-mono text-xs">
              <div>
                <label className="block text-text-secondary mb-1.5 font-sans">Occupied Beds (Max {centre.bedsTotal})</label>
                <input
                  type="number"
                  required
                  max={centre.bedsTotal}
                  min={0}
                  value={newBedsOccupied}
                  onChange={(e) => setNewBedsOccupied(e.target.value)}
                  placeholder="e.g. 4"
                  className="w-full rounded border border-border-col bg-navy px-3 py-2 text-text-primary placeholder:text-text-muted outline-none focus:border-emerald"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-border-col/40">
                <button
                  type="button"
                  onClick={() => setShowBedModal(false)}
                  className="rounded border border-border-col px-3.5 py-1.5 font-sans font-bold text-text-secondary hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded bg-emerald text-navy px-4 py-1.5 font-sans font-bold hover:scale-105 transition-all"
                >
                  Update occupancy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: LAB AUDIT */}
      {showLabModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-xl border border-border-col bg-surface p-6 shadow-2xl animate-card">
            <div className="flex items-center justify-between border-b border-border-col pb-3">
              <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider">
                Audit Diagnostics Checklist
              </h3>
              <button 
                onClick={() => setShowLabModal(false)}
                className="text-text-muted hover:text-white"
              >
                <XCircle size={18} />
              </button>
            </div>

            <div className="mt-4 max-h-[300px] overflow-y-auto space-y-2 pr-1">
              {labTests.map(test => {
                const isAvailable = (labs[centre.id] || {})[test] === true;
                return (
                  <div key={test} className="flex items-center justify-between bg-navy/30 p-2.5 rounded border border-border-col/40">
                    <span className="text-xs font-mono text-text-secondary">{test}</span>
                    <button
                      onClick={() => toggleLabTest(test)}
                      className={`rounded px-2.5 py-1 text-[10px] font-bold ${
                        isAvailable ? 'bg-emerald/10 text-emerald border border-emerald/20' : 'bg-white/5 text-text-muted border border-border-col/40'
                      }`}
                    >
                      {isAvailable ? 'AVAILABLE' : 'OFFLINE'}
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="mt-5 pt-3 border-t border-border-col/40 flex justify-end">
              <button
                onClick={() => setShowLabModal(false)}
                className="rounded bg-emerald text-navy px-4 py-1.5 text-xs font-bold hover:scale-105 transition-all cursor-pointer"
              >
                Submit Audit Log
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
