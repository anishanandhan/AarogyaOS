import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { getTranslation } from '../i18n/translations';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { Activity, Bed, TrendingUp, Brain, Loader2, BarChart3, CheckCircle } from 'lucide-react';
import { predictPatientFootfall } from '../services/bigquery';

const localTranslations = {
  en: {
    capacityCheck: "District Footfall & Capacity Check",
    trendSubtitle: "OPD & IPD 7-Day Trend (early prediction warnings)",
    surgeRisk: "SURGE RISK",
    surgeDetected: "Surge Detected",
    nominalTraffic: "Nominal Patient Traffic",
    todaysTraffic: "Today's Traffic",
    patients: "patients",
    avgTraffic: "6-Day Average Traffic",
    patientsPerDay: "patients/day",
    forecastHeader: "BigQuery ML Footfall Forecast",
    predicting: "Predicting...",
    predictButton: "Predict Next 7 Days",
    model: "Model",
    timeSeriesML: "Time-series ML",
    avgDailyFootfall: "Avg Footfall",
    sevenDayForecast: "7-Day Forecast (ARIMA Model)",
    peak: "PEAK",
    aiRecommendations: "AI Recommendations",
    clickPredict: "Click \"Predict Next 7 Days\" to run BigQuery ML forecast",
    usesArima: "Uses ARIMA_PLUS time-series model with 95% confidence",
    trend: "Trend",
    weekAhead: "Week ahead"
  },
  hi: {
    capacityCheck: "जिला फुटफॉल और क्षमता जांच",
    trendSubtitle: "ओपीडी और आईपीडी 7-दिवसीय प्रवृत्ति (प्रारंभिक भविष्यवाणी चेतावनी)",
    surgeRisk: "भीड़ का जोखिम",
    surgeDetected: "सर्ज का पता चला",
    nominalTraffic: "सामान्य मरीज संख्या",
    todaysTraffic: "आज की मरीज संख्या",
    patients: "मरीज",
    avgTraffic: "6-दिवसीय औसत मरीज संख्या",
    patientsPerDay: "मरीज/दिन",
    forecastHeader: "बिगक्वेरी एमएल फुटफॉल पूर्वानुमान",
    predicting: "पूर्वानुमान जारी...",
    predictButton: "अगले 7 दिनों का पूर्वानुमान लगाएं",
    model: "मॉडल",
    timeSeriesML: "टाइम-सीरीज एमएल",
    avgDailyFootfall: "औसत फुटफॉल",
    sevenDayForecast: "7-दिवसीय पूर्वानुमान (एआरआईएमए मॉडल)",
    peak: "शिखर",
    aiRecommendations: "एआई सिफारिशें",
    clickPredict: "बिगक्वेरी एमएल पूर्वानुमान चलाने के लिए \"अगले 7 दिनों का पूर्वानुमान लगाएं\" पर क्लिक करें",
    usesArima: "95% आत्मविश्वास के साथ ARIMA_PLUS समय-श्रृंखला मॉडल का उपयोग करता है",
    trend: "प्रवृत्ति",
    weekAhead: "आगे का सप्ताह"
  },
  ta: {
    capacityCheck: "மாவட்ட மக்கள் வருகை & திறன் சரிபார்ப்பு",
    trendSubtitle: "OPD & IPD 7-நாள் போக்கு (ஆரம்ப கணிப்பு எச்சரிக்கைகள்)",
    surgeRisk: "அதிகரிப்பு அபாயம்",
    surgeDetected: "அதிகரிப்பு கண்டறியப்பட்டது",
    nominalTraffic: "சாதாரண நோயாளிகளின் எண்ணிக்கை",
    todaysTraffic: "இன்றைய நோயாளி எண்ணிக்கை",
    patients: "நோயாளிகள்",
    avgTraffic: "6-நாள் சராசரி நோயாளி எண்ணிக்கை",
    patientsPerDay: "நோயாளிகள்/நாள்",
    forecastHeader: "BigQuery ML மக்கள் வருகை கணிப்பு",
    predicting: "கணிக்கிறது...",
    predictButton: "அடுத்த 7 நாட்களைக் கணித்திடுக",
    model: "மாதிரி",
    timeSeriesML: "நேரத் தொடர் ML",
    avgDailyFootfall: "சராசரி வருகை",
    sevenDayForecast: "7-நாள் கணிப்பு (ARIMA மாதிரி)",
    peak: "உச்சம்",
    aiRecommendations: "AI பரிந்துரைகள்",
    clickPredict: "BigQuery ML கணிப்பை இயக்க \"அடுத்த 7 நாட்களைக் கணித்திடுக\" என்பதைக் கிளிக் செய்யவும்",
    usesArima: "95% நம்பிக்கையுடன் ARIMA_PLUS நேரத் தொடர் மாதிரியைப் பயன்படுத்துகிறது",
    trend: "போக்கு",
    weekAhead: "அடுத்த வாரம்"
  }
};

