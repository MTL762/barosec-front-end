"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import {
  getStoredToken,
  setStoredToken,
  getProfileApi,
  loginApi,
  registerApi,
  logoutApi,
} from "@/lib/api";
import type { UserProfile, LoginParams, RegisterParams } from "@/lib/api";

interface AuthContextType {
  user: UserProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: LoginParams) => Promise<{ success: boolean; error?: string }>;
  register: (data: RegisterParams) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => ({ success: false }),
  register: async () => ({ success: false }),
  logout: async () => {},
  refreshProfile: async () => {},
});

function extractUserData(raw: any): UserProfile | null {
  if (!raw) return null;
  let root = raw;
  if (root.data && typeof root.data === "object" && !Array.isArray(root.data)) {
    root = root.data;
  }
  if (root.user && typeof root.user === "object" && !Array.isArray(root.user)) {
    return root.user as UserProfile;
  }
  if (root.id !== undefined || root.email !== undefined || root.name !== undefined || root.type !== undefined) {
    return root as UserProfile;
  }
  return root as UserProfile;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchProfile = useCallback(async () => {
    setIsLoading(true);
    const res = await getProfileApi();
    if (res.data && !res.error) {
      const profileUser = extractUserData(res.data) || extractUserData(res.result);
      if (profileUser) {
        setUser((prev) => (prev ? { ...prev, ...profileUser } : profileUser));
      }
    } else if (res.status === 401) {
      setUser(null);
      setToken(null);
      setStoredToken(null);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    let isMounted = true;
    const initAuth = async () => {
      const savedToken = getStoredToken();
      if (savedToken) {
        if (isMounted) setToken(savedToken);
        await fetchProfile();
      } else {
        if (isMounted) setIsLoading(false);
      }
    };
    initAuth();
    return () => {
      isMounted = false;
    };
  }, [fetchProfile]);

  const login = async (data: LoginParams) => {
    setIsLoading(true);
    const res = await loginApi(data);
    if (res.error) {
      setIsLoading(false);
      return { success: false, error: res.error };
    }
    const tokenVal =
      (res.data as Record<string, unknown>)?.token ||
      ((res.data as Record<string, unknown>)?.data as Record<string, unknown>)?.token ||
      (res.result as Record<string, unknown>)?.token ||
      ((res.result as Record<string, unknown>)?.data as Record<string, unknown>)?.token;

    if (typeof tokenVal === "string") {
      setToken(tokenVal);
      setStoredToken(tokenVal);
    }

    const userData = extractUserData(res.data) || extractUserData(res.result);
    if (userData) {
      setUser(userData);
    } else {
      await fetchProfile();
    }
    setIsLoading(false);
    return { success: true };
  };

  const register = async (data: RegisterParams) => {
    setIsLoading(true);
    const res = await registerApi(data);
    if (res.error) {
      setIsLoading(false);
      return { success: false, error: res.error };
    }
    const tokenVal =
      (res.data as Record<string, unknown>)?.token ||
      ((res.data as Record<string, unknown>)?.data as Record<string, unknown>)?.token ||
      (res.result as Record<string, unknown>)?.token;

    if (typeof tokenVal === "string") {
      setToken(tokenVal);
      setStoredToken(tokenVal);
    }

    const userData = extractUserData(res.data) || extractUserData(res.result);
    if (userData) {
      setUser(userData);
    }
    await fetchProfile();
    setIsLoading(false);
    return { success: true };
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await logoutApi();
    } catch {}
    setToken(null);
    setUser(null);
    setStoredToken(null);
    setIsLoading(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        isLoading,
        login,
        register,
        logout,
        refreshProfile: fetchProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
