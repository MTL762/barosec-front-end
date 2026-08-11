"use client";

import { useEffect, useState } from "react";
import { HelpCircle, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { SupportTicketsSection } from "@/components/support/support-tickets-section";
import { getPublicArticlesApi, getPublicFaqsApi, SupportArticleApiItem, SupportFaqApiItem } from "@/lib/api";

export default function ClientSupportDashboardPage() {
  const t = useTranslations("Dashboard.Support");
  const [articles, setArticles] = useState<SupportArticleApiItem[]>([]);
  const [faqs, setFaqs] = useState<SupportFaqApiItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getPublicArticlesApi(), getPublicFaqsApi()])
      .then(([aRes, fRes]) => {
        if (aRes.data && Array.isArray(aRes.data)) setArticles(aRes.data as SupportArticleApiItem[]);
        if (fRes.data && Array.isArray(fRes.data)) setFaqs(fRes.data as SupportFaqApiItem[]);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="bg-background border border-border rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <HelpCircle className="size-6 text-primary" />
            <span>{t("title")}</span>
          </h1>
          <p className="text-xs text-muted-foreground mt-1">{t("subtitle")}</p>
        </div>
      </div>

      {loading ? (
        <div className="p-16 bg-background border border-border rounded-2xl flex flex-col items-center justify-center gap-3 text-muted-foreground shadow-sm">
          <Loader2 className="size-8 animate-spin text-primary" />
          <span className="text-sm font-bold">{t("loading")}</span>
        </div>
      ) : (
        <div className="bg-background border border-border rounded-2xl p-6 shadow-sm">
          <SupportTicketsSection initialArticles={articles} initialFaqs={faqs} />
        </div>
      )}
    </div>
  );
}
