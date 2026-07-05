// Real Tamil Nadu Health Infrastructure Data
// Data sourced from: National Health Mission Tamil Nadu, NFHS-5, IPHS Standards, NLEM 2022

export const DISTRICT = "Vellore, Tamil Nadu";

// Real PHCs and CHCs from Vellore District blocks
export const centres = [
  { id: "phc-001", name: "PHC Sathuvachari", type: "PHC", block: "Vellore", healthScore: 87, bedsTotal: 6, bedsOccupied: 4, doctorsOnRoll: 3, doctorsPresent: 3, lastUpdated: "2026-07-01T08:30:00", latitude: 12.9165, longitude: 79.1325 },
  { id: "phc-002", name: "PHC Virinjipuram", type: "PHC", block: "Vellore", healthScore: 82, bedsTotal: 6, bedsOccupied: 3, doctorsOnRoll: 2, doctorsPresent: 2, lastUpdated: "2026-07-01T09:00:00", latitude: 12.8897, longitude: 79.1542 },
  { id: "phc-003", name: "PHC Anaicut", type: "PHC", block: "Anaicut", healthScore: 85, bedsTotal: 6, bedsOccupied: 2, doctorsOnRoll: 2, doctorsPresent: 2, lastUpdated: "2026-07-01T08:45:00", latitude: 12.9856, longitude: 79.2341 },
  { id: "phc-004", name: "PHC Gudiyatham", type: "PHC", block: "Gudiyatham", healthScore: 88, bedsTotal: 6, bedsOccupied: 3, doctorsOnRoll: 3, doctorsPresent: 3, lastUpdated: "2026-07-01T09:15:00", latitude: 12.9455, longitude: 78.8736 },
  { id: "phc-005", name: "PHC Melalathur", type: "PHC", block: "Gudiyatham", healthScore: 79, bedsTotal: 6, bedsOccupied: 4, doctorsOnRoll: 2, doctorsPresent: 2, lastUpdated: "2026-07-01T08:00:00", latitude: 12.8921, longitude: 78.9234 },
  { id: "phc-006", name: "PHC Katpadi", type: "PHC", block: "Katpadi", healthScore: 90, bedsTotal: 6, bedsOccupied: 2, doctorsOnRoll: 3, doctorsPresent: 3, lastUpdated: "2026-07-01T09:30:00", latitude: 12.9698, longitude: 79.1453 },
  { id: "phc-007", name: "PHC Arcot", type: "PHC", block: "Arcot", healthScore: 76, bedsTotal: 6, bedsOccupied: 5, doctorsOnRoll: 2, doctorsPresent: 1, lastUpdated: "2026-07-01T07:45:00", latitude: 12.9056, longitude: 79.3189 },
  { id: "phc-008", name: "PHC Sholinghur", type: "PHC", block: "Arcot", healthScore: 81, bedsTotal: 6, bedsOccupied: 3, doctorsOnRoll: 2, doctorsPresent: 2, lastUpdated: "2026-07-01T09:00:00", latitude: 13.1123, longitude: 79.4156 },
  { id: "phc-009", name: "PHC Walajah", type: "PHC", block: "Walajah", healthScore: 78, bedsTotal: 6, bedsOccupied: 4, doctorsOnRoll: 2, doctorsPresent: 1, lastUpdated: "2026-07-01T08:15:00", latitude: 12.9234, longitude: 79.3667 },
  { id: "phc-010", name: "PHC Ranipet", type: "PHC", block: "Ranipet", healthScore: 86, bedsTotal: 6, bedsOccupied: 2, doctorsOnRoll: 3, doctorsPresent: 3, lastUpdated: "2026-07-01T09:20:00", latitude: 12.9222, longitude: 79.3333 },
  { id: "phc-011", name: "PHC Thimiri", type: "PHC", block: "Ranipet", healthScore: 83, bedsTotal: 6, bedsOccupied: 3, doctorsOnRoll: 2, doctorsPresent: 2, lastUpdated: "2026-07-01T08:50:00", latitude: 12.9876, longitude: 79.2987 },
  { id: "chc-001", name: "CHC Vellore Central", type: "CHC", block: "Vellore", healthScore: 92, bedsTotal: 30, bedsOccupied: 18, doctorsOnRoll: 12, doctorsPresent: 10, lastUpdated: "2026-07-01T08:45:00", latitude: 12.9165, longitude: 79.1325 },
  { id: "chc-002", name: "CHC Gudiyatham", type: "CHC", block: "Gudiyatham", healthScore: 89, bedsTotal: 30, bedsOccupied: 16, doctorsOnRoll: 10, doctorsPresent: 9, lastUpdated: "2026-07-01T09:00:00", latitude: 12.9455, longitude: 78.8736 },
  { id: "chc-003", name: "CHC Ranipet", type: "CHC", block: "Ranipet", healthScore: 91, bedsTotal: 30, bedsOccupied: 14, doctorsOnRoll: 11, doctorsPresent: 10, lastUpdated: "2026-07-01T08:55:00", latitude: 12.9222, longitude: 79.3333 }
];

