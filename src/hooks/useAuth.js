import { useState, useEffect } from "react";
import {
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { auth, provider, db } from "../firebase";

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Create or update user profile in Firestore on every login
        const userRef = doc(db, "users", firebaseUser.uid, "profile", "info");
        await setDoc(
          userRef,
          {
            displayName: firebaseUser.displayName,
            email: firebaseUser.email,
            photoURL: firebaseUser.photoURL,
            lastActive: serverTimestamp(),
          },
          { merge: true }
        );
        setUser(firebaseUser);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (err) {
      console.error("Sign in error:", err);
    }
  };

  const logOut = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error("Sign out error:", err);
    }
  };

  return { user, loading, signIn, logOut };
}
