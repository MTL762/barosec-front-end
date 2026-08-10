"use client";

import { useEffect, useState } from "react";
import { HelpCircle, Loader2 } from "lucide-react";
import { SupportTicketsSection } from "@/components/support/support-tickets-section";
import { getPublicArticlesApi, getPublicFaqsApi, SupportArticleApiItem, SupportFaqApiItem } from "@/lib/api";

export default function ClientSupportDashboardPage() {
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
      <div className="db-card p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
            <HelpCircle className="size-6 text-primary" />
            <span>مركز الدعم والتذاكر (Support Tickets & Knowledge Base)</span>
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            إرسال ومتابعة تذاكر الدعم الفني وتصفح الأسئلة الشائعة مباشرة عبر الـ APIs
          </p>
        </div>
      </div>

      {loading ? (
        <div className="p-16 db-card flex flex-col items-center justify-center gap-2 text-muted-foreground">
          <Loader2 className="size-6 animate-spin text-primary" />
          <span className="text-xs">جاري تحميل بيانات مركز الدعم والتذاكر...</span>
        </div>
      ) : (
        <div className="db-card p-4 sm:p-6 overflow-hidden">
          <SupportTicketsSection initialArticles={articles} initialFaqs={faqs} />
        </div>
      )}
    </div>
  );
}
