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

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchProfile = useCallback(async () => {
    setIsLoading(true);
    const { data, error } = await getProfileApi();
    if (data && !error) {
      const uData = (data as Record<string, unknown>).data || data;
      setUser(uData as UserProfile);
    } else {
      setUser(null);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    const savedToken = getStoredToken();
    if (savedToken) {
      setToken(savedToken);
      fetchProfile();
    } else {
      setIsLoading(false);
    }
  }, [fetchProfile]);

  const login = async (data: LoginParams) => {
    setIsLoading(true);
    const res = await loginApi(data);
    if (res.error) {
      setIsLoading(false);
      return { success: false, error: res.error };
    }
    const tokenVal = (res.data as Record<string, unknown>)?.token || ((res.data as Record<string, unknown>)?.data as Record<string, unknown>)?.token;
    const userData = (res.data as Record<string, unknown>)?.data || res.data;
    if (typeof tokenVal === "string") {
      setToken(tokenVal);
      setStoredToken(tokenVal);
    }
    if (userData) {
      setUser(userData as UserProfile);
    }
    await fetchProfile();
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
    const tokenVal = (res.data as Record<string, unknown>)?.token || ((res.data as Record<string, unknown>)?.data as Record<string, unknown>)?.token;
    const userData = (res.data as Record<string, unknown>)?.data || res.data;
    if (typeof tokenVal === "string") {
      setToken(tokenVal);
      setStoredToken(tokenVal);
    }
    if (userData) {
      setUser(userData as UserProfile);
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
