import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import HealthScoreRing from '../components/HealthScoreRing';
import { Search, Stethoscope, Bed, Calendar, ArrowRight, Filter } from 'lucide-react';

export default function CentresPage() {
  const { centres } = useApp();
  const navigate = useNavigate();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [facilityFilter, setFacilityFilter] = useState('ALL');
  const [scoreFilter, setScoreFilter] = useState('ALL');

  // Filter centres based on user criteria
  const filteredCentres = centres.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          c.block.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFacility = facilityFilter === 'ALL' || c.type === facilityFilter;
    
    let matchesScore = true;
    if (scoreFilter === 'CRITICAL') matchesScore = c.healthScore < 40;
    else if (scoreFilter === 'LOW') matchesScore = c.healthScore >= 40 && c.healthScore <= 70;
    else if (scoreFilter === 'OK') matchesScore = c.healthScore > 70;

    return matchesSearch && matchesFacility && matchesScore;
  });

  const getCardBorder = (score) => {
    if (score < 40) return 'border-danger/30 hover:border-danger/60 bg-danger/5 animate-critical-pulse';
    if (score <= 70) return 'border-warning/30 hover:border-warning/60 bg-warning/5';
    return 'border-emerald/30 hover:border-emerald/60 bg-emerald/5';
  };

  return (
    <div className="space-y-6">
      
      {/* Search and Filters Bar */}
      <div className="flex flex-col gap-4 rounded-xl border border-border-col bg-surface p-4 md:flex-row md:items-center md:justify-between animate-card" style={{ animationDelay: '0ms' }}>
        
        {/* Search input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute top-2.5 left-3 text-text-muted" size={16} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search centres by name or block..."
            className="w-full rounded-lg border border-border-col bg-navy pl-9 pr-4 py-2 text-xs text-text-primary placeholder:text-text-muted outline-none focus:border-emerald transition-all"
          />
        </div>

        {/* Filters Selection */}
        <div className="flex flex-wrap items-center gap-4">
          {/* Facility Type */}
          <div className="flex items-center gap-2">
            <Filter className="text-text-muted" size={14} />
            <select
              value={facilityFilter}
              onChange={(e) => setFacilityFilter(e.target.value)}
              className="rounded border border-border-col bg-navy px-3 py-1.5 text-xs text-text-secondary outline-none focus:border-emerald font-mono cursor-pointer"
            >
              <option value="ALL">All Types</option>
              <option value="PHC">PHC</option>
              <option value="CHC">CHC</option>
            </select>
          </div>

          {/* Health Category */}
          <div className="flex items-center gap-2">
            <select
              value={scoreFilter}
              onChange={(e) => setScoreFilter(e.target.value)}
              className="rounded border border-border-col bg-navy px-3 py-1.5 text-xs text-text-secondary outline-none focus:border-emerald font-mono cursor-pointer"
            >
              <option value="ALL">All Scores</option>
              <option value="CRITICAL">Critical (&lt;40)</option>
              <option value="LOW">Warning (40-70)</option>
              <option value="OK">Nominal (&gt;70)</option>
            </select>
          </div>
        </div>

      </div>

      {/* Grid of Centres */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredCentres.map((c, index) => {
          const bedPercent = Math.round((c.bedsOccupied / c.bedsTotal) * 100);
          
          return (
            <div
              key={c.id}
              onClick={() => navigate(`/centres/${c.id}`)}
              className={`flex flex-col justify-between rounded-xl border p-5 shadow-lg hover:scale-[1.01] hover:shadow-2xl transition-all duration-200 cursor-pointer animate-card ${getCardBorder(c.healthScore)}`}
              style={{ animationDelay: `${(index + 1) * 50}ms` }}
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-sm text-text-primary leading-tight hover:text-emerald transition-colors">
                      {c.name}
                    </h3>
                    <div className="mt-1.5 flex items-center gap-2">
                      <span className="rounded bg-navy border border-border-col/60 px-2 py-0.5 text-[8px] font-bold text-text-muted font-mono uppercase">
                        {c.type}
                      </span>
                      <span className="text-[10px] text-text-secondary font-mono">
                        Block: {c.block}
                      </span>
                    </div>
                  </div>
                  <HealthScoreRing score={c.healthScore} size={50} />
                </div>

                {/* Telemetries */}
                <div className="mt-6 space-y-4 border-t border-border-col/20 pt-4">
                  {/* Bed occupation */}
                  <div>
                    <div className="flex justify-between text-[10px] font-mono text-text-secondary">
                      <span className="flex items-center gap-1">
                        <Bed size={10} className="text-text-muted" />
                        <span>Bed occupancy</span>
                      </span>
                      <span>{c.bedsOccupied}/{c.bedsTotal} ({bedPercent}%)</span>
                    </div>
                    <div className="mt-1.5 h-1 w-full rounded bg-navy overflow-hidden">
                      <div 
                        className={`h-full rounded transition-all duration-300 ${
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
                      <span>Doctors availability</span>
                    </span>
                    <span className={`font-bold ${c.doctorsPresent === 0 ? 'text-danger font-bold animate-pulse' : 'text-text-primary'}`}>
                      {c.doctorsPresent} / {c.doctorsOnRoll} present
                    </span>
                  </div>
                </div>
              </div>

              {/* Action and update timestamp */}
              <div className="mt-6 flex items-center justify-between border-t border-border-col/10 pt-3 text-[9px] text-text-muted font-mono">
                <span className="flex items-center gap-1">
                  <Calendar size={10} />
                  <span>Update: {new Date(c.lastUpdated).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                </span>
                
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/centres/${c.id}`);
                  }}
                  className="flex items-center gap-0.5 text-xs font-semibold text-emerald hover:underline"
                >
                  <span>Profile</span>
                  <ArrowRight size={10} />
                </button>
              </div>
            </div>
          );
        })}

        {filteredCentres.length === 0 && (
          <div className="col-span-full rounded-xl border border-dashed border-border-col p-12 text-center">
            <p className="text-sm text-text-secondary font-mono">No matching health centers found in this query.</p>
          </div>
        )}
      </div>

    </div>
  );
}
