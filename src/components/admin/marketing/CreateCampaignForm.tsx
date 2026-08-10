"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { Plus, Loader2, CheckCircle2 } from "lucide-react";
import { createCampaignApi } from "@/lib/api";

interface CreateCampaignFormProps {
  onSuccess: () => void;
}

export function CreateCampaignForm({ onSuccess }: CreateCampaignFormProps) {
  const t = useTranslations("Marketing");

  const [newCampaign, setNewCampaign] = useState({
    campaign_name: "",
    channel: "whatsapp",
    target_country: "Egypt",
    target_city: "Cairo",
    target_status: "",
    message_body: "",
  });
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage(null);

    const res = await createCampaignApi({
      campaign_name: newCampaign.campaign_name || "New Campaign",
      channel: newCampaign.channel,
      target_country: newCampaign.target_country,
      target_city: newCampaign.target_city,
      message_body: newCampaign.message_body,
    });

    if (res.data || res.status === 200 || res.status === 201) {
      setSuccessMessage(t("createCampaignHeader") + " — " + (res.data?.campaign_name || newCampaign.campaign_name));
      setNewCampaign({
        campaign_name: "",
        channel: "whatsapp",
        target_country: "Egypt",
        target_city: "Cairo",
        target_status: "",
        message_body: "",
      });
      onSuccess();
    }
    setLoading(false);
  };

  return (
    <div className="db-card p-6 border border-border/80 rounded-2xl space-y-5 bg-card max-w-2xl mx-auto shadow-sm">
      <div className="flex items-center gap-2 pb-3 border-b border-border">
        <div className="p-2 rounded-xl bg-primary/10 text-primary">
          <Plus className="size-5" />
        </div>
        <div>
          <h2 className="text-base font-bold text-foreground">{t("createCampaignHeader")}</h2>
          <p className="text-xs text-muted-foreground">POST /marketing/campaigns</p>
        </div>
      </div>

      {successMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="size-4" />
          <span>{successMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Campaign Name */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-foreground">{t("campaignName")} *</label>
          <input
            type="text"
            required
            value={newCampaign.campaign_name}
            onChange={(e) => setNewCampaign({ ...newCampaign, campaign_name: e.target.value })}
            placeholder={t("campaignNamePlaceholder")}
            className="w-full px-4 py-2.5 rounded-xl border border-input text-xs bg-background focus:ring-2 focus:ring-primary/20 focus:outline-none"
          />
        </div>

        {/* Channel Selection */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-foreground">{t("channel")} *</label>
          <select
            value={newCampaign.channel}
            onChange={(e) => setNewCampaign({ ...newCampaign, channel: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl border border-input text-xs bg-background font-medium focus:ring-2 focus:ring-primary/20 focus:outline-none cursor-pointer"
          >
            <option value="whatsapp">{t("channelWhatsApp")}</option>
            <option value="email">{t("channelEmail")}</option>
            <option value="sms">{t("channelSMS")}</option>
          </select>
        </div>

        {/* Target Country & City */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-foreground">{t("targetCountry")}</label>
            <input
              type="text"
              value={newCampaign.target_country}
              onChange={(e) => setNewCampaign({ ...newCampaign, target_country: e.target.value })}
              placeholder={t("targetCountryPlaceholder")}
              className="w-full px-4 py-2.5 rounded-xl border border-input text-xs bg-background focus:ring-2 focus:ring-primary/20 focus:outline-none"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-foreground">{t("targetCity")}</label>
            <input
              type="text"
              value={newCampaign.target_city}
              onChange={(e) => setNewCampaign({ ...newCampaign, target_city: e.target.value })}
              placeholder={t("targetCityPlaceholder")}
              className="w-full px-4 py-2.5 rounded-xl border border-input text-xs bg-background focus:ring-2 focus:ring-primary/20 focus:outline-none"
            />
          </div>
        </div>

        {/* Target User Status */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-foreground">{t("targetStatus")}</label>
          <input
            type="text"
            value={newCampaign.target_status}
            onChange={(e) => setNewCampaign({ ...newCampaign, target_status: e.target.value })}
            placeholder={t("targetStatusPlaceholder")}
            className="w-full px-4 py-2.5 rounded-xl border border-input text-xs bg-background focus:ring-2 focus:ring-primary/20 focus:outline-none"
          />
        </div>

        {/* Message Body */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-foreground">{t("messageBody")}</label>
          <textarea
            rows={3}
            value={newCampaign.message_body}
            onChange={(e) => setNewCampaign({ ...newCampaign, message_body: e.target.value })}
            placeholder={t("messageBodyPlaceholder")}
            className="w-full px-4 py-2.5 rounded-xl border border-input text-xs bg-background focus:ring-2 focus:ring-primary/20 focus:outline-none"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-bold text-xs hover:bg-primary/90 transition-all duration-200 shadow-md shadow-primary/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              <span>{t("creating")}</span>
            </>
          ) : (
            <span>{t("createCampaignSubmit")}</span>
          )}
        </button>
      </form>
    </div>
  );
}
