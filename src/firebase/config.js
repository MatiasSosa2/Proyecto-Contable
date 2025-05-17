// src/firebase/config.js

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBrKC3zkYCS2h_a9WkrUnIudBrhqT6h8bw",
  authDomain: "accounting-proyect.firebaseapp.com",
  projectId: "accounting-proyect",
  storageBucket: "accounting-proyect.appspot.com",  // corregido aquí
  messagingSenderId: "1014499421392",
  appId: "1:1014499421392:web:b1c64d635a139b375142d5",
  measurementId: "G-C882GFGP3M"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Inicializar Firestore y Auth
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
