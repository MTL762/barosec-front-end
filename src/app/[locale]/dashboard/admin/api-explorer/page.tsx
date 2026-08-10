"use client";

import React, { useState, useEffect } from "react";
import { Terminal, Play, Loader2, Code2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { apiFetch, getBaseUrl, getStoredToken } from "@/lib/api";

const ALL_POSTMAN_REQUESTS = [
  // Auth
  { id: 1, group: "Auth", name: "Register", method: "POST", endpoint: "/auth/register", body: { name: "client", email: "bolaphilip3@gmail.com", password: "password123", password_confirmation: "password123" } },
  { id: 2, group: "Auth", name: "Login", method: "POST", endpoint: "/auth/login", body: { email: "bolaphilip3@gmail.com", password: "password123" } },
  { id: 3, group: "Auth", name: "Logout", method: "POST", endpoint: "/auth/logout" },
  { id: 4, group: "Auth", name: "Get Profile", method: "GET", endpoint: "/auth/profile" },
  { id: 5, group: "Auth", name: "Update Profile", method: "POST", endpoint: "/auth/profile", body: { name: "John Updated" } },
  { id: 6, group: "Auth", name: "Change Password", method: "PUT", endpoint: "/auth/change_password", body: { current_password: "password123", password: "newpassword123", password_confirmation: "newpassword123" } },

  // Verification
  { id: 7, group: "Verification", name: "Send Email Code", method: "POST", endpoint: "/verification/send-email-code" },
  { id: 8, group: "Verification", name: "Verify Email", method: "POST", endpoint: "/verification/verify-email", body: { code: "1234" } },
  { id: 9, group: "Verification", name: "Send Phone Code", method: "POST", endpoint: "/verification/send-phone-code" },
  { id: 10, group: "Verification", name: "Verify Phone", method: "POST", endpoint: "/verification/verify-phone", body: { code: "1234" } },

  // Camera Module
  { id: 11, group: "Client - Cameras", name: "List User Cameras", method: "GET", endpoint: "/cameras?per_page=15&search=&mode=" },
  { id: 12, group: "Client - Cameras", name: "Pair & Add Camera", method: "POST", endpoint: "/cameras", body: { camera_model_id: 1, name: "Front Door Security Camera", serial_number: "CAM-987654321", mac_address: "00:1B:44:11:3A:B7", mode: "security" } },
  { id: 13, group: "Client - Cameras", name: "Get Camera Details", method: "GET", endpoint: "/cameras/1" },
  { id: 14, group: "Client - Cameras", name: "Update Camera Settings", method: "PUT", endpoint: "/cameras/1", body: { name: "Updated Front Door Camera", mode: "sleep", is_locked: true } },
  { id: 15, group: "Client - Cameras", name: "Delete Camera", method: "DELETE", endpoint: "/cameras/1" },

  // Media Module
  { id: 16, group: "Client - Media", name: "List Recordings", method: "GET", endpoint: "/recordings?per_page=15&recording_type=motion&search=" },
  { id: 17, group: "Client - Media", name: "Get Recording Details", method: "GET", endpoint: "/recordings/1" },
  { id: 18, group: "Client - Media", name: "Delete Recording", method: "DELETE", endpoint: "/recordings/1" },

  // Emergency Module
  { id: 19, group: "Client - Emergency", name: "Trigger SOS Emergency", method: "POST", endpoint: "/emergency/sos", body: { camera_id: 1, police_station_id: 1, notes: "Suspicious intruder detected at entrance!" } },
  { id: 20, group: "Client - Emergency", name: "List Emergency Logs", method: "GET", endpoint: "/emergency/logs" },
  { id: 21, group: "Client - Emergency", name: "List Police Stations Directory", method: "GET", endpoint: "/emergency/police-stations?city=Cairo" },

  // Billing Module
  { id: 22, group: "Client - Billing", name: "Get Subscription Plans (Public)", method: "GET", endpoint: "/plans" },
  { id: 23, group: "Client - Billing", name: "Get Active Subscription", method: "GET", endpoint: "/billing/subscription" },
  { id: 24, group: "Client - Billing", name: "Subscribe to Plan", method: "POST", endpoint: "/billing/subscribe", body: { plan_id: 2, payment_method: "credit_card" } },
  { id: 25, group: "Client - Billing", name: "List User Invoices", method: "GET", endpoint: "/billing/invoices" },

  // Support Module
  { id: 26, group: "Client - Support", name: "Get Public Articles", method: "GET", endpoint: "/support/articles" },
  { id: 27, group: "Client - Support", name: "Get Public FAQs", method: "GET", endpoint: "/support/faqs" },
  { id: 28, group: "Client - Support", name: "List Support Tickets", method: "GET", endpoint: "/support/tickets" },
  { id: 29, group: "Client - Support", name: "Create Support Ticket", method: "POST", endpoint: "/support/tickets", body: { subject: "Cannot connect camera to Wi-Fi", message: "My camera fails to pair during setup.", priority: "high", channel: "chat" } },
  { id: 30, group: "Client - Support", name: "Get Ticket Details", method: "GET", endpoint: "/support/tickets/1" },
  { id: 31, group: "Client - Support", name: "Reply to Ticket", method: "POST", endpoint: "/support/tickets/1/reply", body: { message: "Here is an updated screenshot of the error." } },
  { id: 32, group: "Client - Support", name: "Delete Support Ticket", method: "DELETE", endpoint: "/support/tickets/1" },

  // Admin Marketing
  { id: 33, group: "Admin - Marketing", name: "List Campaigns", method: "GET", endpoint: "/marketing/campaigns" },
  { id: 34, group: "Admin - Marketing", name: "Create Campaign", method: "POST", endpoint: "/marketing/campaigns", body: { campaign_name: "Summer Subscription Discount", channel: "whatsapp", target_country: "Egypt", target_city: "Cairo", message_body: "Get 20% off on yearly camera storage plans!" } },
  { id: 35, group: "Admin - Marketing", name: "Get Campaign Details", method: "GET", endpoint: "/marketing/campaigns/1" },
  { id: 36, group: "Admin - Marketing", name: "Send Bulk WhatsApp & Mail", method: "POST", endpoint: "/marketing/send-whatsapp-mail", body: { send_to_all: 1, subject: "Special Offer", message: "Get 20% off on all security plans!" } },

  // Admin Users
  { id: 37, group: "Admin - Users", name: "List Users (Admin)", method: "GET", endpoint: "/admin/users" },
  { id: 38, group: "Admin - Users", name: "Create User", method: "POST", endpoint: "/admin/users", body: { name: "New User", email: "newuser@example.com", password: "password123" } },
  { id: 39, group: "Admin - Users", name: "Get User Details", method: "GET", endpoint: "/admin/users/1" },
  { id: 40, group: "Admin - Users", name: "Update User", method: "POST", endpoint: "/admin/users/1", body: { name: "Updated Name" } },
  { id: 41, group: "Admin - Users", name: "Delete User", method: "DELETE", endpoint: "/admin/users/1" },

  // Admin Roles
  { id: 42, group: "Admin - Roles", name: "List Roles", method: "GET", endpoint: "/roles" },
  { id: 43, group: "Admin - Roles", name: "Create Role", method: "POST", endpoint: "/roles", body: { name: "supervisor", permission_ids: [1, 2, 3] } },
  { id: 44, group: "Admin - Roles", name: "Get Role Details", method: "GET", endpoint: "/roles/1" },
  { id: 45, group: "Admin - Roles", name: "Update Role", method: "PUT", endpoint: "/roles/1", body: { name: "supervisor", permission_ids: [1, 2, 3, 4] } },
  { id: 46, group: "Admin - Roles", name: "Delete Role", method: "DELETE", endpoint: "/roles/1" },
];

export default function AdminApiExplorerPage() {
  const [selectedReq, setSelectedReq] = useState(ALL_POSTMAN_REQUESTS[0]);
  const [customBody, setCustomBody] = useState(
    selectedReq.body ? JSON.stringify(selectedReq.body, null, 2) : ""
  );
  const [runnerLoading, setRunnerLoading] = useState(false);
  const [runnerResponse, setRunnerResponse] = useState<unknown>(null);
  const [storedTokenVal, setStoredTokenVal] = useState<string | null>(null);

  useEffect(() => {
    setStoredTokenVal(getStoredToken());
  }, []);

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

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="db-card p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
            <Code2 className="size-6 text-primary" />
            <span>مستكشف ومختبر الـ APIs المباشر (Postman 41-Request Live Explorer)</span>
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            اختبار جميع طلبات المجموعات (Auth, Verification, Cameras, Media, Emergency, Billing, Support, Marketing, Users, Roles) مباشرة
          </p>
        </div>
        <div className="text-xs font-mono">
          Token: <span className="font-bold text-emerald-500">{storedTokenVal ? "موجود ✓" : "غير مسجل"}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left list of requests */}
        <div className="lg:col-span-4 db-card p-4 flex flex-col h-[650px]">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-[--db-border]">
            <h3 className="text-xs font-bold text-foreground">قائمة طلبات Postman</h3>
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

        {/* Right Runner & Output */}
        <div className="lg:col-span-8 space-y-4">
          <div className="db-card p-6 space-y-4">
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
              <span className="text-[10px] text-slate-400">Accept: application/json</span>
            </div>

            {selectedReq.method !== "GET" && (
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground">جسم الطلب (JSON Request Body)</label>
                <textarea
                  rows={5}
                  value={customBody}
                  onChange={(e) => setCustomBody(e.target.value)}
                  className="w-full p-4 rounded-xl border border-input bg-slate-950 text-emerald-400 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            )}
          </div>

          <div className="db-card p-6 space-y-3 min-h-[300px]">
            <div className="flex items-center justify-between border-b border-[--db-border] pb-3">
              <h3 className="text-xs font-bold text-foreground flex items-center gap-2">
                <Terminal className="size-4 text-primary" />
                <span>نتيجة الاستجابة (Live Response Output)</span>
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
                  HTTP Status: {(runnerResponse as Record<string, number>).status || "OK / Result"}
                </span>
              )}
            </div>

            {!runnerResponse ? (
              <div className="py-16 text-center text-xs text-muted-foreground font-mono">
                اضغط على &quot;إرسال الطلب (Send)&quot; لتشغيل الطلب وعرض النتيجة الحية هنا.
              </div>
            ) : (
              <pre className="p-4 rounded-xl bg-slate-950 text-slate-200 font-mono text-xs overflow-x-auto max-h-96">
                {JSON.stringify(runnerResponse, null, 2)}
              </pre>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
