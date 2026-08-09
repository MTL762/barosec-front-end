import { apiFetch } from "./client";
import type {
  ApiResponse,
  CreateCampaignParams,
  SendBulkMarketingParams,
  MarketingCampaignApiItem,
  CreateAdminUserParams,
  UpdateAdminUserParams,
  AdminUserApiItem,
  CreateRoleParams,
  UpdateRoleParams,
  RoleApiItem,
} from "./types";

// ── Marketing Module ──────────────────────────────────
/**
 * GET /marketing/campaigns
 */
export async function listCampaignsApi() {
  return apiFetch<ApiResponse<MarketingCampaignApiItem[]>>(
    "/marketing/campaigns",
    { method: "GET" }
  );
}

/**
 * POST /marketing/campaigns
 */
export async function createCampaignApi(data: CreateCampaignParams) {
  return apiFetch<ApiResponse<MarketingCampaignApiItem>>(
    "/marketing/campaigns",
    { method: "POST", body: data }
  );
}

/**
 * GET /marketing/campaigns/:id
 */
export async function getCampaignDetailsApi(id: string | number) {
  return apiFetch<ApiResponse<MarketingCampaignApiItem>>(
    `/marketing/campaigns/${id}`,
    { method: "GET" }
  );
}

/**
 * POST /marketing/send-whatsapp-mail
 * Dispatches queued WhatsApp and Email messages to clients matching parameters.
 */
export async function sendBulkMarketingApi(params: SendBulkMarketingParams) {
  const formData = new FormData();
  formData.append("subject", params.subject);
  formData.append("message", params.message);

  if (params.send_to_all !== undefined) {
    formData.append("send_to_all", params.send_to_all ? "1" : "0");
  }
  if (params.country) {
    formData.append("country", params.country);
  }
  if (params.city) {
    formData.append("city", params.city);
  }
  if (params.client_ids && Array.isArray(params.client_ids)) {
    params.client_ids.forEach((id, idx) => {
      formData.append(`client_ids[${idx}]`, String(id));
    });
  }
  if (params.image) {
    formData.append("image", params.image);
  }

  return apiFetch<ApiResponse>("/marketing/send-whatsapp-mail", {
    method: "POST",
    body: formData,
  });
}

// ── User Management Module ─────────────────────────────
/**
 * GET /admin/users
 */
export async function listUsersAdminApi() {
  return apiFetch<ApiResponse<AdminUserApiItem[]>>("/admin/users", {
    method: "GET",
  });
}

/**
 * POST /admin/users
 */
export async function createUserAdminApi(data: CreateAdminUserParams) {
  return apiFetch<ApiResponse<AdminUserApiItem>>("/admin/users", {
    method: "POST",
    body: data,
  });
}

/**
 * GET /admin/users/:id
 */
export async function getUserDetailsAdminApi(id: string | number) {
  return apiFetch<ApiResponse<AdminUserApiItem>>(`/admin/users/${id}`, {
    method: "GET",
  });
}

/**
 * POST /admin/users/:id
 */
export async function updateUserAdminApi(
  id: string | number,
  data: UpdateAdminUserParams
) {
  return apiFetch<ApiResponse<AdminUserApiItem>>(`/admin/users/${id}`, {
    method: "POST",
    body: data,
  });
}

/**
 * DELETE /admin/users/:id
 */
export async function deleteUserAdminApi(id: string | number) {
  return apiFetch<ApiResponse>(`/admin/users/${id}`, {
    method: "DELETE",
  });
}

// ── Role Management Module ─────────────────────────────
/**
 * GET /roles
 */
export async function listRolesApi() {
  return apiFetch<ApiResponse<RoleApiItem[]>>("/roles", {
    method: "GET",
  });
}

/**
 * POST /roles
 */
export async function createRoleApi(data: CreateRoleParams) {
  return apiFetch<ApiResponse<RoleApiItem>>("/roles", {
    method: "POST",
    body: data,
  });
}

/**
 * GET /roles/:id
 */
export async function getRoleDetailsApi(id: string | number) {
  return apiFetch<ApiResponse<RoleApiItem>>(`/roles/${id}`, {
    method: "GET",
  });
}

/**
 * PUT /roles/:id
 */
export async function updateRoleApi(
  id: string | number,
  data: UpdateRoleParams
) {
  return apiFetch<ApiResponse<RoleApiItem>>(`/roles/${id}`, {
    method: "PUT",
    body: data,
  });
}

/**
 * DELETE /roles/:id
 */
export async function deleteRoleApi(id: string | number) {
  return apiFetch<ApiResponse>(`/roles/${id}`, {
    method: "DELETE",
  });
}
