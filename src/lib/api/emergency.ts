import { apiFetch } from "./client";
import type {
  ApiResponse,
  TriggerSosParams,
  EmergencyLogApiItem,
  PoliceStationApiItem,
} from "./types";

/**
 * POST /emergency/sos
 */
export async function triggerSosApi(data: TriggerSosParams) {
  return apiFetch<ApiResponse<EmergencyLogApiItem>>("/emergency/sos", {
    method: "POST",
    body: data,
  });
}

/**
 * GET /emergency/logs
 */
export async function listEmergencyLogsApi() {
  return apiFetch<ApiResponse<EmergencyLogApiItem[]>>("/emergency/logs", {
    method: "GET",
  });
}

/**
 * GET /emergency/police-stations?city=Cairo
 */
export async function listPoliceStationsApi(city?: string) {
  return apiFetch<ApiResponse<PoliceStationApiItem[]>>(
    "/emergency/police-stations",
    {
      method: "GET",
      queryParams: city ? { city } : undefined,
    }
  );
}
