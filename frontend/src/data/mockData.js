export const DISTRICT = "Vellore, Tamil Nadu";

export const centres = [
  { id: "phc-001", name: "PHC Tambaram", type: "PHC", block: "Tambaram", healthScore: 34, bedsTotal: 10, bedsOccupied: 8, doctorsOnRoll: 2, doctorsPresent: 0, lastUpdated: "2026-07-01T08:30:00" },
  { id: "phc-002", name: "PHC Kanchipuram North", type: "PHC", block: "Kanchipuram", healthScore: 71, bedsTotal: 12, bedsOccupied: 5, doctorsOnRoll: 3, doctorsPresent: 3, lastUpdated: "2026-07-01T09:00:00" },
  { id: "chc-001", name: "CHC Vellore Central", type: "CHC", block: "Vellore", healthScore: 58, bedsTotal: 30, bedsOccupied: 22, doctorsOnRoll: 6, doctorsPresent: 4, lastUpdated: "2026-07-01T08:45:00" },
  { id: "phc-003", name: "PHC Gudiyatham", type: "PHC", block: "Gudiyatham", healthScore: 82, bedsTotal: 10, bedsOccupied: 3, doctorsOnRoll: 2, doctorsPresent: 2, lastUpdated: "2026-07-01T09:15:00" },
  { id: "phc-004", name: "PHC Arcot", type: "PHC", block: "Arcot", healthScore: 45, bedsTotal: 8, bedsOccupied: 7, doctorsOnRoll: 2, doctorsPresent: 1, lastUpdated: "2026-07-01T08:00:00" },
  { id: "phc-005", name: "PHC Ranipet", type: "PHC", block: "Ranipet", healthScore: 91, bedsTotal: 10, bedsOccupied: 2, doctorsOnRoll: 2, doctorsPresent: 2, lastUpdated: "2026-07-01T09:30:00" },
  { id: "phc-006", name: "PHC Walajah", type: "PHC", block: "Walajah", healthScore: 29, bedsTotal: 8, bedsOccupied: 8, doctorsOnRoll: 1, doctorsPresent: 0, lastUpdated: "2026-07-01T07:45:00" },
  { id: "chc-002", name: "CHC Katpadi", type: "CHC", block: "Katpadi", healthScore: 63, bedsTotal: 25, bedsOccupied: 14, doctorsOnRoll: 5, doctorsPresent: 4, lastUpdated: "2026-07-01T09:00:00" }
];

export const medicines = [
  { id: "m1", name: "Paracetamol 500mg", unit: "tablets", reorderLevel: 500 },
  { id: "m2", name: "ORS Sachets", unit: "sachets", reorderLevel: 200 },
  { id: "m3", name: "Amoxicillin 250mg", unit: "capsules", reorderLevel: 300 },
  { id: "m4", name: "Metformin 500mg", unit: "tablets", reorderLevel: 400 },
  { id: "m5", name: "Iron-Folic Acid", unit: "tablets", reorderLevel: 600 },
  { id: "m6", name: "Cotrimoxazole", unit: "tablets", reorderLevel: 200 },
  { id: "m7", name: "Chloroquine", unit: "tablets", reorderLevel: 150 },
  { id: "m8", name: "Ringer Lactate IV", unit: "bottles", reorderLevel: 50 }
];