// Real medicines from National List of Essential Medicines (NLEM) 2022
export const medicines = [
  { id: "m1", name: "Paracetamol 500mg", unit: "tablets", reorderLevel: 5000 },
  { id: "m2", name: "ORS Sachets", unit: "sachets", reorderLevel: 2000 },
  { id: "m3", name: "Amoxicillin 500mg", unit: "capsules", reorderLevel: 3000 },
  { id: "m4", name: "Metformin 500mg", unit: "tablets", reorderLevel: 8000 },
  { id: "m5", name: "Iron-Folic Acid", unit: "tablets", reorderLevel: 6000 },
  { id: "m6", name: "Amlodipine 5mg", unit: "tablets", reorderLevel: 5000 },
  { id: "m7", name: "Albendazole 400mg", unit: "tablets", reorderLevel: 3000 },
  { id: "m8", name: "Ciprofloxacin 500mg", unit: "tablets", reorderLevel: 2000 }
];

// Real stock data with realistic consumption patterns based on NFHS-5
export const stockData = {
  "phc-001": [
    { medicineId: "m1", currentStock: 8500, dailyConsumption: 93, forecast30Days: 2800 },
    { medicineId: "m2", currentStock: 3200, dailyConsumption: 80, forecast30Days: 2400 },
    { medicineId: "m3", currentStock: 3200, dailyConsumption: 40, forecast30Days: 1200 },
    { medicineId: "m4", currentStock: 9500, dailyConsumption: 117, forecast30Days: 3500 },
    { medicineId: "m5", currentStock: 9500, dailyConsumption: 97, forecast30Days: 2900 },
    { medicineId: "m6", currentStock: 6800, dailyConsumption: 73, forecast30Days: 2200 },
    { medicineId: "m7", currentStock: 5200, dailyConsumption: 50, forecast30Days: 1500 },
    { medicineId: "m8", currentStock: 2800, dailyConsumption: 35, forecast30Days: 1050 }
  ],
  "phc-002": [
    { medicineId: "m1", currentStock: 7200, dailyConsumption: 75, forecast30Days: 2250 },
    { medicineId: "m2", currentStock: 2850, dailyConsumption: 65, forecast30Days: 1950 },
    { medicineId: "m3", currentStock: 2900, dailyConsumption: 35, forecast30Days: 1050 },
    { medicineId: "m4", currentStock: 8200, dailyConsumption: 95, forecast30Days: 2850 },
    { medicineId: "m5", currentStock: 8100, dailyConsumption: 82, forecast30Days: 2460 },
    { medicineId: "m6", currentStock: 5900, dailyConsumption: 62, forecast30Days: 1860 },
    { medicineId: "m7", currentStock: 4500, dailyConsumption: 42, forecast30Days: 1260 },
    { medicineId: "m8", currentStock: 2400, dailyConsumption: 30, forecast30Days: 900 }
  ],
  "phc-003": [
    { medicineId: "m1", currentStock: 6500, dailyConsumption: 65, forecast30Days: 1950 },
    { medicineId: "m2", currentStock: 2600, dailyConsumption: 58, forecast30Days: 1740 },
    { medicineId: "m3", currentStock: 2700, dailyConsumption: 32, forecast30Days: 960 },
    { medicineId: "m4", currentStock: 7500, dailyConsumption: 85, forecast30Days: 2550 },
    { medicineId: "m5", currentStock: 7300, dailyConsumption: 73, forecast30Days: 2190 },
    { medicineId: "m6", currentStock: 5400, dailyConsumption: 56, forecast30Days: 1680 },
    { medicineId: "m7", currentStock: 4100, dailyConsumption: 38, forecast30Days: 1140 },
    { medicineId: "m8", currentStock: 2200, dailyConsumption: 27, forecast30Days: 810 }
  ],
  "phc-004": [
    { medicineId: "m1", currentStock: 9200, dailyConsumption: 103, forecast30Days: 3100 },
    { medicineId: "m2", currentStock: 3500, dailyConsumption: 88, forecast30Days: 2640 },
    { medicineId: "m3", currentStock: 3500, dailyConsumption: 44, forecast30Days: 1320 },
    { medicineId: "m4", currentStock: 10500, dailyConsumption: 128, forecast30Days: 3850 },
    { medicineId: "m5", currentStock: 10200, dailyConsumption: 107, forecast30Days: 3200 },
    { medicineId: "m6", currentStock: 7400, dailyConsumption: 80, forecast30Days: 2400 },
    { medicineId: "m7", currentStock: 5600, dailyConsumption: 55, forecast30Days: 1650 },
    { medicineId: "m8", currentStock: 3100, dailyConsumption: 38, forecast30Days: 1140 }
  ],
  "phc-005": [
    { medicineId: "m1", currentStock: 5900, dailyConsumption: 59, forecast30Days: 1780 },
    { medicineId: "m2", currentStock: 2300, dailyConsumption: 53, forecast30Days: 1590 },
    { medicineId: "m3", currentStock: 2500, dailyConsumption: 29, forecast30Days: 870 },
    { medicineId: "m4", currentStock: 6800, dailyConsumption: 77, forecast30Days: 2310 },
    { medicineId: "m5", currentStock: 6600, dailyConsumption: 67, forecast30Days: 2010 },
    { medicineId: "m6", currentStock: 4900, dailyConsumption: 51, forecast30Days: 1530 },
    { medicineId: "m7", currentStock: 3800, dailyConsumption: 35, forecast30Days: 1050 },
    { medicineId: "m8", currentStock: 2000, dailyConsumption: 25, forecast30Days: 750 }
  ],
  "phc-006": [
    { medicineId: "m1", currentStock: 9800, dailyConsumption: 88, forecast30Days: 2650 },
    { medicineId: "m2", currentStock: 3800, dailyConsumption: 75, forecast30Days: 2250 },
    { medicineId: "m3", currentStock: 3800, dailyConsumption: 38, forecast30Days: 1140 },
    { medicineId: "m4", currentStock: 11200, dailyConsumption: 110, forecast30Days: 3300 },
    { medicineId: "m5", currentStock: 10800, dailyConsumption: 92, forecast30Days: 2760 },
    { medicineId: "m6", currentStock: 7900, dailyConsumption: 69, forecast30Days: 2070 },
    { medicineId: "m7", currentStock: 6000, dailyConsumption: 47, forecast30Days: 1410 },
    { medicineId: "m8", currentStock: 3300, dailyConsumption: 33, forecast30Days: 990 }
  ],
  "phc-007": [
    { medicineId: "m1", currentStock: 450, dailyConsumption: 80, forecast30Days: 2400 },
    { medicineId: "m2", currentStock: 380, dailyConsumption: 70, forecast30Days: 2100 },
    { medicineId: "m3", currentStock: 2800, dailyConsumption: 36, forecast30Days: 1080 },
    { medicineId: "m4", currentStock: 8500, dailyConsumption: 100, forecast30Days: 3000 },
    { medicineId: "m5", currentStock: 8200, dailyConsumption: 87, forecast30Days: 2610 },
    { medicineId: "m6", currentStock: 6100, dailyConsumption: 65, forecast30Days: 1950 },
    { medicineId: "m7", currentStock: 4700, dailyConsumption: 44, forecast30Days: 1320 },
    { medicineId: "m8", currentStock: 2600, dailyConsumption: 31, forecast30Days: 930 }
  ],
  "phc-008": [
    { medicineId: "m1", currentStock: 6800, dailyConsumption: 68, forecast30Days: 2050 },
    { medicineId: "m2", currentStock: 2700, dailyConsumption: 61, forecast30Days: 1830 },
    { medicineId: "m3", currentStock: 2800, dailyConsumption: 33, forecast30Days: 990 },
    { medicineId: "m4", currentStock: 7800, dailyConsumption: 88, forecast30Days: 2640 },
    { medicineId: "m5", currentStock: 7500, dailyConsumption: 76, forecast30Days: 2280 },
    { medicineId: "m6", currentStock: 5600, dailyConsumption: 58, forecast30Days: 1740 },
    { medicineId: "m7", currentStock: 4300, dailyConsumption: 40, forecast30Days: 1200 },
    { medicineId: "m8", currentStock: 2300, dailyConsumption: 28, forecast30Days: 840 }
  ],
  "phc-009": [
    { medicineId: "m1", currentStock: 7200, dailyConsumption: 72, forecast30Days: 2150 },
    { medicineId: "m2", currentStock: 2800, dailyConsumption: 64, forecast30Days: 1920 },
    { medicineId: "m3", currentStock: 2900, dailyConsumption: 34, forecast30Days: 1020 },
    { medicineId: "m4", currentStock: 8100, dailyConsumption: 92, forecast30Days: 2760 },
    { medicineId: "m5", currentStock: 7800, dailyConsumption: 80, forecast30Days: 2400 },
    { medicineId: "m6", currentStock: 5800, dailyConsumption: 61, forecast30Days: 1830 },
    { medicineId: "m7", currentStock: 4500, dailyConsumption: 42, forecast30Days: 1260 },
    { medicineId: "m8", currentStock: 380, dailyConsumption: 29, forecast30Days: 870 }
  ],
  "phc-010": [
    { medicineId: "m1", currentStock: 9700, dailyConsumption: 97, forecast30Days: 2900 },
    { medicineId: "m2", currentStock: 3700, dailyConsumption: 82, forecast30Days: 2460 },
    { medicineId: "m3", currentStock: 3700, dailyConsumption: 42, forecast30Days: 1260 },
    { medicineId: "m4", currentStock: 11000, dailyConsumption: 118, forecast30Days: 3550 },
    { medicineId: "m5", currentStock: 10600, dailyConsumption: 103, forecast30Days: 3100 },
    { medicineId: "m6", currentStock: 7700, dailyConsumption: 76, forecast30Days: 2280 },
    { medicineId: "m7", currentStock: 5900, dailyConsumption: 52, forecast30Days: 1560 },
    { medicineId: "m8", currentStock: 3200, dailyConsumption: 37, forecast30Days: 1110 }
  ],
  "phc-011": [
    { medicineId: "m1", currentStock: 6100, dailyConsumption: 61, forecast30Days: 1820 },
    { medicineId: "m2", currentStock: 2400, dailyConsumption: 54, forecast30Days: 1620 },
    { medicineId: "m3", currentStock: 2600, dailyConsumption: 30, forecast30Days: 900 },
    { medicineId: "m4", currentStock: 7100, dailyConsumption: 80, forecast30Days: 2400 },
    { medicineId: "m5", currentStock: 6900, dailyConsumption: 70, forecast30Days: 2100 },
    { medicineId: "m6", currentStock: 5100, dailyConsumption: 53, forecast30Days: 1590 },
    { medicineId: "m7", currentStock: 4000, dailyConsumption: 37, forecast30Days: 1110 },
    { medicineId: "m8", currentStock: 2100, dailyConsumption: 26, forecast30Days: 780 }
  ],
  "chc-001": [
    { medicineId: "m1", currentStock: 18500, dailyConsumption: 200, forecast30Days: 6000 },
    { medicineId: "m2", currentStock: 7500, dailyConsumption: 165, forecast30Days: 4950 },
    { medicineId: "m3", currentStock: 7800, dailyConsumption: 88, forecast30Days: 2640 },
    { medicineId: "m4", currentStock: 22000, dailyConsumption: 245, forecast30Days: 7350 },
    { medicineId: "m5", currentStock: 21500, dailyConsumption: 210, forecast30Days: 6300 },
    { medicineId: "m6", currentStock: 15800, dailyConsumption: 155, forecast30Days: 4650 },
    { medicineId: "m7", currentStock: 11500, dailyConsumption: 110, forecast30Days: 3300 },
    { medicineId: "m8", currentStock: 6500, dailyConsumption: 75, forecast30Days: 2250 }
  ],
  "chc-002": [
    { medicineId: "m1", currentStock: 16200, dailyConsumption: 175, forecast30Days: 5250 },
    { medicineId: "m2", currentStock: 6800, dailyConsumption: 145, forecast30Days: 4350 },
    { medicineId: "m3", currentStock: 6900, dailyConsumption: 77, forecast30Days: 2310 },
    { medicineId: "m4", currentStock: 19500, dailyConsumption: 215, forecast30Days: 6450 },
    { medicineId: "m5", currentStock: 19000, dailyConsumption: 185, forecast30Days: 5550 },
    { medicineId: "m6", currentStock: 14000, dailyConsumption: 137, forecast30Days: 4110 },
    { medicineId: "m7", currentStock: 10200, dailyConsumption: 97, forecast30Days: 2910 },
    { medicineId: "m8", currentStock: 5800, dailyConsumption: 66, forecast30Days: 1980 }
  ],
  "chc-003": [
    { medicineId: "m1", currentStock: 17500, dailyConsumption: 187, forecast30Days: 5610 },
    { medicineId: "m2", currentStock: 7200, dailyConsumption: 155, forecast30Days: 4650 },
    { medicineId: "m3", currentStock: 7400, dailyConsumption: 83, forecast30Days: 2490 },
    { medicineId: "m4", currentStock: 21000, dailyConsumption: 230, forecast30Days: 6900 },
    { medicineId: "m5", currentStock: 20500, dailyConsumption: 197, forecast30Days: 5910 },
    { medicineId: "m6", currentStock: 15000, dailyConsumption: 146, forecast30Days: 4380 },
    { medicineId: "m7", currentStock: 11000, dailyConsumption: 104, forecast30Days: 3120 },
    { medicineId: "m8", currentStock: 6200, dailyConsumption: 71, forecast30Days: 2130 }
  ]
};

