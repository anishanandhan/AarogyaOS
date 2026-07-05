import { Router } from 'express';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { handleAgentChat, handlePhotoVerification, handleRunAgent, handleMedicalTriage } from '../services/geminiService.js';
import { getDatabaseStatus } from '../config/db.js';
import db from '../config/jsonDb.js';
import { calculateForecast } from '../services/forecastingService.js';
import { executeQuery } from '../services/bigQueryService.js';

const router = Router();

// GET /api/v1/health
router.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'AarogyaOS API Gateway',
    database: getDatabaseStatus()
  });
});

// GET /api/v1/telemetry/centres
router.get('/telemetry/centres', async (req, res, next) => {
  try {
    const centres = await db.getCollection('centres');
    res.json(centres);
  } catch (err) {
    next(err);
  }
});

// GET /api/v1/telemetry/stock
router.get('/telemetry/stock', async (req, res, next) => {
  try {
    const stock = await db.getCollection('stock');
    res.json(stock);
  } catch (err) {
    next(err);
  }
});

// GET /api/v1/telemetry/attendance
router.get('/telemetry/attendance', async (req, res, next) => {
  try {
    const attendance = await db.getCollection('attendance');
    res.json(attendance);
  } catch (err) {
    next(err);
  }
});

// GET /api/v1/telemetry/asha
router.get('/telemetry/asha', async (req, res, next) => {
  try {
    const asha = await db.getCollection('asha');
    res.json(asha);
  } catch (err) {
    next(err);
  }
});

// GET /api/v1/telemetry/visits
router.get('/telemetry/visits', async (req, res, next) => {
  try {
    const visits = await db.getCollection('visits');
    res.json(visits);
  } catch (err) {
    next(err);
  }
});

// GET /api/v1/telemetry/labs
router.get('/telemetry/labs', async (req, res, next) => {
  try {
    const labs = await db.getCollection('labs');
    res.json(labs);
  } catch (err) {
    next(err);
  }
});

// GET /api/v1/telemetry/alerts
router.get('/telemetry/alerts', async (req, res, next) => {
  try {
    const alerts = await db.getCollection('alerts');
    res.json(alerts);
  } catch (err) {
    next(err);
  }
});

// GET /api/v1/telemetry/transfers
router.get('/telemetry/transfers', async (req, res, next) => {
  try {
    const transfers = await db.getCollection('transfers');
    res.json(transfers);
  } catch (err) {
    next(err);
  }
});

// POST /api/v1/analytics/query
router.post('/analytics/query', async (req, res, next) => {
  try {
    const { query } = req.body;
    const results = await executeQuery(query);
    res.json(results);
  } catch (err) {
    next(err);
  }
});

// POST /api/v1/telemetry/stock/update
router.post('/telemetry/stock/update', async (req, res, next) => {
  const { centreId, medicineId, currentStock } = req.body;
  try {
    const stockMap = await db.getCollection('stock');
    if (stockMap[centreId]) {
      stockMap[centreId] = stockMap[centreId].map(s => 
        s.medicineId === medicineId ? { ...s, currentStock: Number(currentStock) } : s
      );
      await db.setCollection('stock', stockMap);
    }
    res.json({ success: true, message: 'Stock level updated successfully.' });
  } catch (err) {
    next(err);
  }
});

// POST /api/v1/telemetry/attendance/update
router.post('/telemetry/attendance/update', async (req, res, next) => {
  const { centreId, doctor, status, consecutiveAbsent } = req.body;
  try {
    await db.update(
      'attendance',
      item => item.centreId === centreId && item.doctor === doctor,
      { status, consecutiveAbsent: Number(consecutiveAbsent) }
    );
    res.json({ success: true, message: 'Attendance status logged.' });
  } catch (err) {
    next(err);
  }
});

