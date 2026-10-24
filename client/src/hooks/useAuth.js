import { useState, useEffect, useMemo } from "react";
import {
  onAuthStateChanged,
  signInWithPopup,
  signOut as firebaseSignOut,
} from "firebase/auth";
import { auth, googleProvider } from "../firebase";

export const useAuth = () => {
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [customName, setCustomNameState] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (fbUser) => {
      setFirebaseUser(fbUser);
      if (fbUser) {
        const saved = localStorage.getItem(`wp_custom_name_${fbUser.uid}`);
        setCustomNameState(saved || "");
      } else {
        setCustomNameState("");
      }
      setLoading(false);
    });

    const handleAuthUpdate = () => {
      const current = auth.currentUser;
      if (current) {
        const saved = localStorage.getItem(`wp_custom_name_${current.uid}`);
        setCustomNameState(saved || "");
      }
    };

    window.addEventListener("wp_auth_updated", handleAuthUpdate);
    window.addEventListener("storage", handleAuthUpdate);

    return () => {
      unsubscribe();
      window.removeEventListener("wp_auth_updated", handleAuthUpdate);
      window.removeEventListener("storage", handleAuthUpdate);
    };
  }, []);

  const updateCustomName = (name) => {
    const fbUser = firebaseUser || auth.currentUser;
    if (fbUser) {
      const trimmed = name ? name.trim() : "";
      if (trimmed) {
        localStorage.setItem(`wp_custom_name_${fbUser.uid}`, trimmed);
        localStorage.setItem("wp_username", trimmed);
        localStorage.setItem(`wp_name_configured_${fbUser.uid}`, "true");
        setCustomNameState(trimmed);
      } else {
        localStorage.removeItem(`wp_custom_name_${fbUser.uid}`);
        localStorage.setItem(`wp_name_configured_${fbUser.uid}`, "skipped");
        setCustomNameState("");
      }
      window.dispatchEvent(new Event("wp_auth_updated"));
    }
  };

  // Enrich the user object with custom/guaranteed displayName
  const user = useMemo(() => {
    if (!firebaseUser) return null;
    const defaultName =
      firebaseUser.displayName ||
      (firebaseUser.email ? firebaseUser.email.split("@")[0] : "Watcher");
    return {
      ...firebaseUser,
      displayName: customName || defaultName,
      customName: customName,
      googleName: defaultName,
      hasCustomName: Boolean(customName),
      uid: firebaseUser.uid,
      email: firebaseUser.email,
      photoURL: firebaseUser.photoURL,
    };
  }, [firebaseUser, customName]);

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      return result.user;
    } catch (error) {
      if (error.code !== "auth/popup-closed-by-user" && error.code !== "auth/cancelled-popup-request") {
        console.error("Google Sign-In Error:", error);
      }
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      console.error("Sign-Out Error:", error);
      throw error;
    }
  };

  return { user, loading, signInWithGoogle, signOut, updateCustomName };
};
