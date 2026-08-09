"use client";

import { useState, useEffect } from "react";
import {
  Camera,
  Plus,
  Lock,
  Unlock,
  Wifi,
  Video,
  Calendar,
  Trash2,
  QrCode,
  CheckCircle2,
  X,
  Play,
  Volume2,
  ChevronRight,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  listCamerasApi,
  pairAddCameraApi,
  updateCameraSettingsApi,
  deleteCameraApi,
  listRecordingsApi,
} from "@/lib/api";

interface CameraItem {
  id: string;
  name: string;
  location: string;
  status: "live" | "privacy" | "offline";
  isLocked: boolean;
  wifiName: string;
  wifiSignal: number;
  model: string;
  lastEvent: string;
}

const DEFAULT_CAMERAS: CameraItem[] = [
  {
    id: "cam-1",
    name: "كاميرا المدخل الرئيسي",
    location: "المدخل الأمامي",
    status: "live",
    isLocked: false,
    wifiName: "Home_WiFi_5G",
    wifiSignal: 92,
    model: "باروسك Outdoor Pro 4K",
    lastEvent: "رُصد شخص · قبل 5 دقائق",
  },
  {
    id: "cam-2",
    name: "كاميرا الكراج",
    location: "الكراج",
    status: "live",
    isLocked: false,
    wifiName: "Home_WiFi_2.4G",
    wifiSignal: 85,
    model: "باروسك PTZ 360°",
    lastEvent: "وصول سيارة · قبل ساعة",
  },
  {
    id: "cam-3",
    name: "كاميرا غرفة المعيشة",
    location: "الصالون الداخلي",
    status: "privacy",
    isLocked: true,
    wifiName: "Home_WiFi_5G",
    wifiSignal: 98,
    model: "باروسك Interior 4K",
    lastEvent: "وضع الخصوصية",
  },
];

const DEFAULT_RECORDINGS = [
  { time: "09:42 ص", title: "رصد حركة شخص عند الباب", duration: "0:45", type: "motion" },
  { time: "07:15 ص", title: "تسليم شحنة من ساعي التوصيل", duration: "1:12", type: "motion" },
  { time: "02:30 ص", title: "إنذار صوتي خفيف", duration: "0:20", type: "audio" },
];

function SignalBars({ value }: { value: number }) {
  const bars = [value >= 25, value >= 50, value >= 75, value >= 90];
  return (
    <div className="flex items-end gap-0.5 h-3.5">
      {bars.map((active, i) => (
        <div
          key={i}
          className={cn(
            "w-1 rounded-[1px]",
            active ? "bg-emerald-500" : "bg-muted-foreground/25"
          )}
          style={{ height: `${35 + i * 22}%` }}
        />
      ))}
    </div>
  );
}

