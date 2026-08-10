"use client";

import { useEffect, useState } from "react";
import {
  Shield,
  Megaphone,
  Users,
  Key,
  Terminal,
  ArrowUpRight,
  Send,
  Loader2,
} from "lucide-react";
import {
  getBaseUrl,
  getStoredToken,
  listCampaignsApi,
  listUsersAdminApi,
  listRolesApi,
} from "@/lib/api";

export default function AdminDashboardOverviewPage() {
  const [storedTokenVal, setStoredTokenVal] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [campaignCount, setCampaignCount] = useState<number>(0);
  const [userCount, setUserCount] = useState<number>(0);
  const [roleCount, setRoleCount] = useState<number>(0);

  useEffect(() => {
    setStoredTokenVal(getStoredToken());

    Promise.all([listCampaignsApi(), listUsersAdminApi(), listRolesApi()])
      .then(([cRes, uRes, rRes]) => {
        if (cRes.data && Array.isArray(cRes.data)) setCampaignCount(cRes.data.length);
        if (uRes.data && Array.isArray(uRes.data)) setUserCount(uRes.data.length);
        if (rRes.data && Array.isArray(rRes.data)) setRoleCount(rRes.data.length);
      })
      .finally(() => setLoading(false));
  }, []);

  const adminModules = [
    {
      title: "وحدة التسويق والإرسال",
      sub: "إدارة الحملات والتسويق عبر الواتساب والبريد (POST /marketing/send-whatsapp-mail)",
      icon: Megaphone,
      href: "/dashboard/admin/marketing",
      stat: `${campaignCount} حملات`,
      color: "emerald",
    },
    {
      title: "إدارة المستخدمين",
      sub: "عرض، إضافة وتعديل مستخدمي نظام الأدمن والعملاء (/admin/users)",
      icon: Users,
      href: "/dashboard/admin/users",
      stat: `${userCount} مستخدم`,
      color: "blue",
    },
    {
      title: "الأدوار والصلاحيات",
      sub: "تخصيص الأدوار، الصلاحيات ومعرفات الأذونات (/roles)",
      icon: Key,
      href: "/dashboard/admin/roles",
      stat: `${roleCount} أدوار`,
      color: "amber",
    },
    {
      title: "مستكشف الـ APIs (Postman)",
      sub: "مختبر حقيقي لتنفيذ جميع الـ 41 طلب من Postman مباشرة بالتجاوب المباشر",
      icon: Terminal,
      href: "/dashboard/admin/api-explorer",
      stat: "41 Requests",
      color: "purple",
    },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="db-card p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
            <Shield className="size-6 text-primary" />
            <span>لوحة التحكم الرئيسية للمسؤولين (Admin Console Overview)</span>
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            مرحباً بك في مركز إدارة النظام. يمكنك الانتقال للوحدات الفرعية المستقلة أدناه.
          </p>
        </div>
        <div className="text-xs font-mono bg-primary/10 border border-primary/20 px-3.5 py-1.5 rounded-xl text-primary font-bold">
          API Base: {getBaseUrl()} | Token: {storedTokenVal ? "نشط ✓" : "غير مسجل"}
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "حملات التسويق", value: loading ? "..." : String(campaignCount), icon: Megaphone },
          { label: "مستخدمي النظام", value: loading ? "..." : String(userCount), icon: Users },
          { label: "الأدوار والصلاحيات", value: loading ? "..." : String(roleCount), icon: Key },
          { label: "طلبات Postman", value: "41", icon: Terminal },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.label} className="db-card p-4 space-y-2">
              <div className="flex items-center justify-between">
                <div className="size-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <Icon className="size-4" />
                </div>
                {loading && <Loader2 className="size-3 animate-spin text-primary" />}
              </div>
              <div className="text-2xl font-extrabold text-foreground">{item.value}</div>
              <div className="text-xs font-semibold text-muted-foreground">{item.label}</div>
            </div>
          );
        })}
      </div>

      {/* Admin Sub-Modules Cards */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold text-foreground">وحدات الإدارة المتاحة</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {adminModules.map((mod) => {
            const Icon = mod.icon;
            return (
              <a
                key={mod.href}
                href={mod.href}
                className="db-card p-6 flex flex-col justify-between hover:border-primary/50 hover:bg-[--db-hover] transition-all group cursor-pointer space-y-4"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      <Icon className="size-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                        {mod.title}
                      </h3>
                      <span className="text-[10px] font-mono text-primary font-bold">{mod.stat}</span>
                    </div>
                  </div>
                  <ArrowUpRight className="size-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>

                <p className="text-xs text-muted-foreground leading-relaxed">{mod.sub}</p>

                <div className="pt-2 border-t border-[--db-border] flex items-center justify-between text-xs text-primary font-bold">
                  <span>فتح وحدة التحكم ←</span>
                  <Send className="size-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
}
