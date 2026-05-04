"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface AuthContextType {
  isAdmin: boolean;
  setIsAdmin: (value: boolean) => void;
  isLoggedIn: boolean;
  setIsLoggedIn: (value: boolean) => void;
  userName: string | null;
  userEmail: string | null;
  setUserInfo: (userName: string, userEmail: string) => void;
  adminEmail: string | null;
  adminPassword: string | null;
  setAdminCredentials: (email: string, password: string) => void;
  isLoaded: boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [adminEmail, setAdminEmail] = useState<string | null>(null);
  const [adminPassword, setAdminPassword] = useState<string | null>(null);
  const [isLoaded] = useState(true);

  const setUserInfo = (userName: string, userEmail: string) => {
    setUserName(userName);
    setUserEmail(userEmail);
  };

  const setAdminCredentials = (email: string, password: string) => {
    setAdminEmail(email);
    setAdminPassword(password);
  };

  const logout = () => {
    setIsAdmin(false);
    setIsLoggedIn(false);
    setUserName(null);
    setUserEmail(null);
    setAdminEmail(null);
    setAdminPassword(null);
  };

  return (
    <AuthContext.Provider 
      value={{ 
        isAdmin, 
        setIsAdmin,
        isLoggedIn,
        setIsLoggedIn,
        userName,
        userEmail,
        setUserInfo,
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
