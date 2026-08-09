"use client";

import { listCamerasApi, listRecordingsApi } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { cn } from "@/lib/utils";
import {
  Activity,
  Battery,
  Camera,
  Clock,
  Cloud,
  Eye,
  HardDrive,
  TrendingUp,
  Video,
  Wifi
} from "lucide-react";
import { useEffect, useState } from "react";

const colorMap = {
  emerald: {
    bg: "bg-emerald-500/10",
    text: "text-emerald-600 dark:text-emerald-400",
    dot: "bg-emerald-500",
  },
  blue: {
    bg: "bg-blue-500/10",
    text: "text-blue-600 dark:text-blue-400",
    dot: "bg-blue-500",
  },
  amber: {
    bg: "bg-amber-500/10",
    text: "text-amber-600 dark:text-amber-400",
    dot: "bg-amber-500",
  },
  violet: {
    bg: "bg-violet-500/10",
    text: "text-violet-600 dark:text-violet-400",
    dot: "bg-violet-500",
  },
};

const severityMap = {
  high: {
    bg: "bg-red-500/10",
    text: "text-red-600 dark:text-red-400",
    dot: "bg-red-500",
    label: "تنبيه",
  },
  medium: {
    bg: "bg-amber-500/10",
    text: "text-amber-600 dark:text-amber-400",
    dot: "bg-amber-500",
    label: "حركة",
  },
  low: {
    bg: "bg-emerald-500/10",
    text: "text-emerald-600 dark:text-emerald-400",
    dot: "bg-emerald-500",
    label: "عادي",
  },
};

function LiveBadge() {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-500/10 text-red-600 dark:text-red-400 text-[10px] font-bold">
      <span className="size-1.5 rounded-full bg-red-500 animate-pulse" />
      مباشر
    </span>
  );
}

function SignalBar({ value }: { value: number }) {
  const bars = [
    value >= 25,
    value >= 50,
    value >= 75,
    value >= 90,
  ];
  return (
    <div className="flex items-end gap-0.5 h-3">
      {bars.map((active, i) => (
        <div
          key={i}
          className={cn(
            "w-1 rounded-[1px] transition-colors",
            active ? "bg-emerald-500" : "bg-muted-foreground/20"
          )}
          style={{ height: `${40 + i * 20}%` }}
        />
      ))}
    </div>
  );
}

