import { apiFetch } from "./client";
import type {
  ApiResponse,
  ListRecordingsParams,
  RecordingApiItem,
} from "./types";

/**
 * GET /recordings?per_page=15&recording_type=motion&search=
 */
export async function listRecordingsApi(params?: ListRecordingsParams) {
  return apiFetch<ApiResponse<RecordingApiItem[]>>("/recordings", {
    method: "GET",
    queryParams: params as Record<string, string | number | boolean | null | undefined>,
  });
}

/**
 * GET /recordings/:id
 */
export async function getRecordingDetailsApi(id: string | number) {
  return apiFetch<ApiResponse<RecordingApiItem>>(`/recordings/${id}`, {
    method: "GET",
  });
}

/**
 * DELETE /recordings/:id
 */
export async function deleteRecordingApi(id: string | number) {
  return apiFetch<ApiResponse>(`/recordings/${id}`, {
    method: "DELETE",
  });
}