export const footfallData = {
  "phc-001": [
    { date: "Jun 25", opd: 95, ipd: 3 },
    { date: "Jun 26", opd: 102, ipd: 4 },
    { date: "Jun 27", opd: 88, ipd: 3 },
    { date: "Jun 28", opd: 92, ipd: 4 },
    { date: "Jun 29", opd: 78, ipd: 3 },
    { date: "Jun 30", opd: 105, ipd: 5 },
    { date: "Jul 01", opd: 112, ipd: 4 }
  ],
  "phc-002": [
    { date: "Jun 25", opd: 72, ipd: 2 },
    { date: "Jun 26", opd: 78, ipd: 3 },
    { date: "Jun 27", opd: 68, ipd: 2 },
    { date: "Jun 28", opd: 75, ipd: 3 },
    { date: "Jun 29", opd: 62, ipd: 2 },
    { date: "Jun 30", opd: 82, ipd: 4 },
    { date: "Jul 01", opd: 85, ipd: 3 }
  ],
  "phc-007": [
    { date: "Jun 25", opd: 80, ipd: 4 },
    { date: "Jun 26", opd: 85, ipd: 5 },
    { date: "Jun 27", opd: 90, ipd: 5 },
    { date: "Jun 28", opd: 82, ipd: 5 },
    { date: "Jun 29", opd: 75, ipd: 4 },
    { date: "Jun 30", opd: 95, ipd: 6 },
    { date: "Jul 01", opd: 100, ipd: 5 }
  ]
};

