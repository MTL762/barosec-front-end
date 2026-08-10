"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { Send, Loader2, Image as ImageIcon, CheckCircle2, XCircle, X } from "lucide-react";
import { sendBulkMarketingApi } from "@/lib/api";
import { cn } from "@/lib/utils";

export function BulkDispatchForm() {
  const t = useTranslations("Marketing");

  const [bulkSubject, setBulkSubject] = useState("العرض الصيفي الخاص — خصم 20% على باقات التخزين");
  const [bulkMessage, setBulkMessage] = useState(
    "احصل على خصم 20% عند الاشتراك في باقة التخزين السحابي السنوية للكاميرات!"
  );
  const [sendToAll, setSendToAll] = useState(true);
  const [bulkCountry, setBulkCountry] = useState("Egypt");
  const [bulkCity, setBulkCity] = useState("Cairo");
  const [bulkClientIds, setBulkClientIds] = useState("1, 2, 3");
  const [bulkImage, setBulkImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [bulkLoading, setBulkLoading] = useState(false);
  const [bulkResult, setBulkResult] = useState<{ success: boolean; message: string } | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setBulkImage(file);
    if (file) {
      const url = URL.createObjectURL(file);
      setImagePreview(url);
    } else {
      setImagePreview(null);
    }
  };

  const handleSendBulkMarketing = async (e: React.FormEvent) => {
    e.preventDefault();
    setBulkLoading(true);
    setBulkResult(null);

    const clientIdsArray = sendToAll
      ? undefined
      : bulkClientIds
          .split(",")
          .map((n) => Number(n.trim()))
          .filter((n) => !isNaN(n) && n > 0);

    const res = await sendBulkMarketingApi({
      send_to_all: sendToAll ? 1 : 0,
      subject: bulkSubject,
      message: bulkMessage,
      country: bulkCountry || undefined,
      city: bulkCity || undefined,
      client_ids: clientIdsArray,
      image: bulkImage,
    });

    if (res.data || res.status === 200) {
      setBulkResult({
        success: true,
        message: t("dispatchSuccess"),
      });
    } else {
      setBulkResult({
        success: false,
        message: `${t("dispatchFailed")}: ${res.error || "Requires Admin Token / Permissions"}`,
      });
    }
    setBulkLoading(false);
  };

  return (
    <div className="db-card p-6 border-2 border-primary/30 rounded-2xl space-y-6 bg-card shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-border gap-2">
        <div>
          <h2 className="text-base font-bold text-foreground flex items-center gap-2">
            <Send className="size-5 text-primary" />
            <span>{t("bulkDispatchHeader")}</span>
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            POST /marketing/send-whatsapp-mail
          </p>
        </div>
        <span className="self-start sm:self-auto text-[10px] font-mono px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-500/20">
          WhatsApp & Email API
        </span>
      </div>

      {bulkResult && (
        <div
          className={cn(
            "p-4 rounded-xl text-xs font-semibold flex items-center gap-2 border",
            bulkResult.success
              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
              : "bg-destructive/10 text-destructive border-destructive/20"
          )}
        >
          {bulkResult.success ? (
            <CheckCircle2 className="size-4 shrink-0" />
          ) : (
            <XCircle className="size-4 shrink-0" />
          )}
          <span>{bulkResult.message}</span>
        </div>
      )}

      <form onSubmit={handleSendBulkMarketing} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Subject */}
        <div className="sm:col-span-2 space-y-1.5">
          <label className="text-xs font-bold text-foreground">{t("bulkSubject")} *</label>
          <input
            type="text"
            required
            value={bulkSubject}
            onChange={(e) => setBulkSubject(e.target.value)}
            placeholder={t("bulkSubjectPlaceholder")}
            className="w-full px-4 py-2.5 rounded-xl border border-input text-xs bg-background focus:ring-2 focus:ring-primary/20 focus:outline-none"
          />
        </div>

        {/* Scope */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-foreground">{t("sendToAll")}</label>
          <select
            value={sendToAll ? "1" : "0"}
            onChange={(e) => setSendToAll(e.target.value === "1")}
            className="w-full px-4 py-2.5 rounded-xl border border-input text-xs bg-background font-semibold focus:ring-2 focus:ring-primary/20 focus:outline-none cursor-pointer"
          >
            <option value="1">{t("sendToAllYes")}</option>
            <option value="0">{t("sendToAllNo")}</option>
          </select>
        </div>

        {/* Client IDs */}
        {!sendToAll && (
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-foreground">{t("clientIds")}</label>
            <input
              type="text"
              placeholder={t("clientIdsPlaceholder")}
              value={bulkClientIds}
              onChange={(e) => setBulkClientIds(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-input text-xs font-mono bg-background focus:ring-2 focus:ring-primary/20 focus:outline-none"
            />
          </div>
        )}

        {/* Country */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-foreground">{t("targetCountry")}</label>
          <input
            type="text"
            placeholder={t("targetCountryPlaceholder")}
            value={bulkCountry}
            onChange={(e) => setBulkCountry(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-input text-xs bg-background focus:ring-2 focus:ring-primary/20 focus:outline-none"
          />
        </div>

        {/* City */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-foreground">{t("targetCity")}</label>
          <input
            type="text"
            placeholder={t("targetCityPlaceholder")}
            value={bulkCity}
            onChange={(e) => setBulkCity(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-input text-xs bg-background focus:ring-2 focus:ring-primary/20 focus:outline-none"
          />
        </div>

        {/* Message */}
        <div className="sm:col-span-2 space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-foreground">{t("messageBody")} *</label>
            <span className="text-[10px] text-muted-foreground font-mono">
              {bulkMessage.length} chars
            </span>
          </div>
          <textarea
            rows={4}
            required
            value={bulkMessage}
            onChange={(e) => setBulkMessage(e.target.value)}
            placeholder={t("messageBodyPlaceholder")}
            className="w-full px-4 py-2.5 rounded-xl border border-input text-xs bg-background focus:ring-2 focus:ring-primary/20 focus:outline-none"
          />
        </div>

        {/* Image Attachment */}
        <div className="sm:col-span-2 space-y-2">
          <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
            <ImageIcon className="size-4 text-primary" />
            <span>{t("attachImage")}</span>
          </label>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleImageChange}
              className="w-full text-xs file:me-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-primary/10 file:text-primary file:font-bold hover:file:bg-primary/20 cursor-pointer"
            />

            {imagePreview && (
              <div className="relative size-16 shrink-0 rounded-xl overflow-hidden border border-border group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => {
                    setBulkImage(null);
                    setImagePreview(null);
                  }}
                  className="absolute inset-0 bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="size-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={bulkLoading}
          className="sm:col-span-2 py-3.5 rounded-xl bg-primary text-primary-foreground font-bold text-xs hover:bg-primary/90 transition-all duration-200 shadow-md shadow-primary/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
        >
          {bulkLoading ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              <span>{t("sending")}</span>
            </>
          ) : (
            <>
              <Send className="size-4" />
              <span>{t("sendBulkSubmit")}</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
