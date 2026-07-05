import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

const isAlloyDbConfigured = !!(
  process.env.ALLOYDB_HOST &&
  process.env.ALLOYDB_USER &&
  process.env.ALLOYDB_PASSWORD &&
  process.env.ALLOYDB_DATABASE
);

export const pool = isAlloyDbConfigured
  ? new Pool({
      host: process.env.ALLOYDB_HOST,
      user: process.env.ALLOYDB_USER,
      password: process.env.ALLOYDB_PASSWORD,
      database: process.env.ALLOYDB_DATABASE,
      port: parseInt(process.env.ALLOYDB_PORT || '5432'),
      ssl: process.env.ALLOYDB_SSL === 'true' ? { rejectUnauthorized: false } : false,
      connectionTimeoutMillis: 5000,
    })
  : null;

if (isAlloyDbConfigured) {
  console.log('⚡ [AlloyDB] Active connection pool configured for AlloyDB cluster:', process.env.ALLOYDB_HOST);
  
  // Auto-initialize tables
  (async () => {
    try {
      const client = await pool.connect();
      console.log('⚡ [AlloyDB] Connected successfully. Initializing database schema...');
      
      await client.query(`
        CREATE TABLE IF NOT EXISTS centres (
          id VARCHAR(50) PRIMARY KEY,
          name VARCHAR(100) NOT NULL,
          type VARCHAR(20) NOT NULL,
          block VARCHAR(50) NOT NULL,
          health_score INT DEFAULT 100,
          beds_total INT DEFAULT 0,
          beds_occupied INT DEFAULT 0,
          doctors_on_roll INT DEFAULT 0,
          doctors_present INT DEFAULT 0,
          last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS stock (
          centre_id VARCHAR(50) NOT NULL,
          medicine_id VARCHAR(50) NOT NULL,
          current_stock INT DEFAULT 0,
          daily_consumption INT DEFAULT 0,
          forecast_30_days INT DEFAULT 0,
          PRIMARY KEY (centre_id, medicine_id)
        );

        CREATE TABLE IF NOT EXISTS attendance (
          id VARCHAR(50) PRIMARY KEY,
          centre_id VARCHAR(50) NOT NULL,
          doctor_name VARCHAR(100) NOT NULL,
          status VARCHAR(20) NOT NULL,
          timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS transfers (
          id VARCHAR(50) PRIMARY KEY,
          source_centre VARCHAR(100) NOT NULL,
          target_centre VARCHAR(100) NOT NULL,
          medicine VARCHAR(50) NOT NULL,
          quantity INT NOT NULL,
          status VARCHAR(20) DEFAULT 'PENDING',
          timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);
      
      client.release();
      console.log('⚡ [AlloyDB] Database tables initialized successfully.');
    } catch (err) {
      console.error('❌ [AlloyDB Error] Schema initialization failed:', err.message);
    }
  })();
} else {
  console.log('⚡ [AlloyDB] Configuration parameters missing. Falling back to local offline JSON database.');
}

export async function query(text, params) {
  if (!pool) {
    throw new Error('AlloyDB is not configured.');
  }
  return pool.query(text, params);
}