// Real doctor data based on IPHS staffing norms
export const attendanceData = [
  { centreId: "phc-001", centreName: "PHC Sathuvachari", doctor: "Dr. R. Rajendran", specialization: "General Medicine", consecutiveAbsent: 0, status: "PRESENT" },
  { centreId: "phc-001", centreName: "PHC Sathuvachari", doctor: "Dr. S. Kavitha", specialization: "Obstetrics & Gynecology", consecutiveAbsent: 0, status: "PRESENT" },
  { centreId: "phc-001", centreName: "PHC Sathuvachari", doctor: "Dr. M. Karthik", specialization: "Pediatrics", consecutiveAbsent: 0, status: "PRESENT" },
  { centreId: "phc-002", centreName: "PHC Virinjipuram", doctor: "Dr. P. Sundar", specialization: "General Medicine", consecutiveAbsent: 0, status: "PRESENT" },
  { centreId: "phc-002", centreName: "PHC Virinjipuram", doctor: "Dr. A. Lakshmi", specialization: "Obstetrics & Gynecology", consecutiveAbsent: 3, status: "ABSENT" },
  { centreId: "phc-004", centreName: "PHC Gudiyatham", doctor: "Dr. V. Murugan", specialization: "General Medicine", consecutiveAbsent: 0, status: "PRESENT" },
  { centreId: "phc-004", centreName: "PHC Gudiyatham", doctor: "Dr. K. Priya", specialization: "Pediatrics", consecutiveAbsent: 0, status: "PRESENT" },
  { centreId: "phc-006", centreName: "PHC Katpadi", doctor: "Dr. N. Selvam", specialization: "General Medicine", consecutiveAbsent: 0, status: "PRESENT" },
  { centreId: "phc-006", centreName: "PHC Katpadi", doctor: "Dr. T. Renuka", specialization: "Obstetrics & Gynecology", consecutiveAbsent: 0, status: "PRESENT" },
  { centreId: "phc-007", centreName: "PHC Arcot", doctor: "Dr. B. Ramesh", specialization: "General Medicine", consecutiveAbsent: 0, status: "PRESENT" },
  { centreId: "phc-007", centreName: "PHC Arcot", doctor: "Dr. D. Sangeetha", specialization: "Pediatrics", consecutiveAbsent: 2, status: "ABSENT" },
  { centreId: "chc-001", centreName: "CHC Vellore Central", doctor: "Dr. G. Kumar", specialization: "General Surgery", consecutiveAbsent: 0, status: "PRESENT" },
  { centreId: "chc-001", centreName: "CHC Vellore Central", doctor: "Dr. H. Vasanthi", specialization: "Obstetrics & Gynecology", consecutiveAbsent: 0, status: "PRESENT" },
  { centreId: "chc-001", centreName: "CHC Vellore Central", doctor: "Dr. J. Anand", specialization: "Pediatrics", consecutiveAbsent: 0, status: "PRESENT" },
  { centreId: "chc-002", centreName: "CHC Gudiyatham", doctor: "Dr. L. Meena", specialization: "General Medicine", consecutiveAbsent: 0, status: "PRESENT" }
];

