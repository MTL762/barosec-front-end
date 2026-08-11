"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import {
  ShieldAlert,
  MapPin,
  Video,
  Camera as CameraIcon,
  BellRing,
  Volume2,
  PhoneCall,
  History,
  Radio,
  Loader2,
  Building2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  triggerSosApi,
  listEmergencyLogsApi,
  listPoliceStationsApi,
} from "@/lib/api";
import type { PoliceStationApiItem, EmergencyLogApiItem } from "@/lib/api/types";

interface EmergencyLogDisplayItem {
  id: string;
  time: string;
  type: string;
  location: string;
  status: "active" | "resolved" | string;
  clipDuration?: string;
}

type ActionOptionKey = "videoRecord" | "snapshot" | "mobilePush" | "localSiren";

interface ActionOptionConfig {
  key: ActionOptionKey;
  icon: React.ComponentType<{ className?: string }>;
  titleKey: string;
  descKey: string;
}

const RESPONSE_ACTION_OPTIONS: ActionOptionConfig[] = [
  {
    key: "videoRecord",
    icon: Video,
    titleKey: "optInstantRecord",
    descKey: "optInstantRecordDesc",
  },
  {
    key: "snapshot",
    icon: CameraIcon,
    titleKey: "optQuickSnapshots",
    descKey: "optQuickSnapshotsDesc",
  },
  {
    key: "mobilePush",
    icon: BellRing,
    titleKey: "optMobilePush",
    descKey: "optMobilePushDesc",
  },
  {
    key: "localSiren",
    icon: Volume2,
    titleKey: "optLocalSiren",
    descKey: "optLocalSirenDesc",
  },
];

