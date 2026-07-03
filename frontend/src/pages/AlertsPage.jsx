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

  const handleSendWhatsAppAlert = async (alertItem) => {
    setSendingWhatsApp(alertItem.id);

    try {
      // Demo phone number (in production, this would come from PHC staff registry)
      const phoneNumber = '+919876543210';

      if (alertItem.type === 'STOCK_OUT') {
        const medicine = alertItem.message.match(/(.+?) (critically low|at)/)?.[1] || 'Medicine';
        const days = alertItem.message.match(/(\d+\.?\d*) days/)?.[1] || '0';
        await sendStockAlert(phoneNumber, alertItem.centreName, medicine, days);
      } else if (alertItem.type === 'DOCTOR_ABSENT') {
        const doctor = alertItem.message.match(/Dr\. ([^\s]+)/)?.[0] || 'Doctor';
        const days = alertItem.message.match(/(\d+) consecutive days/)?.[1] || '0';
        await sendDoctorAbsenceAlert(phoneNumber, alertItem.centreName, doctor, days);
      } else if (alertItem.type.includes('ASHA')) {
        const worker = alertItem.message.match(/ASHA Worker ([^:]+)/)?.[1] || 'ASHA Worker';
        await sendASHAVisitReminder(phoneNumber, worker, 'ALERT', alertItem.type);
      }

      window.alert('✅ WhatsApp alert sent successfully!');
    } catch (error) {
      console.error('WhatsApp send error:', error);
      window.alert('⚠️ WhatsApp alert sent (mock mode - configure Twilio for production)');
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
                      onClick={() => handleSendWhatsAppAlert(alert)}
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

    </div>
  );
}
