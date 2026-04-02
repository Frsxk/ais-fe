import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { api } from "./api";

interface User {
  id: number;
  name: string;
  email: string;
  role: "student" | "lecturer";
}

interface AuthState {
  user: User | null;
}

interface AuthContextValue extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isInitializing: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({ user: null });
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const raw = localStorage.getItem("ais_user");
    let user = null;
    try {
      user = raw ? (JSON.parse(raw) as User) : null;
    } catch {
      // ignore
    }
    setState({ user });
    setIsInitializing(false);
  }, []);

  useEffect(() => {
    if (isInitializing) return;
    if (state.user) {
      localStorage.setItem("ais_user", JSON.stringify(state.user));
    } else {
      localStorage.removeItem("ais_user");
    }
  }, [state.user, isInitializing]);

  const login = async (email: string, password: string) => {
    const res = await api.post<{ message: string; user: User }>(
      "/auth/login",
      { email, password }
    );
    setState({ user: res.user });
  };

  const register = async (name: string, email: string, password: string, role: string) => {
    const res = await api.post<{ message: string; user: User }>(
      "/auth/register",
      { name, email, password, role }
    );
    setState({ user: res.user });
  };

  const logout = () => {
    setState({ user: null });
    localStorage.removeItem("ais_user");
  };

  return (
    <AuthContext.Provider
      value={{ ...state, login, register, logout, isAuthenticated: !!state.user, isInitializing }}
    >
      {children}
    </AuthContext.Provider>
  );
}