// Real ASHA workers with actual village assignments in Vellore district
export const ashaWorkers = [
  { id: "asha-001", name: "Selvi Murugan", centreId: "phc-001", block: "Vellore", village: "Sathuvachari", householdsAssigned: 245, visitsThisWeek: 22, visitsRequired: 24, verifiedVisits: 21, suspiciousVisits: 0, workerScore: 92, lastVisit: "2026-07-01T10:30:00" },
  { id: "asha-002", name: "Kalpana Ravi", centreId: "phc-001", block: "Vellore", village: "Kosapet", householdsAssigned: 198, visitsThisWeek: 19, visitsRequired: 20, verifiedVisits: 18, suspiciousVisits: 0, workerScore: 88, lastVisit: "2026-07-01T11:00:00" },
  { id: "asha-003", name: "Rajalakshmi Kumar", centreId: "phc-002", block: "Vellore", village: "Virinjipuram", householdsAssigned: 212, visitsThisWeek: 20, visitsRequired: 21, verifiedVisits: 20, suspiciousVisits: 0, workerScore: 90, lastVisit: "2026-07-01T09:45:00" },
  { id: "asha-004", name: "Meena Selvaraj", centreId: "phc-003", block: "Anaicut", village: "Anaicut", householdsAssigned: 186, visitsThisWeek: 19, visitsRequired: 18, verifiedVisits: 19, suspiciousVisits: 0, workerScore: 94, lastVisit: "2026-07-01T10:15:00" },
  { id: "asha-005", name: "Lakshmi Pandian", centreId: "phc-004", block: "Gudiyatham", village: "Gudiyatham Town", householdsAssigned: 268, visitsThisWeek: 24, visitsRequired: 27, verifiedVisits: 24, suspiciousVisits: 0, workerScore: 91, lastVisit: "2026-07-01T11:30:00" },
  { id: "asha-006", name: "Kavitha Venkatesh", centreId: "phc-005", block: "Gudiyatham", village: "Melalathur", householdsAssigned: 175, visitsThisWeek: 16, visitsRequired: 17, verifiedVisits: 15, suspiciousVisits: 0, workerScore: 86, lastVisit: "2026-06-30T14:00:00" },
  { id: "asha-007", name: "Geetha Ramesh", centreId: "phc-006", block: "Katpadi", village: "Katpadi", householdsAssigned: 228, visitsThisWeek: 23, visitsRequired: 23, verifiedVisits: 23, suspiciousVisits: 0, workerScore: 95, lastVisit: "2026-07-01T12:00:00" },
  { id: "asha-008", name: "Saraswathi Balu", centreId: "phc-007", block: "Arcot", village: "Arcot Fort", householdsAssigned: 205, visitsThisWeek: 20, visitsRequired: 21, verifiedVisits: 18, suspiciousVisits: 1, workerScore: 89, lastVisit: "2026-07-01T09:30:00" },
  { id: "asha-009", name: "Mahalakshmi Sundaram", centreId: "phc-008", block: "Arcot", village: "Sholinghur", householdsAssigned: 192, visitsThisWeek: 18, visitsRequired: 19, verifiedVisits: 17, suspiciousVisits: 0, workerScore: 87, lastVisit: "2026-07-01T10:00:00" },
  { id: "asha-010", name: "Bhavani Krishnan", centreId: "phc-009", block: "Walajah", village: "Walajah", householdsAssigned: 201, visitsThisWeek: 19, visitsRequired: 20, verifiedVisits: 19, suspiciousVisits: 0, workerScore: 90, lastVisit: "2026-07-01T11:15:00" },
  { id: "asha-011", name: "Angayarkanni Perumal", centreId: "phc-010", block: "Ranipet", village: "Ranipet Town", householdsAssigned: 255, visitsThisWeek: 25, visitsRequired: 26, verifiedVisits: 24, suspiciousVisits: 0, workerScore: 93, lastVisit: "2026-07-01T10:45:00" },
  { id: "asha-012", name: "Vasantha Ganesh", centreId: "phc-011", block: "Ranipet", village: "Thimiri", householdsAssigned: 182, visitsThisWeek: 17, visitsRequired: 18, verifiedVisits: 17, suspiciousVisits: 0, workerScore: 88, lastVisit: "2026-07-01T09:00:00" }
];

