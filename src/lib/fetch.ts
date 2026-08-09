import { endpointName, endpoints, endpointType } from "./endpoints";
import { extractSearchParams } from "./extractSearchParams";

function getBaseUrl(): string {
  const envUrl = process.env.API_BASE_URL || process.env.NEXT_PUBLIC_BASE_URL;
  if (envUrl && envUrl.trim() !== "") {
    return envUrl.replace(/\/+$/, "");
  }
  return "http://localhost:8000/api";
}

const authUserName = process.env.API_AUTH_USERNAME as string;

// Global variable to store service token in memory (Server-side)
let globalApiToken: string | null = null;

async function getServiceToken(): Promise<string | null> {
  if (globalApiToken) return globalApiToken;

  try {
    const baseUrl = getBaseUrl();
    const params = new URLSearchParams({
      username: authUserName || "",
      password: "B@$eer@2026",
    });
    const loginUrl = `${baseUrl}${endpoints.loginAuth}?${params.toString()}`;
    const res = await fetch(loginUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (res.ok) {
      const text = await res.text();
      let data: any = null;
      if (text) {
        try {
          data = JSON.parse(text);
        } catch (e) {
          console.error("[getServiceToken] Error parsing login JSON:", e);
        }
      }

      if (data?.token) {
        globalApiToken = data.token;
        return globalApiToken;
      }
    } else {
      console.error("[getServiceToken] Failed to authenticate:", res.status, await res.text());
    }
  } catch (error) {
    console.error("[getServiceToken] Network error:", error);
  }

  return null;
}

function getStoredToken(): string | null {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token");
  }
  return null;
}

export interface FetchHelperParams {
  endPoint: endpointName | string | endpointType;
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  headers?: HeadersInit;
  params?: any;
  cache?: "no-store" | "no-cache" | "default" | "reload" | "force-cache" | "only-if-cached";
  refreshToken?: boolean;
  retryCount?: number;
  tags?: endpointType;
  revalidate?: number;
  token?: string;
  isLocalized?: boolean;
}

export interface FetchHelperResponse<T = any> {
  success: boolean;
  data: T | null;
  error: string | null;
  status: number;
  result?: any;
}

export async function fetchHelper<T = any>({
  endPoint,
  method = "GET",
  body,
  headers,
  params,
  cache,
  refreshToken = true,
  retryCount = 1,
  tags,
  revalidate,
  token,
}: FetchHelperParams): Promise<FetchHelperResponse<T>> {
  try {
    const url = handleUrl(endPoint, params);

    // Get auth token (Explicit param -> LocalStorage -> Service Token)
    let apiToken = token || getStoredToken();
    if (!apiToken && typeof window === "undefined") {
      apiToken = await getServiceToken();
    }

    const isFormData = typeof FormData !== "undefined" && body instanceof FormData;
    const requestHeaders: Record<string, string> = {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      Accept: "application/json",
      ...(apiToken ? { Authorization: `Bearer ${apiToken}` } : {}),
      ...(headers as Record<string, string> ?? {}),
    };

    const fetchInit = buildFetchInit({
      method,
      body,
      isFormData,
      cache,
      revalidate,
      tags,
    });

    let res: Response;
    try {
      res = await fetchWithRetry(url, {
        ...fetchInit,
        headers: requestHeaders,
      }, retryCount);

      // If token is expired (401), attempt token refresh on server side
      if (res.status === 401 && refreshToken && typeof window === "undefined") {
        globalApiToken = null;
        apiToken = await getServiceToken();
        if (apiToken) {
          requestHeaders.Authorization = `Bearer ${apiToken}`;
          res = await fetchWithRetry(url, {
            ...fetchInit,
            headers: requestHeaders,
          }, retryCount);
        }
      }
    } catch (networkError) {
      console.error(`[fetchHelper] Network error for ${url}:`, networkError);
      return {
        success: false,
        data: null,
        error: networkError instanceof Error ? networkError.message : "Network error occurred",
        status: 0,
      };
    }

    let rawResult: any = null;
    try {
      const text = await res.text();
      if (text) {
        rawResult = JSON.parse(text);
      } else {
        rawResult = { message: res.statusText || "No content returned" };
      }
    } catch (e) {
      console.error("[fetchHelper] Error parsing response body", e);
      rawResult = { message: res.statusText || "Something went wrong" };
    }

    const status = res.status;
    if (!res.ok) {
      const errorMessage =
        rawResult?.message ||
        rawResult?.error ||
        `Request failed with status ${status}`;
      return {
        success: false,
        data: (rawResult as T) || null,
        error: errorMessage,
        status,
        result: rawResult,
      };
    }

    const extractedData = (rawResult?.data !== undefined ? rawResult.data : rawResult) as T;

    return {
      success: true,
      data: extractedData,
      error: null,
      status,
      result: rawResult,
    };
  } catch (error) {
    console.error(`[fetchHelper] Unexpected error:`, error);
    return {
      success: false,
      data: null,
      error: error instanceof Error ? error.message : "Unexpected error occurred",
      status: 0,
    };
  }
}

