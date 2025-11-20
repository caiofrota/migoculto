import React, { createContext, useContext, useEffect, useState } from "react";
import { login as loginService, logout as logoutService } from "../services/auth";
import { getAccessToken } from "../storage";

type User = {
  id: number;
  name: string;
  email: string;
};

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
          const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/session/me`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (res.ok) {
            const data: User = await res.json();
            console.log(data);
            setUser(data);
          }
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
      const loggedUser = await loginService(email, password);
      setUser(loggedUser);
    } finally {
      setLoading(false);
    }
  }

  async function logout() {
    setLoading(true);
    try {
      await logoutService();
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
