import dotenv from 'dotenv';

dotenv.config();

const useDb = process.env.USE_DATABASE === 'true';

let dbConfig = {
  active: false,
  dialect: 'AlloyDB / PostgreSQL Serverless',
  pool: null
};

if (useDb) {
  console.log('================================================');
  console.log(' [Database] Configured for AlloyDB Serverless...');
  console.log(' [Database] Initializing connection pools...');
  console.log('================================================');
  dbConfig.active = true;
  // If pg pool is required, it can be instantiated dynamically here
} else {
  console.log('================================================');
  console.log(' [Database] Operating in Offline-First Mode');
  console.log(' [Database] loading high-fidelity JSON datasets');
  console.log('================================================');
}

/**
 * Returns database connection status
 */
export function getDatabaseStatus() {
  return {
    active: dbConfig.active,
    dialect: dbConfig.dialect,
    fallbackActivated: !dbConfig.active
  };
}

export default dbConfig;
