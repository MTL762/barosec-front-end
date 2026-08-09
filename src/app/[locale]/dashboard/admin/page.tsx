"use client";

import { useState, useEffect } from "react";
import {
  Shield,
  Trash2,
  Loader2,
  Terminal,
  Users,
  Key,
  Megaphone,
  Code2,
  Play,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  apiFetch,
  getBaseUrl,
  getStoredToken,
  listCampaignsApi,
  createCampaignApi,
  listUsersAdminApi,
  createUserAdminApi,
  deleteUserAdminApi,
  listRolesApi,
  createRoleApi,
  deleteRoleApi,
  MarketingCampaignApiItem,
  AdminUserApiItem,
  RoleApiItem,
} from "@/lib/api";

const ALL_POSTMAN_REQUESTS = [
  // Auth
  { id: 1, group: "Auth", name: "Register", method: "POST", endpoint: "/auth/register", body: { name: "client", email: "bolaphilip3@gmail.com", password: "password123", password_confirmation: "password123" } },
  { id: 2, group: "Auth", name: "Login", method: "POST", endpoint: "/auth/login", body: { email: "bolaphilip3@gmail.com", password: "password123" } },
  { id: 3, group: "Auth", name: "Logout", method: "POST", endpoint: "/auth/logout" },
  { id: 4, group: "Auth", name: "Get Profile", method: "GET", endpoint: "/auth/profile" },
  { id: 5, group: "Auth", name: "Update Profile", method: "POST", endpoint: "/auth/profile", body: { name: "John Updated" } },
  { id: 6, group: "Auth", name: "Change Password", method: "PUT", endpoint: "/auth/change_password", body: { current_password: "password123", password: "newpassword123", password_confirmation: "newpassword123" } },

  // Camera Module
  { id: 7, group: "Client - Cameras", name: "List User Cameras", method: "GET", endpoint: "/cameras?per_page=15&search=&mode=" },
  { id: 8, group: "Client - Cameras", name: "Pair & Add Camera", method: "POST", endpoint: "/cameras", body: { camera_model_id: 1, name: "Front Door Security Camera", serial_number: "CAM-987654321", mac_address: "00:1B:44:11:3A:B7", mode: "security" } },
  { id: 9, group: "Client - Cameras", name: "Get Camera Details", method: "GET", endpoint: "/cameras/1" },
  { id: 10, group: "Client - Cameras", name: "Update Camera Settings", method: "PUT", endpoint: "/cameras/1", body: { name: "Updated Front Door Camera", mode: "sleep", is_locked: true } },
  { id: 11, group: "Client - Cameras", name: "Delete Camera", method: "DELETE", endpoint: "/cameras/1" },

  // Media Module
  { id: 12, group: "Client - Media", name: "List Recordings", method: "GET", endpoint: "/recordings?per_page=15&recording_type=motion&search=" },
  { id: 13, group: "Client - Media", name: "Get Recording Details", method: "GET", endpoint: "/recordings/1" },
  { id: 14, group: "Client - Media", name: "Delete Recording", method: "DELETE", endpoint: "/recordings/1" },

  // Emergency Module
  { id: 15, group: "Client - Emergency", name: "Trigger SOS Emergency", method: "POST", endpoint: "/emergency/sos", body: { camera_id: 1, police_station_id: 1, notes: "Suspicious intruder detected at entrance!" } },
  { id: 16, group: "Client - Emergency", name: "List Emergency Logs", method: "GET", endpoint: "/emergency/logs" },
  { id: 17, group: "Client - Emergency", name: "List Police Stations Directory", method: "GET", endpoint: "/emergency/police-stations?city=Cairo" },

  // Billing Module
  { id: 18, group: "Client - Billing", name: "Get Subscription Plans (Public)", method: "GET", endpoint: "/plans" },
  { id: 19, group: "Client - Billing", name: "Get Active Subscription", method: "GET", endpoint: "/billing/subscription" },
  { id: 20, group: "Client - Billing", name: "Subscribe to Plan", method: "POST", endpoint: "/billing/subscribe", body: { plan_id: 2, payment_method: "credit_card" } },
  { id: 21, group: "Client - Billing", name: "List User Invoices", method: "GET", endpoint: "/billing/invoices" },

  // Support Module
  { id: 22, group: "Client - Support", name: "Get Public Articles", method: "GET", endpoint: "/support/articles" },
  { id: 23, group: "Client - Support", name: "Get Public FAQs", method: "GET", endpoint: "/support/faqs" },
  { id: 24, group: "Client - Support", name: "List Support Tickets", method: "GET", endpoint: "/support/tickets" },
  { id: 25, group: "Client - Support", name: "Create Support Ticket", method: "POST", endpoint: "/support/tickets", body: { subject: "Cannot connect camera to Wi-Fi", message: "My camera fails to pair during setup.", priority: "high", channel: "chat" } },
  { id: 26, group: "Client - Support", name: "Get Ticket Details", method: "GET", endpoint: "/support/tickets/1" },
  { id: 27, group: "Client - Support", name: "Reply to Ticket", method: "POST", endpoint: "/support/tickets/1/reply", body: { message: "Here is an updated screenshot of the error." } },
  { id: 28, group: "Client - Support", name: "Delete Support Ticket", method: "DELETE", endpoint: "/support/tickets/1" },

  // Admin Marketing
  { id: 29, group: "Admin - Marketing", name: "List Campaigns", method: "GET", endpoint: "/marketing/campaigns" },
  { id: 30, group: "Admin - Marketing", name: "Create Campaign", method: "POST", endpoint: "/marketing/campaigns", body: { campaign_name: "Summer Subscription Discount", channel: "whatsapp", target_country: "Egypt", target_city: "Cairo", message_body: "Get 20% off on yearly camera storage plans!" } },
  { id: 31, group: "Admin - Marketing", name: "Get Campaign Details", method: "GET", endpoint: "/marketing/campaigns/1" },

  // Admin Users
  { id: 32, group: "Admin - Users", name: "List Users (Admin)", method: "GET", endpoint: "/admin/users" },
  { id: 33, group: "Admin - Users", name: "Create User", method: "POST", endpoint: "/admin/users", body: { name: "New User", email: "newuser@example.com", password: "password123" } },
  { id: 34, group: "Admin - Users", name: "Get User Details", method: "GET", endpoint: "/admin/users/1" },
  { id: 35, group: "Admin - Users", name: "Update User", method: "POST", endpoint: "/admin/users/1", body: { name: "Updated Name" } },
  { id: 36, group: "Admin - Users", name: "Delete User", method: "DELETE", endpoint: "/admin/users/1" },

  // Admin Roles
  { id: 37, group: "Admin - Roles", name: "List Roles", method: "GET", endpoint: "/roles" },
  { id: 38, group: "Admin - Roles", name: "Create Role", method: "POST", endpoint: "/roles", body: { name: "supervisor", permission_ids: [1, 2, 3] } },
  { id: 39, group: "Admin - Roles", name: "Get Role Details", method: "GET", endpoint: "/roles/1" },
  { id: 40, group: "Admin - Roles", name: "Update Role", method: "PUT", endpoint: "/roles/1", body: { name: "supervisor", permission_ids: [1, 2, 3, 4] } },
  { id: 41, group: "Admin - Roles", name: "Delete Role", method: "DELETE", endpoint: "/roles/1" },
];

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<"postman" | "marketing" | "users" | "roles">("postman");

  // Postman Runner state
  const [selectedReq, setSelectedReq] = useState(ALL_POSTMAN_REQUESTS[0]);
  const [customBody, setCustomBody] = useState(
    selectedReq.body ? JSON.stringify(selectedReq.body, null, 2) : ""
  );
  const [runnerLoading, setRunnerLoading] = useState(false);
  const [runnerResponse, setRunnerResponse] = useState<unknown>(null);
  const [storedTokenVal, setStoredTokenVal] = useState<string | null>(null);

  // Marketing state
  const [campaigns, setCampaigns] = useState<MarketingCampaignApiItem[]>([]);
  const [newCampaign, setNewCampaign] = useState({
    campaign_name: "Summer Subscription Discount",
    channel: "whatsapp",
    target_country: "Egypt",
    target_city: "Cairo",
    message_body: "Get 20% off on yearly camera storage plans!",
  });

  // Admin Users state
  const [adminUsers, setAdminUsers] = useState<AdminUserApiItem[]>([]);
  const [newUser, setNewUser] = useState({
    name: "New User",
    email: "newuser@example.com",
    password: "password123",
  });

  // Roles state
  const [roles, setRoles] = useState<RoleApiItem[]>([]);
  const [newRole, setNewRole] = useState({
    name: "supervisor",
    permission_ids: "1, 2, 3",
  });

  useEffect(() => {
    setStoredTokenVal(getStoredToken());
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    const [cRes, uRes, rRes] = await Promise.all([
      listCampaignsApi(),
      listUsersAdminApi(),
      listRolesApi(),
    ]);

    if (cRes.data && Array.isArray(cRes.data)) setCampaigns(cRes.data as MarketingCampaignApiItem[]);
    if (uRes.data && Array.isArray(uRes.data)) setAdminUsers(uRes.data as AdminUserApiItem[]);
    if (rRes.data && Array.isArray(rRes.data)) setRoles(rRes.data as RoleApiItem[]);
  };

  const handleSelectRequest = (req: typeof ALL_POSTMAN_REQUESTS[0]) => {
    setSelectedReq(req);
    setCustomBody(req.body ? JSON.stringify(req.body, null, 2) : "");
    setRunnerResponse(null);
  };

  const handleExecutePostmanReq = async () => {
    setRunnerLoading(true);
    let parsedBody: unknown = undefined;
    if (customBody && customBody.trim()) {
      try {
        parsedBody = JSON.parse(customBody);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Invalid JSON";
        setRunnerResponse({ error: "Invalid JSON body format: " + msg });
        setRunnerLoading(false);
        return;
      }
    }

    const res = await apiFetch(selectedReq.endpoint, {
      method: selectedReq.method as "GET" | "POST" | "PUT" | "DELETE",
      body: parsedBody,
    });

    setRunnerResponse(res);
    setStoredTokenVal(getStoredToken());
    setRunnerLoading(false);
  };

  const handleCreateCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    await createCampaignApi(newCampaign);
    fetchAdminData();
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    await createUserAdminApi(newUser);
    fetchAdminData();
  };

  const handleDeleteUser = async (id: number | string) => {
    await deleteUserAdminApi(id);
    fetchAdminData();
  };

  const handleCreateRole = async (e: React.FormEvent) => {
    e.preventDefault();
    const ids = newRole.permission_ids.split(",").map((n) => Number(n.trim())).filter(Boolean);
    await createRoleApi({ name: newRole.name, permission_ids: ids });
    fetchAdminData();
  };

  const handleDeleteRole = async (id: number | string) => {
    await deleteRoleApi(id);
    fetchAdminData();
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-background border border-border rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Shield className="size-6 text-primary" />
            <span>لوحة الأدمن ومستكشف APIs (Admin & Postman Collection Explorer)</span>
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            عنوان API الأساسي: <code className="bg-muted px-2 py-0.5 rounded font-mono text-primary">{getBaseUrl()}</code> | Token: <span className="font-mono text-emerald-500 font-bold">{storedTokenVal ? "موجود ✓" : "غير مسجل"}</span>
          </p>
        </div>
      </div>

      {/* Module Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-border">
        {[
          { id: "postman", label: "مستكشف Postman (41 طلب)", icon: Code2 },
          { id: "marketing", label: "التسويق (Campaigns)", icon: Megaphone },
          { id: "users", label: "المستخدمين (User Mgmt)", icon: Users },
          { id: "roles", label: "الأدوار (Role Mgmt)", icon: Key },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as "postman" | "marketing" | "users" | "roles")}
              className={cn(
                "px-4 py-2.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-2 shrink-0 cursor-pointer",
                activeTab === tab.id
                  ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                  : "bg-background border border-border text-muted-foreground hover:text-foreground hover:bg-muted/40"
              )}
            >
              <Icon className="size-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: Postman Collection Live Explorer */}
      {activeTab === "postman" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left panel: List of all 41 Postman endpoints */}
          <div className="lg:col-span-4 bg-background border border-border rounded-2xl p-4 flex flex-col h-[650px] shadow-sm">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-border">
              <h3 className="text-xs font-bold text-foreground">قائمة الـ 41 طلب (Postman Collection)</h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-primary/10 text-primary font-bold">
                {ALL_POSTMAN_REQUESTS.length} Requests
              </span>
            </div>

            <div className="flex-1 overflow-y-auto space-y-1 pe-1">
              {ALL_POSTMAN_REQUESTS.map((req) => {
                const isSelected = selectedReq.id === req.id;
                return (
                  <button
                    key={req.id}
                    onClick={() => handleSelectRequest(req)}
                    className={cn(
                      "w-full text-start p-2.5 rounded-xl border text-xs transition-colors flex items-center justify-between gap-2 cursor-pointer",
                      isSelected
                        ? "border-primary bg-primary/10 text-foreground font-bold"
                        : "border-transparent bg-muted/20 hover:bg-muted/50 text-muted-foreground"
                    )}
                  >
                    <div className="min-w-0">
                      <div className="text-[10px] text-muted-foreground font-mono">{req.group}</div>
                      <div className="truncate text-foreground font-semibold">{req.name}</div>
                    </div>
                    <span
                      className={cn(
                        "text-[9px] font-mono font-bold px-1.5 py-0.5 rounded shrink-0",
                        req.method === "GET"
                          ? "bg-blue-500/10 text-blue-600 dark:text-blue-400"
                          : req.method === "POST"
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                          : req.method === "PUT"
                          ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                          : "bg-red-500/10 text-red-600 dark:text-red-400"
                      )}
                    >
                      {req.method}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right panel: Request Runner & Live Output */}
          <div className="lg:col-span-8 space-y-4">
            {/* Request info card */}
            <div className="bg-background border border-border rounded-2xl p-6 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      "px-2.5 py-1 rounded-lg text-xs font-mono font-bold",
                      selectedReq.method === "GET"
                        ? "bg-blue-500/10 text-blue-600 dark:text-blue-400"
                        : selectedReq.method === "POST"
                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                        : selectedReq.method === "PUT"
                        ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                        : "bg-red-500/10 text-red-600 dark:text-red-400"
                    )}
                  >
                    {selectedReq.method}
                  </span>
                  <h2 className="text-base font-bold text-foreground">{selectedReq.name}</h2>
                </div>
                <button
                  onClick={handleExecutePostmanReq}
                  disabled={runnerLoading}
                  className="px-6 py-2 rounded-xl bg-primary text-primary-foreground font-bold text-xs hover:bg-primary/90 transition-colors shadow-md shadow-primary/20 flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {runnerLoading ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <>
                      <Play className="size-4 fill-current" />
                      <span>إرسال الطلب (Send)</span>
                    </>
                  )}
                </button>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 text-slate-200 font-mono text-xs flex items-center justify-between">
                <span>{getBaseUrl()}{selectedReq.endpoint}</span>
                <span className="text-[10px] text-slate-400">Header: Accept: application/json</span>
              </div>

              {/* Request body editor if non-GET */}
              {selectedReq.method !== "GET" && (
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-foreground">جسم الطلب (JSON Request Body)</label>
                  <textarea
                    rows={5}
                    value={customBody}
                    onChange={(e) => setCustomBody(e.target.value)}
                    className="w-full p-4 rounded-xl border border-border bg-slate-950 text-emerald-400 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              )}
            </div>

            {/* Live Response Panel */}
            <div className="bg-background border border-border rounded-2xl p-6 shadow-sm space-y-3 min-h-[300px]">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <h3 className="text-xs font-bold text-foreground flex items-center gap-2">
                  <Terminal className="size-4 text-primary" />
                  <span>نتيجة الاستجابة (Live HTTP Response Output)</span>
                </h3>
                {Boolean(runnerResponse) && (
                  <span
                    className={cn(
                      "px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold",
                      (runnerResponse as Record<string, number>).status >= 200 && (runnerResponse as Record<string, number>).status < 300
                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                        : "bg-red-500/10 text-red-600 dark:text-red-400"
                    )}
                  >
                    HTTP Status: {(runnerResponse as Record<string, number>).status || "Error"}
                  </span>
                )}
              </div>

              {!runnerResponse ? (
                <div className="py-16 text-center text-xs text-muted-foreground font-mono">
                  اضغط على &quot;إرسال الطلب (Send)&quot; لأداء الـ Request وعرض الاستجابة هنا.
                </div>
              ) : (
                <pre className="p-4 rounded-xl bg-slate-950 text-slate-200 font-mono text-xs overflow-x-auto max-h-96">
                  {JSON.stringify(runnerResponse, null, 2)}
                </pre>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Marketing Module */}
      {activeTab === "marketing" && (
        <div className="space-y-6">
          <div className="bg-background border border-border rounded-2xl p-6 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-foreground flex items-center gap-2">
              <Megaphone className="size-5 text-primary" />
              <span>إنشاء حملة تسويقية جديدة (POST /marketing/campaigns)</span>
            </h2>
            <form onSubmit={handleCreateCampaign} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-foreground">اسم الحملة (campaign_name)</label>
                <input
                  type="text"
                  required
                  value={newCampaign.campaign_name}
                  onChange={(e) => setNewCampaign({ ...newCampaign, campaign_name: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border border-input text-xs"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-foreground">القناة (channel)</label>
                <input
                  type="text"
                  required
                  value={newCampaign.channel}
                  onChange={(e) => setNewCampaign({ ...newCampaign, channel: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border border-input text-xs"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-foreground">الدولة المستهدفة</label>
                <input
                  type="text"
                  value={newCampaign.target_country}
                  onChange={(e) => setNewCampaign({ ...newCampaign, target_country: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border border-input text-xs"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-foreground">المدينة المستهدفة</label>
                <input
                  type="text"
                  value={newCampaign.target_city}
                  onChange={(e) => setNewCampaign({ ...newCampaign, target_city: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border border-input text-xs"
                />
              </div>
              <div className="sm:col-span-2 space-y-1">
                <label className="text-xs font-bold text-foreground">نص الرسالة (message_body)</label>
                <textarea
                  rows={2}
                  value={newCampaign.message_body}
                  onChange={(e) => setNewCampaign({ ...newCampaign, message_body: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border border-input text-xs"
                />
              </div>
              <button
                type="submit"
                className="sm:col-span-2 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-xs hover:bg-primary/90"
              >
                إنشاء الحملة عبر API
              </button>
            </form>
          </div>

          <div className="bg-background border border-border rounded-2xl p-6 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-foreground">قائمة الحملات (GET /marketing/campaigns)</h2>
            <div className="divide-y divide-border border border-border rounded-xl overflow-hidden">
              {campaigns.length === 0 ? (
                <div className="p-6 text-center text-xs text-muted-foreground">لا توجد حملات مسجلة حالياً.</div>
              ) : (
                campaigns.map((c, i) => (
                  <div key={i} className="p-4 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-foreground">{c.campaign_name}</div>
                      <div className="text-[10px] text-muted-foreground">{c.channel} · {c.target_country}</div>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-primary/10 text-primary font-bold text-[10px]">
                      {c.status || "نشطة"}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: User Management Module */}
      {activeTab === "users" && (
        <div className="space-y-6">
          <div className="bg-background border border-border rounded-2xl p-6 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-foreground flex items-center gap-2">
              <Users className="size-5 text-primary" />
              <span>إضافة مستخدم أدمن (POST /admin/users)</span>
            </h2>
            <form onSubmit={handleCreateUser} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <input
                type="text"
                required
                placeholder="الاسم"
                value={newUser.name}
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                className="px-4 py-2.5 rounded-xl border border-input text-xs"
              />
              <input
                type="email"
                required
                placeholder="البريد الإلكتروني"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                className="px-4 py-2.5 rounded-xl border border-input text-xs font-mono"
              />
              <input
                type="password"
                required
                placeholder="كلمة السر"
                value={newUser.password}
                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                className="px-4 py-2.5 rounded-xl border border-input text-xs font-mono"
              />
              <button
                type="submit"
                className="sm:col-span-3 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-xs hover:bg-primary/90"
              >
                إضافة المستخدم عبر API
              </button>
            </form>
          </div>

          <div className="bg-background border border-border rounded-2xl p-6 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-foreground">المستخدمين المسجلين (GET /admin/users)</h2>
            <div className="divide-y divide-border border border-border rounded-xl overflow-hidden">
              {adminUsers.length === 0 ? (
                <div className="p-6 text-center text-xs text-muted-foreground">لا يوجد مستخدمون محملون حالياً.</div>
              ) : (
                adminUsers.map((u, i) => (
                  <div key={i} className="p-4 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-foreground">{u.name}</div>
                      <div className="text-[10px] text-muted-foreground font-mono">{u.email}</div>
                    </div>
                    <button
                      onClick={() => handleDeleteUser(u.id)}
                      className="p-1.5 text-red-600 hover:bg-red-500/10 rounded-lg"
                      title="DELETE /admin/users/:id"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: Role Management Module */}
      {activeTab === "roles" && (
        <div className="space-y-6">
          <div className="bg-background border border-border rounded-2xl p-6 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-foreground flex items-center gap-2">
              <Key className="size-5 text-primary" />
              <span>إنشاء دور جديد (POST /roles)</span>
            </h2>
            <form onSubmit={handleCreateRole} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="text"
                required
                placeholder="اسم الدور (role name)"
                value={newRole.name}
                onChange={(e) => setNewRole({ ...newRole, name: e.target.value })}
                className="px-4 py-2.5 rounded-xl border border-input text-xs"
              />
              <input
                type="text"
                required
                placeholder="معرفات الصلاحيات (1, 2, 3)"
                value={newRole.permission_ids}
                onChange={(e) => setNewRole({ ...newRole, permission_ids: e.target.value })}
                className="px-4 py-2.5 rounded-xl border border-input text-xs font-mono"
              />
              <button
                type="submit"
                className="sm:col-span-2 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-xs hover:bg-primary/90"
              >
                إنشاء الدور عبر API
              </button>
            </form>
          </div>

          <div className="bg-background border border-border rounded-2xl p-6 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-foreground">قائمة الأدوار (GET /roles)</h2>
            <div className="divide-y divide-border border border-border rounded-xl overflow-hidden">
              {roles.length === 0 ? (
                <div className="p-6 text-center text-xs text-muted-foreground">لا توجد أدوار مسجلة حالياً.</div>
              ) : (
                roles.map((r, i) => (
                  <div key={i} className="p-4 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-foreground">{r.name}</div>
                      <div className="text-[10px] text-muted-foreground font-mono">
                        Permissions: {JSON.stringify(r.permission_ids || r.permissions || [])}
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteRole(r.id)}
                      className="p-1.5 text-red-600 hover:bg-red-500/10 rounded-lg"
                      title="DELETE /roles/:id"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
