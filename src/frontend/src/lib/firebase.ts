// Firebase client initialization
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAlwV86hGaoymMmG8U6eWo_OZBXIvByp-E",
  authDomain: "findbus-f27a3.firebaseapp.com",
  projectId: "findbus-f27a3",
  storageBucket: "findbus-f27a3.firebasestorage.app",
  messagingSenderId: "1081077757279",
  appId: "1:1081077757279:web:02e086ef4acb03383fb2ea",
  measurementId: "G-K6DD9RPTK8",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