export default function EmergencyDashboardPage() {
  const t = useTranslations("Emergency");

  const [emergencyActive, setEmergencyActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sosNotes, setSosNotes] = useState("");
  const [selectedStationId, setSelectedStationId] = useState<number>(1);
  const [selectedCameraId, setSelectedCameraId] = useState<number>(1);

  const [policeStations, setPoliceStations] = useState<PoliceStationApiItem[]>([
    { id: 1, name: t("fallbackStation1"), city: t("cityCairo"), phone: "122" },
    { id: 2, name: t("fallbackStation2"), city: t("cityRiyadh"), phone: "999" },
  ]);

  const [emergencyLogs, setEmergencyLogs] = useState<EmergencyLogDisplayItem[]>([
    {
      id: "log-1",
      time: t("logTimeToday"),
      type: t("logTypeAudio"),
      location: t("logLocationEntrance"),
      status: "resolved",
      clipDuration: "1:30",
    },
    {
      id: "log-2",
      time: t("logTimeYesterday"),
      type: t("logTypeTest"),
      location: t("logLocationMobile"),
      status: "resolved",
      clipDuration: "0:45",
    },
  ]);

  const [options, setOptions] = useState<Record<ActionOptionKey, boolean>>({
    videoRecord: true,
    snapshot: true,
    mobilePush: true,
    localSiren: true,
  });

  const gpsLocation = t("defaultLocation");

  const fetchLogsAndStations = useCallback(async () => {
    try {
      const [lRes, sRes] = await Promise.all([
        listEmergencyLogsApi(),
        listPoliceStationsApi("Cairo"),
      ]);

      if (lRes?.data && Array.isArray(lRes.data) && lRes.data.length > 0) {
        const formatted: EmergencyLogDisplayItem[] = lRes.data.map(
          (l: EmergencyLogApiItem) => ({
            id: String(l.id),
            time: l.created_at || t("now"),
            type: l.notes || t("sosCardTitle"),
            location: t("cameraLocation", { id: l.camera_id || 1 }),
            status: l.status || "active",
            clipDuration: "1:00",
          })
        );
        setEmergencyLogs(formatted);
      }

      if (sRes?.data && Array.isArray(sRes.data) && sRes.data.length > 0) {
        setPoliceStations(sRes.data);
      }
    } catch {
      // Fallback data is preserved on network error
    }
  }, [t]);

  useEffect(() => {
    fetchLogsAndStations();
  }, [fetchLogsAndStations]);

  const toggleOption = (key: ActionOptionKey) => {
    setOptions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleTriggerEmergency = async () => {
    setLoading(true);

    try {
      const noteContent = sosNotes.trim() || t("notesPlaceholder");
      await triggerSosApi({
        camera_id: selectedCameraId,
        police_station_id: selectedStationId,
        notes: noteContent,
      });

      const nextActive = !emergencyActive;
      setEmergencyActive(nextActive);

      if (nextActive) {
        toast.success(t("sosTriggeredSuccess"));
        setEmergencyLogs((prev) => [
          {
            id: `log-${Date.now()}`,
            time: t("nowRecording"),
            type: t("sosTriggered", { notes: noteContent }),
            location: gpsLocation,
            status: "active",
            clipDuration: t("recordingProgress"),
          },
          ...prev,
        ]);
      } else {
        toast.info(t("sosCancelled"));
      }
    } catch {
      toast.error(t("sosTriggerError"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Banner */}
      <div className="db-card p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-s-4 border-s-red-500">
        <div>
          <div className="flex items-center gap-2">
            <span className="size-3 rounded-full bg-red-500 animate-ping" />
            <h1 className="text-xl font-bold text-foreground">{t("title")}</h1>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {t("subtitle")}
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-red-500/10 text-red-600 dark:text-red-400 text-xs font-mono font-bold shrink-0">
          <Radio className="size-4 animate-pulse" />
          <span>{t("connectedBadge")}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main SOS Trigger */}
        <div className="lg:col-span-7 db-card p-6 flex flex-col justify-between items-center text-center space-y-6">
          <div className="space-y-2">
            <div className="size-16 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center mx-auto mb-2">
              <ShieldAlert className="size-8" />
            </div>
            <h2 className="text-lg font-bold text-foreground">{t("sosCardTitle")}</h2>
            <p className="text-xs text-muted-foreground max-w-md mx-auto">
              {t("sosCardDesc")}
            </p>
          </div>

          {/* Form Inputs for API parameters */}
          <div className="w-full space-y-3 text-start bg-muted/30 p-4 rounded-xl border border-border">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label htmlFor="camera_id_input" className="text-[10px] font-bold text-foreground block mb-1">
                  {t("cameraIdLabel")}
                </label>
                <input
                  id="camera_id_input"
                  type="number"
                  min={1}
                  value={selectedCameraId}
                  onChange={(e) => setSelectedCameraId(Number(e.target.value))}
                  className="w-full px-3 py-1.5 rounded-lg border border-input bg-background text-xs font-mono focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div>
                <label htmlFor="police_station_select" className="text-[10px] font-bold text-foreground block mb-1">
                  {t("policeStationLabel")}
                </label>
                <select
                  id="police_station_select"
                  value={selectedStationId}
                  onChange={(e) => setSelectedStationId(Number(e.target.value))}
                  className="w-full px-3 py-1.5 rounded-lg border border-input bg-background text-xs focus:outline-none focus:ring-2 focus:ring-primary/20"
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
              <label htmlFor="sos_notes_input" className="text-[10px] font-bold text-foreground block mb-1">
                {t("notesLabel")}
              </label>
              <input
                id="sos_notes_input"
                type="text"
                value={sosNotes}
                placeholder={t("notesPlaceholder")}
                onChange={(e) => setSosNotes(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg border border-input bg-background text-xs focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          {/* SOS Trigger Button */}
          <button
            type="button"
            onClick={handleTriggerEmergency}
            disabled={loading}
            className={cn(
              "relative size-44 rounded-full font-bold transition-all transform active:scale-95 flex flex-col items-center justify-center gap-2 text-white shadow-2xl cursor-pointer select-none",
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
                <span className="text-sm font-bold">{t("cancelSos")}</span>
              </>
            ) : (
              <>
                <Radio className="size-10" />
                <span className="text-xl font-bold tracking-wider">{t("sendSos")}</span>
                <span className="text-[10px] opacity-80 font-mono">POST /emergency/sos</span>
              </>
            )}
          </button>

          {/* Location info */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono bg-muted/40 px-4 py-2 rounded-xl border border-border">
            <MapPin className="size-4 text-primary shrink-0" />
            <span>{t("currentLocation", { location: gpsLocation })}</span>
          </div>
        </div>

        {/* Options & Response actions */}
        <div className="lg:col-span-5 space-y-6">
          <div className="db-card p-5 space-y-4">
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
              <Building2 className="size-4 text-primary" />
              <span>{t("policeDirectory")}</span>
            </h3>
            <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
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
                    className="flex items-center gap-1 px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold hover:bg-emerald-500/20 transition-colors"
                  >
                    <PhoneCall className="size-3" />
                    <span>{station.phone || "122"}</span>
                  </a>
                </div>
              ))}
            </div>
          </div>

          <div className="db-card p-5 space-y-4">
            <h3 className="text-sm font-bold text-foreground">{t("actionSettings")}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {RESPONSE_ACTION_OPTIONS.map((opt) => {
                const Icon = opt.icon;
                const active = options[opt.key];
                return (
                  <button
                    key={opt.key}
                    type="button"
                    onClick={() => toggleOption(opt.key)}
                    className={cn(
                      "p-3 rounded-xl border text-start transition-all flex flex-col gap-1.5 cursor-pointer",
                      active
                        ? "border-primary bg-primary/8 text-foreground shadow-sm"
                        : "border-border bg-muted/20 text-muted-foreground hover:bg-muted/40"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <Icon className={cn("size-4", active ? "text-primary" : "text-muted-foreground")} />
                      <span className={cn("size-2 rounded-full", active ? "bg-primary" : "bg-muted-foreground/30")} />
                    </div>
                    <span className="text-xs font-bold">{t(opt.titleKey)}</span>
                    <span className="text-[10px] leading-tight text-muted-foreground">{t(opt.descKey)}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Emergency Logs Table */}
      <div className="db-card p-6 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h3 className="text-base font-bold text-foreground flex items-center gap-2">
            <History className="size-5 text-primary" />
            <span>{t("emergencyLogs")}</span>
          </h3>
          <span className="text-xs text-muted-foreground font-mono">
            {t("totalLogs", { count: emergencyLogs.length })}
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
                  {log.status === "active" ? t("statusActive") : t("statusResolved")}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
