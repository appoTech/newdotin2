// src/utils/firebase.js
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyBOsjQpFNDHC0J18gbWS0U9UvBx3bfWdsg",
  authDomain: "appopener-91440.firebaseapp.com",
  databaseURL:
    "https://appopener-91440-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "appopener-91440",
  storageBucket: "appopener-91440.firebasestorage.app",
  messagingSenderId: "705226084724",
  appId: "1:705226084724:web:6710c26a30d0460377dc21",
  measurementId: "G-F7YMBY74PS",
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
