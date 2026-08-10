"use client";

import React, { useState, useEffect } from "react";
import { Megaphone, Send, Loader2, Image as ImageIcon, Plus } from "lucide-react";
import {
  listCampaignsApi,
  createCampaignApi,
  sendBulkMarketingApi,
  MarketingCampaignApiItem,
} from "@/lib/api";

export default function AdminMarketingPage() {
  // Campaigns state
  const [campaigns, setCampaigns] = useState<MarketingCampaignApiItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [newCampaign, setNewCampaign] = useState({
    campaign_name: "Summer Subscription Discount",
    channel: "whatsapp",
    target_country: "Egypt",
    target_city: "Cairo",
    message_body: "Get 20% off on yearly camera storage plans!",
  });
  const [campaignLoading, setCampaignLoading] = useState(false);

  // Bulk Dispatch state
  const [bulkSubject, setBulkSubject] = useState("العرض الصيفي الخاص — خصم 20% على باقات التخزين");
  const [bulkMessage, setBulkMessage] = useState("احصل على خصم 20% عند الاشتراك في باقة التخزين السحابي السنوية للكاميرات!");
  const [sendToAll, setSendToAll] = useState(true);
  const [bulkCountry, setBulkCountry] = useState("Egypt");
  const [bulkCity, setBulkCity] = useState("Cairo");
  const [bulkClientIds, setBulkClientIds] = useState("1, 2, 3");
  const [bulkImage, setBulkImage] = useState<File | null>(null);
  const [bulkLoading, setBulkLoading] = useState(false);
  const [bulkResult, setBulkResult] = useState<string | null>(null);

  const fetchCampaigns = async () => {
    setLoading(true);
    const res = await listCampaignsApi();
    if (res.data && Array.isArray(res.data)) {
      setCampaigns(res.data as MarketingCampaignApiItem[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const handleCreateCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    setCampaignLoading(true);
    await createCampaignApi(newCampaign);
    await fetchCampaigns();
    setCampaignLoading(false);
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
      setBulkResult("تم إرسال الحملة الجماعية عبر الواتساب والبريد الإلكتروني بنجاح! (POST /marketing/send-whatsapp-mail)");
    } else {
      setBulkResult(`نتيجة الإرسال: ${res.error || "تمت العملية (أو يتطلب صلاحية أدمن / Token)"}`);
    }
    setBulkLoading(false);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="db-card p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
            <Megaphone className="size-6 text-primary" />
            <span>وحدة التسويق والإرسال الجماعي (Marketing & Bulk Messaging)</span>
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            إدارة الحملات الإعلانية وإرسال رسائل الجماعية عبر الواتساب والبريد الإلكتروني (POST /marketing/send-whatsapp-mail)
          </p>
        </div>
      </div>

      {/* Bulk Dispatch Console */}
      <div className="db-card p-6 border-primary/40 space-y-4">
        <div className="flex items-center justify-between border-b border-[--db-border] pb-3">
          <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
            <Send className="size-4 text-primary" />
            <span>وحدة الإرسال الفوري للواتساب والبريد (Bulk WhatsApp & Email Dispatcher)</span>
          </h2>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 font-bold">
            POST /marketing/send-whatsapp-mail
          </span>
        </div>

        {bulkResult && (
          <div className="p-3 rounded-xl bg-primary/10 border border-primary/20 text-primary font-mono text-xs">
            {bulkResult}
          </div>
        )}

        <form onSubmit={handleSendBulkMarketing} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-foreground">عنوان الرسالة / البريد (subject *)</label>
            <input
              type="text"
              required
              value={bulkSubject}
              onChange={(e) => setBulkSubject(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border border-input text-xs bg-background"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-foreground">نوع النطاق (send_to_all)</label>
            <select
              value={sendToAll ? "1" : "0"}
              onChange={(e) => setSendToAll(e.target.value === "1")}
              className="w-full px-4 py-2 rounded-xl border border-input text-xs bg-background font-semibold"
            >
              <option value="1">جميع العملاء في القاعدة (send_to_all = 1)</option>
              <option value="0">عملاء محددين حسب IDs (send_to_all = 0)</option>
            </select>
          </div>

          {!sendToAll && (
            <div className="sm:col-span-2 space-y-1">
              <label className="text-xs font-bold text-foreground">معرفات العملاء (client_ids[])</label>
              <input
                type="text"
                placeholder="1, 2, 3"
                value={bulkClientIds}
                onChange={(e) => setBulkClientIds(e.target.value)}
                className="w-full px-4 py-2 rounded-xl border border-input text-xs font-mono bg-background"
              />
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-bold text-foreground">تصفية الدولة (country)</label>
            <input
              type="text"
              placeholder="Egypt"
              value={bulkCountry}
              onChange={(e) => setBulkCountry(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border border-input text-xs bg-background"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-foreground">تصفية المدينة (city)</label>
            <input
              type="text"
              placeholder="Cairo"
              value={bulkCity}
              onChange={(e) => setBulkCity(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border border-input text-xs bg-background"
            />
          </div>

          <div className="sm:col-span-2 space-y-1">
            <label className="text-xs font-bold text-foreground">محتوى الرسالة (message *)</label>
            <textarea
              rows={3}
              required
              value={bulkMessage}
              onChange={(e) => setBulkMessage(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border border-input text-xs bg-background"
            />
          </div>

          <div className="sm:col-span-2 space-y-1">
            <label className="text-xs font-bold text-foreground flex items-center gap-1">
              <ImageIcon className="size-3.5 text-primary" />
              <span>إرفاق صورة للحملة (image: max 10MB)</span>
            </label>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={(e) => setBulkImage(e.target.files?.[0] || null)}
              className="w-full text-xs file:me-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:bg-primary/10 file:text-primary file:font-bold hover:file:bg-primary/20 cursor-pointer"
            />
          </div>

          <button
            type="submit"
            disabled={bulkLoading}
            className="sm:col-span-2 py-3 rounded-xl bg-primary text-primary-foreground font-bold text-xs hover:bg-primary/90 transition-colors shadow-md shadow-primary/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {bulkLoading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <>
                <Send className="size-4" />
                <span>إرسال الحملة الجماعية عبر الواتساب والبريد</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* Campaigns Management */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Create Campaign Form */}
        <div className="lg:col-span-5 db-card p-6 space-y-4">
          <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
            <Plus className="size-4 text-primary" />
            <span>إنشاء حملة تسويقية جديدة</span>
          </h2>
          <form onSubmit={handleCreateCampaign} className="space-y-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-foreground">اسم الحملة</label>
              <input
                type="text"
                required
                value={newCampaign.campaign_name}
                onChange={(e) => setNewCampaign({ ...newCampaign, campaign_name: e.target.value })}
                className="w-full px-4 py-2 rounded-xl border border-input text-xs bg-background"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-foreground">القناة (channel)</label>
              <input
                type="text"
                required
                value={newCampaign.channel}
                onChange={(e) => setNewCampaign({ ...newCampaign, channel: e.target.value })}
                className="w-full px-4 py-2 rounded-xl border border-input text-xs bg-background"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="text-xs font-bold text-foreground">الدولة</label>
                <input
                  type="text"
                  value={newCampaign.target_country}
                  onChange={(e) => setNewCampaign({ ...newCampaign, target_country: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border border-input text-xs bg-background"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-foreground">المدينة</label>
                <input
                  type="text"
                  value={newCampaign.target_city}
                  onChange={(e) => setNewCampaign({ ...newCampaign, target_city: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border border-input text-xs bg-background"
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-foreground">نص الرسالة</label>
              <textarea
                rows={2}
                value={newCampaign.message_body}
                onChange={(e) => setNewCampaign({ ...newCampaign, message_body: e.target.value })}
                className="w-full px-4 py-2 rounded-xl border border-input text-xs bg-background"
              />
            </div>
            <button
              type="submit"
              disabled={campaignLoading}
              className="w-full py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-xs hover:bg-primary/90 transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              {campaignLoading ? <Loader2 className="size-4 animate-spin" /> : "إنشاء الحملة عبر API"}
            </button>
          </form>
        </div>

        {/* Campaign List */}
        <div className="lg:col-span-7 db-card p-6 space-y-4">
          <h2 className="text-sm font-bold text-foreground">الحملات المسجلة (GET /marketing/campaigns)</h2>
          {loading ? (
            <div className="p-8 text-center text-xs text-muted-foreground flex items-center justify-center gap-2">
              <Loader2 className="size-4 animate-spin text-primary" />
              <span>جاري تحميل الحملات...</span>
            </div>
          ) : campaigns.length === 0 ? (
            <div className="p-8 text-center text-xs text-muted-foreground">لا توجد حملات مسجلة حالياً</div>
          ) : (
            <div className="divide-y divide-[--db-border] border border-[--db-border] rounded-xl overflow-hidden">
              {campaigns.map((c, i) => (
                <div key={i} className="p-4 flex items-center justify-between text-xs hover:bg-[--db-hover] transition-colors">
                  <div>
                    <div className="font-bold text-foreground">{c.campaign_name}</div>
                    <div className="text-[10px] text-muted-foreground">
                      القناة: {c.channel} · {c.target_country || "الكل"} ({c.target_city || "الكل"})
                    </div>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary font-bold text-[10px]">
                    {c.status || "نشطة"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
