import { apiFetch } from "./client";
import type {
  ApiResponse,
  PlanApiItem,
  SubscriptionApiItem,
  SubscribeParams,
  InvoiceApiItem,
} from "./types";

/**
 * GET /plans (Public)
 */
export async function getSubscriptionPlansApi() {
  return apiFetch<ApiResponse<PlanApiItem[]>>("/plans", {
    method: "GET",
  });
}

/**
 * GET /billing/subscription
 */
export async function getActiveSubscriptionApi() {
  return apiFetch<ApiResponse<SubscriptionApiItem>>("/billing/subscription", {
    method: "GET",
  });
}

/**
 * POST /billing/subscribe
 */
export async function subscribeToPlanApi(data: SubscribeParams) {
  return apiFetch<ApiResponse<SubscriptionApiItem>>("/billing/subscribe", {
    method: "POST",
    body: data,
  });
}

/**
 * GET /billing/invoices
 */
export async function listInvoicesApi() {
  return apiFetch<ApiResponse<InvoiceApiItem[]>>("/billing/invoices", {
    method: "GET",
  });
}
