  import React, { createContext, useContext, useState, useEffect } from "react";
  import { auth, provider } from "../Firebase/Firebase.js";
  import { signInWithPopup, onAuthStateChanged, signOut } from "firebase/auth";

  const AuthContext = createContext(null);

  export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    function login() {
      return signInWithPopup(auth, provider);
    }

    function logout() {
      return signOut(auth);
    }

    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        setCurrentUser(user);
        setLoading(false);
      });
      return unsubscribe;
    }, []);

    const value = {
      currentUser,
      login,
      logout,
    };

    return (
      <AuthContext.Provider value={value}>
        {!loading && children}
      </AuthContext.Provider>
    );
  }

  export function useAuth() {
    return useContext(AuthContext);
  }
