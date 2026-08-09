import { apiFetch, setStoredToken } from "./client";
import type {
  ApiResponse,
  RegisterParams,
  LoginParams,
  UpdateProfileParams,
  ChangePasswordParams,
  UserProfile,
} from "./types";

/**
 * POST /auth/register
 */
export async function registerApi(data: RegisterParams) {
  return apiFetch<ApiResponse<UserProfile>>("/auth/register", {
    method: "POST",
    body: data,
  });
}

/**
 * POST /auth/login
 */
export async function loginApi(data: LoginParams) {
  const result = await apiFetch<ApiResponse<UserProfile>>("/auth/login", {
    method: "POST",
    body: data,
  });
  return result;
}

/**
 * POST /auth/logout
 */
export async function logoutApi() {
  const result = await apiFetch<ApiResponse>("/auth/logout", {
    method: "POST",
  });
  setStoredToken(null);
  return result;
}

/**
 * GET /auth/profile
 */
export async function getProfileApi() {
  return apiFetch<ApiResponse<UserProfile>>("/auth/profile", {
    method: "GET",
  });
}

/**
 * POST /auth/profile
 */
export async function updateProfileApi(data: UpdateProfileParams) {
  return apiFetch<ApiResponse<UserProfile>>("/auth/profile", {
    method: "POST",
    body: data,
  });
}

/**
 * PUT /auth/change_password
 */
export async function changePasswordApi(data: ChangePasswordParams) {
  return apiFetch<ApiResponse>("/auth/change_password", {
    method: "PUT",
    body: data,
  });
}
