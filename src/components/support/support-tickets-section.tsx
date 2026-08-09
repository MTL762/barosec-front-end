"use client";

import { useState, useEffect } from "react";
import { Send, MessageSquare, CheckCircle2, AlertCircle, Loader2, BookOpen, HelpCircle } from "lucide-react";
import { getPublicArticlesApi, getPublicFaqsApi, createSupportTicketApi, listSupportTicketsApi } from "@/lib/api";

export function SupportTicketsSection() {
  const [articles, setArticles] = useState<any[]>([]);
  const [faqs, setFaqs] = useState<any[]>([]);
  const [tickets, setTickets] = useState<any[]>([]);
  
  // Ticket Form
  const [subject, setSubject] = useState("Cannot connect camera to Wi-Fi");
  const [message, setMessage] = useState("My camera fails to pair during setup.");
  const [priority, setPriority] = useState("high");
  const [channel, setChannel] = useState("chat");

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSupportData();
  }, []);

  const fetchSupportData = async () => {
    const [aRes, fRes, tRes] = await Promise.all([
      getPublicArticlesApi(),
      getPublicFaqsApi(),
      listSupportTicketsApi(),
    ]);

    if (aRes.data && Array.isArray(aRes.data)) setArticles(aRes.data);
    if (fRes.data && Array.isArray(fRes.data)) setFaqs(fRes.data);
    if (tRes.data && Array.isArray(tRes.data)) setTickets(tRes.data);
  };

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(null);
    setError(null);

    const res = await createSupportTicketApi({
      subject,
      message,
      priority,
      channel,
    });

    if (res.data) {
      setSuccess("تم إنشاء تذكرة الدعم بنجاح عبر API! (POST /support/tickets)");
      fetchSupportData();
    } else {
      setError(res.error || "فشل إرسال التذكرة");
    }
    setLoading(false);
  };

  return (
    <div className="space-y-12 max-w-5xl mx-auto py-12 px-4">
      {/* Articles & FAQs Preview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-2xl p-6 space-y-4 shadow-sm">
          <h3 className="text-base font-bold text-ink flex items-center gap-2">
            <BookOpen className="size-5 text-primary" />
            <span>مقالات الدعم (GET /support/articles)</span>
          </h3>
          {articles.length === 0 ? (
            <p className="text-xs text-muted-foreground">لا توجد مقالات محملة من API حالياً.</p>
          ) : (
            <div className="space-y-2">
              {articles.map((art, idx) => (
                <div key={idx} className="p-3 rounded-xl border border-border bg-muted/20 text-xs font-bold text-ink">
                  {art.title || art.name}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-card border border-border rounded-2xl p-6 space-y-4 shadow-sm">
          <h3 className="text-base font-bold text-ink flex items-center gap-2">
            <HelpCircle className="size-5 text-primary" />
            <span>الأسئلة الشائعة (GET /support/faqs)</span>
          </h3>
          {faqs.length === 0 ? (
            <p className="text-xs text-muted-foreground">لا توجد أسئلة شائعة محملة من API حالياً.</p>
          ) : (
            <div className="space-y-2">
              {faqs.map((faq, idx) => (
                <div key={idx} className="p-3 rounded-xl border border-border bg-muted/20 text-xs">
                  <div className="font-bold text-ink">{faq.question}</div>
                  <div className="text-muted-foreground text-[10px] mt-1">{faq.answer}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Ticket Submission Form (POST /support/tickets) */}
      <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="space-y-1">
          <h3 className="text-lg font-bold text-ink flex items-center gap-2">
            <MessageSquare className="size-5 text-primary" />
            <span>تقديم تذكرة دعم فني جديدة (POST /support/tickets)</span>
          </h3>
          <p className="text-xs text-muted-foreground">
            إرسال طلب مباشر لفريق الدعم الفني لحل أي مشكلة تقنية بالكاميرا.
          </p>
        </div>

        {success && (
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold text-xs flex items-center gap-2">
            <CheckCircle2 className="size-4" />
            <span>{success}</span>
          </div>
        )}

        {error && (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 font-bold text-xs flex items-center gap-2">
            <AlertCircle className="size-4" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleCreateTicket} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-ink">موضوع التذكرة (subject)</label>
              <input
                type="text"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-input bg-background text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-ink">الأولوية (priority)</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-input bg-background text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="high">عالية (high)</option>
                <option value="medium">متوسطة (medium)</option>
                <option value="low">منخفضة (low)</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-ink">تفاصيل المشكلة (message)</label>
            <textarea
              required
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-input bg-background text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-bold text-sm hover:bg-primary/90 transition-colors shadow-md shadow-primary/20 flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="size-4 animate-spin" /> : <><Send className="size-4" /> إرسال التذكرة الآن</>}
          </button>
        </form>

        {/* Existing Tickets List (GET /support/tickets) */}
        {tickets.length > 0 && (
          <div className="pt-6 border-t border-border space-y-3">
            <h4 className="text-sm font-bold text-ink">التذاكر الحالية (GET /support/tickets):</h4>
            <div className="space-y-2">
              {tickets.map((t, idx) => (
                <div key={idx} className="p-3 rounded-xl border border-border bg-muted/20 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-ink">{t.subject}</div>
                    <div className="text-[10px] text-muted-foreground">{t.message}</div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary font-bold text-[10px]">
                    {t.status || "مفتوحة"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
