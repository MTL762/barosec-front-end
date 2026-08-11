"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Camera,
  CheckCircle2,
  Loader2,
  QrCode,
  Wifi,
  Shield,
  Radio,
  Cpu,
} from "lucide-react";
import { useLocale } from "next-intl";
import { pairAddCameraApi } from "@/lib/api";

export default function AddCameraPage() {
  const t = useTranslations("Dashboard.Cameras");
  const locale = useLocale();
  const router = useRouter();

  const isRtl = locale === "ar";
  const BackIcon = isRtl ? ArrowRight : ArrowLeft;

  const [name, setName] = useState("");
  const [modelId, setModelId] = useState(1);
  const [serialNumber, setSerialNumber] = useState("");
  const [macAddress, setMacAddress] = useState("");
  const [mode, setMode] = useState("security");
  const [wifiNetwork, setWifiNetwork] = useState("Home_WiFi_5G");
  const [qrScanned, setQrScanned] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setSubmitting(true);
    setError(null);

    try {
      const res = await pairAddCameraApi({
        camera_model_id: modelId,
        name: name.trim(),
        serial_number: serialNumber || `CAM-${Date.now()}`,
        mac_address: macAddress || "00:1B:44:11:3A:B7",
        mode,
      });

      const addedData: any = res.data?.data || res.data;
      const newId = addedData?.id ? String(addedData.id) : "";

      router.push(newId ? `/dashboard/cameras?selected=${newId}` : "/dashboard/cameras");
    } catch (err: any) {
      console.error("Failed to add camera:", err);
      setError(err?.message || "Failed to pair camera. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

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
            {t("addCameraTitle")}
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            {t("addCameraSubtitle")}
          </p>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs font-medium">
          {error}
        </div>
      )}

      {/* Main Card Container */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-[--db-sidebar] border border-[--db-border] rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
          {/* Section 1: Basic Information */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-[--db-border] pb-3">
              <Cpu className="size-4 text-primary" />
              <h2 className="text-sm font-bold text-foreground">
                {t("deviceDetails")}
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
                  placeholder={t("cameraNamePlaceholder")}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-[--db-border] bg-[--db-card] text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground">
                  {t("serialNumber")}
                </label>
                <input
                  type="text"
                  placeholder="CAM-984210"
                  value={serialNumber}
                  onChange={(e) => setSerialNumber(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-[--db-border] bg-[--db-card] text-xs font-mono text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground">
                  {t("macAddress")}
                </label>
                <input
                  type="text"
                  placeholder="00:1B:44:11:3A:B7"
                  value={macAddress}
                  onChange={(e) => setMacAddress(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-[--db-border] bg-[--db-card] text-xs font-mono text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Mode & Model */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-[--db-border] pb-3">
              <Shield className="size-4 text-primary" />
              <h2 className="text-sm font-bold text-foreground">
                {t("configurationNetwork")}
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
            </div>
          </div>

          {/* Section 3: QR Code Verification */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-[--db-border] pb-3">
              <Radio className="size-4 text-primary" />
              <h2 className="text-sm font-bold text-foreground">
                {t("deviceVerification")}
              </h2>
            </div>

            <div className="border-2 border-dashed border-[--db-border] rounded-2xl p-6 sm:p-8 text-center space-y-4 bg-[--db-card]/50">
              {qrScanned ? (
                <div className="space-y-2 text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="size-12 mx-auto animate-bounce" />
                  <div className="text-sm font-bold">
                    {t("qrScannedSuccess")}
                  </div>
                  <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                    {t("readyToAdd")}
                  </p>
                </div>
              ) : (
                <>
                  <div className="size-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto text-primary">
                    <QrCode className="size-8" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-foreground">
                      {t("scanQrPrompt")}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
                      {t("scanQrDesc")}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setQrScanned(true)}
                    className="px-5 py-2 bg-primary text-primary-foreground text-xs font-bold rounded-xl hover:bg-primary/90 transition-all shadow-md shadow-primary/20"
                  >
                    {t("simulateQrScan")}
                  </button>
                </>
              )}
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
            disabled={submitting || !qrScanned || !name.trim()}
            className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold disabled:opacity-40 hover:bg-primary/90 transition-colors flex items-center gap-2 shadow-sm shadow-primary/20"
          >
            {submitting ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                <span>{t("saving")}</span>
              </>
            ) : (
              t("addCameraSubmit")
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
