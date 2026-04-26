"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface AuthContextType {
  isAdmin: boolean;
  setIsAdmin: (value: boolean) => void;
  isLoaded: boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load auth state từ localStorage
  useEffect(() => {
    const savedAdmin = localStorage.getItem("isAdmin") === "true";
    setIsAdmin(savedAdmin);
    setIsLoaded(true);
  }, []);

  // Save auth state vào localStorage khi thay đổi
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("isAdmin", isAdmin.toString());
    }
  }, [isAdmin, isLoaded]);

  const logout = () => {
    setIsAdmin(false);
    localStorage.removeItem("isAdmin");
  };

  return (
    <AuthContext.Provider value={{ isAdmin, setIsAdmin, logout, isLoaded }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
