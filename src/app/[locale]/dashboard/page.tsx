"use client";

import { useEffect, useState } from "react";
import {
  Activity,
  Camera,
  Clock,
  Cloud,
  Eye,
  HardDrive,
  Loader2,
  ShieldCheck,
  TrendingUp,
  Video,
  Wifi,
} from "lucide-react";
import {
  listCamerasApi,
  listRecordingsApi,
  getActiveSubscriptionApi,
  listEmergencyLogsApi,
  CameraApiItem,
  RecordingApiItem,
  SubscriptionApiItem,
  EmergencyLogApiItem,
} from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { cn } from "@/lib/utils";

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
  const bars = [value >= 25, value >= 50, value >= 75, value >= 90];
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
  const { user } = useAuth();
  const [time, setTime] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [cameras, setCameras] = useState<CameraApiItem[]>([]);
  const [recordings, setRecordings] = useState<RecordingApiItem[]>([]);
  const [subscription, setSubscription] = useState<SubscriptionApiItem | null>(null);
  const [emergencyLogs, setEmergencyLogs] = useState<EmergencyLogApiItem[]>([]);

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
    let isMounted = true;
    setLoading(true);

    Promise.all([
      listCamerasApi({ per_page: 15 }),
      listRecordingsApi({ per_page: 15 }),
      getActiveSubscriptionApi(),
      listEmergencyLogsApi(),
    ])
      .then(([cRes, rRes, sRes, eRes]) => {
        if (!isMounted) return;

        const cameraItems = Array.isArray(cRes.data)
          ? cRes.data
          : Array.isArray(cRes.data?.data)
          ? (cRes.data.data as CameraApiItem[])
          : [];
        setCameras(cameraItems);

        const recordingItems = Array.isArray(rRes.data)
          ? rRes.data
          : Array.isArray(rRes.data?.data)
          ? (rRes.data.data as RecordingApiItem[])
          : [];
        setRecordings(recordingItems);

        const subItem = (sRes.data?.data || sRes.data) as SubscriptionApiItem | null;
        if (subItem && typeof subItem === "object" && ("plan" in subItem || "status" in subItem)) {
          setSubscription(subItem);
        }

        const emergencyItems = Array.isArray(eRes.data)
          ? eRes.data
          : Array.isArray(eRes.data?.data)
          ? (eRes.data.data as EmergencyLogApiItem[])
          : [];
        setEmergencyLogs(emergencyItems);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const activeCamerasCount = cameras.filter((c) => !c.is_locked).length;
  const latestRecording = recordings[0];
  const latestRecordingTime = latestRecording?.created_at
    ? new Date(String(latestRecording.created_at)).toLocaleTimeString("ar-SA", {
        hour: "2-digit",
        minute: "2-digit",
      })
    : null;

  const dynamicStatCards = [
    {
      label: "كاميرات متصلة",
      value: String(cameras.length),
      sub: cameras.length > 0 ? `منها ${activeCamerasCount} نشطة` : "لا توجد كاميرات",
      icon: Camera,
      color: "emerald",
      trend: cameras.length > 0 ? `+${cameras.length}` : null,
    },
    {
      label: "تسجيلات اليوم",
      value: String(recordings.length),
      sub: recordings.length > 0 ? `${recordings.length} مقطع محفوظ` : "لا توجد تسجيلات",
      icon: Video,
      color: "blue",
      trend: recordings.length > 0 ? `+${recordings.length}` : null,
    },
    {
      label: "آخر حدث",
      value: String(latestRecordingTime || time || "الآن"),
      sub: String(latestRecording
        ? (latestRecording.title || latestRecording.name || "رصد حركة")
        : emergencyLogs.length > 0
        ? "سجل طوارئ"
        : "مراقبة مستمرة"),
      icon: Activity,
      color: "amber",
      trend: null,
    },
    {
      label: "الاشتراك والتخزين",
      value: String(
        subscription?.plan?.name ||
          (subscription?.status === "active" ? "اشتراك نشط" : "باقة اساسية")
      ),
      sub: `${recordings.length * 0.5 < 1 ? "أقل من 1" : (recordings.length * 0.5).toFixed(1)} GB مستخدمة`,
      icon: HardDrive,
      color: "violet",
      trend: null,
    },
  ];

  const connectivityPercentage =
    cameras.length > 0
      ? Math.round((activeCamerasCount / cameras.length) * 100)
      : 100;

  const storageUsagePercentage = Math.min(100, Math.max(5, recordings.length * 5));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-xl font-bold text-foreground">
            مرحباً، {user?.name || user?.email || "العميل"} 👋
          </h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            نظرة عامة على حالة الكاميرات، التسجيلات، والأنشطة الأخيرة مباشرة من الخادم
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm font-mono text-muted-foreground">
          {loading && <Loader2 className="size-3.5 animate-spin text-primary" />}
          <Clock className="size-3.5" />
          <span>{time} — تحديث مباشر</span>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {dynamicStatCards.map((s) => {
          const Icon = s.icon;
          const c = colorMap[s.color as keyof typeof colorMap];
          return (
            <div key={s.label} className="db-card p-4 space-y-3">
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
                <div className="text-xs text-muted-foreground mt-1 truncate">{s.sub}</div>
              </div>
              <div className="text-xs font-semibold text-muted-foreground">{s.label}</div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <div className="xl:col-span-7 db-card overflow-hidden flex flex-col">
          <div className="flex items-center justify-between px-5 py-4 border-b border-[--db-border]">
            <h3 className="text-sm font-bold text-foreground">بث مباشر للكاميرات</h3>
            <a href="/dashboard/cameras" className="text-xs font-bold text-primary hover:underline">
              عرض الكل
            </a>
          </div>

          {loading ? (
            <div className="p-12 flex flex-col items-center justify-center gap-2 text-muted-foreground">
              <Loader2 className="size-6 animate-spin text-primary" />
              <span className="text-xs">جاري تحميل بيانات الكاميرات...</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-[--db-border] flex-1">
              {cameras.map((cam) => {
                const isPrivacy = Boolean(cam.is_locked);
                const signal = (cam.wifi_signal as number) || (cam.signal as number) || 90;
                const camName = String(cam.name || `كاميرا #${cam.id}`);
                const camModel = cam.mode
                  ? `وضع: ${cam.mode}`
                  : cam.serial_number
                  ? `S/N: ${cam.serial_number}`
                  : "باروسك 4K";
                const lastEvent = isPrivacy
                  ? "وضع الخصوصية"
                  : cam.updated_at
                  ? new Date(String(cam.updated_at)).toLocaleTimeString("ar-SA", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "متصلة الآن";

                return (
                  <div
                    key={String(cam.id)}
                    className="relative bg-slate-950 aspect-video flex flex-col justify-between p-3 overflow-hidden group"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-900 to-slate-800" />
                    <div
                      className="absolute inset-0 opacity-20"
                      style={{
                        backgroundImage:
                          "radial-gradient(ellipse at 30% 40%, oklch(0.55 0.11 200 / 0.3) 0%, transparent 60%)",
                      }}
                    />

                    <div className="relative flex items-center justify-between z-10">
                      {!isPrivacy ? (
                        <LiveBadge />
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-[10px] font-bold">
                          🔒 خصوصية
                        </span>
                      )}
                      <div className="flex items-center gap-1.5">
                        <SignalBar value={signal} />
                        <span className="text-[10px] font-mono text-slate-400">{signal}%</span>
                      </div>
                    </div>

                    <div className="relative flex-1 flex items-center justify-center z-10">
                      {isPrivacy ? (
                        <div className="size-10 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400 text-xl">
                          🔒
                        </div>
                      ) : (
                        <Eye className="size-6 text-white/20 group-hover:text-white/60 transition-colors" />
                      )}
                    </div>

                    <div className="relative z-10 flex items-end justify-between">
                      <div>
                        <div className="text-white text-xs font-bold truncate max-w-[120px]">
                          {camName}
                        </div>
                        <div className="text-slate-400 text-[10px] truncate max-w-[120px]">
                          {camModel}
                        </div>
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">{lastEvent}</div>
                    </div>
                  </div>
                );
              })}

              <a
                href="/dashboard/cameras"
                className={cn(
                  "relative bg-[--db-card] aspect-video flex flex-col items-center justify-center gap-2 group hover:bg-[--db-hover] transition-colors cursor-pointer",
                  cameras.length === 0 && "col-span-full py-8 aspect-auto min-h-[180px]"
                )}
              >
                <div className="size-10 rounded-xl border-2 border-dashed border-[--db-border] flex items-center justify-center text-muted-foreground group-hover:border-primary group-hover:text-primary transition-colors">
                  <Camera className="size-4" />
                </div>
                <span className="text-xs font-bold text-muted-foreground group-hover:text-primary transition-colors">
                  {cameras.length === 0 ? "لا توجد كاميرات مضافة — اضغط لإضافة كاميرا جديدة" : "إضافة كاميرا"}
                </span>
              </a>
            </div>
          )}
        </div>

        <div className="xl:col-span-5 db-card flex flex-col">
          <div className="flex items-center justify-between px-5 py-4 border-b border-[--db-border] shrink-0">
            <h3 className="text-sm font-bold text-foreground">سجل الأحداث والتسجيلات</h3>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-bold">
              {recordings.length} حدث
            </span>
          </div>

          <div className="flex-1 overflow-y-auto max-h-[380px]">
            {loading ? (
              <div className="p-8 flex flex-col items-center justify-center gap-2 text-muted-foreground">
                <Loader2 className="size-5 animate-spin text-primary" />
                <span className="text-xs">جاري تحميل سجل الأحداث...</span>
              </div>
            ) : recordings.length === 0 ? (
              <div className="p-8 text-center text-xs text-muted-foreground">
                لا توجد أحداث أو تسجيلات حالية
              </div>
            ) : (
              recordings.map((event, i) => {
                const recType = String(
                  event.recording_type || event.type || "motion"
                ).toLowerCase();
                const severityKey =
                  recType === "sos" || recType === "alert"
                    ? "high"
                    : recType === "motion"
                    ? "medium"
                    : "low";
                const s = severityMap[severityKey];

                const title = String(
                  event.title ||
                    event.name ||
                    (recType === "motion"
                      ? "رصد حركة أمام الكاميرا"
                      : recType === "sos"
                      ? "تنبيه طوارئ SOS"
                      : "تسجيل فيديو جديد")
                );

                const formattedTime = event.created_at
                  ? new Date(String(event.created_at)).toLocaleTimeString("ar-SA", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "الآن";

                const camName = String(
                  event.camera_name ||
                    (event.camera_id ? `كاميرا #${event.camera_id}` : "كاميرا عامة")
                );

                return (
                  <div
                    key={String(event.id || i)}
                    className={cn(
                      "flex items-start gap-3 px-5 py-3.5 hover:bg-[--db-hover] transition-colors",
                      i < recordings.length - 1 && "border-b border-[--db-border]"
                    )}
                  >
                    <div className="flex flex-col items-center shrink-0 pt-1">
                      <span className={cn("size-2 rounded-full", s.dot)} />
                      {i < recordings.length - 1 && (
                        <span className="w-px flex-1 bg-[--db-border] mt-1.5 min-h-[20px]" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-xs font-semibold text-foreground leading-snug truncate">
                          {title}
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
                        <span className="text-[10px] text-muted-foreground font-mono">
                          {formattedTime}
                        </span>
                        <span className="size-0.5 rounded-full bg-muted-foreground/40" />
                        <span className="text-[10px] text-muted-foreground truncate max-w-[140px]">
                          {camName}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      <div className="db-card px-5 py-4">
        <h3 className="text-sm font-bold text-foreground mb-4">صحة النظام والاتصال</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              label: "اتصال الكاميرات",
              value: connectivityPercentage,
              icon: Wifi,
              color: "emerald",
              unit: "%",
            },
            {
              label: "استهلاك التخزين",
              value: storageUsagePercentage,
              icon: Cloud,
              color: "blue",
              unit: "%",
            },
            {
              label: "جاهزية الاستجابة",
              value: 100,
              icon: ShieldCheck,
              color: "emerald",
              unit: "%",
            },
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
                        item.color === "emerald" ? "bg-emerald-500" : "bg-blue-500"
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

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "إدارة الكاميرات", icon: "📷", href: "/dashboard/cameras", sub: "عرض التحكم وضبط الأوضاع" },
          { label: "مراجعة التسجيلات", icon: "📹", href: "/dashboard/cameras", sub: "عرض الوسائط المحفوظة" },
          { label: "حالة الطوارئ SOS", icon: "🚨", href: "/dashboard/emergency", sub: "سجل الطوارئ والبلاغات" },
          { label: "إدارة الاشتراك", icon: "💳", href: "/dashboard/billing", sub: "تفاصيل الباقة والفواتير" },
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
