/**
 * BigQuery Service
 * Handles SQL query execution for analytics
 */

/**
 * Execute a BigQuery SQL query
 */
export async function executeQuery(query) {
  console.log('[BigQuery Service] Executing query:', query.substring(0, 100) + '...');

  // Simulate query execution
  await new Promise(resolve => setTimeout(resolve, 800));

  // Return mock results based on query patterns
  if (query.includes('medicine_stock_history')) {
    return getMockStockTrends();
  } else if (query.includes('staff_attendance')) {
    return getMockAttendanceTrends();
  }

  return [];
}

function getMockStockTrends() {
  return Array.from({ length: 30 }, (_, i) => ({
    date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    avg_stock: Math.max(100 - i * 3 + Math.random() * 20, 10),
  }));
}

function getMockAttendanceTrends() {
  return [
    { doctor_name: 'Dr. Sharma', centre_name: 'Walajah PHC', days_present: 56, days_absent: 34, attendance_rate: 62.2 }
  ];
}
