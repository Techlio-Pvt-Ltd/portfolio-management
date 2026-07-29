import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

export const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
export const db = getFirestore(app);

// getAuth() validates the API key eagerly and throws if Firebase env vars
// aren't set yet (e.g. during a local build before .env.local is configured).
// Guard it so the public site (which doesn't need auth) still builds/renders.
export const auth = (() => {
  try {
    return getAuth(app);
  } catch {
    return undefined as unknown as ReturnType<typeof getAuth>;
  }
})();