export const stockData = {
  "phc-001": [
    { medicineId: "m1", currentStock: 120, dailyConsumption: 45, forecast30Days: 1350 },
    { medicineId: "m2", currentStock: 30, dailyConsumption: 12, forecast30Days: 360 },
    { medicineId: "m3", currentStock: 800, dailyConsumption: 20, forecast30Days: 600 },
    { medicineId: "m4", currentStock: 50, dailyConsumption: 18, forecast30Days: 540 },
    { medicineId: "m5", currentStock: 1200, dailyConsumption: 30, forecast30Days: 900 },
    { medicineId: "m6", currentStock: 15, dailyConsumption: 8, forecast30Days: 240 },
    { medicineId: "m7", currentStock: 200, dailyConsumption: 5, forecast30Days: 150 },
    { medicineId: "m8", currentStock: 80, dailyConsumption: 3, forecast30Days: 90 }
  ],
  "phc-002": [
    { medicineId: "m1", currentStock: 900, dailyConsumption: 38, forecast30Days: 1140 },
    { medicineId: "m2", currentStock: 450, dailyConsumption: 15, forecast30Days: 450 },
    { medicineId: "m3", currentStock: 600, dailyConsumption: 22, forecast30Days: 660 },
    { medicineId: "m4", currentStock: 700, dailyConsumption: 20, forecast30Days: 600 },
    { medicineId: "m5", currentStock: 800, dailyConsumption: 28, forecast30Days: 840 },
    { medicineId: "m6", currentStock: 300, dailyConsumption: 10, forecast30Days: 300 },
    { medicineId: "m7", currentStock: 180, dailyConsumption: 6, forecast30Days: 180 },
    { medicineId: "m8", currentStock: 60, dailyConsumption: 2, forecast30Days: 60 }
  ],
  "phc-003": [
    { medicineId: "m1", currentStock: 850, dailyConsumption: 30, forecast30Days: 900 },
    { medicineId: "m2", currentStock: 380, dailyConsumption: 10, forecast30Days: 300 },
    { medicineId: "m3", currentStock: 420, dailyConsumption: 15, forecast30Days: 450 },
    { medicineId: "m4", currentStock: 600, dailyConsumption: 18, forecast30Days: 540 },
    { medicineId: "m5", currentStock: 900, dailyConsumption: 25, forecast30Days: 750 },
    { medicineId: "m6", currentStock: 420, dailyConsumption: 8, forecast30Days: 240 },
    { medicineId: "m7", currentStock: 300, dailyConsumption: 4, forecast30Days: 120 },
    { medicineId: "m8", currentStock: 70, dailyConsumption: 2, forecast30Days: 60 }
  ],
  "phc-004": [
    { medicineId: "m1", currentStock: 400, dailyConsumption: 25, forecast30Days: 750 },
    { medicineId: "m2", currentStock: 180, dailyConsumption: 8, forecast30Days: 240 },
    { medicineId: "m3", currentStock: 320, dailyConsumption: 12, forecast30Days: 360 },
    { medicineId: "m4", currentStock: 350, dailyConsumption: 14, forecast30Days: 420 },
    { medicineId: "m5", currentStock: 500, dailyConsumption: 20, forecast30Days: 600 },
    { medicineId: "m6", currentStock: 190, dailyConsumption: 7, forecast30Days: 210 },
    { medicineId: "m7", currentStock: 110, dailyConsumption: 3, forecast30Days: 90 },
    { medicineId: "m8", currentStock: 40, dailyConsumption: 2, forecast30Days: 60 }
  ],
  "phc-005": [
    { medicineId: "m1", currentStock: 950, dailyConsumption: 32, forecast30Days: 960 },
    { medicineId: "m2", currentStock: 500, dailyConsumption: 12, forecast30Days: 360 },
    { medicineId: "m3", currentStock: 750, dailyConsumption: 16, forecast30Days: 480 },
    { medicineId: "m4", currentStock: 680, dailyConsumption: 15, forecast30Days: 450 },
    { medicineId: "m5", currentStock: 850, dailyConsumption: 22, forecast30Days: 660 },
    { medicineId: "m6", currentStock: 480, dailyConsumption: 6, forecast30Days: 180 },
    { medicineId: "m7", currentStock: 250, dailyConsumption: 2, forecast30Days: 60 },
    { medicineId: "m8", currentStock: 90, dailyConsumption: 1, forecast30Days: 30 }
  ],
  "phc-006": [
    { medicineId: "m1", currentStock: 200, dailyConsumption: 40, forecast30Days: 1200 },
    { medicineId: "m2", currentStock: 8, dailyConsumption: 12, forecast30Days: 360 },
    { medicineId: "m3", currentStock: 100, dailyConsumption: 18, forecast30Days: 540 },
    { medicineId: "m4", currentStock: 80, dailyConsumption: 15, forecast30Days: 450 },
    { medicineId: "m5", currentStock: 300, dailyConsumption: 22, forecast30Days: 660 },
    { medicineId: "m6", currentStock: 40, dailyConsumption: 9, forecast30Days: 270 },
    { medicineId: "m7", currentStock: 90, dailyConsumption: 5, forecast30Days: 150 },
    { medicineId: "m8", currentStock: 10, dailyConsumption: 3, forecast30Days: 90 }
  ],
  "chc-001": [
    { medicineId: "m1", currentStock: 1500, dailyConsumption: 60, forecast30Days: 1800 },
    { medicineId: "m2", currentStock: 600, dailyConsumption: 24, forecast30Days: 720 },
    { medicineId: "m3", currentStock: 900, dailyConsumption: 30, forecast30Days: 900 },
    { medicineId: "m4", currentStock: 1100, dailyConsumption: 35, forecast30Days: 1050 },
    { medicineId: "m5", currentStock: 1300, dailyConsumption: 40, forecast30Days: 1200 },
    { medicineId: "m6", currentStock: 500, dailyConsumption: 15, forecast30Days: 450 },
    { medicineId: "m7", currentStock: 350, dailyConsumption: 8, forecast30Days: 240 },
    { medicineId: "m8", currentStock: 150, dailyConsumption: 5, forecast30Days: 150 }
  ],
  "chc-002": [
    { medicineId: "m1", currentStock: 1100, dailyConsumption: 48, forecast30Days: 1440 },
    { medicineId: "m2", currentStock: 400, dailyConsumption: 18, forecast30Days: 540 },
    { medicineId: "m3", currentStock: 800, dailyConsumption: 25, forecast30Days: 750 },
    { medicineId: "m4", currentStock: 900, dailyConsumption: 28, forecast30Days: 840 },
    { medicineId: "m5", currentStock: 1000, dailyConsumption: 32, forecast30Days: 960 },
    { medicineId: "m6", currentStock: 420, dailyConsumption: 12, forecast30Days: 360 },
    { medicineId: "m7", currentStock: 280, dailyConsumption: 5, forecast30Days: 150 },
    { medicineId: "m8", currentStock: 110, dailyConsumption: 4, forecast30Days: 120 }
  ]
};

