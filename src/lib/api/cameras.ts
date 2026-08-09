import { apiFetch } from "./client";
import type {
  ApiResponse,
  ListCamerasParams,
  PairAddCameraParams,
  UpdateCameraParams,
  CameraApiItem,
} from "./types";

/**
 * GET /cameras?per_page=15&search=&mode=
 */
export async function listCamerasApi(params?: ListCamerasParams) {
  return apiFetch<ApiResponse<CameraApiItem[]>>("/cameras", {
    method: "GET",
    queryParams: params as Record<string, string | number | boolean | null | undefined>,
  });
}

/**
 * POST /cameras
 */
export async function pairAddCameraApi(data: PairAddCameraParams) {
  return apiFetch<ApiResponse<CameraApiItem>>("/cameras", {
    method: "POST",
    body: data,
  });
}

/**
 * GET /cameras/:id
 */
export async function getCameraDetailsApi(id: string | number) {
  return apiFetch<ApiResponse<CameraApiItem>>(`/cameras/${id}`, {
    method: "GET",
  });
}

/**
 * PUT /cameras/:id
 */
export async function updateCameraSettingsApi(
  id: string | number,
  data: UpdateCameraParams
) {
  return apiFetch<ApiResponse<CameraApiItem>>(`/cameras/${id}`, {
    method: "PUT",
    body: data,
  });
}

/**
 * DELETE /cameras/:id
 */
export async function deleteCameraApi(id: string | number) {
  return apiFetch<ApiResponse>(`/cameras/${id}`, {
    method: "DELETE",
  });
}