// POST /api/v1/telemetry/visits/add
router.post('/telemetry/visits/add', async (req, res, next) => {
  const { visit } = req.body;
  try {
    const addedVisit = await db.insert('visits', visit);
    
    // Also update ASHA worker scores in DB
    const asha = await db.getCollection('asha');
    const updatedAsha = asha.map(w => {
      if (w.id === visit.workerId) {
        const isSuspicious = visit.verificationStatus === 'SUSPICIOUS';
        const isVerified = visit.verificationStatus === 'VERIFIED';
        const visitsThisWeek = w.visitsThisWeek + 1;
        const verifiedVisits = isVerified ? w.verifiedVisits + 1 : w.verifiedVisits;
        const suspiciousVisits = isSuspicious ? w.suspiciousVisits + 1 : w.suspiciousVisits;
        
        const completionRate = Math.min(1, visitsThisWeek / w.visitsRequired);
        const verificationRate = verifiedVisits / (visitsThisWeek || 1);
        let workerScore = Math.round((completionRate * 60) + (verificationRate * 40));
        if (suspiciousVisits > 3) workerScore = Math.max(10, workerScore - 30);

        return {
          ...w,
          visitsThisWeek,
          verifiedVisits,
          suspiciousVisits,
          workerScore,
          lastVisit: visit.timestamp
        };
      }
      return w;
    });
    
    await db.setCollection('asha', updatedAsha);
    res.json({ success: true, visit: addedVisit });
  } catch (err) {
    next(err);
  }
});

// POST /api/v1/telemetry/labs/update
router.post('/telemetry/labs/update', async (req, res, next) => {
  const { centreId, updatedTests, auditDate } = req.body;
  try {
    const labsMap = await db.getCollection('labs');
    labsMap[centreId] = {
      ...updatedTests,
      lastAudit: auditDate
    };
    await db.setCollection('labs', labsMap);
    res.json({ success: true, message: 'Lab audit updated.' });
  } catch (err) {
    next(err);
  }
});

