import assert from "node:assert";
import * as api from "./index";

export function verifyAllEndpoints(): boolean {
  const requiredFunctions: (keyof typeof api)[] = [
    // Auth
    "registerApi",
    "loginApi",
    "logoutApi",
    "getProfileApi",
    "updateProfileApi",
    "changePasswordApi",
    // Cameras
    "listCamerasApi",
    "pairAddCameraApi",
    "getCameraDetailsApi",
    "updateCameraSettingsApi",
    "deleteCameraApi",
    // Media
    "listRecordingsApi",
    "getRecordingDetailsApi",
    "deleteRecordingApi",
    // Billing
    "getSubscriptionPlansApi",
    "getActiveSubscriptionApi",
    "subscribeToPlanApi",
    "listInvoicesApi",
    // Support
    "getPublicArticlesApi",
    "getPublicFaqsApi",
    "listSupportTicketsApi",
    "createSupportTicketApi",
    "getTicketDetailsApi",
    "replyToTicketApi",
    "deleteSupportTicketApi",
    // Emergency
    "triggerSosApi",
    "listEmergencyLogsApi",
    "listPoliceStationsApi",
    // Verification
    "sendEmailCodeApi",
    "verifyEmailApi",
    "sendPhoneCodeApi",
    "verifyPhoneCodeApi",
    // Admin Marketing
    "listCampaignsApi",
    "createCampaignApi",
    "getCampaignDetailsApi",
    "sendBulkMarketingApi",
    // Admin Users
    "listUsersAdminApi",
    "createUserAdminApi",
    "getUserDetailsAdminApi",
    "updateUserAdminApi",
    "deleteUserAdminApi",
    // Admin Roles
    "listRolesApi",
    "createRoleApi",
    "getRoleDetailsApi",
    "updateRoleApi",
    "deleteRoleApi",
  ];

  for (const fnName of requiredFunctions) {
    if (typeof api[fnName] !== "function") {
      throw new Error(`API Endpoint Function missing: ${fnName}`);
    }
  }

  return true;
}
