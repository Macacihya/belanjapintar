import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// Konfigurasi Firebase Anda
const firebaseConfig = {
  apiKey: "AIzaSyBvC3SKeaursuATzPuExANQ_I0i88TA7AE",
  authDomain: "listbelanja-ff11a.firebaseapp.com",
  projectId: "listbelanja-ff11a",
  storageBucket: "listbelanja-ff11a.firebasestorage.app",
  messagingSenderId: "848388983596",
  appId: "1:848388983596:web:ceff06b33660ab53afba89",
  measurementId: "G-1P3QYT68HJ"
};

// Initialize Firebase
let db: any;
let analytics: any;

try {
  const app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  // Inisialisasi Analytics jika di lingkungan browser
  if (typeof window !== 'undefined') {
    analytics = getAnalytics(app);
  }
} catch (error) {
  console.error("Firebase initialization error. Please check your config.", error);
}

export { db, analytics };