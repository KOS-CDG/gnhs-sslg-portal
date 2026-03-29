import * as admin from 'firebase-admin';

let initialized = false;
let initFailed  = false;

export function initFirebase(): void {
  if (initialized || initFailed) return;

  const projectId   = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey  = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

  if (!projectId || !clientEmail || !privateKey) {
    console.warn(
      '\n⚠️  Firebase Admin NOT initialized — missing env vars in backend/.env\n' +
      '   FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY\n' +
      '   The backend will start, but API routes requiring Firestore will fail.\n' +
      '   → See README.md for setup instructions.\n'
    );
    initFailed = true;
    return;
  }

  try {
    admin.initializeApp({
      credential: admin.credential.cert({ projectId, clientEmail, privateKey }),
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    });
    initialized = true;
    console.log('🔥  Firebase Admin initialized');
  } catch (err) {
    console.error('❌  Firebase Admin init failed:', (err as Error).message);
    initFailed = true;
  }
}

export const db      = () => admin.firestore();
export const auth    = () => admin.auth();
export const storage = () => admin.storage();

// Timestamp helper
export const now = () => admin.firestore.FieldValue.serverTimestamp();
