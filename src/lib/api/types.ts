export interface ApiResponse<T = unknown> {
  status?: boolean;
  message?: string;
  data?: T;
  token?: string;
  [key: string]: unknown;
}

// ── Auth Types ──────────────────────────────────────────
export interface RegisterParams {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface LoginParams {
  email: string;
  password: string;
}

export interface UpdateProfileParams {
  name?: string;
  email?: string;
  [key: string]: unknown;
}

export interface ChangePasswordParams {
  current_password: string;
  old_password?: string;
  password: string;
  password_confirmation: string;
}

export interface UserProfile {
  id: number | string;
  name: string;
  email: string;
  phone?: string | null;
  email_verified_at?: string | null;
  phone_verified_at?: string | null;
  email_verified?: boolean;
  phone_verified?: boolean;
  role?: string;
  created_at?: string;
  updated_at?: string;
  [key: string]: unknown;
}

// ── Camera Module Types ─────────────────────────────────
export interface ListCamerasParams {
  per_page?: number;
  search?: string;
  mode?: string;
}

export interface PairAddCameraParams {
  camera_model_id: number;
  name: string;
  serial_number: string;
  mac_address: string;
  mode: string;
}

export interface UpdateCameraParams {
  name?: string;
  mode?: string;
  is_locked?: boolean;
  [key: string]: unknown;
}

export interface CameraApiItem {
  id: number | string;
  camera_model_id?: number;
  name: string;
  serial_number?: string;
  mac_address?: string;
  mode?: string;
  is_locked?: boolean;
  status?: string;
  created_at?: string;
  updated_at?: string;
  [key: string]: unknown;
}

// ── Media Module Types ──────────────────────────────────
export interface ListRecordingsParams {
  per_page?: number;
  recording_type?: string;
  search?: string;
}

export interface RecordingApiItem {
  id: number | string;
  camera_id?: number | string;
  recording_type?: string;
  file_url?: string;
  thumbnail_url?: string;
  duration?: string | number;
  created_at?: string;
  [key: string]: unknown;
}

// ── Emergency Module Types ──────────────────────────────
export interface TriggerSosParams {
  camera_id: number;
  police_station_id: number;
  notes: string;
}

export interface EmergencyLogApiItem {
  id: number | string;
  camera_id?: number;
  police_station_id?: number;
  notes?: string;
  status?: string;
  created_at?: string;
  [key: string]: unknown;
}

export interface PoliceStationApiItem {
  id: number | string;
  name: string;
  city: string;
  phone?: string;
  address?: string;
  [key: string]: unknown;
}

// ── Billing Module Types ────────────────────────────────
export interface PlanApiItem {
  id: number | string;
  name: string;
  price: number | string;
  billing_cycle?: string;
  features?: string[];
  [key: string]: unknown;
}

export interface SubscriptionApiItem {
  id: number | string;
  plan_id: number | string;
  status: string;
  starts_at?: string;
  ends_at?: string;
  plan?: PlanApiItem;
  [key: string]: unknown;
}

export interface SubscribeParams {
  plan_id: number;
  payment_method: string;
}

export interface InvoiceApiItem {
  id: number | string;
  invoice_number?: string;
  amount: number | string;
  status: string;
  date?: string;
  download_url?: string;
  [key: string]: unknown;
}

// ── Support Module Types ────────────────────────────────
export interface SupportArticleApiItem {
  id: number | string;
  title: string;
  category?: string;
  content?: string;
  [key: string]: unknown;
}

export interface SupportFaqApiItem {
  id: number | string;
  question: string;
  answer: string;
  [key: string]: unknown;
}

export interface CreateTicketParams {
  subject: string;
  message: string;
  priority: string;
  channel: string;
}

export interface TicketReplyParams {
  message: string;
}

export interface SupportTicketApiItem {
  id: number | string;
  subject: string;
  message?: string;
  priority?: string;
  channel?: string;
  status?: string;
  created_at?: string;
  replies?: Array<{
    id: number | string;
    message: string;
    sender?: string;
    created_at?: string;
  }>;
  [key: string]: unknown;
}

// ── Admin Module Types ──────────────────────────────────
export interface CreateCampaignParams {
  campaign_name: string;
  channel: string;
  target_country: string;
  target_city: string;
  message_body: string;
}

export interface MarketingCampaignApiItem {
  id: number | string;
  campaign_name: string;
  channel: string;
  target_country?: string;
  target_city?: string;
  message_body?: string;
  status?: string;
  created_at?: string;
  [key: string]: unknown;
}

export interface CreateAdminUserParams {
  name: string;
  email: string;
  password: string;
}

export interface UpdateAdminUserParams {
  name?: string;
  email?: string;
  [key: string]: unknown;
}

export interface AdminUserApiItem {
  id: number | string;
  name: string;
  email: string;
  role?: string;
  created_at?: string;
  [key: string]: unknown;
}

export interface CreateRoleParams {
  name: string;
  permission_ids: number[];
}

export interface UpdateRoleParams {
  name?: string;
  permission_ids?: number[];
}

export interface RoleApiItem {
  id: number | string;
  name: string;
  permissions?: unknown[];
  created_at?: string;
  [key: string]: unknown;
}

// ── Verification Module Types ────────────────────────────
export interface VerifyCodeParams {
  code: string;
}

export interface VerificationStatusData {
  email_verified?: boolean;
  phone_verified?: boolean;
  [key: string]: unknown;
}

export interface SendBulkMarketingParams {
  send_to_all?: boolean | number;
  subject: string;
  message: string;
  country?: string;
  city?: string;
  client_ids?: number[];
  image?: File | Blob | null;
}

