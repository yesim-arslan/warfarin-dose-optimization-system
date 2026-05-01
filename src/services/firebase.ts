import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC7f8cFnZT1Y2sht6rbmV677AwY4n-kUOU",
  authDomain: "inr-dose-app.firebaseapp.com",
  projectId: "inr-dose-app",
  storageBucket: "inr-dose-app.firebasestorage.app",
  messagingSenderId: "912224365700",
  appId: "1:912224365700:web:fe75cc0509ef4e0c7726d1"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);