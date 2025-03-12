// firebase.js (in your frontend project)

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; // Authentication
import { getFirestore } from "firebase/firestore"; // Firestore

// Your Firebase config (already set in your Firebase console)
// I heard it's generally safe to expose ? 
const firebaseConfig = {
    apiKey: process.env.REACT_APP_API_KEY, // I'll send it privately
    authDomain: "informaticahack-5fc53.firebaseapp.com",
    projectId: "informaticahack-5fc53",
    storageBucket: "informaticahack-5fc53.firebasestorage.app",
    messagingSenderId: "511412761644",
    appId: "1:511412761644:web:b5b9289fa72485a2494d89",
    measurementId: "G-DWFX2DZYBH"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firebase services you need
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };