/**
 * Google BigQuery Analytics Integration
 * Provides large-scale data analytics, trend analysis, and predictive modeling
 * for district health management
 */

const BIGQUERY_PROJECT_ID = import.meta.env.VITE_GOOGLE_CLOUD_PROJECT_ID || 'smart-health-demo';
const BIGQUERY_DATASET = 'health_analytics';

/**
 * BigQuery table schemas for health data
 */
export const BIGQUERY_TABLES = {
  STOCK_HISTORY: `${BIGQUERY_PROJECT_ID}.${BIGQUERY_DATASET}.medicine_stock_history`,
  ATTENDANCE_LOGS: `${BIGQUERY_PROJECT_ID}.${BIGQUERY_DATASET}.staff_attendance`,
  PATIENT_FOOTFALL: `${BIGQUERY_PROJECT_ID}.${BIGQUERY_DATASET}.patient_visits`,
  ASHA_VISITS: `${BIGQUERY_PROJECT_ID}.${BIGQUERY_DATASET}.asha_household_visits`,
  LAB_TESTS: `${BIGQUERY_PROJECT_ID}.${BIGQUERY_DATASET}.laboratory_tests`,
  ALERTS_HISTORY: `${BIGQUERY_PROJECT_ID}.${BIGQUERY_DATASET}.alert_events`,
};

/**
 * Simulated BigQuery query execution
 * In production, this would use @google-cloud/bigquery SDK from backend
 * @param {string} query - SQL query
 * @returns {Promise<Array>} Query results
 */
async function executeBigQuerySQL(query) {
  console.log('[BigQuery] Executing query:', query.substring(0, 100) + '...');

  // Simulate query execution delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  // Return mock results based on query patterns
  if (query.includes('medicine_stock_history')) {
    return getMockStockTrends();
  } else if (query.includes('staff_attendance')) {
    return getMockAttendanceTrends();
  } else if (query.includes('patient_visits')) {
    return getMockFootfallTrends();
  } else if (query.includes('alert_events')) {
    return getMockAlertAnalytics();
  }

  return [];
}

/**
 * Analyze medicine stock depletion trends using BigQuery
 * @param {string} centreName - PHC name
 * @param {string} medicineName - Medicine name
 * @param {number} days - Number of days to analyze
 * @returns {Promise<Object>} Trend analysis
 */
export async function analyzeStockDepletionTrend(centreName, medicineName, days = 30) {
  console.log(`[BigQuery] Analyzing ${medicineName} depletion at ${centreName} over ${days} days`);

  const query = `
    SELECT
      DATE(timestamp) as date,
      AVG(quantity_remaining) as avg_stock,
      MIN(quantity_remaining) as min_stock,
      MAX(quantity_remaining) as max_stock,
      SUM(quantity_dispensed) as total_dispensed
    FROM ${BIGQUERY_TABLES.STOCK_HISTORY}
    WHERE centre_name = '${centreName}'
      AND medicine_name = '${medicineName}'
      AND timestamp >= TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL ${days} DAY)
    GROUP BY DATE(timestamp)
    ORDER BY date
  `;

  const results = await executeBigQuerySQL(query);

  // Calculate depletion rate and forecast
  const depletionRate = calculateDepletionRate(results);
  const forecast = forecastStockout(results, depletionRate);

  return {
    medicine: medicineName,
    centre: centreName,
    analysisWindow: `${days} days`,
    currentStock: results[results.length - 1]?.avg_stock || 0,
    averageDepletionRate: depletionRate.toFixed(2) + ' units/day',
    projectedStockoutDate: forecast.date,
    daysUntilStockout: forecast.days,
    recommendation: forecast.days < 7 ? 'CRITICAL: Order immediately' :
                    forecast.days < 14 ? 'Order within 3 days' :
                    'Monitor closely',
    historicalData: results,
  };
}

/**
 * Analyze doctor attendance patterns using BigQuery ML
 * @param {string} districtName - District name
 * @returns {Promise<Object>} Attendance insights
 */
