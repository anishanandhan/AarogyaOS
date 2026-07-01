import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { medicines, redistributionSuggestions } from '../data/mockData';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import { Package, ArrowRightLeft, ArrowRight, Filter } from 'lucide-react';

export default function StockPage() {
  const { stock, centres } = useApp();
  const navigate = useNavigate();
  const [centreFilter, setCentreFilter] = useState('ALL');

  // Flatten stockData across all centres
  const getFlattenedStock = () => {
    let rows = [];
    Object.keys(stock).forEach(cId => {
      const centreName = centres.find(c => c.id === cId)?.name || cId;
      stock[cId].forEach(s => {
        const medInfo = medicines.find(m => m.id === s.medicineId) || {};
        const daysRemaining = Math.floor(s.currentStock / s.dailyConsumption);
        rows.push({
          centreId: cId,
          centreName,
          medicineId: s.medicineId,
          medicineName: medInfo.name,
          unit: medInfo.unit,
          currentStock: s.currentStock,
          dailyConsumption: s.dailyConsumption,
          daysRemaining,
          forecast30Days: s.forecast30Days
        });
      });
    });

    // Apply filter
    if (centreFilter !== 'ALL') {
      rows = rows.filter(r => r.centreId === centreFilter);
    }

    // Sort ascending by Days Remaining (most critical first)
    return rows.sort((a, b) => a.daysRemaining - b.daysRemaining);
  };

  const tableRows = getFlattenedStock();

  // Aggregate stock levels per medicine for chart (Y-axis: stock, X-axis: medicine)
  const getChartData = () => {
    return medicines.map(m => {
      let totalStock = 0;
      Object.keys(stock).forEach(cId => {
        const item = stock[cId].find(s => s.medicineId === m.id);
        if (item) totalStock += item.currentStock;
      });
      return {
        name: m.name.split(' ')[0], // short name
        fullName: m.name,
        stock: totalStock
      };
    });
  };

  const chartData = getChartData();

  return (
    <div className="space-y-6">
      
      {/* 2-Column Main content Split */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-10">
        
        {/* Left Inventory Table Panel (70%) */}
        <div className="rounded-xl border border-border-col bg-surface p-5 lg:col-span-7 space-y-4 animate-card" style={{ animationDelay: '0ms' }}>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-border-col/40 pb-3">
            <h2 className="text-xs font-bold text-text-primary uppercase tracking-wider flex items-center gap-1.5">
              <Package size={14} className="text-emerald" />
              <span>District Medicine Inventory Log</span>
            </h2>

            {/* Centre Filter dropdown */}
            <div className="flex items-center gap-2">
              <Filter className="text-text-muted" size={12} />
              <select
                value={centreFilter}
                onChange={(e) => setCentreFilter(e.target.value)}
                className="rounded border border-border-col bg-navy px-2.5 py-1.5 text-xs text-text-secondary outline-none focus:border-emerald font-mono cursor-pointer"
              >
                <option value="ALL">All Vellore Centres</option>
                {centres.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="overflow-x-auto max-h-[460px]">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-navy/80 text-text-secondary uppercase text-[10px] sticky top-0 z-10">
                <tr>
                  <th className="p-3">Centre</th>
                  <th className="p-3">Medicine</th>
                  <th className="p-3">Stock level</th>
                  <th className="p-3">Days Left</th>
                  <th className="p-3">30-day Forecast</th>
                  <th className="p-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-col/40">
                {tableRows.map((row, idx) => {
                  let badgeClass = 'bg-emerald/15 text-emerald border border-emerald/20';
                  let status = 'OK';
                  if (row.daysRemaining < 7) {
                    badgeClass = 'bg-danger/15 text-danger border border-danger/25 animate-pulse';
                    status = 'CRITICAL';
                  } else if (row.daysRemaining < 14) {
                    badgeClass = 'bg-warning/15 text-warning border border-warning/25';
                    status = 'LOW';
                  }

                  return (
                    <tr 
                      key={`${row.centreId}-${row.medicineId}`} 
                      className="hover:bg-white/5 cursor-pointer transition-all"
                      onClick={() => navigate(`/centres/${row.centreId}`)}
                    >
                      <td className="p-3 font-semibold text-text-secondary">{row.centreName}</td>
                      <td className="p-3 font-bold text-text-primary">{row.medicineName}</td>
                      <td className="p-3 text-text-muted">{row.currentStock} {row.unit}</td>
                      <td className={`p-3 font-bold ${row.daysRemaining < 7 ? 'text-danger' : row.daysRemaining < 14 ? 'text-warning' : 'text-emerald'}`}>
                        {row.daysRemaining} days
                      </td>
                      <td className="p-3 text-text-muted">{row.forecast30Days} units</td>
                      <td className="p-3 text-right">
                        <span className={`rounded-full px-2 py-0.5 text-[8px] font-bold ${badgeClass}`}>
                          {status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Redistributionsuggestions Panel (30%) */}
        <div className="rounded-xl border border-border-col bg-surface p-5 lg:col-span-3 space-y-4 animate-card" style={{ animationDelay: '100ms' }}>
          <h2 className="text-xs font-bold text-text-primary uppercase tracking-wider flex items-center gap-1.5 border-b border-border-col/40 pb-3">
            <ArrowRightLeft size={14} className="text-emerald" />
            <span>Redistribution Roster</span>
          </h2>

          <div className="space-y-4 max-h-[460px] overflow-y-auto pr-1">
            {redistributionSuggestions.map((s, index) => (
              <div 
                key={index} 
                className="rounded-lg border border-border-col/60 bg-navy/40 p-3.5 space-y-2 text-xs font-mono"
              >
                <div className="flex items-center justify-between">
                  <span className={`rounded px-1.5 py-0.5 text-[8.5px] font-bold ${
                    s.urgency === 'CRITICAL' ? 'bg-danger text-white' : 'bg-warning text-navy'
                  }`}>
                    {s.urgency}
                  </span>
                  <span className="text-[9px] text-text-muted">ID: TRANSFER-0{index+1}</span>
                </div>
                
                <div className="flex items-center justify-between font-semibold">
                  <span className="text-text-primary">{s.from}</span>
                  <ArrowRight size={10} className="text-text-muted" />
                  <span className="text-text-primary">{s.to}</span>
                </div>

                <div className="border-t border-border-col/35 pt-2 flex items-center justify-between mt-2">
                  <div>
                    <span className="text-[9px] text-text-muted font-sans">Medicine</span>
                    <p className="font-bold text-emerald">{s.medicine}</p>
                  </div>
                  <span className="rounded bg-navy border border-border-col px-2 py-0.5 font-bold text-text-primary">
                    {s.quantity}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* District-wide Stock Bar Chart */}
      <div className="rounded-xl border border-border-col bg-surface p-5 animate-card" style={{ animationDelay: '150ms' }}>
        <h2 className="text-xs font-bold text-text-primary uppercase tracking-wider mb-4">
          Total District stock levels per Medicine
        </h2>
        <div className="h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
              <XAxis dataKey="name" stroke="#94A3B8" fontSize={9} fontClassName="font-mono" />
              <YAxis stroke="#94A3B8" fontSize={9} fontClassName="font-mono" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1E293B', borderColor: '#334155', borderRadius: '8px' }}
                labelStyle={{ color: '#94A3B8', fontFamily: 'monospace', fontSize: '10px' }}
                itemStyle={{ color: '#F8FAFC', fontFamily: 'monospace', fontSize: '10px' }}
                formatter={(value, name, props) => [value, props.payload.fullName]}
              />
              <Bar dataKey="stock" fill="#10B981" radius={[4, 4, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.stock < 1000 ? '#EF4444' : entry.stock < 2500 ? '#F59E0B' : '#10B981'} 
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
}
