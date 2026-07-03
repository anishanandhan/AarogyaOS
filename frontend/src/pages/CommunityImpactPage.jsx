import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { getTranslation } from '../i18n/translations';
import { visitLogs } from '../data/mockData';
import {
  Users,
  MapPin,
  Heart,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  Calendar,
  Activity
} from 'lucide-react';

export default function CommunityImpactPage() {
  const { centres, asha, language } = useApp();
  const [selectedBlock, setSelectedBlock] = useState('ALL');

  // Calculate community impact metrics
  const totalHouseholds = asha.reduce((sum, w) => sum + w.householdsAssigned, 0);
  const totalVisitsThisWeek = asha.reduce((sum, w) => sum + w.visitsThisWeek, 0);
  const verifiedVisitsTotal = asha.reduce((sum, w) => sum + w.verifiedVisits, 0);
  const activeWorkers = asha.filter(w => w.visitsThisWeek > 0).length;

  // Village coverage data
  const villagesByBlock = {};
  asha.forEach(worker => {
    if (!villagesByBlock[worker.block]) {
      villagesByBlock[worker.block] = new Set();
    }
    villagesByBlock[worker.block].add(worker.village);
  });

  const totalVillages = Object.values(villagesByBlock).reduce(
    (sum, villages) => sum + villages.size, 0
  );

  // Block-wise statistics
  const blockStats = Object.keys(villagesByBlock).map(block => {
    const workers = asha.filter(w => w.block === block);
    const villages = Array.from(villagesByBlock[block]);
    const households = workers.reduce((sum, w) => sum + w.householdsAssigned, 0);
    const visits = workers.reduce((sum, w) => sum + w.visitsThisWeek, 0);
    const verified = workers.reduce((sum, w) => sum + w.verifiedVisits, 0);

    return {
      block,
      villages: villages.length,
      workers: workers.length,
      households,
      visits,
      verified,
      coverage: visits > 0 ? Math.round((verified / visits) * 100) : 0
    };
  });

  const filteredStats = selectedBlock === 'ALL'
    ? blockStats
    : blockStats.filter(s => s.block === selectedBlock);

  // Recent verified visits for impact showcase
  const recentVerifiedVisits = visitLogs
    .filter(v => v.verificationStatus === 'VERIFIED')
    .slice(0, 8);

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">{getTranslation('communityHealthImpact', language)}</h1>
          <p className="mt-1 text-sm text-text-secondary">
            {getTranslation('realTimeVerification', language)}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedBlock}
            onChange={(e) => setSelectedBlock(e.target.value)}
            className="rounded-lg border border-border-col bg-surface px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-emerald"
          >
            <option value="ALL">{getTranslation('allBlocks', language)}</option>
            {Object.keys(villagesByBlock).map(block => (
              <option key={block} value={block}>{block}</option>
            ))}
          </select>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <div className="rounded-xl border border-border-col bg-surface p-5">
          <div className="flex items-center justify-between">
            <div className="rounded-lg bg-emerald/10 p-2 text-emerald">
              <MapPin size={20} />
            </div>
            <TrendingUp size={16} className="text-emerald" />
          </div>
          <p className="mt-4 text-3xl font-bold text-text-primary font-mono">{totalVillages}</p>
          <p className="mt-1 text-xs text-text-secondary">{getTranslation('villagesCovered', language)}</p>
        </div>

        <div className="rounded-xl border border-border-col bg-surface p-5">
          <div className="flex items-center justify-between">
            <div className="rounded-lg bg-info/10 p-2 text-info">
              <Users size={20} />
            </div>
            <Activity size={16} className="text-info" />
          </div>
          <p className="mt-4 text-3xl font-bold text-text-primary font-mono">{totalHouseholds.toLocaleString()}</p>
          <p className="mt-1 text-xs text-text-secondary">{getTranslation('householdsRegistered', language)}</p>
        </div>

        <div className="rounded-xl border border-border-col bg-surface p-5">
          <div className="flex items-center justify-between">
            <div className="rounded-lg bg-warning/10 p-2 text-warning">
              <Heart size={20} />
            </div>
            <Calendar size={16} className="text-warning" />
          </div>
          <p className="mt-4 text-3xl font-bold text-text-primary font-mono">{totalVisitsThisWeek}</p>
          <p className="mt-1 text-xs text-text-secondary">{getTranslation('visitsThisWeek', language)}</p>
        </div>

        <div className="rounded-xl border border-border-col bg-surface p-5">
          <div className="flex items-center justify-between">
            <div className="rounded-lg bg-emerald/10 p-2 text-emerald">
              <CheckCircle size={20} />
            </div>
            <Activity size={16} className="text-emerald" />
          </div>
          <p className="mt-4 text-3xl font-bold text-text-primary font-mono">{verifiedVisitsTotal}</p>
          <p className="mt-1 text-xs text-text-secondary">{getTranslation('aiVerifiedVisits', language)}</p>
        </div>
      </div>

      {/* Block-wise Coverage Table */}
      <div className="rounded-xl border border-border-col bg-surface p-6">
        <h2 className="text-sm font-bold text-text-primary uppercase tracking-wider mb-4">
          {getTranslation('blockwiseVillageCoverage', language)}
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border-col text-left text-xs text-text-muted uppercase tracking-wider">
                <th className="pb-3 font-semibold">{getTranslation('block', language)}</th>
                <th className="pb-3 font-semibold">{getTranslation('villages', language)}</th>
                <th className="pb-3 font-semibold">{getTranslation('ashaWorkers', language)}</th>
                <th className="pb-3 font-semibold">{getTranslation('households', language)}</th>
                <th className="pb-3 font-semibold">{getTranslation('visitsWeek', language)}</th>
                <th className="pb-3 font-semibold">{getTranslation('verified', language)}</th>
                <th className="pb-3 font-semibold">{getTranslation('coverage', language)}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-col/50">
              {filteredStats.map((stat) => (
                <tr key={stat.block} className="hover:bg-white/5 transition-colors">
                  <td className="py-3 font-semibold text-text-primary">{stat.block}</td>
                  <td className="py-3 text-text-secondary font-mono">{stat.villages}</td>
                  <td className="py-3 text-text-secondary font-mono">{stat.workers}</td>
                  <td className="py-3 text-text-secondary font-mono">{stat.households}</td>
                  <td className="py-3 text-text-secondary font-mono">{stat.visits}</td>
                  <td className="py-3 text-emerald font-mono font-bold">{stat.verified}</td>
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-2 bg-navy rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald rounded-full transition-all"
                          style={{ width: `${stat.coverage}%` }}
                        />
                      </div>
                      <span className="text-text-primary font-mono text-xs font-bold">
                        {stat.coverage}%
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Verified Visits */}
      <div className="rounded-xl border border-border-col bg-surface p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold text-text-primary uppercase tracking-wider flex items-center gap-2">
            <CheckCircle size={16} className="text-emerald" />
            <span>{getTranslation('recentVerifiedVisits', language)}</span>
          </h2>
          <span className="text-xs text-text-muted font-mono">{getTranslation('last24Hours', language)}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recentVerifiedVisits.map((visit) => (
            <div
              key={visit.id}
              className="rounded-lg border border-emerald/20 bg-emerald/5 p-4"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <CheckCircle size={14} className="text-emerald" />
                    <span className="text-xs font-bold text-emerald uppercase">{getTranslation('verified', language)}</span>
                  </div>
                  <p className="mt-2 text-sm font-semibold text-text-primary">
                    {visit.workerName}
                  </p>
                  <p className="mt-1 text-xs text-text-secondary">
                    {visit.visitType} • Household {visit.householdId}
                  </p>
                  {visit.notes && (
                    <p className="mt-2 text-xs text-text-muted italic">"{visit.notes}"</p>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-text-muted font-mono">
                    {new Date(visit.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                  {visit.photoSubmitted && (
                    <span className="mt-1 inline-block rounded-full bg-emerald/20 px-2 py-0.5 text-[8px] font-bold text-emerald">
                      {getTranslation('photoProofCheckmark', language)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Impact Statement */}
      <div className="rounded-xl border border-emerald/30 bg-gradient-to-br from-emerald/10 to-emerald/5 p-6">
        <div className="flex items-start gap-4">
          <div className="rounded-lg bg-emerald/20 p-3 text-emerald">
            <Heart size={24} />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-emerald">{getTranslation('communityHealthImpactStatement', language)}</h3>
            <p className="mt-2 text-sm text-text-secondary leading-relaxed">
              {getTranslation('thisWeek', language)} <span className="font-bold text-text-primary">{activeWorkers} {getTranslation('activeAshaWorkers', language)}</span> {getTranslation('reached', language)}{' '}
              <span className="font-bold text-text-primary">{totalHouseholds.toLocaleString()} {getTranslation('households', language)}</span> {getTranslation('across', language)}{' '}
              <span className="font-bold text-text-primary">{totalVillages} {getTranslation('villages', language)}</span> {getTranslation('inVelloreDistrict', language)}{' '}
              <span className="font-bold text-emerald">{verifiedVisitsTotal} {getTranslation('visitsWereAiVerified', language)}</span> {getTranslation('withPhotoProof', language)}
              {getTranslation('ensuringMaternalCare', language)}
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
