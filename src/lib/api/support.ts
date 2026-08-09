import { apiFetch } from "./client";
import type {
  ApiResponse,
  SupportArticleApiItem,
  SupportFaqApiItem,
  SupportTicketApiItem,
  CreateTicketParams,
  TicketReplyParams,
} from "./types";

/**
 * GET /support/articles (Public)
 */
export async function getPublicArticlesApi() {
  return apiFetch<ApiResponse<SupportArticleApiItem[]>>("/support/articles", {
    method: "GET",
  });
}

/**
 * GET /support/faqs (Public)
 */
export async function getPublicFaqsApi() {
  return apiFetch<ApiResponse<SupportFaqApiItem[]>>("/support/faqs", {
    method: "GET",
  });
}

/**
 * GET /support/tickets
 */
export async function listSupportTicketsApi() {
  return apiFetch<ApiResponse<SupportTicketApiItem[]>>("/support/tickets", {
    method: "GET",
  });
}

/**
 * POST /support/tickets
 */
export async function createSupportTicketApi(data: CreateTicketParams) {
  return apiFetch<ApiResponse<SupportTicketApiItem>>("/support/tickets", {
    method: "POST",
    body: data,
  });
}

/**
 * GET /support/tickets/:id
 */
export async function getTicketDetailsApi(id: string | number) {
  return apiFetch<ApiResponse<SupportTicketApiItem>>(`/support/tickets/${id}`, {
    method: "GET",
  });
}

/**
 * POST /support/tickets/:id/reply
 */
export async function replyToTicketApi(
  id: string | number,
  data: TicketReplyParams
) {
  return apiFetch<ApiResponse<SupportTicketApiItem>>(
    `/support/tickets/${id}/reply`,
    {
      method: "POST",
      body: data,
    }
  );
}

/**
 * DELETE /support/tickets/:id
 */
export async function deleteSupportTicketApi(id: string | number) {
  return apiFetch<ApiResponse>(`/support/tickets/${id}`, {
    method: "DELETE",
  });
}
