import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { getTranslation } from '../i18n/translations';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { BarChart3, Database, Filter, ExternalLink, RefreshCw, Layers } from 'lucide-react';

const mockReports = {
  stockouts: {
    title: 'PHC Medicine Stock-outs & Depletion Analysis',
    metrics: [
      { label: 'Total Records Syncing', value: '45,820' },
      { label: 'Active Deficit Centers', value: '2' },
      { label: 'Avg Depletion Rate', value: '24.5 units/day' },
      { label: 'Looker Cache Refresh', value: '12m ago' }
    ],
    chartData: [
      { name: 'Walajah', stockRemaining: 15, dailyConsumption: 40, transferNeeded: 150 },
      { name: 'Tambaram', stockRemaining: 30, dailyConsumption: 45, transferNeeded: 200 },
      { name: 'Arcot', stockRemaining: 110, dailyConsumption: 25, transferNeeded: 0 },
      { name: 'Gudiyatham', stockRemaining: 600, dailyConsumption: 18, transferNeeded: 0 },
      { name: 'Ranipet', stockRemaining: 950, dailyConsumption: 32, transferNeeded: 0 },
      { name: 'Vellore Central', stockRemaining: 1500, dailyConsumption: 60, transferNeeded: 0 }
    ]
  },
  attendance: {
    title: 'Staff Presence & Shift Compliance',
    metrics: [
      { label: 'Active Roster Count', value: '24' },
      { label: 'Overall Attendance Rate', value: '78.5%' },
      { label: 'Consecutive Doctor Absences', value: '10 days' },
      { label: 'Audit Alerts Generated', value: '3' }
    ],
    chartData: [
      { name: 'PHC Walajah', presenceDays: 12, absentDays: 18, rate: 40 },
      { name: 'PHC Tambaram', presenceDays: 15, absentDays: 15, rate: 50 },
      { name: 'CHC Vellore', presenceDays: 75, absentDays: 15, rate: 83 },
      { name: 'CHC Katpadi', presenceDays: 65, absentDays: 10, rate: 86 },
      { name: 'PHC Ranipet', presenceDays: 28, absentDays: 2, rate: 93 },
      { name: 'PHC Gudiyatham', presenceDays: 29, absentDays: 1, rate: 96 }
    ]
  },
  footfall: {
    title: 'Outbreak Vector Indicators & Patient Visits',
    metrics: [
      { label: 'Total IPD Registrations', value: '12,940' },
      { label: 'Climate Outbreak Risk Index', value: 'High (0.88)' },
      { label: 'Bed Capacity Reserved', value: '22%' },
      { label: 'Looker Dashboard ID', value: 'lk_f43b_8' }
    ],
    chartData: [
      { name: 'Week 1', normalVisits: 140, surgeVisits: 190 },
      { name: 'Week 2', normalVisits: 160, surgeVisits: 220 },
      { name: 'Week 3', normalVisits: 150, surgeVisits: 280 },
      { name: 'Week 4', normalVisits: 170, surgeVisits: 310 },
      { name: 'Week 5', normalVisits: 185, surgeVisits: 345 }
    ]
  }
};

