import type { endpointName, endpointType } from "../endpoints";
import { fetchHelper } from "../fetch";

export function getBaseUrl(): string {
  const envUrl = process.env.API_BASE_URL || process.env.NEXT_PUBLIC_BASE_URL;
  if (envUrl && envUrl.trim() !== "") {
    return envUrl.replace(/\/+$/, "");
  }
  return "http://localhost:8000/api";
}

export function getStoredToken(): string | null {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token");
  }
  return null;
}

export function setStoredToken(token: string | null): void {
  if (typeof window !== "undefined") {
    if (token) {
      localStorage.setItem("token", token);
      document.cookie = `token=${encodeURIComponent(token)}; path=/; max-age=2592000; SameSite=Lax`;
    } else {
      localStorage.removeItem("token");
      document.cookie = "token=; path=/; max-age=0; SameSite=Lax";
    }
  }
}

export interface RequestOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  headers?: Record<string, string>;
  body?: unknown;
  queryParams?: Record<string, string | number | boolean | undefined | null>;
  token?: string;
}

export async function apiFetch<T = unknown>(
  endpoint: endpointName | string | endpointType,
  options: RequestOptions = {}
): Promise<{
  data: T | null;
  error: string | null;
  status: number;
  meta?: any;
  links?: any;
  result?: any;
}> {
  const res = await fetchHelper<T>({
    endPoint: endpoint,
    method: options.method || "GET",
    body: options.body,
    headers: options.headers,
    params: options.queryParams,
    token: options.token,
  });

  // Auto-save token if returned in response data
  const rawResult = res.result;
  if (rawResult) {
    const dataObj = rawResult?.data as Record<string, unknown> | undefined;
    if (dataObj?.token && typeof dataObj.token === "string") {
      setStoredToken(dataObj.token);
    } else if (rawResult?.token && typeof rawResult.token === "string") {
      setStoredToken(rawResult.token);
    }
  }

  return {
    data: res.data,
    error: res.error,
    status: res.status,
    meta: rawResult?.meta,
    links: rawResult?.links,
    result: rawResult,
  };
}
