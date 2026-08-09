import { apiFetch } from "./client";
import type { ApiResponse, VerifyCodeParams, VerificationStatusData } from "./types";

/**
 * POST /verification/send-email-code
 * Sends a 4-digit verification code to the authenticated user's email address.
 */
export async function sendEmailCodeApi() {
  return apiFetch<ApiResponse>("/verification/send-email-code", {
    method: "POST",
  });
}

/**
 * POST /verification/verify-email
 * Validates the email OTP code provided by the user.
 */
export async function verifyEmailApi(data: VerifyCodeParams) {
  return apiFetch<ApiResponse<VerificationStatusData>>("/verification/verify-email", {
    method: "POST",
    body: data,
  });
}

/**
 * POST /verification/send-phone-code
 * Sends a 4-digit verification code to the authenticated user's phone via WhatsApp.
 */
export async function sendPhoneCodeApi() {
  return apiFetch<ApiResponse>("/verification/send-phone-code", {
    method: "POST",
  });
}

/**
 * POST /verification/verify-phone
 * Validates the phone OTP code provided by the user.
 */
export async function verifyPhoneCodeApi(data: VerifyCodeParams) {
  return apiFetch<ApiResponse<VerificationStatusData>>("/verification/verify-phone", {
    method: "POST",
    body: data,
  });
}
