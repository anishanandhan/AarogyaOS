import { createContext, useContext, useState, useEffect } from 'react';
import { 
  alerts as initialAlerts, 
  centres as initialCentres, 
  stockData as initialStockData,
  attendanceData as initialAttendanceData,
  ashaWorkers as initialAshaWorkers,
  visitLogs as initialVisitLogs,
  labAvailability as initialLabAvailability,
  redistributionSuggestions as initialTransfers,
  medicines
} from '../data/mockData';

const AppContext = createContext();
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1';

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
  const [transfers, setTransfers] = useState(initialTransfers);

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

  // Fetch initial telemetry from backend JSON Database on mount
  useEffect(() => {
    async function fetchInitialData() {
      try {
        const [resCentres, resStock, resAttendance, resAsha, resVisits, resLabs, resAlerts, resTransfers] = await Promise.all([
          fetch(`${API_BASE_URL}/telemetry/centres`).then(r => r.json()),
          fetch(`${API_BASE_URL}/telemetry/stock`).then(r => r.json()),
          fetch(`${API_BASE_URL}/telemetry/attendance`).then(r => r.json()),
          fetch(`${API_BASE_URL}/telemetry/asha`).then(r => r.json()),
          fetch(`${API_BASE_URL}/telemetry/visits`).then(r => r.json()),
          fetch(`${API_BASE_URL}/telemetry/labs`).then(r => r.json()),
          fetch(`${API_BASE_URL}/telemetry/alerts`).then(r => r.json()),
          fetch(`${API_BASE_URL}/telemetry/transfers`).then(r => r.json())
        ]);
        
        setCentres(resCentres);
        setStock(resStock);
        setAttendance(resAttendance);
        setAsha(resAsha);
        setVisits(resVisits);
        setLabs(resLabs);
        setAlerts(resAlerts);
        setTransfers(resTransfers);
      } catch (err) {
        console.error('[AppContext] Failed to fetch telemetry from server, using local fallbacks:', err);
      }
    }
    fetchInitialData();
  }, []);

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

  const dismissAlert = async (id) => {
    const updatedAlerts = alerts.map(a => a.id === id ? { ...a, dismissed: true } : a);
    setAlerts(updatedAlerts);
    try {
      await fetch(`${API_BASE_URL}/telemetry/alerts/update`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ alerts: updatedAlerts })
      });
    } catch (err) {
      console.error('Failed to sync dismissed alert:', err);
    }
  };

  const updateStock = async (centreId, medicineId, newStockQuantity) => {
    setStock(prev => {
      const updated = { ...prev };
      if (updated[centreId]) {
        updated[centreId] = updated[centreId].map(s => {
          if (s.medicineId === medicineId) {
            return { ...s, currentStock: Number(newStockQuantity) };
          }
          return s;
        });
      }
      return updated;
    });

    try {
      await fetch(`${API_BASE_URL}/telemetry/stock/update`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ centreId, medicineId, currentStock: newStockQuantity })
      });
    } catch (err) {
      console.error('Failed to sync stock update:', err);
    }
  };

  const logAttendance = async (centreId, doctorName, status) => {
    let consecutiveAbsent = 0;
    setAttendance(prev => {
      return prev.map(a => {
        if (a.centreId === centreId && a.doctor === doctorName) {
          const isAbsent = status === 'ABSENT';
          consecutiveAbsent = isAbsent ? a.consecutiveAbsent + 1 : 0;
          return {
            ...a,
            status,
            consecutiveAbsent
          };
        }
        return a;
      });
    });

    try {
      await fetch(`${API_BASE_URL}/telemetry/attendance/update`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ centreId, doctor: doctorName, status, consecutiveAbsent })
      });
    } catch (err) {
      console.error('Failed to sync attendance update:', err);
    }
  };

  const submitVisitLog = async (newVisit) => {
    const visitId = `v-${Date.now()}`;
    const log = {
      id: visitId,
      ...newVisit,
      timestamp: new Date().toISOString()
    };
    
    setVisits(prev => [log, ...prev]);

    try {
      await fetch(`${API_BASE_URL}/telemetry/visits/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ visit: log })
      });
      
      const resAsha = await fetch(`${API_BASE_URL}/telemetry/asha`).then(r => r.json());
      setAsha(resAsha);
    } catch (err) {
      console.error('Failed to sync visit log:', err);
    }
  };

  const updateLabAudit = async (centreId, updatedTests, auditDate) => {
    setLabs(prev => {
      return {
        ...prev,
        [centreId]: {
          ...updatedTests,
          lastAudit: auditDate
        }
      };
    });

    try {
      await fetch(`${API_BASE_URL}/telemetry/labs/update`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ centreId, updatedTests, auditDate })
      });
    } catch (err) {
      console.error('Failed to sync lab audit:', err);
    }
  };

  const approveTransfer = async (transfer) => {
    try {
      const res = await fetch(`${API_BASE_URL}/telemetry/transfers/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fromCentreName: transfer.from,
          toCentreName: transfer.to,
          medicineName: transfer.medicine,
          quantity: transfer.quantity
        })
      });
      if (res.ok) {
        const [newStock, newAlerts, newTransfers] = await Promise.all([
          fetch(`${API_BASE_URL}/telemetry/stock`).then(r => r.json()),
          fetch(`${API_BASE_URL}/telemetry/alerts`).then(r => r.json()),
          fetch(`${API_BASE_URL}/telemetry/transfers`).then(r => r.json())
        ]);
        setStock(newStock);
        setAlerts(newAlerts);
        setTransfers(newTransfers);
      }
    } catch (error) {
      console.error('Failed to approve stock transfer:', error);
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
      transfers,
      dismissAlert, 
      updateStock, 
      logAttendance, 
      submitVisitLog, 
      updateLabAudit,
      approveTransfer,
      logout,
      activeAlerts, 
      criticalCount 
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
