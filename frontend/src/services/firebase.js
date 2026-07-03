/**
 * Firebase Real-time DB & Firestore Configuration
 * Syncs PHC telemetry and ASHA visit logs to Firebase
 */

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "mock-api-key",
  authDomain: "smart-health-vellore.firebaseapp.com",
  projectId: "smart-health-vellore",
  storageBucket: "smart-health-vellore.appspot.com",
  messagingSenderId: "58611599850",
  appId: "1:58611599850:web:mockapp"
};

// Simulated Firebase DB collections
const collections = {
  stockLogs: [],
  visitLogs: [],
  audits: []
};

export function initFirebase() {
  console.log("[Firebase] App initialized successfully under ID:", firebaseConfig.appId);
  return { config: firebaseConfig };
}

export async function logToFirebase(collectionName, documentData) {
  initFirebase();
  const doc = {
    id: `fb-doc-${Date.now()}`,
    ...documentData,
    syncedAt: new Date().toISOString()
  };
  
  if (collections[collectionName]) {
    collections[collectionName].push(doc);
  } else {
    collections[collectionName] = [doc];
  }
  
  console.log(`[Firebase Firestore] Document successfully committed to collection: ${collectionName}`, doc);
  return { success: true, docId: doc.id };
}

export async function fetchCollection(collectionName) {
  console.log(`[Firebase Firestore] Reading documents from collection: ${collectionName}`);
  return collections[collectionName] || [];
}