// Convenience method helpers
fetchHelper.get = <T = any>(
  endPoint: endpointName | string | endpointType,
  options?: Omit<FetchHelperParams, "endPoint" | "method">
) => fetchHelper<T>({ endPoint, method: "GET", ...options });

fetchHelper.post = <T = any>(
  endPoint: endpointName | string | endpointType,
  body?: unknown,
  options?: Omit<FetchHelperParams, "endPoint" | "method" | "body">
) => fetchHelper<T>({ endPoint, method: "POST", body, ...options });

fetchHelper.put = <T = any>(
  endPoint: endpointName | string | endpointType,
  body?: unknown,
  options?: Omit<FetchHelperParams, "endPoint" | "method" | "body">
) => fetchHelper<T>({ endPoint, method: "PUT", body, ...options });

fetchHelper.patch = <T = any>(
  endPoint: endpointName | string | endpointType,
  body?: unknown,
  options?: Omit<FetchHelperParams, "endPoint" | "method" | "body">
) => fetchHelper<T>({ endPoint, method: "PATCH", body, ...options });

fetchHelper.delete = <T = any>(
  endPoint: endpointName | string | endpointType,
  options?: Omit<FetchHelperParams, "endPoint" | "method">
) => fetchHelper<T>({ endPoint, method: "DELETE", ...options });

async function fetchWithRetry(
  input: string,
  init: RequestInit,
  retryCount = 1
): Promise<Response> {
  let lastError: unknown;
  for (let attempt = 0; attempt <= retryCount; attempt++) {
    try {
      return await fetch(input, init);
    } catch (error) {
      lastError = error;
      if (attempt === retryCount) {
        throw error;
      }
    }
  }
  throw lastError;
}

function buildFetchInit({
  method,
  body,
  isFormData,
  cache,
  revalidate,
  tags,
}: {
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  isFormData: boolean;
  cache?: "no-store" | "no-cache" | "default" | "reload" | "force-cache" | "only-if-cached";
  revalidate?: number;
  tags?: endpointType;
}): RequestInit {
  const init: RequestInit = { method };

  if (method !== "GET") {
    init.body = isFormData ? (body as FormData) : JSON.stringify(body);
  }

  if (cache === "no-store" || cache === "no-cache") {
    init.cache = cache;
    return init;
  }

  if (revalidate !== undefined) {
    (init as any).next = {
      revalidate,
      ...(tags ? { tags: [tags.join("")] } : {}),
    };
    return init;
  }

  init.cache = cache ?? "no-cache";
  return init;
}

export function handleUrl(
  endPoint: endpointName | string | endpointType,
  params?: any
): string {
  const baseUrl = getBaseUrl();
  let queryString = "";
  if (params !== undefined && params !== null) {
    queryString = extractSearchParams(params);
  }

  let path = "";
  if (Array.isArray(endPoint)) {
    path = endPoint
      .map((item) => {
        if (typeof item === "string" && item in endpoints) {
          return endpoints[item as endpointName];
        }
        const strItem = String(item);
        return strItem.startsWith("/") ? strItem : `/${strItem}`;
      })
      .join("");
  } else if (typeof endPoint === "string") {
    if (endPoint in endpoints) {
      path = endpoints[endPoint as endpointName];
    } else {
      path = endPoint.startsWith("/") ? endPoint : `/${endPoint}`;
    }
  }

  const cleanPath = path.replace(/\/+/g, "/");
  const fullUrl = `${baseUrl}${cleanPath.startsWith("/") ? "" : "/"}${cleanPath}`;

  if (queryString && queryString.length > 0) {
    const prefix = queryString.startsWith("?") ? "" : "?";
    return `${fullUrl}${prefix}${queryString}`;
  }

  return fullUrl;
}