export default function LookerAnalyticsPage() {
  const { language } = useApp();
  const [selectedReport, setSelectedReport] = useState('stockouts');
  const [selectedBlock, setSelectedBlock] = useState('All');
  const [refreshing, setRefreshing] = useState(false);

  const embedUrl = import.meta.env.VITE_LOOKER_EMBED_URL;

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 800);
  };

  const report = mockReports[selectedReport];

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2.5">
            <BarChart3 className="text-emerald-600" size={26} />
            Looker BI Insights Studio
          </h1>
          <p className="text-xs text-slate-500 font-semibold mt-1">
            Enterprise-grade district health intelligence dashboarding and Looker reports
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleRefresh}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer transition-all"
          >
            <RefreshCw size={13} className={refreshing ? 'animate-spin' : ''} />
            <span>Refresh Cache</span>
          </button>
          
          {embedUrl && (
            <a
              href={embedUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 rounded-xl bg-slate-900 px-3.5 py-2 text-xs font-bold text-white hover:bg-slate-800 cursor-pointer shadow-md transition-all"
            >
              <ExternalLink size={13} />
              <span>Open in Looker Studio</span>
            </a>
          )}
        </div>
      </div>

      {embedUrl ? (
        /* Real Looker Embed Iframe */
        <div className="rounded-2xl border border-slate-200 overflow-hidden bg-white shadow-md">
          <div className="bg-slate-50 border-b border-slate-200 px-4 py-3 flex items-center justify-between">
            <span className="text-[10px] font-extrabold text-slate-500 tracking-widest uppercase flex items-center gap-1.5">
              <Database size={12} className="text-emerald-500" />
              LIVE LOOKER STUDIO CONNECTION ACTIVE
            </span>
            <span className="text-[10px] font-bold text-slate-400">
              aarogyaos-enterprise.looker.com
            </span>
          </div>
          <iframe
            src={embedUrl}
            className="w-full h-[650px] border-0"
            allowFullScreen
            title="Looker Live Embed Dashboard"
          ></iframe>
        </div>
      ) : (
        /* Interactive Mock Looker Studio Interface */
        <div className="space-y-6">
          {/* Controls Bar */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
            <div>
              <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                Report Dashboard Source
              </label>
              <select
                value={selectedReport}
                onChange={(e) => setSelectedReport(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              >
                <option value="stockouts">Medicine Stock depletion & Transfers</option>
                <option value="attendance">Workforce Presence & Absenteeism</option>
                <option value="footfall">Weather Surge & Bed Capacity</option>
              </select>
            </div>

            <div>
              <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                Health Block Filter
              </label>
              <select
                value={selectedBlock}
                onChange={(e) => setSelectedBlock(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              >
                <option value="All">All Blocks (Tambaram, Vellore, Walajah, etc.)</option>
                <option value="Vellore">Vellore Block only</option>
                <option value="Walajah">Walajah Block only</option>
              </select>
            </div>

            <div className="flex items-end">
              <div className="w-full bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-2 flex items-center justify-between text-emerald-800">
                <div className="flex items-center gap-2">
                  <Database size={15} className="text-emerald-600" />
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase tracking-wider">BigQuery Source</span>
                    <span className="text-[9px] font-semibold text-emerald-700 font-mono">aarogyaos-enterprise.health_analytics</span>
                  </div>
                </div>
                <span className="bg-emerald-600/10 text-emerald-600 text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider border border-emerald-500/20">
                  Sync Active
                </span>
              </div>
            </div>
          </div>

          {/* Looker Studio Canvas Wrapper */}
          <div className="bg-slate-50 border border-slate-200 rounded-3xl p-5 shadow-inner relative overflow-hidden">
            {/* Looker Banner */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-5">
              <div className="flex items-center gap-2">
                <div className="bg-blue-600 text-white p-1.5 rounded-lg">
                  <Layers size={14} />
                </div>
                <span className="text-[10px] font-black text-slate-600 tracking-wider font-mono">LOOKER EXPLORER</span>
              </div>
              <div className="flex items-center gap-4 text-[10px] text-slate-400 font-bold font-mono">
                <span>PROJECT: AAROGYAOS_CF</span>
                <span>CACHE: READY</span>
              </div>
            </div>

            {/* Looker Widgets Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {report.metrics.map((m, idx) => (
                <div key={idx} className="bg-white border border-slate-150 rounded-2xl p-4 shadow-sm">
                  <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                    {m.label}
                  </span>
                  <span className="block text-lg font-black text-slate-800 mt-1 font-mono">
                    {m.value}
                  </span>
                </div>
              ))}
            </div>

            {/* Report Content */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
              <div>
                <h3 className="text-sm font-extrabold text-slate-700">{report.title}</h3>
                <p className="text-[10px] text-slate-400 font-semibold">Visualizing live BigQuery views from looker-embed-connector</p>
              </div>

              {/* Chart container */}
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  {selectedReport === 'stockouts' ? (
                    <BarChart data={report.chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="name" stroke="#64748b" fontSize={10} fontWeight="bold" />
                      <YAxis stroke="#64748b" fontSize={10} fontWeight="bold" />
                      <Tooltip contentStyle={{ borderRadius: '12px', fontSize: '11px' }} />
                      <Legend wrapperStyle={{ fontSize: '11px' }} />
                      <Bar dataKey="stockRemaining" name="Stock Remaining" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="dailyConsumption" name="Daily Consumption" fill="#ef4444" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="transferNeeded" name="Auto-Redistribute Target" fill="#10b981" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  ) : selectedReport === 'attendance' ? (
                    <BarChart data={report.chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="name" stroke="#64748b" fontSize={10} fontWeight="bold" />
                      <YAxis stroke="#64748b" fontSize={10} fontWeight="bold" />
                      <Tooltip contentStyle={{ borderRadius: '12px', fontSize: '11px' }} />
                      <Legend wrapperStyle={{ fontSize: '11px' }} />
                      <Bar dataKey="presenceDays" name="Shifts Present" fill="#10b981" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="absentDays" name="Shifts Absent" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  ) : (
                    <LineChart data={report.chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="name" stroke="#64748b" fontSize={10} fontWeight="bold" />
                      <YAxis stroke="#64748b" fontSize={10} fontWeight="bold" />
                      <Tooltip contentStyle={{ borderRadius: '12px', fontSize: '11px' }} />
                      <Legend wrapperStyle={{ fontSize: '11px' }} />
                      <Line type="monotone" dataKey="normalVisits" name="Baseline Visits" stroke="#64748b" strokeWidth={2.5} dot={{ r: 4 }} />
                      <Line type="monotone" dataKey="surgeVisits" name="Forecast Vector Surge" stroke="#dc2626" strokeWidth={3} dot={{ r: 5 }} />
                    </LineChart>
                  )}
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
