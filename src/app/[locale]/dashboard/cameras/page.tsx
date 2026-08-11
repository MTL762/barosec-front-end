"use client";

import { Link } from "@/i18n/navigation";
import {
  CameraApiItem,
  deleteCameraApi,
  listCamerasApi,
  listRecordingsApi,
  RecordingApiItem,
  updateCameraSettingsApi,
} from "@/lib/api";
import { cn } from "@/lib/utils";
import {
  AlertCircle,
  Calendar,
  Camera,
  ChevronRight,
  Loader2,
  Lock,
  Pencil,
  Play,
  Plus,
  Trash2,
  Unlock,
  Video,
  Volume2,
  Wifi,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

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

interface RecordingItem {
  id: string;
  time: string;
  title: string;
  duration: string;
  type: string;
  fileUrl?: string;
}

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
  const t = useTranslations("Dashboard.Cameras");
  const locale = useLocale();
  const searchParams = useSearchParams();
  const selectedIdFromUrl = searchParams.get("selected");

  const [cameras, setCameras] = useState<CameraItem[]>([]);
  const [recordings, setRecordings] = useState<RecordingItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedCamera, setSelectedCamera] = useState<CameraItem | null>(null);
  const [filterDate, setFilterDate] = useState<string>("");
  const [filterType, setFilterType] = useState("all");

  const timeLocale = locale === "ar" ? "ar-SA" : "en-US";

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    setFilterDate(today);

    fetchCamerasAndRecordings();
  }, []);

  const fetchCamerasAndRecordings = async () => {
    setLoading(true);
    const [cRes, rRes] = await Promise.all([
      listCamerasApi({ per_page: 15 }),
      listRecordingsApi({ per_page: 15 }),
    ]);

    const cameraData = Array.isArray(cRes.data)
      ? cRes.data
      : Array.isArray(cRes.data?.data)
      ? (cRes.data.data as CameraApiItem[])
      : [];

    const fetchedCameras: CameraItem[] = cameraData.map((c: any) => ({
      id: String(c.id),
      name: String(c.name || `Cam #${c.id}`),
      location: String(c.location || c.mode || t("mainLocation")),
      status: c.is_locked ? "privacy" : (c.status || "live"),
      isLocked: Boolean(c.is_locked),
      wifiName: String(c.wifi_name || c.wifi || "Home_WiFi"),
      wifiSignal: Number(c.wifi_signal || c.signal || 90),
      model: String(
        c.model ||
          (c.camera_model_id
            ? t("model", { modelId: c.camera_model_id })
            : t("barosicCamera"))
      ),
      lastEvent: c.is_locked
        ? t("privacyMode")
        : c.updated_at
        ? new Date(String(c.updated_at)).toLocaleTimeString(timeLocale, {
            hour: "2-digit",
            minute: "2-digit",
          })
        : t("connectedNow"),
    }));

    setCameras(fetchedCameras);

    if (fetchedCameras.length > 0) {
      setSelectedCamera((prev) => {
        if (selectedIdFromUrl) {
          const matched = fetchedCameras.find((c) => c.id === selectedIdFromUrl);
          if (matched) return matched;
        }
        if (!prev) return fetchedCameras[0];
        const exists = fetchedCameras.find((c) => c.id === prev.id);
        return exists || fetchedCameras[0];
      });
    } else {
      setSelectedCamera(null);
    }

    const recordingData = Array.isArray(rRes.data)
      ? rRes.data
      : Array.isArray(rRes.data?.data)
      ? (rRes.data.data as RecordingApiItem[])
      : [];

    const fetchedRecs: RecordingItem[] = recordingData.map((r: any) => ({
      id: String(r.id),
      time: r.created_at
        ? new Date(String(r.created_at)).toLocaleTimeString(timeLocale, {
            hour: "2-digit",
            minute: "2-digit",
          })
        : "Now",
      title: String(r.title || r.name || `Recording #${r.id}`),
      duration: String(r.duration || "1:00"),
      type: String(r.recording_type || r.type || "motion"),
      fileUrl: r.file_url ? String(r.file_url) : undefined,
    }));

    setRecordings(fetchedRecs);
    setLoading(false);
  };

  const toggleLock = async (camId: string) => {
    const target = cameras.find((c) => c.id === camId);
    if (!target) return;
    const nextLock = !target.isLocked;

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
            lastEvent: nextLock ? t("privacyMode") : t("liveStreamActive"),
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
    await deleteCameraApi(camId);

    const remaining = cameras.filter((c) => c.id !== camId);
    setCameras(remaining);
    if (selectedCamera?.id === camId) {
      setSelectedCamera(remaining.length > 0 ? remaining[0] : null);
    }
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
            <h2 className="text-sm font-bold text-foreground">{t("connectedCameras")}</h2>
            <p className="text-[10px] text-muted-foreground mt-0.5">
              {t("activeCamerasCount", { count: cameras.length })}
            </p>
          </div>
          <Link
            href="/dashboard/cameras/add"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold hover:bg-primary/90 transition-colors shadow-sm shadow-primary/20"
          >
            <Plus className="size-3.5" />
            <span>{t("add")}</span>
          </Link>
        </div>

        {/* Camera list */}
        <div className="flex-1 overflow-y-auto divide-y divide-[--db-border]">
          {loading ? (
            <div className="p-8 text-center text-muted-foreground text-xs flex flex-col items-center gap-2">
              <Loader2 className="size-5 animate-spin text-primary" />
              <span>{t("loadingCameras")}</span>
            </div>
          ) : cameras.length === 0 ? (
            <div className="p-8 text-center text-xs text-muted-foreground space-y-2">
              <p>{t("noCameras")}</p>
              <Link
                href="/dashboard/cameras/add"
                className="text-primary font-bold hover:underline text-xs inline-block"
              >
                {t("addNewCamera")}
              </Link>
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
                        {cam.isLocked
                          ? t("privacyLocked")
                          : cam.status === "offline"
                          ? t("offline")
                          : t("live")}
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
                <Link
                  href={`/dashboard/cameras/${selectedCamera.id}/edit`}
                  title={t("editCamera")}
                  className="p-1.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                >
                  <Pencil className="size-4" />
                </Link>
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
                  <span>{selectedCamera.isLocked ? t("unlock") : t("lockPrivacy")}</span>
                </button>
                <button
                  onClick={() => deleteCamera(selectedCamera.id)}
                  title={t("deleteCamera")}
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
                    <div className="text-sm font-bold text-slate-200">{t("privacyEnabled")}</div>
                    <p className="text-xs text-slate-400 max-w-xs">{t("privacyDesc")}</p>
                  </div>
                ) : (
                  <>
                    {/* Top bar */}
                    <div className="absolute top-0 inset-x-0 flex items-center justify-between p-3 z-10">
                      <span className="flex items-center gap-1.5 bg-red-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
                        <span className="size-1.5 rounded-full bg-white animate-pulse" />
                        {t("liveHD")}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400 bg-black/40 backdrop-blur-sm px-2 py-0.5 rounded-md">
                        30fps · {selectedCamera.wifiSignal > 50 ? "4.2Mbps" : "2.1Mbps"}
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
                    <h3 className="text-sm font-bold text-foreground">{t("recordingsArchive")}</h3>
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
                    { id: "all", label: t("filterAll") },
                    { id: "motion", label: t("filterMotion") },
                    { id: "audio", label: t("filterAudio") },
                    { id: "emergency", label: t("filterEmergency") },
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
                  {loading ? (
                    <div className="p-8 text-center text-xs text-muted-foreground flex flex-col items-center gap-2">
                      <Loader2 className="size-5 animate-spin text-primary" />
                      <span>{t("loadingRecordings")}</span>
                    </div>
                  ) : filtered.length === 0 ? (
                    <div className="py-8 text-center text-xs text-muted-foreground">
                      {t("noRecordings")}
                    </div>
                  ) : (
                    filtered.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-3 p-3 rounded-xl bg-[--db-card] border border-[--db-border] hover:border-primary/30 transition-colors group"
                      >
                        <div className="size-9 rounded-xl bg-primary/8 text-primary flex items-center justify-center shrink-0 group-hover:bg-primary/15 transition-colors">
                          <Play className="size-3.5 fill-current" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-bold text-foreground truncate">{item.title}</div>
                          <div className="text-[10px] text-muted-foreground font-mono mt-0.5">
                            {item.time} · {item.duration} {t("min")}
                          </div>
                        </div>
                        <button className="px-3 py-1.5 rounded-lg bg-[--db-sidebar] border border-[--db-border] text-xs font-bold text-foreground hover:border-primary/30 transition-colors shrink-0">
                          {t("play")}
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
            <div className="text-sm font-bold text-foreground">
              {cameras.length === 0 ? t("noConnectedCameras") : t("selectCamera")}
            </div>
            <p className="text-xs text-muted-foreground max-w-xs">
              {cameras.length === 0 ? t("addCameraPrompt") : t("clickCameraPrompt")}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
