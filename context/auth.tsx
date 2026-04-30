"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface AuthContextType {
  isAdmin: boolean;
  setIsAdmin: (value: boolean) => void;
  adminEmail: string | null;
  adminPassword: string | null;
  setAdminCredentials: (email: string, password: string) => void;
  isLoaded: boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminEmail, setAdminEmail] = useState<string | null>(null);
  const [adminPassword, setAdminPassword] = useState<string | null>(null);
  const [isLoaded] = useState(true);

  const setAdminCredentials = (email: string, password: string) => {
    setAdminEmail(email);
    setAdminPassword(password);
  };

  const logout = () => {
    setIsAdmin(false);
    setAdminEmail(null);
    setAdminPassword(null);
  };

  return (
    <AuthContext.Provider 
      value={{ 
        isAdmin, 
        setIsAdmin, 
        adminEmail,
        adminPassword,
        setAdminCredentials,
        logout, 
        isLoaded 
      }}
    >
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
