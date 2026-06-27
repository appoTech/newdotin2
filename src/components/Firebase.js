// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from 'firebase/firestore';
// import { getAnalytics } from "firebase/analytics";
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAtSI5jmF5IqPcfTMe9n_YpjrFvWameGDc",
  authDomain: "deet-me-test.firebaseapp.com",
  projectId: "deet-me-test",
  storageBucket: "deet-me-test.appspot.com",
  messagingSenderId: "55626808921",
  appId: "1:55626808921:web:c00fea2e969a96c3ee7b48",
  measurementId: "G-2X14GNB2Z4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
// const analytics = getAnalytics(app);

export {db};