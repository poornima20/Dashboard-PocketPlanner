// ==========================================
// FIREBASE IMPORTS
// ==========================================

import { initializeApp } from
"https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
  getAuth
} from
"https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
  getFirestore
} from
"https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


// ==========================================
// FIREBASE CONFIG
// ==========================================

const firebaseConfig = {
  apiKey: "AIzaSyASyErnTbmHPFVEkjvlZrFp9oXFNS95SjY",
  authDomain: "pocket-planner-eeb28.firebaseapp.com",
  projectId: "pocket-planner-eeb28",
  storageBucket: "pocket-planner-eeb28.firebasestorage.app",
  messagingSenderId: "817631735021",
  appId: "1:817631735021:web:777a8c8a71133e1b24b0e4"
};

// ==========================================
// INITIALIZE FIREBASE
// ==========================================

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const db = getFirestore(app);

console.log("Firebase Connected");