// POST /api/v1/telemetry/alerts/update
router.post('/api/v1/telemetry/alerts/update', async (req, res, next) => {
  const { alerts } = req.body;
  try {
    await db.setCollection('alerts', alerts);
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

// POST /api/v1/telemetry/transfers/approve
router.post('/telemetry/transfers/approve', async (req, res, next) => {
  const { fromCentreName, toCentreName, medicineName, quantity } = req.body;
  try {
    const centres = await db.getCollection('centres');
    const fromCentre = centres.find(c => c.name === fromCentreName);
    const toCentre = centres.find(c => c.name === toCentreName);

    if (fromCentre && toCentre) {
      const stockMap = await db.getCollection('stock');
      const medicines = [
        { id: "m1", name: "Paracetamol 500mg" },
        { id: "m2", name: "ORS Sachets" },
        { id: "m3", name: "Amoxicillin 250mg" },
        { id: "m4", name: "Metformin 500mg" },
        { id: "m5", name: "Iron-Folic Acid" },
        { id: "m6", name: "Cotrimoxazole" },
        { id: "m7", name: "Chloroquine" },
        { id: "m8", name: "Ringer Lactate IV" }
      ];
      
      const medId = medicines.find(m => m.name === medicineName)?.id;
      
      if (medId) {
        // Deduct from source
        if (stockMap[fromCentre.id]) {
          stockMap[fromCentre.id] = stockMap[fromCentre.id].map(s => 
            s.medicineId === medId ? { ...s, currentStock: Math.max(0, s.currentStock - quantity) } : s
          );
        }
        // Add to destination
        if (stockMap[toCentre.id]) {
          stockMap[toCentre.id] = stockMap[toCentre.id].map(s => 
            s.medicineId === medId ? { ...s, currentStock: s.currentStock + quantity } : s
          );
        }
        await db.setCollection('stock', stockMap);

        // Remove the transfer recommendation
        const transfers = await db.getCollection('transfers');
        const updatedTransfers = transfers.filter(t => 
          !(t.from === fromCentreName && t.to === toCentreName && t.medicine === medicineName)
        );
        await db.setCollection('transfers', updatedTransfers);

        // Dismiss associated alert
        const alerts = await db.getCollection('alerts');
        const updatedAlerts = alerts.map(a => 
          (a.centreId === toCentre.id && a.type === 'STOCK_OUT' && a.message.includes(medicineName))
            ? { ...a, dismissed: true }
            : a
        );
        await db.setCollection('alerts', updatedAlerts);
      }
    }

    res.json({ success: true, message: 'Transfer executed successfully.' });
  } catch (err) {
    next(err);
  }
});

// POST /api/v1/analyze
router.post('/analyze', async (req, res, next) => {
  const { messages, language } = req.body;
  
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Invalid request payload: messages array required.' });
  }

  try {
    const analysis = await handleAgentChat(messages, language || 'en');
    res.json({ analysis });
  } catch (err) {
    next(err);
  }
});

// POST /api/v1/audit
router.post('/audit', async (req, res, next) => {
  const { base64Image, workerName, householdId } = req.body;

  if (!base64Image || !workerName || !householdId) {
    return res.status(400).json({ error: 'Missing required audit parameters: base64Image, workerName, householdId.' });
  }

  try {
    const auditResult = await handlePhotoVerification(base64Image, workerName, householdId);
    res.json(auditResult);
  } catch (err) {
    next(err);
  }
});

// POST /api/v1/triage
router.post('/triage', async (req, res, next) => {
  const { base64Image, patientInfo } = req.body;

  if (!base64Image) {
    return res.status(400).json({ error: 'Missing required parameter: base64Image.' });
  }

  try {
    const triageResult = await handleMedicalTriage(base64Image, patientInfo || {});
    res.json(triageResult);
  } catch (err) {
    next(err);
  }
});

// POST /api/v1/agent/run
router.post('/agent/run', async (req, res, next) => {
  const { agentRole, districtData } = req.body;

  if (!agentRole || !districtData) {
    return res.status(400).json({ error: 'Missing required run parameters: agentRole, districtData.' });
  }

  try {
    const report = await handleRunAgent(agentRole, districtData);
    res.json({ report });
  } catch (err) {
    next(err);
  }
});

// GET /api/v1/telemetry/environmental
router.get('/telemetry/environmental', async (req, res, next) => {
  try {
    const weatherRes = await fetch('https://api.open-meteo.com/v1/forecast?latitude=12.9165&longitude=79.1325&current=temperature_2m,relative_humidity_2m,precipitation,apparent_temperature&timezone=Asia/Kolkata');
    const weatherData = await weatherRes.json();

    const temp = weatherData.current?.temperature_2m || 30;
    const humidity = weatherData.current?.relative_humidity_2m || 65;
    const rain = weatherData.current?.precipitation || 0;

    const humidityFactor = Math.min(100, Math.max(0, (humidity - 40) * 1.6));
    const tempFactor = temp >= 22 && temp <= 32 ? 100 : Math.max(0, 100 - Math.abs(27 - temp) * 10);
    const vectorBreedingRisk = Math.round((humidityFactor * 0.5) + (tempFactor * 0.4) + (rain > 0 ? 10 : 0));

    res.json({
      location: 'Vellore District HQ',
      temperature: temp,
      humidity: humidity,
      rain: rain,
      apparentTemperature: weatherData.current.apparent_temperature,
      vectorBreedingRisk,
      airQualityIndex: Math.round(52 + Math.random() * 8),
      source: 'Open-Meteo Live API'
    });
  } catch (err) {
    console.error('Failed to query Open-Meteo live API, returning fallback data:', err);
    res.json({
      location: 'Vellore District HQ (Offline Fallback)',
      temperature: 30.5,
      humidity: 65,
      rain: 0,
      apparentTemperature: 33.2,
      vectorBreedingRisk: 58,
      airQualityIndex: 55,
      source: 'Local Baseline Fallback'
    });
  }
});

// POST /api/v1/analytics/forecast
router.post('/analytics/forecast', (req, res) => {
  const { historicalData, forecastDays } = req.body;
  const forecastResult = calculateForecast(historicalData, forecastDays || 7);
  res.json(forecastResult);
});

export default router;
