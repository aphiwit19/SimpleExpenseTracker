// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDDvNg82Vt-SwHCtKx1MmmatnHErf_jVq4",
  authDomain: "simple-expense-tracker-9ec35.firebaseapp.com",
  projectId: "simple-expense-tracker-9ec35",
  storageBucket: "simple-expense-tracker-9ec35.firebasestorage.app",
  messagingSenderId: "276115689190",
  appId: "1:276115689190:web:ad9a2e6b6e1247a481f527",
  measurementId: "G-Y9RN7WH3TT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export default app;