export async function analyzeAttendancePatterns(districtName = 'Vellore') {
  console.log(`[BigQuery] Analyzing attendance patterns for ${districtName}`);

  const query = `
    SELECT
      doctor_name,
      centre_name,
      COUNTIF(status = 'PRESENT') as days_present,
      COUNTIF(status = 'ABSENT') as days_absent,
      ROUND(COUNTIF(status = 'PRESENT') / COUNT(*) * 100, 2) as attendance_rate,
      STRING_AGG(DISTINCT absence_reason, ', ') as common_reasons
    FROM ${BIGQUERY_TABLES.ATTENDANCE_LOGS}
    WHERE district = '${districtName}'
      AND date >= DATE_SUB(CURRENT_DATE(), INTERVAL 90 DAY)
    GROUP BY doctor_name, centre_name
    HAVING attendance_rate < 85
    ORDER BY attendance_rate ASC
  `;

  const results = await executeBigQuerySQL(query);

  return {
    district: districtName,
    analysisWindow: '90 days',
    lowAttendanceStaff: results.length,
    criticalCases: results.filter(r => r.attendance_rate < 70).length,
    patterns: results.map(r => ({
      doctor: r.doctor_name,
      centre: r.centre_name,
      attendanceRate: r.attendance_rate + '%',
      daysAbsent: r.days_absent,
      commonReasons: r.common_reasons,
      riskLevel: r.attendance_rate < 70 ? 'HIGH' : 'MODERATE',
    })),
    recommendations: generateAttendanceRecommendations(results),
  };
}

/**
 * Predict patient footfall using BigQuery ML time-series forecasting
 * @param {string} centreName - PHC name
 * @param {number} forecastDays - Days to forecast
 * @returns {Promise<Object>} Footfall prediction
 */
import { footfallData } from '../data/mockData';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1';

export async function predictPatientFootfall(centreName, forecastDays = 7) {
  console.log(`[Forecasting Engine] Requesting linear regression forecast for ${centreName} (${forecastDays} days)`);

  const centreIdMap = {
    'PHC Tambaram': 'phc-001',
    'PHC Kanchipuram North': 'phc-002',
    'CHC Vellore Central': 'chc-001',
    'PHC Gudiyatham': 'phc-003',
    'PHC Arcot': 'phc-004',
    'PHC Ranipet': 'phc-005',
    'PHC Walajah': 'phc-006',
    'CHC Katpadi': 'chc-002',
    'Walajah PHC': 'phc-006'
  };
  const centreId = centreIdMap[centreName] || 'phc-001';

  // Load actual historical visit data for the centre
  const historical = footfallData[centreId] || [
    { opd: 87, ipd: 3 },
    { opd: 94, ipd: 4 },
    { opd: 102, ipd: 5 },
    { opd: 78, ipd: 2 },
    { opd: 65, ipd: 3 },
    { opd: 110, ipd: 6 },
    { opd: 143, ipd: 8 }
  ];
  
  const historicalData = historical.map((h, i) => ({
    day: i + 1,
    value: h.opd + h.ipd
  }));

  try {
    const res = await fetch(`${API_BASE_URL}/analytics/forecast`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ historicalData, forecastDays })
    });

    if (!res.ok) {
      throw new Error(`Server returned status: ${res.status}`);
    }

    const result = await res.json();
    const predictions = result.predictions;

    return {
      centre: centreName,
      forecastHorizon: `${forecastDays} days`,
      model: 'LEAST_SQUARES_LINEAR_REGRESSION',
      predictions: predictions.map((row, idx) => ({
        date: new Date(Date.now() + idx * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        predictedPatients: row.forecast_value,
        lowerBound: row.lower_bound,
        upperBound: row.upper_bound,
        confidence: '95%',
      })),
      insights: {
        averageDailyFootfall: Math.round(predictions.reduce((sum, r) => sum + r.forecast_value, 0) / predictions.length),
        peakDay: predictions.reduce((max, r, idx) => r.forecast_value > predictions[max].forecast_value ? idx : max, 0),
        trend: result.slope > 0 ? 'INCREASING' : 'DECREASING',
      },
      recommendations: generateFootfallRecommendations(predictions),
    };
  } catch (error) {
    console.error('Forecasting API failed, falling back to local simulation:', error);
    
    // Offline local fallback regression simulation
    const dummyPredictions = Array.from({ length: forecastDays }, (_, i) => {
      const base = 90 + i * 2;
      return {
        forecast_value: base,
        lower_bound: base - 15,
        upper_bound: base + 15
      };
    });

    return {
      centre: centreName,
      forecastHorizon: `${forecastDays} days`,
      model: 'LOCAL_REGRESSION_FALLBACK',
      predictions: dummyPredictions.map((row, idx) => ({
        date: new Date(Date.now() + idx * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        predictedPatients: row.forecast_value,
        lowerBound: row.lower_bound,
        upperBound: row.upper_bound,
        confidence: '95%',
      })),
      insights: {
        averageDailyFootfall: 95,
        peakDay: forecastDays - 1,
        trend: 'INCREASING',
      },
      recommendations: generateFootfallRecommendations(dummyPredictions),
    };
  }
}

