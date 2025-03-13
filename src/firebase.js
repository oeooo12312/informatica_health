// firebase.js (in your frontend project)

import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth"; // Authentication
import { getFirestore } from "firebase/firestore"; // Firestore

// Your Firebase config (already set in your Firebase console)
// I heard it's generally safe to expose ? 
const firebaseConfig = {
    apiKey: import.meta.env.VITE_APP_API_KEY, // I'll send it privately
    authDomain: "informaticahack-5fc53.firebaseapp.com",
    projectId: "informaticahack-5fc53",
    storageBucket: "informaticahack-5fc53.firebasestorage.app",
    messagingSenderId: "511412761644",
    appId: "1:511412761644:web:b5b9289fa72485a2494d89",
    measurementId: "G-DWFX2DZYBH"
  };

console.log(import.meta);

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firebase services you need
const auth = getAuth(app);
const db = getFirestore(app);

const createUserWithEmailAndPasswordWrapper = (email, password) => {
    createUserWithEmailAndPassword(auth, email, password);
}

const signInWithEmailAndPasswordWrapper = (email, password) => {
    signInWithEmailAndPassword(auth, email, password);
}

const signOutWrapper = (onSuccess, onError) => {
    try {
        signOut(auth);
        onSuccess();
    } catch (e) {
        onError(e);
    }
}
export { auth, signInWithEmailAndPasswordWrapper, createUserWithEmailAndPasswordWrapper, signOutWrapper };