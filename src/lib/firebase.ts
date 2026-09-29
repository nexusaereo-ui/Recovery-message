import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

let appInstance: any = null;
let dbInstance: Firestore | null = null;

try {
  appInstance = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
  dbInstance = firebaseConfig.firestoreDatabaseId
    ? getFirestore(appInstance, firebaseConfig.firestoreDatabaseId)
    : getFirestore(appInstance);
} catch (err) {
  console.warn('Firebase init fallback:', err);
}

export const app = appInstance;
export const db = dbInstance as Firestore;

export async function testFirestoreConnection() {
  // Optional test connection
}


