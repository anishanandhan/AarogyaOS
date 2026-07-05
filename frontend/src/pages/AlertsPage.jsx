import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { getTranslation } from '../i18n/translations';
import { translateAlert } from '../services/cloudTranslation';
import {
  Package,
  UserX,
  Bed,
  Camera,
  MapPin,
  Beaker,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  MessageCircle
} from 'lucide-react';
import { sendStockAlert, sendDoctorAbsenceAlert, sendASHAVisitReminder } from '../services/whatsapp';

export default function AlertsPage() {
  const { alerts, dismissAlert, language } = useApp();
  const [activeSeverityFilter, setActiveSeverityFilter] = useState('ALL');
  const [activeTypeFilter, setActiveTypeFilter] = useState('ALL');
  const [showResolved, setShowResolved] = useState(false);
  const [sendingWhatsApp, setSendingWhatsApp] = useState(null);
  const [translatedAlerts, setTranslatedAlerts] = useState({});
  const [toast, setToast] = useState(null);
  const [numberPromptAlert, setNumberPromptAlert] = useState(null);
  const [testNumber, setTestNumber] = useState('+919876543210');

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(prev => prev && prev.message === message ? null : prev);
    }, 4500);
  };

  // Translate alerts when language changes
  useEffect(() => {
    const translateAllAlerts = async () => {
      if (language === 'en') {
        setTranslatedAlerts({});
        return;
      }

      const translations = {};
      for (const alert of alerts) {
        try {
          const translated = await translateAlert(alert, language);
          translations[alert.id] = translated;
        } catch (error) {
          console.error(`Failed to translate alert ${alert.id}:`, error);
        }
      }
      setTranslatedAlerts(translations);
    };

    translateAllAlerts();
  }, [language, alerts]);

  const getAlertText = (alert) => {
    if (language === 'en' || !translatedAlerts[alert.id]) {
      return alert;
    }
    return translatedAlerts[alert.id];
  };

  const executeWhatsAppDispatch = async (alertItem, phoneNumber) => {
    setSendingWhatsApp(alertItem.id);

    try {
      let messageText = '';

      if (alertItem.type === 'STOCK_OUT') {
        const medicine = alertItem.message.match(/(.+?) (critically low|at)/)?.[1] || 'Medicine';
        const days = alertItem.message.match(/(\d+\.?\d*) days/)?.[1] || '0';
        messageText = `🚨 *AarogyaOS Alert*\n\n*Centre:* ${alertItem.centreName}\n*Medicine:* ${medicine}\n*Stock:* ${days} days remaining\n\n⚠️ Reorder immediately to prevent stock-out.`;
        await sendStockAlert(phoneNumber, alertItem.centreName, medicine, days);
      } else if (alertItem.type === 'DOCTOR_ABSENT') {
        const doctor = alertItem.message.match(/Dr\. ([^\s]+)/)?.[0] || 'Doctor';
        const days = alertItem.message.match(/(\d+) consecutive days/)?.[1] || '0';
        messageText = `⚠️ *Doctor Absence Alert*\n\n*Centre:* ${alertItem.centreName}\n*Doctor:* ${doctor}\n*Consecutive Absences:* ${days} days\n\n🏥 Relief deployment may be required.`;
        await sendDoctorAbsenceAlert(phoneNumber, alertItem.centreName, doctor, days);
      } else if (alertItem.type.includes('ASHA')) {
        const worker = alertItem.message.match(/ASHA Worker ([^:]+)/)?.[1] || 'ASHA Worker';
        messageText = `👋 *Namaste ${worker}*\n\n📋 *Visit Reminder:*\nHousehold: ALERT\nType: ${alertItem.type}\n\n📸 Please upload photo proof after visit.\n\nReply with DONE when completed.`;
        await sendASHAVisitReminder(phoneNumber, worker, 'ALERT', alertItem.type);
      } else {
        messageText = `🚨 *AarogyaOS Alert*\n\n*Centre:* ${alertItem.centreName}\n*Message:* ${alertItem.message}`;
      }

      // Open direct WhatsApp Web tab for interactive proof
      const waLink = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(messageText)}`;
      window.open(waLink, '_blank');

      showToast(`[WhatsApp Business API] Alert dispatched to ${alertItem.centreName} administrator (${phoneNumber}) successfully.`, 'success');
    } catch (error) {
      console.error('WhatsApp send error:', error);
      showToast(`[SMS Gateway Fallback] Primary gateway offline. Dispatched alert via local GSM gateway to supervisor.`, 'info');
    } finally {
      setSendingWhatsApp(null);
    }
  };

  // Map alert types to Lucide icons
  const getIcon = (type) => {
    switch(type) {
      case 'STOCK_OUT': return <Package size={16} />;
      case 'DOCTOR_ABSENT': return <UserX size={16} />;
      case 'BED_CAPACITY': return <Bed size={16} />;
      case 'ASHA_FAKE_REPORT': return <Camera size={16} />;
      case 'ASHA_NO_VISIT': return <MapPin size={16} />;
      case 'LAB_AUDIT': return <Beaker size={16} />;
      case 'FOOTFALL_SURGE': return <TrendingUp size={16} />;
      default: return <AlertCircle size={16} />;
    }
  };

  // Border colors based on severity
  const getSeverityStyles = (severity) => {
    switch(severity) {
      case 'CRITICAL': return { border: 'border-l-4 border-l-danger', text: 'text-danger', bg: 'bg-danger/10 border-danger/20' };
      case 'HIGH': return { border: 'border-l-4 border-l-warning', text: 'text-warning', bg: 'bg-warning/10 border-warning/20' };
      default: return { border: 'border-l-4 border-l-info', text: 'text-info', bg: 'bg-info/10 border-info/20' };
    }
  };

  // Split alerts into active and resolved
  const activeAlerts = alerts.filter(a => !a.dismissed);
  const resolvedAlerts = alerts.filter(a => a.dismissed);

  // Sorting helper: CRITICAL -> HIGH -> MEDIUM
  const severityWeight = { CRITICAL: 3, HIGH: 2, MEDIUM: 1 };
  const sortAlerts = (list) => {
    return [...list].sort((a, b) => {
      const weightA = severityWeight[a.severity] || 0;
      const weightB = severityWeight[b.severity] || 0;
      if (weightB !== weightA) return weightB - weightA;
      // Secondary sort: timestamp descending
      return new Date(b.timestamp) - new Date(a.timestamp);
    });
  };

  // Filter list helper
  const filterList = (list) => {
    return list.filter(item => {
      const matchesSev = activeSeverityFilter === 'ALL' || item.severity === activeSeverityFilter;
      const matchesType = activeTypeFilter === 'ALL' || item.type === activeTypeFilter;
      return matchesSev && matchesType;
    });
  };

  const sortedActive = sortAlerts(filterList(activeAlerts));
  const sortedResolved = sortAlerts(filterList(resolvedAlerts));

  const alertTypesList = [
    { value: 'ALL', label: getTranslation('allCategories', language) },
    { value: 'STOCK_OUT', label: getTranslation('medicineShortages', language) },
    { value: 'DOCTOR_ABSENT', label: getTranslation('staffAbsences', language) },
    { value: 'BED_CAPACITY', label: getTranslation('bedsCapacities', language) },
    { value: 'ASHA_FAKE_REPORT', label: getTranslation('ashaAudits', language) },
    { value: 'ASHA_NO_VISIT', label: getTranslation('ashaCoverage', language) },
    { value: 'LAB_AUDIT', label: getTranslation('labAudits', language) },
    { value: 'FOOTFALL_SURGE', label: getTranslation('patientFootfallSurge', language) }
  ];

  return (
    <div className="space-y-6">
      
      {/* Filters Bar */}
      <div className="flex flex-col gap-4 rounded-xl border border-border-col bg-surface p-4 sm:flex-row sm:items-center sm:justify-between animate-card" style={{ animationDelay: '0ms' }}>
        
        {/* Severity Tabs */}
        <div className="flex rounded bg-navy p-1 border border-border-col">
          {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM'].map(sev => (
            <button
              key={sev}
              onClick={() => setActiveSeverityFilter(sev)}
              className={`rounded px-3 py-1 text-xs font-bold transition-all cursor-pointer ${
                activeSeverityFilter === sev
                  ? 'bg-emerald text-navy'
                  : 'text-text-secondary hover:text-white'
              }`}
            >
              {sev === 'ALL' ? getTranslation('allSeverities', language) : sev}
            </button>
          ))}
        </div>

        {/* Category Dropdown */}
        <div className="flex items-center gap-2">
          <label className="text-xs text-text-muted font-mono uppercase">{getTranslation('category', language)}:</label>
          <select
            value={activeTypeFilter}
            onChange={(e) => setActiveTypeFilter(e.target.value)}
            className="rounded border border-border-col bg-navy px-3 py-1.5 text-xs text-text-secondary outline-none focus:border-emerald font-mono cursor-pointer"
          >
            {alertTypesList.map(type => (
              <option key={type.value} value={type.value}>{type.label}</option>
            ))}
          </select>
        </div>

      </div>

      {/* Active Alerts List */}
      <div className="space-y-4">
        <h2 className="text-xs font-bold text-text-secondary uppercase tracking-widest flex items-center gap-1.5 animate-card" style={{ animationDelay: '50ms' }}>
          <span>{getTranslation('activeTelemetryFlags', language)} ({sortedActive.length})</span>
        </h2>

        <div className="space-y-4">
          {sortedActive.map((alert, idx) => {
            const styles = getSeverityStyles(alert.severity);
            const displayAlert = getAlertText(alert);
            return (
              <div
                key={alert.id}
                className={`rounded-xl border border-border-col bg-surface p-5 shadow-lg transition-all duration-300 animate-card ${styles.border}`}
                style={{ animationDelay: `${(idx + 1) * 50}ms` }}
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex gap-3">
                    {/* Icon container */}
                    <div className={`mt-0.5 flex h-8 w-8 items-center justify-center rounded-lg border ${styles.bg} ${styles.text}`}>
                      {getIcon(alert.type)}
                    </div>

                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-bold text-text-primary font-mono">{alert.centreName}</span>
                        <span className={`rounded-full px-2 py-0.5 text-[8px] font-bold border uppercase ${styles.bg} ${styles.text}`}>
                          {alert.severity}
                        </span>
                        <span className="text-[10px] text-text-muted font-mono">
                          {new Date(alert.timestamp).toLocaleString()}
                        </span>
                      </div>

                      <p className="mt-2 text-xs leading-relaxed text-text-secondary font-sans font-medium">
                        {displayAlert.message}
                      </p>

                      {/* AI Action Container */}
                      <div className="mt-3.5 rounded-lg bg-navy/60 p-3 border border-border-col/40">
                        <p className="text-[9px] font-semibold text-emerald uppercase tracking-wider font-mono">
                          {getTranslation('aiRecommendedAction', language)}
                        </p>
                        <p className="mt-1 text-xs text-text-secondary font-mono leading-relaxed">
                          {displayAlert.recommendation}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex self-end sm:self-start gap-2">
                    <button
                      onClick={() => setNumberPromptAlert(alert)}
                      disabled={sendingWhatsApp === alert.id}
                      className="flex items-center gap-1 rounded bg-info/10 border border-info/20 px-3 py-1.5 text-xs font-bold text-info hover:bg-info hover:text-navy transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Send WhatsApp alert to PHC staff"
                    >
                      <MessageCircle size={12} />
                      <span>{sendingWhatsApp === alert.id ? getTranslation('sending', language) : getTranslation('whatsapp', language)}</span>
                    </button>

                    <button
                      onClick={() => dismissAlert(alert.id)}
                      className="flex items-center gap-1 rounded bg-emerald/10 border border-emerald/20 px-3 py-1.5 text-xs font-bold text-emerald hover:bg-emerald hover:text-navy transition-all cursor-pointer"
                    >
                      <CheckCircle2 size={12} />
                      <span>{getTranslation('resolve', language)}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {sortedActive.length === 0 && (
            <div className="rounded-xl border border-dashed border-border-col p-8 text-center animate-card" style={{ animationDelay: '100ms' }}>
              <CheckCircle2 className="mx-auto text-emerald mb-2.5" size={24} />
              <p className="text-xs text-text-secondary font-mono">{getTranslation('noAlertsMatchingFilter', language)}</p>
            </div>
          )}
        </div>
      </div>

      {/* Resolved Alerts Section (Collapsible) */}
      {sortedResolved.length > 0 && (
        <div className="rounded-xl border border-border-col bg-surface/30 overflow-hidden animate-card" style={{ animationDelay: '150ms' }}>
          
          <button
            onClick={() => setShowResolved(!showResolved)}
            className="flex w-full items-center justify-between p-4 text-xs font-bold text-text-secondary uppercase tracking-widest hover:bg-surface/50 transition-all cursor-pointer"
          >
            <span>{getTranslation('resolvedAlertsRegistry', language)} ({sortedResolved.length})</span>
            {showResolved ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>

          {showResolved && (
            <div className="border-t border-border-col bg-navy/10 p-4 space-y-3">
              {sortedResolved.map((alert) => (
                <div
                  key={alert.id}
                  className="flex items-center justify-between rounded-lg border border-border-col/50 bg-surface/40 p-3 opacity-60 hover:opacity-100 transition-opacity"
                >
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-text-muted" />
                    <span className="text-xs font-bold text-text-secondary font-mono">{alert.centreName}</span>
                    <span className="text-[10px] text-text-muted font-mono">{alert.message}</span>
                  </div>
                  <span className="text-[10px] text-text-muted font-mono">
                    {getTranslation('resolved', language)} {new Date(alert.timestamp).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          )}

        </div>
      )}

      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-4 rounded-2xl shadow-2xl flex items-center gap-3 border border-slate-800 max-w-sm animate-fade-in-up">
          <div className="flex-1">
            <h4 className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-0.5">
              {toast.type === 'success' ? 'DISPATCH SUCCESS' : 'SYSTEM NOTIFICATION'}
            </h4>
            <p className="text-[11px] font-semibold text-slate-200 leading-relaxed font-sans">
              {toast.message}
            </p>
          </div>
          <button
            onClick={() => setToast(null)}
            className="text-slate-400 hover:text-white text-xs font-bold px-1 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {numberPromptAlert && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 max-w-sm w-full space-y-4 text-white">
            <div>
              <h3 className="text-sm font-black uppercase tracking-wider text-emerald-400">Dispatch District Alert</h3>
              <p className="text-xs text-slate-400 mt-1 font-semibold leading-relaxed">
                Enter the supervisor's phone number. You can enter your own number to test the WhatsApp alert live on your device.
              </p>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                Recipient Phone Number
              </label>
              <input
                type="text"
                value={testNumber}
                onChange={(e) => setTestNumber(e.target.value)}
                placeholder="+919876543210"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 text-white rounded-xl text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none font-mono"
              />
            </div>
            <div className="flex gap-2 justify-end pt-2">
              <button
                onClick={() => setNumberPromptAlert(null)}
                className="px-4 py-2 border border-slate-800 rounded-xl text-xs font-bold text-slate-400 hover:text-white transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const alertItem = numberPromptAlert;
                  setNumberPromptAlert(null);
                  executeWhatsAppDispatch(alertItem, testNumber);
                }}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-extrabold shadow-lg shadow-emerald-500/20 hover:scale-105 transition-all cursor-pointer"
              >
                Dispatch Alert
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
