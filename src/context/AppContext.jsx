import { createContext, useContext, useState, useEffect } from 'react';
import { 
  alerts as initialAlerts, 
  centres as initialCentres, 
  stockData as initialStockData,
  attendanceData as initialAttendanceData,
  ashaWorkers as initialAshaWorkers,
  visitLogs as initialVisitLogs,
  labAvailability as initialLabAvailability,
  medicines
} from '../data/mockData';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [userRole, setUserRole] = useState(() => {
    return localStorage.getItem('smart_health_role') || null;
  });
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('smart_health_language') || 'en';
  });
  const [alerts, setAlerts] = useState(initialAlerts);
  const [centres, setCentres] = useState(initialCentres);
  const [stock, setStock] = useState(initialStockData);
  const [attendance, setAttendance] = useState(initialAttendanceData);
  const [asha, setAsha] = useState(initialAshaWorkers);
  const [visits, setVisits] = useState(initialVisitLogs);
  const [labs, setLabs] = useState(initialLabAvailability);

  // Sync role to localStorage to survive reload during test/demo
  useEffect(() => {
    if (userRole) {
      localStorage.setItem('smart_health_role', userRole);
    } else {
      localStorage.removeItem('smart_health_role');
    }
  }, [userRole]);

  // Sync language preference to localStorage
  useEffect(() => {
    localStorage.setItem('smart_health_language', language);
  }, [language]);

  // Recalculate health scores for each centre dynamically based on current state
  // 5 pillars of 20 points each:
  // 1. Stock: (medicines above reorder / total medicines) * 20
  // 2. Beds: ((bedsTotal - bedsOccupied) / bedsTotal) * 20 -- wait, usually high occupation is bad if full, or let's say: (1 - occupied/total) * 20 or if beds available > 0 get 20, else if 100% occupied get 5 points.
  // 3. Doctors: (present doctors / doctors on roll) * 20
  // 4. ASHA visits: (average workerScore / 100) * 20
  // 5. Labs: (available tests / 10) * 20
  const recalculateHealthScores = () => {
    setCentres(prevCentres => {
      return prevCentres.map(c => {
        let stockScore = 20;
        const cStocks = stock[c.id];
        if (cStocks) {
          const criticalStocks = cStocks.filter(s => s.currentStock / s.dailyConsumption < 7).length;
          stockScore = Math.max(0, 20 - (criticalStocks * 4));
        }

        const bedPercent = c.bedsOccupied / c.bedsTotal;
        const bedScore = bedPercent >= 1.0 ? 5 : bedPercent > 0.8 ? 12 : 20;

        const doctorsOn = attendance.filter(a => a.centreId === c.id);
        const presentD = doctorsOn.filter(a => a.status === 'PRESENT').length;
        const totalD = doctorsOn.length || 1;
        const doctorScore = (presentD / totalD) * 20;

        const cAsha = asha.filter(w => w.centreId === c.id);
        const avgAshaScore = cAsha.length 
          ? cAsha.reduce((sum, w) => sum + w.workerScore, 0) / cAsha.length
          : 80;
        const ashaScore = (avgAshaScore / 100) * 20;

        const cLabs = labs[c.id];
        let labScore = 10;
        if (cLabs) {
          const availableTests = Object.keys(cLabs).filter(k => k !== 'lastAudit' && cLabs[k] === true).length;
          labScore = (availableTests / 10) * 20;
        }

        const newScore = Math.min(100, Math.round(stockScore + bedScore + doctorScore + ashaScore + labScore));
        
        // Return updated centre object
        return {
          ...c,
          healthScore: newScore,
          doctorsOnRoll: totalD,
          doctorsPresent: presentD
        };
      });
    });
  };

  // Re-run health score calculation when stock, attendance, asha, or labs change
  useEffect(() => {
    recalculateHealthScores();
  }, [stock, attendance, asha, labs]);

  const dismissAlert = (id) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, dismissed: true } : a));
  };

  const updateStock = (centreId, medicineId, newStockQuantity) => {
    setStock(prev => {
      const updated = { ...prev };
      if (updated[centreId]) {
        updated[centreId] = updated[centreId].map(s => {
          if (s.medicineId === medicineId) {
            return { ...s, currentStock: Number(newStockQuantity) };
          }
          return s;
        });
      } else {
        // Fallback create initial stock if missing
        updated[centreId] = medicines.map(m => ({
          medicineId: m.id,
          currentStock: m.id === medicineId ? Number(newStockQuantity) : 300,
          dailyConsumption: 15,
          forecast30Days: 450
        }));
      }
      return updated;
    });

    // Check if we should auto-resolve or create alerts based on stock
    const med = medicines.find(m => m.id === medicineId);
    const medName = med ? med.name : 'Medicine';
    const cName = centres.find(c => c.id === centreId)?.name || 'PHC';

    const cStockInfo = stock[centreId]?.find(s => s.medicineId === medicineId);
    const consumption = cStockInfo ? cStockInfo.dailyConsumption : 15;
    const daysRemaining = newStockQuantity / consumption;

    if (daysRemaining < 7) {
      // Create a new stockout alert if it doesn't already exist active
      const alertExists = alerts.some(a => a.centreId === centreId && a.type === 'STOCK_OUT' && !a.dismissed && a.message.includes(medName));
      if (!alertExists) {
        const newAlert = {
          id: `a-stock-${Date.now()}`,
          severity: daysRemaining < 3 ? "CRITICAL" : "HIGH",
          type: "STOCK_OUT",
          centreId,
          centreName: cName,
          message: `${medName} critically low — ${daysRemaining.toFixed(1)} days remaining at current consumption.`,
          recommendation: `Place monthly indent order or request stock redistribution immediately.`,
          timestamp: new Date().toISOString(),
          dismissed: false
        };
        setAlerts(prev => [newAlert, ...prev]);
      }
    } else {
      // Resolve existing alerts for this stock
      setAlerts(prev => prev.map(a => {
        if (a.centreId === centreId && a.type === 'STOCK_OUT' && a.message.includes(medName)) {
          return { ...a, dismissed: true };
        }
        return a;
      }));
    }
  };

  const logAttendance = (centreId, doctorName, status) => {
    setAttendance(prev => {
      return prev.map(a => {
        if (a.centreId === centreId && a.doctor === doctorName) {
          const isAbsent = status === 'ABSENT';
          const newConsecutive = isAbsent ? a.consecutiveAbsent + 1 : 0;
          
          // Trigger alert if absent 3+ consecutive days
          if (isAbsent && newConsecutive >= 3) {
            const alertExists = alerts.some(al => al.centreId === centreId && al.type === 'DOCTOR_ABSENT' && !al.dismissed && al.message.includes(doctorName));
            if (!alertExists) {
              const newAlert = {
                id: `a-doc-${Date.now()}`,
                severity: newConsecutive >= 5 ? "CRITICAL" : "HIGH",
                type: "DOCTOR_ABSENT",
                centreId,
                centreName: a.centreName,
                message: `${doctorName} absent for ${newConsecutive} consecutive days. Staff-to-patient ratio compromised.`,
                recommendation: `Deploy relief doctor from district doctor roster immediately.`,
                timestamp: new Date().toISOString(),
                dismissed: false
              };
              setAlerts(alPrev => [newAlert, ...alPrev]);
            }
          } else if (!isAbsent) {
            // Resolve absenteeism alerts
            setAlerts(alPrev => alPrev.map(al => {
              if (al.centreId === centreId && al.type === 'DOCTOR_ABSENT' && al.message.includes(doctorName)) {
                return { ...al, dismissed: true };
              }
              return al;
            }));
          }

          return {
            ...a,
            status,
            consecutiveAbsent: newConsecutive
          };
        }
        return a;
      });
    });
  };

  const submitVisitLog = (newVisit) => {
    const visitId = `v-${Date.now()}`;
    const log = {
      id: visitId,
      ...newVisit,
      timestamp: new Date().toISOString()
    };
    
    setVisits(prev => [log, ...prev]);

    // Update ASHA worker stats
    setAsha(prevAsha => {
      return prevAsha.map(w => {
        if (w.id === newVisit.workerId) {
          const isSuspicious = newVisit.verificationStatus === 'SUSPICIOUS';
          const isVerified = newVisit.verificationStatus === 'VERIFIED';
          
          const newVisitsThisWeek = w.visitsThisWeek + 1;
          const newVerified = isVerified ? w.verifiedVisits + 1 : w.verifiedVisits;
          const newSuspicious = isSuspicious ? w.suspiciousVisits + 1 : w.suspiciousVisits;
          
          // Recalculate score: completion rate * 60 + verification rate * 40
          const completionRate = Math.min(1, newVisitsThisWeek / w.visitsRequired);
          const totalLogged = newVisitsThisWeek || 1;
          const verificationRate = newVerified / totalLogged;
          
          let workerScore = Math.round((completionRate * 60) + (verificationRate * 40));
          if (newSuspicious > 3) workerScore = Math.max(10, workerScore - 30);

          // Alert for Fake Reporting
          if (isSuspicious && newSuspicious > 3) {
            const alertExists = alerts.some(a => a.type === 'ASHA_FAKE_REPORT' && !a.dismissed && a.message.includes(w.name));
            if (!alertExists) {
              const newAlert = {
                id: `a-asha-${Date.now()}`,
                severity: "CRITICAL",
                type: "ASHA_FAKE_REPORT",
                centreId: w.centreId,
                centreName: centres.find(c => c.id === w.centreId)?.name || 'PHC',
                message: `ASHA Worker ${w.name}: ${newSuspicious} suspicious visits flagged. Photo metadata mismatch detected.`,
                recommendation: `Block supervisor to conduct field audit in ${w.village} village.`,
                timestamp: new Date().toISOString(),
                dismissed: false
              };
              setAlerts(alPrev => [newAlert, ...alPrev]);
            }
          }

          return {
            ...w,
            visitsThisWeek: newVisitsThisWeek,
            verifiedVisits: newVerified,
            suspiciousVisits: newSuspicious,
            workerScore,
            lastVisit: log.timestamp
          };
        }
        return w;
      });
    });
  };

  const updateLabAudit = (centreId, updatedTests, auditDate) => {
    setLabs(prev => {
      return {
        ...prev,
        [centreId]: {
          ...updatedTests,
          lastAudit: auditDate
        }
      };
    });

    // Check if tests missing and audit date is overdue
    const cName = centres.find(c => c.id === centreId)?.name || 'PHC';
    const totalAvailable = Object.keys(updatedTests).filter(k => k !== 'lastAudit' && updatedTests[k] === true).length;
    
    if (totalAvailable < 5) {
      const alertExists = alerts.some(a => a.centreId === centreId && a.type === 'LAB_AUDIT' && !a.dismissed);
      if (!alertExists) {
        const newAlert = {
          id: `a-lab-${Date.now()}`,
          severity: "HIGH",
          type: "LAB_AUDIT",
          centreId,
          centreName: cName,
          message: `Lab audit reports only ${totalAvailable}/10 standard diagnostic tests available.`,
          recommendation: `Schedule diagnostic supplies dispatch. Audit is priority.`,
          timestamp: new Date().toISOString(),
          dismissed: false
        };
        setAlerts(alPrev => [newAlert, ...alPrev]);
      }
    } else {
      // Resolve
      setAlerts(alPrev => alPrev.map(a => {
        if (a.centreId === centreId && a.type === 'LAB_AUDIT') {
          return { ...a, dismissed: true };
        }
        return a;
      }));
    }
  };

  const logout = () => {
    setUserRole(null);
  };

  const activeAlerts = alerts.filter(a => !a.dismissed);
  const criticalCount = activeAlerts.filter(a => a.severity === 'CRITICAL').length;

  return (
    <AppContext.Provider value={{ 
      userRole, 
      setUserRole, 
      language, 
      setLanguage, 
      alerts, 
      setAlerts,
      centres, 
      stock, 
      attendance, 
      asha, 
      visits, 
      labs, 
      dismissAlert, 
      updateStock, 
      logAttendance, 
      submitVisitLog, 
      updateLabAudit,
      logout,
      activeAlerts, 
      criticalCount 
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