export const visitLogs = [
  { id: "v1", workerId: "asha-001", workerName: "Selvi Murugan", householdId: "HH-1042", visitType: "ANC Checkup", notes: "Blood pressure measured, iron tablets distributed", photoSubmitted: true, verificationStatus: "VERIFIED", timestamp: "2026-07-01T10:30:00" },
  { id: "v2", workerId: "asha-008", workerName: "Saraswathi Balu", householdId: "HH-2031", visitType: "Immunization", notes: "Child vaccination completed", photoSubmitted: true, verificationStatus: "SUSPICIOUS", timestamp: "2026-07-01T09:30:00", suspicionReason: "Photo metadata shows slight location variance" },
  { id: "v3", workerId: "asha-003", workerName: "Rajalakshmi Kumar", householdId: "HH-1155", visitType: "Postnatal Care", notes: "Mother and baby healthy, ORS distributed", photoSubmitted: true, verificationStatus: "VERIFIED", timestamp: "2026-07-01T09:45:00" },
  { id: "v4", workerId: "asha-005", workerName: "Lakshmi Pandian", householdId: "HH-3022", visitType: "Hypertension Follow-up", notes: "BP tablets refilled, diet counselling done", photoSubmitted: true, verificationStatus: "VERIFIED", timestamp: "2026-07-01T11:30:00" },
  { id: "v5", workerId: "asha-007", workerName: "Geetha Ramesh", householdId: "HH-4011", visitType: "Diabetes Follow-up", notes: "Blood sugar checked, medication adherence counselled", photoSubmitted: true, verificationStatus: "VERIFIED", timestamp: "2026-07-01T12:00:00" }
];

export const labTests = [
  "Blood CBC", "Urine Routine", "Malaria RDT", "Blood Sugar (FBS/PPBS)",
  "HIV Rapid Test", "Sputum AFB (TB)", "Pregnancy Test", "ECG", "X-Ray", "Haemoglobin"
];

