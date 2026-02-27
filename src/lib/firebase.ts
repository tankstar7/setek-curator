import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getFirestore, Firestore } from "firebase/firestore";
import { getAnalytics, Analytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey:            process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain:        process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId:         process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket:     process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId:             process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId:     process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// ── 환경변수 누락 감지 ─────────────────────────────────────────────────────
// projectId가 undefined이면 Firestore getDocs()가 에러 없이 무한 대기 상태가 됨
const REQUIRED_FIREBASE_VARS: (keyof typeof firebaseConfig)[] = [
  'apiKey', 'projectId', 'appId',
];
const missingFirebase = REQUIRED_FIREBASE_VARS.filter((k) => !firebaseConfig[k]);
if (missingFirebase.length > 0) {
  console.error(
    `%c[Firebase] ❌ 환경변수 누락: ${missingFirebase.map((k) => `NEXT_PUBLIC_FIREBASE_${k.replace(/([A-Z])/g, '_$1').toUpperCase()}`).join(', ')}\n.env.local 파일에 해당 값이 있는지 확인하세요.`,
    'color: red; font-weight: bold; font-size: 14px;'
  );
}

// Next.js HMR 환경에서 앱이 중복 초기화되지 않도록 이미 초기화된 앱을 재사용한다.
const app: FirebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

export const db: Firestore = getFirestore(app);

// Analytics는 브라우저 환경에서만 동작하므로 isSupported()로 확인 후 초기화한다.
export let analytics: Analytics | null = null;
if (typeof window !== "undefined") {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  });
}

export default app;