/**
 * Analyze disease outbreak patterns using BigQuery
 * @param {string} disease - Disease name
 * @param {string} district - District name
 * @returns {Promise<Object>} Outbreak analysis
 */
export async function analyzeOutbreakPattern(disease = 'Dengue', district = 'Vellore') {
  console.log(`[BigQuery] Analyzing ${disease} outbreak patterns in ${district}`);

  const query = `
    SELECT
      DATE(visit_date) as date,
      COUNT(*) as case_count,
      AVG(CASE WHEN severity = 'SEVERE' THEN 1 ELSE 0 END) as severity_rate,
      STRING_AGG(DISTINCT patient_location, ', ') as affected_areas
    FROM ${BIGQUERY_TABLES.PATIENT_FOOTFALL}
    WHERE district = '${district}'
      AND diagnosis LIKE '%${disease}%'
      AND visit_date >= DATE_SUB(CURRENT_DATE(), INTERVAL 90 DAY)
    GROUP BY DATE(visit_date)
    ORDER BY date
  `;

  const results = await executeBigQuerySQL(query);

  // Detect if outbreak is active
  const recent7Days = results.slice(-7);
  const prior7Days = results.slice(-14, -7);
  const recentAvg = recent7Days.reduce((sum, r) => sum + r.case_count, 0) / recent7Days.length;
  const priorAvg = prior7Days.reduce((sum, r) => sum + r.case_count, 0) / prior7Days.length;
  const percentChange = ((recentAvg - priorAvg) / priorAvg * 100).toFixed(1);

  return {
    disease,
    district,
    outbreakStatus: percentChange > 20 ? 'ACTIVE_SURGE' : percentChange > 10 ? 'EMERGING' : 'STABLE',
    totalCases90Days: results.reduce((sum, r) => sum + r.case_count, 0),
    averageDailyCases: (results.reduce((sum, r) => sum + r.case_count, 0) / results.length).toFixed(1),
    weeklyChange: percentChange + '%',
    affectedAreas: [...new Set(results.flatMap(r => r.affected_areas.split(', ')))],
    trend: results,
    alertLevel: percentChange > 50 ? 'CRITICAL' : percentChange > 20 ? 'HIGH' : 'MODERATE',
    recommendation: getOutbreakRecommendation(disease, percentChange),
  };
}

/**
 * Generate district-wide health analytics dashboard data
 * @param {string} district - District name
 * @returns {Promise<Object>} Comprehensive analytics
 */
export async function generateDistrictAnalytics(district = 'Vellore') {
  console.log(`[BigQuery] Generating comprehensive analytics for ${district}`);

  const [stockTrends, attendancePatterns, footfallPrediction, outbreakAnalysis, alertMetrics] = await Promise.all([
    getMockStockTrends(),
    analyzeAttendancePatterns(district),
    predictPatientFootfall('Walajah PHC', 7),
    analyzeOutbreakPattern('Dengue', district),
    analyzeAlertResolutionMetrics(district),
  ]);

  return {
    district,
    generatedAt: new Date().toISOString(),
    timeWindow: '90 days',
    keyMetrics: {
      totalPatientVisits: 45820,
      averageDailyFootfall: 509,
      stockAlerts: 23,
      attendanceIssues: attendancePatterns.lowAttendanceStaff,
      activeOutbreaks: outbreakAnalysis.outbreakStatus !== 'STABLE' ? 1 : 0,
    },
    trends: {
      stock: stockTrends,
      attendance: attendancePatterns,
      footfall: footfallPrediction,
      outbreaks: outbreakAnalysis,
    },
    alerts: alertMetrics,
    dataQuality: {
      completeness: 97.3,
      timeliness: 94.8,
      accuracy: 99.1,
    },
    queryExecutionTime: '1.8s',
    dataScanned: '2.3 GB',
  };
}

/**
 * Analyze alert resolution performance
 */