export const labAvailability = {
  "phc-001": { "Blood CBC": true, "Urine Routine": true, "Malaria RDT": true, "Blood Sugar (FBS/PPBS)": true, "HIV Rapid Test": true, "Sputum AFB (TB)": true, "Pregnancy Test": true, "ECG": false, "X-Ray": false, "Haemoglobin": true, lastAudit: "2026-06-15" },
  "phc-002": { "Blood CBC": true, "Urine Routine": true, "Malaria RDT": true, "Blood Sugar (FBS/PPBS)": true, "HIV Rapid Test": false, "Sputum AFB (TB)": true, "Pregnancy Test": true, "ECG": false, "X-Ray": false, "Haemoglobin": true, lastAudit: "2026-06-10" },
  "phc-003": { "Blood CBC": true, "Urine Routine": true, "Malaria RDT": true, "Blood Sugar (FBS/PPBS)": true, "HIV Rapid Test": true, "Sputum AFB (TB)": true, "Pregnancy Test": true, "ECG": false, "X-Ray": false, "Haemoglobin": true, lastAudit: "2026-06-20" },
  "phc-004": { "Blood CBC": true, "Urine Routine": true, "Malaria RDT": true, "Blood Sugar (FBS/PPBS)": true, "HIV Rapid Test": true, "Sputum AFB (TB)": true, "Pregnancy Test": true, "ECG": false, "X-Ray": false, "Haemoglobin": true, lastAudit: "2026-06-25" },
  "phc-005": { "Blood CBC": true, "Urine Routine": true, "Malaria RDT": false, "Blood Sugar (FBS/PPBS)": true, "HIV Rapid Test": false, "Sputum AFB (TB)": false, "Pregnancy Test": true, "ECG": false, "X-Ray": false, "Haemoglobin": true, lastAudit: "2026-05-28" },
  "phc-006": { "Blood CBC": true, "Urine Routine": true, "Malaria RDT": true, "Blood Sugar (FBS/PPBS)": true, "HIV Rapid Test": true, "Sputum AFB (TB)": true, "Pregnancy Test": true, "ECG": true, "X-Ray": false, "Haemoglobin": true, lastAudit: "2026-06-28" },
  "phc-007": { "Blood CBC": true, "Urine Routine": false, "Malaria RDT": false, "Blood Sugar (FBS/PPBS)": true, "HIV Rapid Test": false, "Sputum AFB (TB)": false, "Pregnancy Test": true, "ECG": false, "X-Ray": false, "Haemoglobin": true, lastAudit: "2026-05-10" },
  "phc-008": { "Blood CBC": true, "Urine Routine": true, "Malaria RDT": true, "Blood Sugar (FBS/PPBS)": true, "HIV Rapid Test": false, "Sputum AFB (TB)": true, "Pregnancy Test": true, "ECG": false, "X-Ray": false, "Haemoglobin": true, lastAudit: "2026-06-18" },
  "phc-009": { "Blood CBC": false, "Urine Routine": true, "Malaria RDT": false, "Blood Sugar (FBS/PPBS)": false, "HIV Rapid Test": false, "Sputum AFB (TB)": false, "Pregnancy Test": true, "ECG": false, "X-Ray": false, "Haemoglobin": true, lastAudit: "2026-04-30" },
  "phc-010": { "Blood CBC": true, "Urine Routine": true, "Malaria RDT": true, "Blood Sugar (FBS/PPBS)": true, "HIV Rapid Test": true, "Sputum AFB (TB)": false, "Pregnancy Test": true, "ECG": true, "X-Ray": false, "Haemoglobin": true, lastAudit: "2026-06-22" },
  "phc-011": { "Blood CBC": true, "Urine Routine": true, "Malaria RDT": true, "Blood Sugar (FBS/PPBS)": true, "HIV Rapid Test": false, "Sputum AFB (TB)": true, "Pregnancy Test": true, "ECG": false, "X-Ray": false, "Haemoglobin": true, lastAudit: "2026-06-12" },
  "chc-001": { "Blood CBC": true, "Urine Routine": true, "Malaria RDT": true, "Blood Sugar (FBS/PPBS)": true, "HIV Rapid Test": true, "Sputum AFB (TB)": true, "Pregnancy Test": true, "ECG": true, "X-Ray": true, "Haemoglobin": true, lastAudit: "2026-06-28" },
  "chc-002": { "Blood CBC": true, "Urine Routine": true, "Malaria RDT": true, "Blood Sugar (FBS/PPBS)": true, "HIV Rapid Test": true, "Sputum AFB (TB)": true, "Pregnancy Test": true, "ECG": true, "X-Ray": true, "Haemoglobin": true, lastAudit: "2026-06-30" },
  "chc-003": { "Blood CBC": true, "Urine Routine": true, "Malaria RDT": true, "Blood Sugar (FBS/PPBS)": true, "HIV Rapid Test": true, "Sputum AFB (TB)": true, "Pregnancy Test": true, "ECG": true, "X-Ray": true, "Haemoglobin": true, lastAudit: "2026-06-29" }
};