export default function CamerasDashboardPage() {
  const [cameras, setCameras] = useState<CameraItem[]>(DEFAULT_CAMERAS);
  const [recordings, setRecordings] = useState(DEFAULT_RECORDINGS);
  const [loading, setLoading] = useState(false);
  const [apiNotice, setApiNotice] = useState<string | null>(null);

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [selectedCamera, setSelectedCamera] = useState<CameraItem | null>(DEFAULT_CAMERAS[0]);
  const [filterDate, setFilterDate] = useState("2026-07-21");
  const [filterType, setFilterType] = useState("all");
  
  // New camera form fields
  const [newCamName, setNewCamName] = useState("");
  const [newCamModelId, setNewCamModelId] = useState(1);
  const [newCamSerial, setNewCamSerial] = useState("CAM-987654321");
  const [newCamMac, setNewCamMac] = useState("00:1B:44:11:3A:B7");
  const [newCamMode, setNewCamMode] = useState("security");
  const [newCamWifi, setNewCamWifi] = useState("Home_WiFi_5G");
  const [qrScanned, setQrScanned] = useState(false);
  const [submittingAdd, setSubmittingAdd] = useState(false);

  useEffect(() => {
    fetchCamerasAndRecordings();
  }, []);

  const fetchCamerasAndRecordings = async () => {
    setLoading(true);
    const [cRes, rRes] = await Promise.all([
      listCamerasApi({ per_page: 15 }),
      listRecordingsApi({ per_page: 15, recording_type: "motion" }),
    ]);

    if (cRes.data && Array.isArray(cRes.data)) {
      const fetched: CameraItem[] = cRes.data.map((c: any) => ({
        id: String(c.id),
        name: c.name || "كاميرا",
        location: c.location || "الموقع الرئيسي",
        status: c.is_locked ? "privacy" : (c.status || "live"),
        isLocked: !!c.is_locked,
        wifiName: c.wifi_name || "Home_WiFi_5G",
        wifiSignal: c.wifi_signal || 90,
        model: c.model || `كاميرا موديل #${c.camera_model_id || 1}`,
        lastEvent: c.last_event || "متصلة",
      }));
      if (fetched.length > 0) {
        setCameras(fetched);
        setSelectedCamera(fetched[0]);
      }
      setApiNotice("تم التوصيل بنجاح بـ API الكاميرات (GET /cameras)");
    } else {
      setApiNotice(cRes.error ? `وضع المعاينة المحلي (API error: ${cRes.error})` : null);
    }

    if (rRes.data && Array.isArray(rRes.data)) {
      const fetchedRecs = rRes.data.map((r: any) => ({
        time: r.created_at || "الآن",
        title: r.title || `تسجيل #${r.id}`,
        duration: String(r.duration || "1:00"),
        type: r.recording_type || "motion",
      }));
      if (fetchedRecs.length > 0) {
        setRecordings(fetchedRecs);
      }
    }
    setLoading(false);
  };

  const toggleLock = async (camId: string) => {
    const target = cameras.find((c) => c.id === camId);
    if (!target) return;
    const nextLock = !target.isLocked;

    // Call API PUT /cameras/:id
    await updateCameraSettingsApi(camId, {
      name: target.name,
      mode: nextLock ? "sleep" : "security",
      is_locked: nextLock,
    });

    setCameras((prev) =>
      prev.map((c) => {
        if (c.id === camId) {
          return {
            ...c,
            isLocked: nextLock,
            status: nextLock ? "privacy" : "live",
            lastEvent: nextLock ? "وضع الخصوصية" : "بث مباشر نشط",
          };
        }
        return c;
      })
    );

    if (selectedCamera?.id === camId) {
      setSelectedCamera((prev) =>
        prev
          ? { ...prev, isLocked: nextLock, status: nextLock ? "privacy" : "live" }
          : null
      );
    }
  };

  const deleteCamera = async (camId: string) => {
    // Call API DELETE /cameras/:id
    await deleteCameraApi(camId);

    setCameras((prev) => prev.filter((c) => c.id !== camId));
    if (selectedCamera?.id === camId) {
      setSelectedCamera(cameras.find((c) => c.id !== camId) || null);
    }
  };

  const handleAddCamera = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCamName.trim()) return;
    setSubmittingAdd(true);

    // Call API POST /cameras
    const res = await pairAddCameraApi({
      camera_model_id: newCamModelId,
      name: newCamName,
      serial_number: newCamSerial,
      mac_address: newCamMac,
      mode: newCamMode,
    });

    const newCam: CameraItem = {
      id: res.data?.id ? String(res.data.id) : `cam-${Date.now()}`,
      name: newCamName,
      location: "موقع جديد",
      status: "live",
      isLocked: false,
      wifiName: newCamWifi,
      wifiSignal: 88,
      model: `موديل #${newCamModelId}`,
      lastEvent: "تم الإقران عبر API · الآن",
    };

    setCameras((prev) => [...prev, newCam]);
    setSelectedCamera(newCam);
    setNewCamName("");
    setQrScanned(false);
    setAddModalOpen(false);
    setSubmittingAdd(false);
  };

  const filtered = recordings.filter(
    (r) => filterType === "all" || r.type === filterType
  );

  return (
    <div className="flex flex-col lg:flex-row gap-0 h-full -mx-4 sm:-mx-6 -my-6">
      {/* ── Left panel: Camera list ─────────────────── */}
      <div className="w-full lg:w-80 xl:w-96 shrink-0 flex flex-col border-b lg:border-b-0 lg:border-e border-[--db-border] bg-[--db-sidebar]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[--db-border]">
          <div>
            <h2 className="text-sm font-bold text-foreground">الكاميرات المتصلة (GET /cameras)</h2>
            <p className="text-[10px] text-muted-foreground mt-0.5">{cameras.length} كاميرات نشطة</p>
          </div>
          <button
            onClick={() => setAddModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold hover:bg-primary/90 transition-colors shadow-sm shadow-primary/20"
          >
            <Plus className="size-3.5" />
            <span>إضافة</span>
          </button>
        </div>

        {apiNotice && (
          <div className="px-5 py-2 bg-primary/10 text-primary text-[10px] font-mono border-b border-[--db-border]">
            {apiNotice}
          </div>
        )}

        {/* Camera list */}
        <div className="flex-1 overflow-y-auto divide-y divide-[--db-border]">
          {loading ? (
            <div className="p-8 text-center text-muted-foreground text-xs flex flex-col items-center gap-2">
              <Loader2 className="size-5 animate-spin text-primary" />
              <span>جاري التحميل من API...</span>
            </div>
          ) : (
            cameras.map((cam) => {
              const isSelected = selectedCamera?.id === cam.id;
              return (
                <button
                  key={cam.id}
                  onClick={() => setSelectedCamera(cam)}
                  className={cn(
                    "w-full text-start px-5 py-4 flex items-start gap-3 transition-colors",
                    isSelected
                      ? "bg-primary/8 border-e-2 border-primary"
                      : "hover:bg-[--db-hover]"
                  )}
                >
                  {/* Status indicator */}
                  <div className="mt-0.5 shrink-0">
                    {cam.isLocked ? (
                      <div className="size-8 rounded-xl bg-amber-500/10 flex items-center justify-center">
                        <Lock className="size-4 text-amber-600 dark:text-amber-400" />
                      </div>
                    ) : cam.status === "offline" ? (
                      <div className="size-8 rounded-xl bg-muted flex items-center justify-center">
                        <AlertCircle className="size-4 text-muted-foreground" />
                      </div>
                    ) : (
                      <div className="size-8 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Camera className="size-4 text-primary" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="text-xs font-bold text-foreground truncate">{cam.name}</span>
                      <span
                        className={cn(
                          "shrink-0 flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded-md",
                          cam.isLocked
                            ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                            : cam.status === "offline"
                            ? "bg-muted text-muted-foreground"
                            : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                        )}
                      >
                        {!cam.isLocked && cam.status === "live" && (
                          <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        )}
                        {cam.isLocked ? "مُقَفلة" : cam.status === "offline" ? "غير متصلة" : "مباشر"}
                      </span>
                    </div>
                    <div className="text-[10px] text-muted-foreground">{cam.model}</div>
                    <div className="flex items-center justify-between mt-1.5">
                      <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                        <Wifi className="size-2.5" />
                        <span className="font-mono">{cam.wifiSignal}%</span>
                      </div>
                      <SignalBars value={cam.wifiSignal} />
                    </div>
                  </div>

                  {isSelected && <ChevronRight className="size-3.5 text-primary mt-2 shrink-0 rtl:rotate-180" />}
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* ── Right panel: Player & recordings ──────── */}
      <div className="flex-1 overflow-y-auto">
        {selectedCamera ? (
          <div className="flex flex-col h-full">
            {/* Sub-header */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-[--db-border] bg-[--db-sidebar] shrink-0">
              <div>
                <h2 className="text-sm font-bold text-foreground">{selectedCamera.name}</h2>
                <p className="text-[10px] text-muted-foreground">
                  {selectedCamera.location} · {selectedCamera.wifiName}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleLock(selectedCamera.id)}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors",
                    selectedCamera.isLocked
                      ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20"
                      : "bg-muted text-foreground hover:bg-accent"
                  )}
                >
                  {selectedCamera.isLocked ? <Lock className="size-3.5" /> : <Unlock className="size-3.5" />}
                  <span>{selectedCamera.isLocked ? "إلغاء القفل (PUT)" : "قفل الخصوصية (PUT)"}</span>
                </button>
                <button
                  onClick={() => deleteCamera(selectedCamera.id)}
                  title="حذف الكاميرا (DELETE /cameras/:id)"
                  className="p-1.5 rounded-xl text-muted-foreground hover:text-red-600 hover:bg-red-500/10 transition-colors"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            </div>

            <div className="flex-1 px-5 py-5 space-y-6">
              {/* Video player */}
              <div className="relative aspect-video rounded-2xl bg-slate-950 overflow-hidden border border-slate-800 shadow-xl">
                <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />

                {selectedCamera.isLocked ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-center">
                    <div className="size-14 rounded-2xl bg-amber-500/20 flex items-center justify-center">
                      <Lock className="size-7 text-amber-400" />
                    </div>
                    <div className="text-sm font-bold text-slate-200">وضع الخصوصية مفعّل</div>
                    <p className="text-xs text-slate-400 max-w-xs">
                      تم إيقاف تشغيل مستشعر الكاميرا بالكامل لحماية خصوصيتك.
                    </p>
                  </div>
                ) : (
                  <>
                    {/* Top bar */}
                    <div className="absolute top-0 inset-x-0 flex items-center justify-between p-3 z-10">
                      <span className="flex items-center gap-1.5 bg-red-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
                        <span className="size-1.5 rounded-full bg-white animate-pulse" />
                        بث مباشر HD
                      </span>
                      <span className="text-[10px] font-mono text-slate-400 bg-black/40 backdrop-blur-sm px-2 py-0.5 rounded-md">
                        30fps · 4.2Mbps
                      </span>
                    </div>

                    {/* Center play */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <button className="size-14 rounded-full bg-white/10 border border-white/20 flex items-center justify-center hover:bg-white/20 transition-colors backdrop-blur-sm">
                        <Play className="size-6 text-white fill-white ms-0.5" />
                      </button>
                    </div>

                    {/* Bottom bar */}
                    <div className="absolute bottom-0 inset-x-0 flex items-center justify-between p-3 z-10 bg-gradient-to-t from-black/60">
                      <span className="text-[10px] font-mono text-emerald-400">
                        ● {selectedCamera.lastEvent}
                      </span>
                      <div className="flex items-center gap-2">
                        <Volume2 className="size-3.5 text-slate-400" />
                        <Video className="size-3.5 text-slate-400" />
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Recording filters */}
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Calendar className="size-4 text-primary" />
                    <h3 className="text-sm font-bold text-foreground">التسجيلات والأرشيف (GET /recordings)</h3>
                  </div>
                  <input
                    type="date"
                    value={filterDate}
                    onChange={(e) => setFilterDate(e.target.value)}
                    className="px-3 py-1.5 rounded-xl border border-[--db-border] bg-[--db-card] text-xs font-mono text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div className="flex items-center gap-2">
                  {[
                    { id: "all", label: "الكل" },
                    { id: "motion", label: "حركة" },
                    { id: "audio", label: "صوت" },
                    { id: "emergency", label: "طوارئ" },
                  ].map((btn) => (
                    <button
                      key={btn.id}
                      onClick={() => setFilterType(btn.id)}
                      className={cn(
                        "px-3 py-1.5 rounded-xl text-xs font-bold transition-colors",
                        filterType === btn.id
                          ? "bg-primary text-primary-foreground"
                          : "bg-[--db-card] border border-[--db-border] text-muted-foreground hover:text-foreground hover:border-foreground/20"
                      )}
                    >
                      {btn.label}
                    </button>
                  ))}
                </div>

                {/* Recording list */}
                <div className="space-y-2">
                  {filtered.length === 0 ? (
                    <div className="py-8 text-center text-xs text-muted-foreground">
                      لا توجد تسجيلات لهذا الفلتر
                    </div>
                  ) : (
                    filtered.map((item, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-3 p-3 rounded-xl bg-[--db-card] border border-[--db-border] hover:border-primary/30 transition-colors group"
                      >
                        <div className="size-9 rounded-xl bg-primary/8 text-primary flex items-center justify-center shrink-0 group-hover:bg-primary/15 transition-colors">
                          <Play className="size-3.5 fill-current" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-bold text-foreground truncate">{item.title}</div>
                          <div className="text-[10px] text-muted-foreground font-mono mt-0.5">
                            {item.time} · {item.duration} دقيقة
                          </div>
                        </div>
                        <button className="px-3 py-1.5 rounded-lg bg-[--db-sidebar] border border-[--db-border] text-xs font-bold text-foreground hover:border-primary/30 transition-colors shrink-0">
                          تشغيل
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center gap-3 text-center py-20">
            <div className="size-14 rounded-2xl bg-muted flex items-center justify-center">
              <Camera className="size-7 text-muted-foreground" />
            </div>
            <div className="text-sm font-bold text-foreground">اختر كاميرا من القائمة</div>
            <p className="text-xs text-muted-foreground max-w-xs">
              انقر على أي كاميرا في القائمة لعرض البث المباشر والتسجيلات.
            </p>
          </div>
        )}
      </div>

      {/* ── Add Camera Modal ────────────────────────── */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[--db-sidebar] border border-[--db-border] rounded-2xl max-w-sm w-full shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[--db-border]">
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                <QrCode className="size-4 text-primary" />
                إقران وإضافة كاميرا (POST /cameras)
              </h3>
              <button
                onClick={() => setAddModalOpen(false)}
                className="p-1 rounded-lg text-muted-foreground hover:bg-accent"
              >
                <X className="size-4" />
              </button>
            </div>

            <form onSubmit={handleAddCamera} className="px-6 py-5 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground">اسم الكاميرا</label>
                <input
                  type="text"
                  required
                  placeholder="Front Door Security Camera"
                  value={newCamName}
                  onChange={(e) => setNewCamName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-[--db-border] bg-[--db-card] text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-foreground">رقم السيريال</label>
                  <input
                    type="text"
                    value={newCamSerial}
                    onChange={(e) => setNewCamSerial(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-[--db-border] bg-[--db-card] text-xs font-mono text-foreground"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-foreground">عنوان MAC</label>
                  <input
                    type="text"
                    value={newCamMac}
                    onChange={(e) => setNewCamMac(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-[--db-border] bg-[--db-card] text-xs font-mono text-foreground"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground">شبكة الإنترنت</label>
                <select
                  value={newCamWifi}
                  onChange={(e) => setNewCamWifi(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-[--db-border] bg-[--db-card] text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="Home_WiFi_5G">Home_WiFi_5G (5GHz)</option>
                  <option value="Home_WiFi_2.4G">Home_WiFi_2.4G (2.4GHz)</option>
                  <option value="Barosic_Security_Net">Barosic_Security_Net</option>
                </select>
              </div>

              <div className="border border-dashed border-[--db-border] rounded-xl p-5 text-center space-y-3">
                {qrScanned ? (
                  <div className="space-y-1 text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="size-8 mx-auto" />
                    <div className="text-xs font-bold">تم مسح رمز QR بنجاح!</div>
                    <div className="text-[10px] text-muted-foreground">جاهز للإرسال لـ POST /cameras</div>
                  </div>
                ) : (
                  <>
                    <QrCode className="size-10 mx-auto text-primary" />
                    <div className="text-xs font-bold text-foreground">اقرأ رمز QR من ظهر الكاميرا</div>
                    <button
                      type="button"
                      onClick={() => setQrScanned(true)}
                      className="px-4 py-1.5 bg-primary text-primary-foreground text-xs font-bold rounded-xl"
                    >
                      محاكاة مسح QR
                    </button>
                  </>
                )}
              </div>

              <div className="flex gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setAddModalOpen(false)}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-[--db-border] text-sm font-bold text-foreground hover:bg-accent transition-colors"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={submittingAdd || !qrScanned || !newCamName.trim()}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-bold disabled:opacity-40 hover:bg-primary/90 transition-colors flex items-center justify-center gap-1"
                >
                  {submittingAdd ? <Loader2 className="size-4 animate-spin" /> : "إضافة الكاميرا"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
