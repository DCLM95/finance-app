import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDbChOov0NUE-IzWo6DybqDRI_hpugkZdk",
  authDomain: "darren-finance-app.firebaseapp.com",
  projectId: "darren-finance-app",
  storageBucket: "darren-finance-app.appspot.com",
  messagingSenderId: "990853673962",
  appId: "1:990853673962:web:99df7861ee6f3fe5977893",
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

export const db = getFirestore(app);