export default function FootfallPage() {
  const { centres, language } = useApp();
  const [selectedCentreId, setSelectedCentreId] = useState('phc-001');
  const [prediction, setPrediction] = useState(null);
  const [isPredicting, setIsPredicting] = useState(false);

  const t = localTranslations[language] || localTranslations.en;

  const handlePredict = async () => {
    setIsPredicting(true);
    try {
      const selectedCentre = centres.find(c => c.id === selectedCentreId);
      const result = await predictPatientFootfall(selectedCentre?.name || 'Walajah PHC', 7);
      setPrediction(result);
    } catch (error) {
      console.error('[BigQuery] Prediction error:', error);
    } finally {
      setIsPredicting(false);
    }
  };

  const getFootfallSeries = (cId) => {
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

    if (rawData[cId]) return rawData[cId];

    const seed = cId.charCodeAt(cId.length - 1) || 5;
    return [
      { date: "Jun 25", opd: 50 + seed * 2, ipd: 2 },
      { date: "Jun 26", opd: 58 + seed * 3, ipd: 3 },
      { date: "Jun 27", opd: 52 + seed, ipd: 2 },
      { date: "Jun 28", opd: 64 + seed * 4, ipd: 3 },
      { date: "Jun 29", opd: 48 + seed, ipd: 1 },
      { date: "Jun 30", opd: 68 + seed * 2, ipd: 4 },
      { date: "Jul 01", opd: 72 + seed * 3, ipd: 3 }
    ];
  };

  const checkSurge = (series) => {
    if (series.length < 7) return false;
    const today = series[series.length - 1].opd;
    const previousDays = series.slice(0, 6);
    const avg = previousDays.reduce((sum, d) => sum + d.opd, 0) / previousDays.length;
    return today > avg * 1.2;
  };

  const getSurgeInfo = (cId) => {
    const series = getFootfallSeries(cId);
    const isSurging = checkSurge(series);
    const todayVal = series[series.length - 1].opd;
    const prevDays = series.slice(0, 6);
    const avgVal = Math.round(prevDays.reduce((sum, d) => sum + d.opd, 0) / prevDays.length);
    return { isSurging, todayVal, avgVal };
  };

  const selectedCentre = centres.find(c => c.id === selectedCentreId) || centres[0];
  const chartSeries = getFootfallSeries(selectedCentreId);

  return (
    <div className="space-y-6">
      
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-10">
        
        {/* Left Side: Centres Checklist Grid */}
        <div className="rounded-xl border border-border-col bg-surface p-5 lg:col-span-4 space-y-4 animate-card" style={{ animationDelay: '0ms' }}>
          <h2 className="text-xs font-bold text-text-primary uppercase tracking-wider flex items-center gap-1.5 border-b border-border-col/40 pb-3">
            <Activity size={14} className="text-emerald" />
            <span>{t.capacityCheck}</span>
          </h2>

          <div className="space-y-3 overflow-y-auto max-h-[500px] pr-1">
            {centres.map((c) => {
              const { isSurging, todayVal } = getSurgeInfo(c.id);
              const bedPercent = Math.round((c.bedsOccupied / c.bedsTotal) * 100);
              const isSelected = selectedCentreId === c.id;

              return (
                <div
                  key={c.id}
                  onClick={() => setSelectedCentreId(c.id)}
                  className={`rounded-lg border p-3.5 cursor-pointer transition-all ${
                    isSelected 
                      ? 'border-emerald bg-white/5 shadow-md' 
                      : 'border-border-col/60 bg-navy/20 hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-xs font-bold text-text-primary">{c.name}</h3>
                      <p className="text-[10px] text-text-muted mt-0.5 font-mono">{c.type} · {c.block}</p>
                    </div>

                    <div className="flex flex-col items-end gap-1 font-mono">
                      <span className="text-xs font-bold text-text-primary">{todayVal} OPD</span>
                      {isSurging && (
                        <span className="rounded bg-warning/20 text-warning border border-warning/30 px-1 py-0.5 text-[8px] font-bold animate-pulse">
                          {t.surgeRisk}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="mt-3.5 space-y-1">
                    <div className="flex justify-between text-[9px] font-mono text-text-secondary">
                      <span className="flex items-center gap-1">
                        <Bed size={9} />
                        <span>{getTranslation('beds', language)}</span>
                      </span>
                      <span>{c.bedsOccupied}/{c.bedsTotal} {getTranslation('occupied', language)}</span>
                    </div>
                    <div className="h-1 w-full bg-navy rounded overflow-hidden">
                      <div 
                        className={`h-full rounded ${
                          bedPercent >= 100 ? 'bg-danger' : 
                          bedPercent > 80 ? 'bg-warning' : 'bg-emerald'
                        }`} 
                        style={{ width: `${Math.min(100, bedPercent)}%` }} 
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: Recharts details */}
        <div className="rounded-xl border border-border-col bg-surface p-5 lg:col-span-6 flex flex-col justify-between animate-card" style={{ animationDelay: '100ms' }}>
          <div>
            <div className="flex items-start justify-between border-b border-border-col/40 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-sm font-bold text-text-primary uppercase tracking-wider">{selectedCentre.name}</h2>
                  <span className="rounded bg-navy border border-border-col/60 px-2 py-0.5 text-[8px] font-bold text-text-muted font-mono uppercase">
                    {selectedCentre.type}
                  </span>
                </div>
                <p className="text-[10px] text-text-muted mt-1 font-mono">
                  {t.trendSubtitle}
                </p>
              </div>

              {getSurgeInfo(selectedCentreId).isSurging ? (
                <div className="flex items-center gap-1 rounded-lg border border-warning/30 bg-warning/5 px-3 py-1.5 text-xs text-warning font-mono">
                  <TrendingUp size={14} />
                  <span>{t.surgeDetected}: +{Math.round((getSurgeInfo(selectedCentreId).todayVal / getSurgeInfo(selectedCentreId).avgVal - 1) * 100)}%</span>
                </div>
              ) : (
                <div className="rounded-lg border border-emerald/20 bg-emerald/5 px-3 py-1.5 text-xs text-emerald font-mono">
                  <span>{t.nominalTraffic}</span>
                </div>
              )}
            </div>

            <div className="my-5 grid grid-cols-2 gap-4 rounded-lg bg-navy/40 p-3.5 border border-border-col/35 font-mono text-xs">
              <div>
                <span className="text-[9px] text-text-muted font-sans uppercase">{t.todaysTraffic}</span>
                <p className="font-bold text-text-primary mt-0.5">{getSurgeInfo(selectedCentreId).todayVal} {t.patients}</p>
              </div>
              <div>
                <span className="text-[9px] text-text-muted font-sans uppercase">{t.avgTraffic}</span>
                <p className="font-bold text-text-secondary mt-0.5">{getSurgeInfo(selectedCentreId).avgVal} {t.patientsPerDay}</p>
              </div>
            </div>

            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartSeries} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="opdGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="ipdGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                  <XAxis dataKey="date" stroke="#94A3B8" fontSize={9} fontClassName="font-mono" />
                  <YAxis stroke="#94A3B8" fontSize={9} fontClassName="font-mono" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1E293B', borderColor: '#334155', borderRadius: '8px' }}
                    labelStyle={{ color: '#94A3B8', fontFamily: 'monospace', fontSize: '10px' }}
                    itemStyle={{ color: '#F8FAFC', fontFamily: 'monospace', fontSize: '10px' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '10px', fontFamily: 'monospace', paddingTop: '15px' }} />
                  <Area type="monotone" dataKey="opd" stroke="#3B82F6" strokeWidth={2} fillOpacity={1} fill="url(#opdGrad)" name={getTranslation('opdFootfall', language)} />
                  <Area type="monotone" dataKey="ipd" stroke="#10B981" strokeWidth={2} fillOpacity={1} fill="url(#ipdGrad)" name={getTranslation('ipdAdmissions', language)} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <p className="mt-4 text-center text-[9px] text-text-muted font-mono leading-relaxed">
            {getTranslation('dataSourcedFromVellore', language)}
          </p>
        </div>

        {/* BigQuery ML Prediction Panel */}
        <div className="rounded-xl border border-border-col bg-surface p-5 lg:col-span-10 lg:mt-6 animate-card" style={{ animationDelay: '100ms' }}>
          <div className="flex items-center justify-between border-b border-border-col pb-3">
            <div className="flex items-center gap-2">
              <Brain size={16} className="text-info" />
              <h2 className="text-sm font-bold text-text-primary">{t.forecastHeader}</h2>
            </div>
            <button
              onClick={handlePredict}
              disabled={isPredicting}
              className="flex items-center gap-2 rounded-lg bg-info/10 border border-info/30 px-3 py-1.5 text-xs font-semibold text-info hover:bg-info/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isPredicting ? (
                <>
                  <Loader2 size={12} className="animate-spin" />
                  <span>{t.predicting}</span>
                </>
              ) : (
                <>
                  <BarChart3 size={12} />
                  <span>{t.predictButton}</span>
                </>
              )}
            </button>
          </div>

          {prediction ? (
            <div className="mt-4 space-y-4">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div className="rounded-lg border border-border-col bg-navy/30 p-3 font-mono">
                  <div className="flex items-center gap-2 mb-1">
                    <CheckCircle size={14} className="text-emerald" />
                    <span className="text-[10px] font-semibold text-text-muted uppercase font-sans">{t.model}</span>
                  </div>
                  <p className="text-xs font-bold text-text-primary">{prediction.model}</p>
                  <p className="text-[9px] text-text-secondary mt-0.5 font-sans">{t.timeSeriesML}</p>
                </div>

                <div className="rounded-lg border border-border-col bg-navy/30 p-3 font-mono">
                  <div className="flex items-center gap-2 mb-1">
                    <Activity size={14} className="text-info" />
                    <span className="text-[10px] font-semibold text-text-muted uppercase font-sans">{t.avgDailyFootfall}</span>
                  </div>
                  <p className="text-xs font-bold text-text-primary">{prediction.insights.averageDailyFootfall} {t.patients}</p>
                  <p className="text-[9px] text-text-secondary mt-0.5 font-sans">{t.sevenDayForecast}</p>
                </div>

                <div className="rounded-lg border border-border-col bg-navy/30 p-3 font-mono">
                  <div className="flex items-center gap-2 mb-1">
                    <TrendingUp size={14} className={prediction.insights.trend === 'INCREASING' ? 'text-warning' : 'text-emerald'} />
                    <span className="text-[10px] font-semibold text-text-muted uppercase font-sans">{t.trend}</span>
                  </div>
                  <p className={`text-xs font-bold ${prediction.insights.trend === 'INCREASING' ? 'text-warning' : 'text-emerald'}`}>
                    {prediction.insights.trend}
                  </p>
                  <p className="text-[9px] text-text-secondary mt-0.5 font-sans">{t.weekAhead}</p>
                </div>
              </div>

              {/* Daily Predictions */}
              <div className="rounded-lg border border-border-col bg-navy/20 p-4 font-mono">
                <h3 className="text-xs font-bold text-text-primary mb-3 flex items-center gap-2 font-sans">
                  <BarChart3 size={14} className="text-info" />
                  <span>{t.sevenDayForecast}</span>
                </h3>
                <div className="space-y-2">
                  {prediction.predictions.map((pred, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs">
                      <span className="text-text-secondary">{pred.date}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-text-muted text-[10px]">
                          {pred.lowerBound}-{pred.upperBound}
                        </span>
                        <span className="font-bold text-text-primary">{pred.predictedPatients} {t.patients}</span>
                        {idx === prediction.insights.peakDay && (
                          <span className="rounded-full bg-warning/10 border border-warning/30 px-2 py-0.5 text-[8px] font-bold text-warning">
                            {t.peak}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommendations */}
              <div className="rounded-lg bg-emerald/5 border border-emerald/20 p-3 font-sans">
                <p className="text-xs font-bold text-emerald mb-2 flex items-center gap-1">
                  <CheckCircle size={12} />
                  <span>{t.aiRecommendations}</span>
                </p>
                <ul className="space-y-1 text-[10px] text-text-secondary">
                  {prediction.recommendations.map((rec, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-emerald mt-0.5">•</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div className="mt-4 text-center py-8">
              <Brain size={32} className="mx-auto text-text-muted mb-2" />
              <p className="text-xs text-text-muted">{t.clickPredict}</p>
              <p className="text-[10px] text-text-secondary mt-1 font-mono">{t.usesArima}</p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