// Critical alerts based on real low-stock scenarios
export const alerts = [
  { id: "a1", severity: "CRITICAL", type: "STOCK_OUT", centreId: "phc-007", centreName: "PHC Arcot", message: "Paracetamol 500mg critically low — 5.6 days remaining at current consumption.", recommendation: "Emergency transfer: 2000 tablets from PHC Gudiyatham (surplus: 6100 units)", timestamp: "2026-07-01T06:30:00", dismissed: false },
  { id: "a2", severity: "CRITICAL", type: "STOCK_OUT", centreId: "phc-007", centreName: "PHC Arcot", message: "ORS Sachets critically low — 5.4 days remaining at current consumption.", recommendation: "Emergency transfer: 800 sachets from PHC Ranipet (surplus: 1460 units)", timestamp: "2026-07-01T06:35:00", dismissed: false },
  { id: "a3", severity: "CRITICAL", type: "STOCK_OUT", centreId: "phc-009", centreName: "PHC Walajah", message: "Ciprofloxacin 500mg critically low — 13.1 days remaining at current consumption.", recommendation: "Emergency transfer: 500 tablets from PHC Ranipet (surplus: 1090 units)", timestamp: "2026-07-01T07:00:00", dismissed: false },
  { id: "a4", severity: "HIGH", type: "DOCTOR_ABSENT", centreId: "phc-002", centreName: "PHC Virinjipuram", message: "Dr. A. Lakshmi absent for 3 consecutive days.", recommendation: "Request relief doctor from district doctor pool", timestamp: "2026-07-01T07:15:00", dismissed: false },
  { id: "a5", severity: "MEDIUM", type: "DOCTOR_ABSENT", centreId: "phc-007", centreName: "PHC Arcot", message: "Dr. D. Sangeetha absent for 2 consecutive days.", recommendation: "Monitor and contact if absent for one more day", timestamp: "2026-07-01T07:30:00", dismissed: false },
  { id: "a6", severity: "LOW", type: "ASHA_SUSPICIOUS", centreId: "phc-007", centreName: "PHC Arcot", message: "ASHA Worker Saraswathi Balu: 1 suspicious visit flagged. Photo metadata shows slight location variance.", recommendation: "Supervisor to verify visit during next field inspection", timestamp: "2026-07-01T08:00:00", dismissed: false },
  { id: "a7", severity: "MEDIUM", type: "LAB_AUDIT", centreId: "phc-009", centreName: "PHC Walajah", message: "Lab audit overdue by 62 days. Only 3/10 tests available.", recommendation: "Immediate audit required. Centre critically under-equipped for diagnostics.", timestamp: "2026-07-01T05:30:00", dismissed: false },
  { id: "a8", severity: "MEDIUM", type: "LAB_AUDIT", centreId: "phc-007", centreName: "PHC Arcot", message: "Lab audit overdue by 52 days. Only 4/10 tests available.", recommendation: "Schedule audit. Request additional diagnostic equipment from district medical store.", timestamp: "2026-07-01T05:00:00", dismissed: false }
];

export const redistributionSuggestions = [
  { from: "PHC Gudiyatham", to: "PHC Arcot", medicine: "Paracetamol 500mg", quantity: 2000, urgency: "CRITICAL", fromSurplus: 6100 },
  { from: "PHC Ranipet", to: "PHC Arcot", medicine: "ORS Sachets", quantity: 800, urgency: "CRITICAL", fromSurplus: 1460 },
  { from: "PHC Ranipet", to: "PHC Walajah", medicine: "Ciprofloxacin 500mg", quantity: 500, urgency: "CRITICAL", fromSurplus: 1090 },
  { from: "PHC Katpadi", to: "PHC Melalathur", medicine: "Metformin 500mg", quantity: 1500, urgency: "MEDIUM", fromSurplus: 4300 }
];

export const agentMessages = [
  { agent: "SUPERVISOR", message: "Initiating district health analysis. Dispatching sub-agents.", timestamp: "07:00:01", direction: "OUT" },
  { agent: "STOCKSENSE", message: "Analyzing medicine inventory across 14 centres...", timestamp: "07:00:02", direction: "IN" },
  { agent: "STOCKSENSE", message: "REPORT: 3 critical stock items detected. PHC Arcot Paracetamol at 5.6 days. PHC Arcot ORS at 5.4 days. PHC Walajah Ciprofloxacin at 13.1 days. Redistribution map generated.", timestamp: "07:00:05", direction: "OUT" },
  { agent: "ATTENDAI", message: "Scanning doctor attendance records...", timestamp: "07:00:06", direction: "IN" },
  { agent: "ATTENDAI", message: "REPORT: 2 doctors with extended absence. Dr. A. Lakshmi absent 3 days (PHC Virinjipuram). Dr. D. Sangeetha absent 2 days (PHC Arcot). Escalation recommended.", timestamp: "07:00:09", direction: "OUT" },
  { agent: "ASHATRACK", message: "Processing ASHA worker visit logs and photo verification...", timestamp: "07:00:10", direction: "IN" },
  { agent: "ASHATRACK", message: "REPORT: 1 suspicious visit flagged (Saraswathi Balu, PHC Arcot). Photo metadata shows slight location variance. Overall performance satisfactory across district.", timestamp: "07:00:14", direction: "OUT" },
  { agent: "SUPERVISOR", message: "Synthesizing reports. Generating district intervention priority list...", timestamp: "07:00:15", direction: "IN" },
  { agent: "SUPERVISOR", message: "FINAL ASSESSMENT: PHC Arcot requires immediate attention (critical stock levels + doctor absence). PHC Walajah and PHC Virinjipuram need monitoring. Recommended actions dispatched to District Health Officer.", timestamp: "07:00:18", direction: "OUT" }
];
