export const endpoints = {
  // Auth
  loginAuth: "/auth/login",
  register: "/auth/register",
  logout: "/auth/logout",
  profile: "/auth/profile",
  changePassword: "/auth/change_password",

  // Cameras
  cameras: "/cameras",

  // Media / Recordings
  recordings: "/recordings",

  // Emergency
  emergencySos: "/emergency/sos",
  emergencyLogs: "/emergency/logs",
  policeStations: "/emergency/police-stations",

  // Billing
  plans: "/plans",
  billingSubscription: "/billing/subscription",
  billingSubscribe: "/billing/subscribe",
  billingInvoices: "/billing/invoices",

  // Support
  supportArticles: "/support/articles",
  supportFaqs: "/support/faqs",
  supportTickets: "/support/tickets",

  // Verification
  sendEmailCode: "/verification/send-email-code",
  verifyEmail: "/verification/verify-email",
  sendPhoneCode: "/verification/send-phone-code",
  verifyPhone: "/verification/verify-phone",

  // Admin Marketing
  marketingCampaigns: "/marketing/campaigns",
  sendWhatsappMail: "/marketing/send-whatsapp-mail",

  // Admin Users
  adminUsers: "/admin/users",

  // Admin Roles
  roles: "/roles",
} as const;

export type endpointName = keyof typeof endpoints;
export type EndpointName = endpointName;

export type endpointType = (endpointName | string | number)[];
export type EndpointType = endpointType;

export const tags = {
  auth: "auth",
  cameras: "cameras",
  recordings: "recordings",
  emergency: "emergency",
  billing: "billing",
  support: "support",
  marketing: "marketing",
  users: "users",
  roles: "roles",
} as const;

export type Tags = keyof typeof tags;
