import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, OAuthProvider, signInWithPopup, signInWithEmailAndPassword } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBbgy2bn7YP9Kpr_i6KnCc1fX1iYjIIXg0",
  authDomain: "distributex-71de4.firebaseapp.com",
  projectId: "distributex-71de4",
  storageBucket: "distributex-71de4.firebasestorage.app",
  messagingSenderId: "406117707315",
  appId: "1:406117707315:web:1e2c09428b9aeda9e63d46",
  measurementId: "G-E9NWY26V9F"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const microsoftProvider = new OAuthProvider('microsoft.com'); // Add Microsoft provider

export { auth, googleProvider, microsoftProvider, signInWithEmailAndPassword, signInWithPopup };
