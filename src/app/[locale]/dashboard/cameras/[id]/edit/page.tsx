"use client";

import { useState, useEffect, use } from "react";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Camera,
  Loader2,
  Lock,
  Unlock,
  Shield,
  Wifi,
  Cpu,
  Save,
} from "lucide-react";
import { useLocale } from "next-intl";
import { getCameraDetailsApi, updateCameraSettingsApi } from "@/lib/api";

interface EditCameraPageProps {
  params: Promise<{ id: string }>;
}

export default function EditCameraPage({ params }: EditCameraPageProps) {
  const { id } = use(params);
  const t = useTranslations("Dashboard.Cameras");
  const locale = useLocale();
  const router = useRouter();

  const isRtl = locale === "ar";
  const BackIcon = isRtl ? ArrowRight : ArrowLeft;

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [mode, setMode] = useState("security");
  const [isLocked, setIsLocked] = useState(false);
  const [serialNumber, setSerialNumber] = useState("");
  const [macAddress, setMacAddress] = useState("");
  const [wifiNetwork, setWifiNetwork] = useState("Home_WiFi_5G");

  useEffect(() => {
    fetchCameraDetails();
  }, [id]);

  const fetchCameraDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getCameraDetailsApi(id);
      const data: any = res.data?.data || res.data;

      if (data) {
        setName(data.name || `Camera #${id}`);
        setMode(data.mode || "security");
        setIsLocked(Boolean(data.is_locked));
        setSerialNumber(data.serial_number || `CAM-${id}`);
        setMacAddress(data.mac_address || "00:1B:44:11:3A:B7");
        setWifiNetwork(data.wifi_name || data.wifi || "Home_WiFi_5G");
      } else {
        setError(t("cameraNotFound"));
      }
    } catch (err: any) {
      console.error("Failed to fetch camera details:", err);
      // Fallback state if API returns 404 or fails
      setName(`Cam #${id}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setSubmitting(true);
    setError(null);

    try {
      await updateCameraSettingsApi(id, {
        name: name.trim(),
        mode,
        is_locked: isLocked,
      });

      router.push(`/dashboard/cameras?selected=${id}`);
    } catch (err: any) {
      console.error("Failed to update camera:", err);
      setError(err?.message || "Failed to update camera. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-20 text-center flex flex-col items-center justify-center gap-3 text-muted-foreground">
        <Loader2 className="size-8 animate-spin text-primary" />
        <span className="text-xs font-medium">{t("loadingCameraDetails")}</span>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Top Header & Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link
            href="/dashboard/cameras"
            className="inline-flex items-center gap-2 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors mb-2"
          >
            <BackIcon className="size-4" />
            <span>{t("backToCameras")}</span>
          </Link>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground flex items-center gap-2.5">
            <div className="size-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <Camera className="size-5" />
            </div>
            {t("editCameraTitle")}
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            {t("editCameraSubtitle")}
          </p>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs font-medium">
          {error}
        </div>
      )}

      {/* Edit Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-[--db-sidebar] border border-[--db-border] rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
          {/* Section 1: Basic Information */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-[--db-border] pb-3">
              <Cpu className="size-4 text-primary" />
              <h2 className="text-sm font-bold text-foreground">
                {t("deviceIdentifiers")}
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-bold text-foreground">
                  {t("cameraName")} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-[--db-border] bg-[--db-card] text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground">
                  {t("serialNumber")}
                </label>
                <input
                  type="text"
                  readOnly
                  value={serialNumber}
                  className="w-full px-3.5 py-2 rounded-xl border border-[--db-border] bg-muted/40 text-xs font-mono text-muted-foreground cursor-not-allowed"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground">
                  {t("macAddress")}
                </label>
                <input
                  type="text"
                  readOnly
                  value={macAddress}
                  className="w-full px-3.5 py-2 rounded-xl border border-[--db-border] bg-muted/40 text-xs font-mono text-muted-foreground cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Mode & Privacy Toggle */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-[--db-border] pb-3">
              <Shield className="size-4 text-primary" />
              <h2 className="text-sm font-bold text-foreground">
                {t("operationalControls")}
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground">
                  {t("mode")}
                </label>
                <select
                  value={mode}
                  onChange={(e) => setMode(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-[--db-border] bg-[--db-card] text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="security">{t("modeSecurity")}</option>
                  <option value="sleep">{t("modeSleep")}</option>
                  <option value="privacy">{t("modePrivacy")}</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground flex items-center gap-1">
                  <Wifi className="size-3.5 text-primary" />
                  {t("wifiNetwork")}
                </label>
                <select
                  value={wifiNetwork}
                  onChange={(e) => setWifiNetwork(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-[--db-border] bg-[--db-card] text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="Home_WiFi_5G">Home_WiFi_5G (5GHz)</option>
                  <option value="Home_WiFi_2.4G">Home_WiFi_2.4G (2.4GHz)</option>
                  <option value="Barosic_Security_Net">
                    Barosic_Security_Net
                  </option>
                </select>
              </div>

              <div className="sm:col-span-2 pt-2">
                <div className="flex items-center justify-between p-4 rounded-xl border border-[--db-border] bg-[--db-card]">
                  <div className="flex items-center gap-3">
                    <div
                      className={`size-10 rounded-xl flex items-center justify-center ${
                        isLocked
                          ? "bg-amber-500/10 text-amber-500"
                          : "bg-emerald-500/10 text-emerald-500"
                      }`}
                    >
                      {isLocked ? (
                        <Lock className="size-5" />
                      ) : (
                        <Unlock className="size-5" />
                      )}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-foreground">
                        {t("privacyMode")}
                      </div>
                      <p className="text-[11px] text-muted-foreground mt-0.5">
                        {t("privacyDesc")}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsLocked(!isLocked)}
                    className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      isLocked
                        ? "bg-amber-500/15 text-amber-600 dark:text-amber-400 hover:bg-amber-500/25"
                        : "bg-muted text-foreground hover:bg-accent"
                    }`}
                  >
                    {isLocked ? t("unlock") : t("lockPrivacy")}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3">
          <Link
            href="/dashboard/cameras"
            className="px-6 py-2.5 rounded-xl border border-[--db-border] text-xs font-bold text-foreground hover:bg-accent transition-colors"
          >
            {t("cancel")}
          </Link>
          <button
            type="submit"
            disabled={submitting || !name.trim()}
            className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold disabled:opacity-40 hover:bg-primary/90 transition-colors flex items-center gap-2 shadow-sm shadow-primary/20"
          >
            {submitting ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                <span>{t("saving")}</span>
              </>
            ) : (
              <>
                <Save className="size-4" />
                <span>{t("saveChanges")}</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
