"use client";

import { useState, useEffect } from "react";
import {
  ShieldAlert,
  MapPin,
  Video,
  Camera as CameraIcon,
  BellRing,
  Volume2,
  PhoneCall,
  CheckCircle2,
  History,
  Radio,
  Clock,
  Loader2,
  Building2,
  Send,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { triggerSosApi, listEmergencyLogsApi, listPoliceStationsApi } from "@/lib/api";

export default function EmergencyDashboardPage() {
  const [emergencyActive, setEmergencyActive] = useState(false);
  const [gpsLocation] = useState("24.7136° N, 46.6753° E · حي الملقا، الرياض");
  const [loading, setLoading] = useState(false);
  const [sosNotes, setSosNotes] = useState("Suspicious intruder detected at entrance!");
  const [selectedStationId, setSelectedStationId] = useState(1);
  const [selectedCameraId, setSelectedCameraId] = useState(1);

  const [policeStations, setPoliceStations] = useState([
    { id: 1, name: "قسم شرطة القاهرة المركزية", city: "Cairo", phone: "122" },
    { id: 2, name: "قسم شرطة الرياض الشمالي", city: "Riyadh", phone: "999" },
  ]);

  const [emergencyLogs, setEmergencyLogs] = useState([
    {
      id: "log-1",
      time: "اليوم · 03:15 ص",
      type: "إنذار صوتي محلي",
      location: "المدخل الرئيسي",
      status: "resolved",
      clipDuration: "1:30",
    },
    {
      id: "log-2",
      time: "أمس · 11:45 م",
      type: "اختبار زر الطوارئ",
      location: "التطبيق المحمول",
      status: "resolved",
      clipDuration: "0:45",
    },
  ]);

  const [options, setOptions] = useState({
    videoRecord: true,
    snapshot: true,
    mobilePush: true,
    localSiren: true,
  });

  useEffect(() => {
    fetchLogsAndStations();
  }, []);

  const fetchLogsAndStations = async () => {
    const [lRes, sRes] = await Promise.all([
      listEmergencyLogsApi(),
      listPoliceStationsApi("Cairo"),
    ]);

    if (lRes.data && Array.isArray(lRes.data) && lRes.data.length > 0) {
      const formatted = lRes.data.map((l: any) => ({
        id: String(l.id),
        time: l.created_at || "الآن",
        type: l.notes || "SOS Emergency Triggered",
        location: `كاميرا #${l.camera_id || 1}`,
        status: l.status || "active",
        clipDuration: "1:00",
      }));
      setEmergencyLogs(formatted);
    }

    if (sRes.data && Array.isArray(sRes.data) && sRes.data.length > 0) {
      setPoliceStations(sRes.data);
    }
  };

  const toggleOption = (key: keyof typeof options) => {
    setOptions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleTriggerEmergency = async () => {
    setLoading(true);

    // Call API POST /emergency/sos
    await triggerSosApi({
      camera_id: selectedCameraId,
      police_station_id: selectedStationId,
      notes: sosNotes,
    });

    const nextActive = !emergencyActive;
    setEmergencyActive(nextActive);

    if (nextActive) {
      setEmergencyLogs((prev) => [
        {
          id: `log-${Date.now()}`,
          time: "الآن · جاري التسجيل (POST /emergency/sos)",
          type: `تفعيل SOS: ${sosNotes}`,
          location: gpsLocation,
          status: "active",
          clipDuration: "جاري...",
        },
        ...prev,
      ]);
    }
    setLoading(false);
  };

  const responseOptions = [
    {
      key: "videoRecord" as const,
      icon: Video,
      title: "تسجيل فوري",
      desc: "حفظ مقطع فيديو وصوت سحابياً دون انقطاع",
    },
    {
      key: "snapshot" as const,
      icon: CameraIcon,
      title: "صور سريعة",
      desc: "التقاط صور متتابعة عالية الدقة للأدلة",
    },
    {
      key: "mobilePush" as const,
      icon: BellRing,
      title: "إنذار الهاتف",
      desc: "صوت مرتفع يكسر وضع الصامت",
    },
    {
      key: "localSiren" as const,
      icon: Volume2,
      title: "صفارة محلية",
      desc: "صوت 105dB من الكاميرا لإخافة المقتحمين",
    },
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Banner */}
      <div className="db-card p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-s-4 border-s-red-500">
        <div>
          <div className="flex items-center gap-2">
            <span className="size-3 rounded-full bg-red-500 animate-ping" />
            <h1 className="text-xl font-bold text-foreground">مركز استجابة الطوارئ (Emergency SOS Module)</h1>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            ربط فورية بكاميرات باروسك ومراكز الشرطة المحلية عبر API (POST /emergency/sos).
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-red-500/10 text-red-600 dark:text-red-400 text-xs font-mono font-bold">
          <Radio className="size-4 animate-pulse" />
          <span>مُتصل بغرفة العمليات 24/7</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main SOS Trigger */}
        <div className="lg:col-span-7 db-card p-6 flex flex-col justify-between items-center text-center space-y-6">
          <div className="space-y-2">
            <div className="size-16 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center mx-auto mb-2">
              <ShieldAlert className="size-8" />
            </div>
            <h2 className="text-lg font-bold text-foreground">زر الاستجابة الفورية SOS</h2>
            <p className="text-xs text-muted-foreground max-w-md mx-auto">
              عند الضغط، سيتم إرسال طلب طوارئ لـ POST /emergency/sos وتوثيق الحدث وإخطار جهات الاتصال المسجلة.
            </p>
          </div>

          {/* Form Inputs for API parameters */}
          <div className="w-full space-y-3 text-start bg-muted/30 p-4 rounded-xl border border-border">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-bold text-foreground">رقم الكاميرا (camera_id)</label>
                <input
                  type="number"
                  value={selectedCameraId}
                  onChange={(e) => setSelectedCameraId(Number(e.target.value))}
                  className="w-full px-3 py-1.5 rounded-lg border border-input bg-background text-xs font-mono"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-foreground">مركز الشرطة (police_station_id)</label>
                <select
                  value={selectedStationId}
                  onChange={(e) => setSelectedStationId(Number(e.target.value))}
                  className="w-full px-3 py-1.5 rounded-lg border border-input bg-background text-xs"
                >
                  {policeStations.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.city})
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="text-[10px] font-bold text-foreground">ملاحظات البلاغ (notes)</label>
              <input
                type="text"
                value={sosNotes}
                onChange={(e) => setSosNotes(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg border border-input bg-background text-xs"
              />
            </div>
          </div>

          {/* Huge SOS Button */}
          <button
            onClick={handleTriggerEmergency}
            disabled={loading}
            className={cn(
              "relative size-44 rounded-full font-bold transition-all transform active:scale-95 flex flex-col items-center justify-center gap-2 text-white shadow-2xl cursor-pointer",
              emergencyActive
                ? "bg-red-600 animate-pulse ring-8 ring-red-500/40"
                : "bg-gradient-to-tr from-red-600 to-red-500 hover:scale-105 hover:shadow-red-500/30"
            )}
          >
            {loading ? (
              <Loader2 className="size-10 animate-spin" />
            ) : emergencyActive ? (
              <>
                <ShieldAlert className="size-10" />
                <span className="text-sm font-bold">إلغاء إنذار SOS</span>
              </>
            ) : (
              <>
                <Radio className="size-10" />
                <span className="text-xl font-bold tracking-wider">إرسال SOS</span>
                <span className="text-[10px] opacity-80 font-mono">POST /emergency/sos</span>
              </>
            )}
          </button>

          {/* Location info */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono bg-muted/40 px-4 py-2 rounded-xl border border-border">
            <MapPin className="size-4 text-primary shrink-0" />
            <span>موقع البلاغ الحالية: {gpsLocation}</span>
          </div>
        </div>

        {/* Options & Response actions */}
        <div className="lg:col-span-5 space-y-6">
          <div className="db-card p-5 space-y-4">
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
              <Building2 className="size-4 text-primary" />
              <span>دليل مراكز الشرطة (GET /emergency/police-stations)</span>
            </h3>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {policeStations.map((station) => (
                <div
                  key={station.id}
                  className="p-3 rounded-xl border border-border bg-muted/20 flex items-center justify-between text-xs"
                >
                  <div>
                    <div className="font-bold text-foreground">{station.name}</div>
                    <div className="text-muted-foreground text-[10px]">{station.city}</div>
                  </div>
                  <a
                    href={`tel:${station.phone || "122"}`}
                    className="flex items-center gap-1 px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold hover:bg-emerald-500/20"
                  >
                    <PhoneCall className="size-3" />
                    <span>{station.phone || "122"}</span>
                  </a>
                </div>
              ))}
            </div>
          </div>

          <div className="db-card p-5 space-y-4">
            <h3 className="text-sm font-bold text-foreground">إعدادات الإجراءات عند التفعيل</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {responseOptions.map((opt) => {
                const Icon = opt.icon;
                const active = options[opt.key];
                return (
                  <button
                    key={opt.key}
                    type="button"
                    onClick={() => toggleOption(opt.key)}
                    className={cn(
                      "p-3 rounded-xl border text-start transition-colors flex flex-col gap-1.5",
                      active
                        ? "border-primary bg-primary/8 text-foreground"
                        : "border-border bg-muted/20 text-muted-foreground hover:bg-muted/40"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <Icon className={cn("size-4", active ? "text-primary" : "text-muted-foreground")} />
                      <span className={cn("size-2 rounded-full", active ? "bg-primary" : "bg-muted-foreground/30")} />
                    </div>
                    <span className="text-xs font-bold">{opt.title}</span>
                    <span className="text-[10px] leading-tight text-muted-foreground">{opt.desc}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Emergency Logs Table */}
      <div className="db-card p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-foreground flex items-center gap-2">
            <History className="size-5 text-primary" />
            <span>سجل بلاغات الطوارئ (GET /emergency/logs)</span>
          </h3>
          <span className="text-xs text-muted-foreground font-mono">
            إجمالي البلاغات: {emergencyLogs.length}
          </span>
        </div>

        <div className="divide-y divide-border overflow-hidden rounded-xl border border-border">
          {emergencyLogs.map((log) => (
            <div key={log.id} className="p-4 flex items-center justify-between gap-4 bg-background hover:bg-muted/30 transition-colors">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-xl bg-red-500/10 text-red-500 flex items-center justify-center shrink-0">
                  <ShieldAlert className="size-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-foreground">{log.type}</div>
                  <div className="text-[10px] text-muted-foreground mt-0.5">{log.location}</div>
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs font-mono">
                <span className="text-muted-foreground">{log.time}</span>
                <span
                  className={cn(
                    "px-2.5 py-1 rounded-full text-[10px] font-bold",
                    log.status === "active"
                      ? "bg-red-500/10 text-red-600 animate-pulse"
                      : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                  )}
                >
                  {log.status === "active" ? "نشط الآن" : "تم التعامل"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