export const footfallData = {
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

export const attendanceData = [
  { centreId: "phc-001", centreName: "PHC Tambaram", doctor: "Dr. Meena Krishnan", specialization: "General Medicine", consecutiveAbsent: 4, status: "ABSENT" },
  { centreId: "phc-001", centreName: "PHC Tambaram", doctor: "Dr. Suresh Babu", specialization: "General Surgery", consecutiveAbsent: 0, status: "PRESENT" },
  { centreId: "phc-006", centreName: "PHC Walajah", doctor: "Dr. Ravi Shankar", specialization: "General Medicine", consecutiveAbsent: 6, status: "ABSENT" },
  { centreId: "chc-001", centreName: "CHC Vellore Central", doctor: "Dr. Priya Nair", specialization: "Gynaecology", consecutiveAbsent: 0, status: "PRESENT" },
  { centreId: "chc-001", centreName: "CHC Vellore Central", doctor: "Dr. Arun Kumar", specialization: "Paediatrics", consecutiveAbsent: 2, status: "ABSENT" },
  { centreId: "chc-001", centreName: "CHC Vellore Central", doctor: "Dr. Lakshmi Devi", specialization: "General Medicine", consecutiveAbsent: 0, status: "PRESENT" },
  { centreId: "phc-002", centreName: "PHC Kanchipuram North", doctor: "Dr. Vijay Kumar", specialization: "General Medicine", consecutiveAbsent: 0, status: "PRESENT" },
  { centreId: "phc-003", centreName: "PHC Gudiyatham", doctor: "Dr. Anitha Selvam", specialization: "General Medicine", consecutiveAbsent: 0, status: "PRESENT" }
];

export const ashaWorkers = [
  { id: "asha-001", name: "Lakshmi Devi", centreId: "phc-001", block: "Tambaram", village: "Perungalathur", householdsAssigned: 120, visitsThisWeek: 18, visitsRequired: 20, verifiedVisits: 15, suspiciousVisits: 2, workerScore: 72, lastVisit: "2026-07-01T10:00:00" },
  { id: "asha-002", name: "Sumathi R", centreId: "phc-001", block: "Tambaram", village: "Chitlapakkam", householdsAssigned: 95, visitsThisWeek: 5, visitsRequired: 19, verifiedVisits: 3, suspiciousVisits: 0, workerScore: 28, lastVisit: "2026-06-27T14:00:00" },
  { id: "asha-003", name: "Parvathi K", centreId: "phc-002", block: "Kanchipuram", village: "Uthiramerur", householdsAssigned: 110, visitsThisWeek: 22, visitsRequired: 22, verifiedVisits: 22, suspiciousVisits: 0, workerScore: 98, lastVisit: "2026-07-01T11:30:00" },
  { id: "asha-004", name: "Meenakshi S", centreId: "phc-006", block: "Walajah", village: "Arcot North", householdsAssigned: 88, visitsThisWeek: 21, visitsRequired: 18, verifiedVisits: 8, suspiciousVisits: 11, workerScore: 31, lastVisit: "2026-07-01T09:00:00" },
  { id: "asha-005", name: "Gomathi V", centreId: "phc-003", block: "Gudiyatham", village: "Gudiyatham West", householdsAssigned: 130, visitsThisWeek: 25, visitsRequired: 26, verifiedVisits: 24, suspiciousVisits: 0, workerScore: 94, lastVisit: "2026-07-01T12:00:00" },
  { id: "asha-006", name: "Radha M", centreId: "phc-006", block: "Walajah", village: "Walajah South", householdsAssigned: 102, visitsThisWeek: 0, visitsRequired: 20, verifiedVisits: 0, suspiciousVisits: 0, workerScore: 5, lastVisit: "2026-06-24T08:00:00" }
];

export const visitLogs = [
  { id: "v1", workerId: "asha-001", workerName: "Lakshmi Devi", householdId: "HH-1042", visitType: "ANC Checkup", notes: "Blood pressure measured, iron tablets distributed", photoSubmitted: true, verificationStatus: "VERIFIED", timestamp: "2026-07-01T10:00:00" },
  { id: "v2", workerId: "asha-004", workerName: "Meenakshi S", householdId: "HH-2031", visitType: "Immunization", notes: "Child vaccination done", photoSubmitted: true, verificationStatus: "SUSPICIOUS", timestamp: "2026-07-01T09:00:00", suspicionReason: "Photo metadata does not match reported location" },
  { id: "v3", workerId: "asha-002", workerName: "Sumathi R", householdId: "HH-1155", visitType: "TB Follow-up", notes: "Patient not at home", photoSubmitted: false, verificationStatus: "UNVERIFIED", timestamp: "2026-06-27T14:00:00" },
  { id: "v4", workerId: "asha-003", workerName: "Parvathi K", householdId: "HH-3022", visitType: "Postnatal Care", notes: "Mother and baby healthy, ORS distributed", photoSubmitted: true, verificationStatus: "VERIFIED", timestamp: "2026-07-01T11:30:00" },
  { id: "v5", workerId: "asha-005", workerName: "Gomathi V", householdId: "HH-4011", visitType: "Hypertension Follow-up", notes: "BP tablets refilled, diet counselling done", photoSubmitted: true, verificationStatus: "VERIFIED", timestamp: "2026-07-01T12:00:00" }
];

export const labTests = [
  "Blood CBC", "Urine Routine", "Malaria RDT", "Blood Sugar (FBS/PPBS)",
  "HIV Rapid Test", "Sputum AFB (TB)", "Pregnancy Test", "ECG", "X-Ray", "Haemoglobin"
];

export const labAvailability = {
  "phc-001": { "Blood CBC": true, "Urine Routine": true, "Malaria RDT": false, "Blood Sugar (FBS/PPBS)": true, "HIV Rapid Test": false, "Sputum AFB (TB)": false, "Pregnancy Test": true, "ECG": false, "X-Ray": false, "Haemoglobin": true, lastAudit: "2026-05-28" },
  "phc-002": { "Blood CBC": true, "Urine Routine": true, "Malaria RDT": true, "Blood Sugar (FBS/PPBS)": true, "HIV Rapid Test": true, "Sputum AFB (TB)": true, "Pregnancy Test": true, "ECG": true, "X-Ray": false, "Haemoglobin": true, lastAudit: "2026-06-20" },
  "chc-001": { "Blood CBC": true, "Urine Routine": true, "Malaria RDT": true, "Blood Sugar (FBS/PPBS)": true, "HIV Rapid Test": true, "Sputum AFB (TB)": true, "Pregnancy Test": true, "ECG": true, "X-Ray": true, "Haemoglobin": true, lastAudit: "2026-06-28" },
  "phc-003": { "Blood CBC": true, "Urine Routine": true, "Malaria RDT": true, "Blood Sugar (FBS/PPBS)": true, "HIV Rapid Test": false, "Sputum AFB (TB)": true, "Pregnancy Test": true, "ECG": false, "X-Ray": false, "Haemoglobin": true, lastAudit: "2026-06-15" },
  "phc-004": { "Blood CBC": true, "Urine Routine": false, "Malaria RDT": false, "Blood Sugar (FBS/PPBS)": true, "HIV Rapid Test": false, "Sputum AFB (TB)": false, "Pregnancy Test": true, "ECG": false, "X-Ray": false, "Haemoglobin": true, lastAudit: "2026-05-10" },
  "phc-005": { "Blood CBC": true, "Urine Routine": true, "Malaria RDT": true, "Blood Sugar (FBS/PPBS)": true, "HIV Rapid Test": true, "Sputum AFB (TB)": false, "Pregnancy Test": true, "ECG": true, "X-Ray": false, "Haemoglobin": true, lastAudit: "2026-06-25" },
  "phc-006": { "Blood CBC": false, "Urine Routine": true, "Malaria RDT": false, "Blood Sugar (FBS/PPBS)": false, "HIV Rapid Test": false, "Sputum AFB (TB)": false, "Pregnancy Test": true, "ECG": false, "X-Ray": false, "Haemoglobin": true, lastAudit: "2026-04-30" },
  "chc-002": { "Blood CBC": true, "Urine Routine": true, "Malaria RDT": true, "Blood Sugar (FBS/PPBS)": true, "HIV Rapid Test": true, "Sputum AFB (TB)": true, "Pregnancy Test": true, "ECG": true, "X-Ray": true, "Haemoglobin": true, lastAudit: "2026-06-30" }
};

export const alerts = [
  { id: "a1", severity: "CRITICAL", type: "STOCK_OUT", centreId: "phc-006", centreName: "PHC Walajah", message: "ORS Sachets critically low — 0.7 days remaining at current consumption.", recommendation: "Emergency transfer: 150 sachets from PHC Ranipet (surplus: 380 units)", timestamp: "2026-07-01T06:30:00", dismissed: false },
  { id: "a2", severity: "CRITICAL", type: "DOCTOR_ABSENT", centreId: "phc-006", centreName: "PHC Walajah", message: "Dr. Ravi Shankar absent for 6 consecutive days. Centre has 0 doctors present.", recommendation: "Deploy relief doctor from CHC Katpadi district roster immediately", timestamp: "2026-07-01T07:00:00", dismissed: false },
  { id: "a3", severity: "CRITICAL", type: "BED_CAPACITY", centreId: "phc-006", centreName: "PHC Walajah", message: "Bed occupancy at 100% (8/8). Cannot admit new IPD patients.", recommendation: "Redirect non-critical IPD cases to CHC Katpadi (11 beds available)", timestamp: "2026-07-01T08:00:00", dismissed: false },
  { id: "a4", severity: "CRITICAL", type: "ASHA_FAKE_REPORT", centreId: "phc-006", centreName: "PHC Walajah", message: "ASHA Worker Meenakshi S: 11 suspicious visits flagged. Photo metadata mismatch detected.", recommendation: "Block supervisor to conduct field verification in Arcot North village", timestamp: "2026-07-01T08:30:00", dismissed: false },
  { id: "a5", severity: "HIGH", type: "DOCTOR_ABSENT", centreId: "phc-001", centreName: "PHC Tambaram", message: "Dr. Meena Krishnan absent 4 consecutive days. Centre running 143 patients with 0 doctors.", recommendation: "Urgent: Request emergency deployment from district doctor pool", timestamp: "2026-07-01T07:15:00", dismissed: false },
  { id: "a6", severity: "HIGH", type: "STOCK_OUT", centreId: "phc-001", centreName: "PHC Tambaram", message: "Cotrimoxazole at 1.9 days remaining. Paracetamol at 2.7 days remaining.", recommendation: "Emergency stock transfer from PHC Gudiyatham (Cotrimoxazole: 420 units surplus)", timestamp: "2026-07-01T06:45:00", dismissed: false },
  { id: "a7", severity: "HIGH", type: "FOOTFALL_SURGE", centreId: "phc-001", centreName: "PHC Tambaram", message: "Today's footfall 57% above 7-day average (143 vs avg 91). No doctor present.", recommendation: "Deploy mobile medical unit to PHC Tambaram immediately", timestamp: "2026-07-01T09:00:00", dismissed: false },
  { id: "a8", severity: "HIGH", type: "ASHA_NO_VISIT", centreId: "phc-006", centreName: "PHC Walajah", message: "ASHA Worker Radha M: Zero visits logged in 7 days. Walajah South village unserved.", recommendation: "Supervisor field visit required. Reassign households to Meenakshi S temporarily.", timestamp: "2026-07-01T07:45:00", dismissed: false },
  { id: "a9", severity: "MEDIUM", type: "LAB_AUDIT", centreId: "phc-001", centreName: "PHC Tambaram", message: "Lab audit overdue by 34 days. Only 5/10 tests available.", recommendation: "Schedule audit. Request ECG machine and X-Ray service from district medical store.", timestamp: "2026-07-01T05:00:00", dismissed: false },
  { id: "a10", severity: "MEDIUM", type: "LAB_AUDIT", centreId: "phc-006", centreName: "PHC Walajah", message: "Lab audit overdue by 62 days. Only 2/10 tests available.", recommendation: "Immediate audit required. Centre critically under-equipped for diagnostics.", timestamp: "2026-07-01T05:30:00", dismissed: false },
  { id: "a11", severity: "MEDIUM", type: "STOCK_OUT", centreId: "phc-004", centreName: "PHC Arcot", message: "Paracetamol approaching reorder threshold — 9 days remaining.", recommendation: "Place monthly indent order with district pharmacy this week.", timestamp: "2026-07-01T07:30:00", dismissed: false }
];

export const redistributionSuggestions = [
  { from: "PHC Ranipet", to: "PHC Walajah", medicine: "ORS Sachets", quantity: 150, urgency: "CRITICAL", fromSurplus: 380 },
  { from: "PHC Gudiyatham", to: "PHC Tambaram", medicine: "Cotrimoxazole", quantity: 200, urgency: "CRITICAL", fromSurplus: 420 },
  { from: "PHC Kanchipuram North", to: "PHC Arcot", medicine: "Paracetamol 500mg", quantity: 400, urgency: "MEDIUM", fromSurplus: 900 },
  { from: "PHC Gudiyatham", to: "PHC Walajah", medicine: "Ringer Lactate IV", quantity: 30, urgency: "HIGH", fromSurplus: 70 }
];

export const agentMessages = [
  { agent: "SUPERVISOR", message: "Initiating district health analysis. Dispatching sub-agents.", timestamp: "07:00:01", direction: "OUT" },
  { agent: "STOCKSENSE", message: "Analyzing medicine inventory across 8 centres...", timestamp: "07:00:02", direction: "IN" },
  { agent: "STOCKSENSE", message: "REPORT: 6 critical stock items detected. PHC Walajah ORS at 0.7 days. PHC Tambaram Cotrimoxazole at 1.9 days. Redistribution map generated.", timestamp: "07:00:05", direction: "OUT" },
  { agent: "ATTENDAI", message: "Scanning doctor attendance records...", timestamp: "07:00:06", direction: "IN" },
  { agent: "ATTENDAI", message: "REPORT: 2 centres with zero doctors present (PHC Tambaram, PHC Walajah). 3 doctors absent 3+ days. Escalation required.", timestamp: "07:00:09", direction: "OUT" },
  { agent: "ASHATRACK", message: "Processing ASHA worker visit logs and photo verification...", timestamp: "07:00:10", direction: "IN" },
  { agent: "ASHATRACK", message: "REPORT: 11 suspicious visits flagged (Meenakshi S, Walajah). 1 worker with zero visits (Radha M, 7 days). Walajah South village completely unserved.", timestamp: "07:00:14", direction: "OUT" },
  { agent: "SUPERVISOR", message: "Synthesizing reports. Generating district intervention priority list...", timestamp: "07:00:15", direction: "IN" },
  { agent: "SUPERVISOR", message: "FINAL ASSESSMENT: PHC Walajah is in multi-system crisis (stock + staff + ASHA + labs). Immediate district intervention required. Recommended actions dispatched to District Health Officer.", timestamp: "07:00:18", direction: "OUT" }
];