export default function DashboardOverviewPage() {
  /*
  // Static data references (commented out):
  //
  // const CAMERAS = [
  //   { id: "cam-1", name: "المدخل الرئيسي", status: "live" as const, signal: 92, model: "Pro 4K", lastEvent: "قبل 5 دقائق" },
  //   { id: "cam-2", name: "الكراج", status: "live" as const, signal: 85, model: "PTZ 360°", lastEvent: "قبل ساعة" },
  //   { id: "cam-3", name: "غرفة المعيشة", status: "privacy" as const, signal: 98, model: "Interior 4K", lastEvent: "مُقَفلة" },
  // ];
  //
  // const ACTIVITY = [
  //   { id: 1, type: "motion", title: "رُصد شخص عند المدخل", time: "09:42 ص", cam: "المدخل الرئيسي", severity: "medium" as const },
  //   { id: 2, type: "delivery", title: "تسليم شحنة بريدية", time: "07:15 ص", cam: "المدخل الرئيسي", severity: "low" as const },
  //   { id: 3, type: "car", title: "وصول سيارة العائلة", time: "06:55 ص", cam: "الكراج", severity: "low" as const },
  //   { id: 4, type: "alert", title: "إنذار صوتي خفيف", time: "02:30 ص", cam: "المدخل الرئيسي", severity: "high" as const },
  //   { id: 5, type: "motion", title: "حركة في الحديقة", time: "البارحة 11:12 م", cam: "الكراج", severity: "medium" as const },
  // ];
  //
  // const STAT_CARDS = [
  //   { label: "كاميرات متصلة", value: "3", sub: "من أصل 3", icon: Camera, color: "emerald", trend: "+0" },
  //   { label: "تسجيلات اليوم", value: "14", sub: "مقطع محفوظ", icon: Video, color: "blue", trend: "+3" },
  //   { label: "آخر حدث", value: "09:42 ص", sub: "رصد حركة", icon: Activity, color: "amber", trend: null },
  //   { label: "التخزين السحابي", value: "68%", sub: "34GB من 50GB", icon: HardDrive, color: "violet", trend: null },
  // ];
  */

  const { user } = useAuth();
  const [time, setTime] = useState<string>("");
  const [liveCameras, setLiveCameras] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [recordingsCount, setRecordingsCount] = useState<number>(0);

  useEffect(() => {
    const tick = () =>
      setTime(
        new Date().toLocaleTimeString("ar-SA", { hour: "2-digit", minute: "2-digit" })
      );
    tick();
    const id = setInterval(tick, 60000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    Promise.all([
      listCamerasApi({ per_page: 15 }),
      listRecordingsApi({ per_page: 15 }),
    ]).then(([cRes, rRes]) => {
      if (cRes.data && Array.isArray(cRes.data) && cRes.data.length > 0) {
        setLiveCameras(
          cRes.data.map((c: any) => ({
            id: String(c.id),
            name: c.name || "كاميرا",
            status: c.is_locked ? "privacy" : "live",
            signal: c.wifi_signal || 90,
            model: c.model || `موديل #${c.camera_model_id || 1}`,
            lastEvent: c.last_event || "متصلة",
          }))
        );
      }
      if (rRes.data && Array.isArray(rRes.data)) {
        setRecordingsCount(rRes.data.length);
        setActivities(
          rRes.data.map((r: any, i: number) => ({
            id: r.id || i + 1,
            type: r.type || "motion",
            title: r.title || r.name || "تسجيل فيديو",
            time: r.created_at
              ? new Date(r.created_at).toLocaleTimeString("ar-SA", { hour: "2-digit", minute: "2-digit" })
              : "الآن",
            cam: r.camera_name || "كاميرا",
            severity: (r.severity as any) || "low",
          }))
        );
      }
    });
  }, []);

  const dynamicStatCards = [
    {
      label: "كاميرات متصلة",
      value: String(liveCameras.length),
      sub: `من أصل ${liveCameras.length}`,
      icon: Camera,
      color: "emerald",
      trend: liveCameras.length > 0 ? "+100%" : "0",
    },
    {
      label: "تسجيلات اليوم",
      value: String(recordingsCount),
      sub: "مقطع محفوظ",
      icon: Video,
      color: "blue",
      trend: recordingsCount > 0 ? `+${recordingsCount}` : "0",
    },
    {
      label: "آخر حدث",
      value: time || "الآن",
      sub: "مراقبة مستمرة",
      icon: Activity,
      color: "amber",
      trend: null,
    },
    {
      label: "التخزين السحابي",
      value: "68%",
      sub: "34GB من 50GB",
      icon: HardDrive,
      color: "violet",
      trend: null,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Greeting row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-xl font-bold text-foreground">
            مرحباً، {user?.name || user?.email || "العميل"} 👋
          </h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            جميع الكاميرات والتسجيلات تعمل بشكل مباشر عبر backend API
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm font-mono text-muted-foreground">
          <Clock className="size-3.5" />
          <span>{time} — تحديث مباشر</span>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {dynamicStatCards.map((s) => {
          const Icon = s.icon;
          const c = colorMap[s.color as keyof typeof colorMap];
          return (
            <div
              key={s.label}
              className="db-card p-4 space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className={cn("size-8 rounded-xl flex items-center justify-center", c.bg)}>
                  <Icon className={cn("size-4", c.text)} />
                </div>
                {s.trend && (
                  <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5">
                    <TrendingUp className="size-3" />
                    {s.trend}
                  </span>
                )}
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground leading-none">{s.value}</div>
                <div className="text-xs text-muted-foreground mt-1">{s.sub}</div>
              </div>
              <div className="text-xs font-semibold text-muted-foreground">{s.label}</div>
            </div>
          );
        })}
      </div>

      {/* Main grid: cameras + activity */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Live camera tiles */}
        <div className="xl:col-span-7 db-card overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-[--db-border]">
            <h3 className="text-sm font-bold text-foreground">بث مباشر للكاميرات</h3>
            <a href="/dashboard/cameras" className="text-xs font-bold text-primary hover:underline">
              عرض الكل
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-[--db-border]">
            {liveCameras.map((cam) => (
              <div
                key={cam.id}
                className="relative bg-slate-950 aspect-video flex flex-col justify-between p-3 overflow-hidden group"
              >
                {/* Simulated feed background */}
                <div className="absolute inset-0 bg-gradient-to-br from-slate-900 to-slate-800" />
                <div
                  className="absolute inset-0 opacity-20"
                  style={{
                    backgroundImage:
                      "radial-gradient(ellipse at 30% 40%, oklch(0.55 0.11 200 / 0.3) 0%, transparent 60%)",
                  }}
                />

                {/* Status row */}
                <div className="relative flex items-center justify-between z-10">
                  {cam.status === "live" ? (
                    <LiveBadge />
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-[10px] font-bold">
                      🔒 خصوصية
                    </span>
                  )}
                  <div className="flex items-center gap-1.5">
                    <SignalBar value={cam.signal} />
                    <span className="text-[10px] font-mono text-slate-400">{cam.signal}%</span>
                  </div>
                </div>

                {/* Center icon */}
                <div className="relative flex-1 flex items-center justify-center z-10">
                  {cam.status === "privacy" ? (
                    <div className="size-10 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400 text-xl">
                      🔒
                    </div>
                  ) : (
                    <Eye className="size-6 text-white/20 group-hover:text-white/60 transition-colors" />
                  )}
                </div>

                {/* Bottom info */}
                <div className="relative z-10 flex items-end justify-between">
                  <div>
                    <div className="text-white text-xs font-bold">{cam.name}</div>
                    <div className="text-slate-400 text-[10px]">{cam.model}</div>
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono">{cam.lastEvent}</div>
                </div>
              </div>
            ))}

            {/* Add camera tile */}
            <a
              href="/dashboard/cameras"
              className="relative bg-[--db-card] aspect-video flex flex-col items-center justify-center gap-2 group hover:bg-[--db-hover] transition-colors cursor-pointer"
            >
              <div className="size-10 rounded-xl border-2 border-dashed border-[--db-border] flex items-center justify-center text-muted-foreground group-hover:border-primary group-hover:text-primary transition-colors">
                <Camera className="size-4" />
              </div>
              <span className="text-xs font-bold text-muted-foreground group-hover:text-primary transition-colors">
                إضافة كاميرا
              </span>
            </a>
          </div>
        </div>

        {/* Activity feed */}
        <div className="xl:col-span-5 db-card flex flex-col">
          <div className="flex items-center justify-between px-5 py-4 border-b border-[--db-border] shrink-0">
            <h3 className="text-sm font-bold text-foreground">سجل الأحداث</h3>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-bold">
              {activities.length} حدث اليوم
            </span>
          </div>

          <div className="flex-1 overflow-y-auto">
            {activities.length === 0 ? (
              <div className="p-8 text-center text-xs text-muted-foreground">
                لا توجد أحداث حالية
              </div>
            ) : (
              activities.map((event, i) => {
                const s = severityMap[event.severity as keyof typeof severityMap] || severityMap.low;
                return (
                  <div
                    key={event.id}
                    className={cn(
                      "flex items-start gap-3 px-5 py-3.5 hover:bg-[--db-hover] transition-colors",
                      i < activities.length - 1 && "border-b border-[--db-border]"
                    )}
                  >
                    {/* Timeline dot */}
                    <div className="flex flex-col items-center shrink-0 pt-1">
                      <span className={cn("size-2 rounded-full", s.dot)} />
                      {i < activities.length - 1 && (
                        <span className="w-px flex-1 bg-[--db-border] mt-1.5 min-h-[20px]" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-xs font-semibold text-foreground leading-snug">
                          {event.title}
                        </span>
                        <span
                          className={cn(
                            "shrink-0 text-[10px] font-bold px-1.5 py-0.5 rounded-md",
                            s.bg,
                            s.text
                          )}
                        >
                          {s.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] text-muted-foreground font-mono">{event.time}</span>
                        <span className="size-0.5 rounded-full bg-muted-foreground/40" />
                        <span className="text-[10px] text-muted-foreground">{event.cam}</span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* System health strip */}
      <div className="db-card px-5 py-4">
        <h3 className="text-sm font-bold text-foreground mb-4">صحة النظام</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: "سرعة الإنترنت", value: 92, icon: Wifi, color: "emerald", unit: "Mbps" },
            { label: "التخزين السحابي", value: 68, icon: Cloud, color: "blue", unit: "%" },
            { label: "طاقة النسخ الاحتياطي", value: 100, icon: Battery, color: "emerald", unit: "%" },
          ].map((item) => {
            const Icon = item.icon;
            const c = colorMap[item.color as keyof typeof colorMap];
            return (
              <div key={item.label} className="flex items-center gap-3">
                <div className={cn("size-8 rounded-xl flex items-center justify-center shrink-0", c.bg)}>
                  <Icon className={cn("size-4", c.text)} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-semibold text-foreground">{item.label}</span>
                    <span className={cn("text-xs font-bold font-mono", c.text)}>
                      {item.value}{item.unit}
                    </span>
                  </div>
                  <div className="h-1.5 bg-[--db-border] rounded-full overflow-hidden">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all duration-700",
                        item.color === "emerald" ? "bg-emerald-500" :
                        item.color === "blue" ? "bg-blue-500" : "bg-violet-500"
                      )}
                      style={{ width: `${item.value}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "تفعيل وضع الليل", icon: "🌙", href: "/dashboard/cameras", sub: "قفل جميع الكاميرات الداخلية" },
          { label: "مراجعة التسجيلات", icon: "📹", href: "/dashboard/cameras", sub: "آخر 24 ساعة" },
          { label: "حالة الطوارئ", icon: "🚨", href: "/dashboard/emergency", sub: "استجابة فورية" },
          { label: "إدارة الاشتراك", icon: "💳", href: "/dashboard/billing", sub: "Premium سنوي" },
        ].map((action) => (
          <a
            key={action.label}
            href={action.href}
            className="db-card p-4 flex flex-col gap-2 hover:bg-[--db-hover] transition-colors group cursor-pointer"
          >
            <span className="text-2xl">{action.icon}</span>
            <div>
              <div className="text-xs font-bold text-foreground group-hover:text-primary transition-colors">
                {action.label}
              </div>
              <div className="text-[10px] text-muted-foreground mt-0.5">{action.sub}</div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
