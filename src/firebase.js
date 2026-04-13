import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDsd3jj2DHwCbQeoE8CSfZIO2bqjXGiSRw",
  authDomain: "decards-55fcc.firebaseapp.com",
  projectId: "decards-55fcc",
  storageBucket: "decards-55fcc.firebasestorage.app",
  messagingSenderId: "467683610935",
  appId: "1:467683610935:web:b4112be8bc8b192e408ab2",
  measurementId: "G-H9ZKZYPY2G",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);
