import admin from 'firebase-admin';

import serviceAccount from '../voice-gift.json' assert { type: 'json' };

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export default admin;

export const auth = admin.auth();

export const firestore = admin.firestore();
