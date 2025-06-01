import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyDFNr6i4ByM6or5CuS_y8V5jVpeK3h9gIg",
  authDomain: "love-letter-a8996.firebaseapp.com",
  projectId: "love-letter-a8996",
  databaseURL:
    "https://love-letter-a8996-default-rtdb.europe-west1.firebasedatabase.app/",
  storageBucket: "love-letter-a8996.firebasestorage.app",
  messagingSenderId: "528950757466",
  appId: "1:528950757466:web:fe0a7a38d23af956d2f063",
  measurementId: "G-2JGDPSP9X0",
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
