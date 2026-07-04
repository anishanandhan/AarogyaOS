import { Router } from 'express';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { handleAgentChat, handlePhotoVerification, handleRunAgent } from '../services/geminiService.js';
import { getDatabaseStatus } from '../config/db.js';

const router = Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATASETS_DIR = path.join(__dirname, '../../../datasets');

async function loadDataset(filename) {
  try {
    const filepath = path.join(DATASETS_DIR, filename);
    const data = await fs.readFile(filepath, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.error(`Error loading dataset ${filename}:`, err);
    throw new Error(`Failed to load mock dataset: ${filename}`);
  }
}

// GET /api/v1/health
router.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'AarogyaOS API Gateway',
    database: getDatabaseStatus()
  });
});

// GET /api/v1/telemetry/clinics
router.get('/telemetry/clinics', async (req, res, next) => {
  try {
    const clinics = await loadDataset('clinics.json');
    res.json(clinics);
  } catch (err) {
    next(err);
  }
});

// GET /api/v1/telemetry/visits
router.get('/telemetry/visits', async (req, res, next) => {
  try {
    const visits = await loadDataset('asha_visits.json');
    res.json(visits);
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

export default router;
