import { apiService, User } from "@/services/api";
import React, { createContext, useContext, useEffect, useState } from "react";
import { getAccessToken } from "../storage";

type AppContextValue = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AppContext = createContext<AppContextValue | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const token = await getAccessToken();
      if (token) {
        try {
          const res = await apiService.me();
          console.log(res);
          setUser(res);
        } catch {
          // TODO
        }
      }
      setLoading(false);
    })();
  }, []);

  async function login(email: string, password: string) {
    setLoading(true);
    try {
      const loggedUser = await apiService.login(email, password);
      setUser(loggedUser);
    } finally {
      setLoading(false);
    }
  }

  async function logout() {
    setLoading(true);
    try {
      await apiService.logout();
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  return <AppContext.Provider value={{ user, loading, login, logout }}>{children}</AppContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