async function analyzeAlertResolutionMetrics(district) {
  const query = `
    SELECT
      alert_type,
      AVG(TIMESTAMP_DIFF(resolved_at, created_at, HOUR)) as avg_resolution_hours,
      COUNT(*) as total_alerts,
      COUNTIF(resolved_at IS NOT NULL) as resolved_count
    FROM ${BIGQUERY_TABLES.ALERTS_HISTORY}
    WHERE district = '${district}'
      AND created_at >= TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL 30 DAY)
    GROUP BY alert_type
  `;

  const results = await executeBigQuerySQL(query);

  return {
    averageResolutionTime: '4.2 hours',
    resolutionRate: 87.3,
    byType: results,
  };
}

// Mock data generators

function getMockStockTrends() {
  return Array.from({ length: 30 }, (_, i) => ({
    date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    avg_stock: Math.max(100 - i * 3 + Math.random() * 20, 10),
    min_stock: Math.max(80 - i * 3, 5),
    max_stock: Math.max(120 - i * 3, 15),
    total_dispensed: Math.floor(15 + Math.random() * 10),
  }));
}

function getMockAttendanceTrends() {
  return [
    { doctor_name: 'Dr. Sharma', centre_name: 'Walajah PHC', days_present: 56, days_absent: 34, attendance_rate: 62.2, common_reasons: 'Sick leave, Training' },
    { doctor_name: 'Dr. Patel', centre_name: 'Ranipet PHC', days_present: 72, days_absent: 18, attendance_rate: 80.0, common_reasons: 'Personal leave' },
  ];
}

function getMockFootfallTrends() {
  return Array.from({ length: 7 }, (_, i) => ({
    forecast_value: Math.floor(80 + Math.random() * 40),
    lower_bound: Math.floor(60 + Math.random() * 20),
    upper_bound: Math.floor(100 + Math.random() * 20),
  }));
}

function getMockAlertAnalytics() {
  return [
    { alert_type: 'STOCK_OUT', avg_resolution_hours: 3.2, total_alerts: 15, resolved_count: 14 },
    { alert_type: 'DOCTOR_ABSENT', avg_resolution_hours: 8.5, total_alerts: 8, resolved_count: 6 },
    { alert_type: 'BED_CAPACITY', avg_resolution_hours: 2.1, total_alerts: 5, resolved_count: 5 },
  ];
}

function calculateDepletionRate(stockData) {
  if (stockData.length < 2) return 0;
  const firstStock = stockData[0].avg_stock;
  const lastStock = stockData[stockData.length - 1].avg_stock;
  return (firstStock - lastStock) / stockData.length;
}

function forecastStockout(stockData, depletionRate) {
  const currentStock = stockData[stockData.length - 1]?.avg_stock || 0;
  const daysUntilStockout = Math.floor(currentStock / Math.abs(depletionRate));
  const stockoutDate = new Date(Date.now() + daysUntilStockout * 24 * 60 * 60 * 1000);
  return {
    days: daysUntilStockout,
    date: stockoutDate.toISOString().split('T')[0],
  };
}

function generateAttendanceRecommendations(patterns) {
  return [
    'Deploy temporary doctors to centres with <70% attendance',
    'Conduct attendance review meetings with low-performing staff',
    'Implement incentive program for >90% attendance',
  ];
}

function generateFootfallRecommendations(forecast) {
  const avgFootfall = forecast.reduce((sum, r) => sum + r.forecast_value, 0) / forecast.length;
  if (avgFootfall > 100) {
    return ['Increase OPD staff', 'Extend clinic hours', 'Prepare surge capacity'];
  }
  return ['Normal operations', 'Monitor trends'];
}

function getOutbreakRecommendation(disease, percentChange) {
  if (percentChange > 50) {
    return `CRITICAL: ${disease} outbreak detected. Activate rapid response team, increase diagnostic capacity, and issue public health advisory immediately.`;
  } else if (percentChange > 20) {
    return `Emerging ${disease} surge. Increase surveillance, ensure adequate medicine stocks, and prepare vector control measures.`;
  }
  return `${disease} cases stable. Maintain routine surveillance and preventive measures.`;
}

export default {
  analyzeStockDepletionTrend,
  analyzeAttendancePatterns,
  predictPatientFootfall,
  analyzeOutbreakPattern,
  generateDistrictAnalytics,
  BIGQUERY_TABLES,
};
