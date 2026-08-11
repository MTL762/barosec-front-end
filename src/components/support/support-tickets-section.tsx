"use client";

import { useState, useEffect } from "react";
import {
  Send,
  MessageSquare,
  CheckCircle2,
  AlertCircle,
  Loader2,
  BookOpen,
  HelpCircle,
  Plus,
  Search,
  Phone,
  Mail,
  LifeBuoy,
  Clock,
  ChevronDown,
  ChevronUp,
  X,
  FileText,
} from "lucide-react";
import { useTranslations } from "next-intl";
import {
  getPublicArticlesApi,
  getPublicFaqsApi,
  createSupportTicketApi,
  listSupportTicketsApi,
} from "@/lib/api";
import { cn } from "@/lib/utils";

export function SupportTicketsSection({
  initialArticles = [],
  initialFaqs = [],
}: {
  initialArticles?: any[];
  initialFaqs?: any[];
}) {
  const t = useTranslations("Dashboard.Support");

  const [activeTab, setActiveTab] = useState<"tickets" | "faqs">("tickets");
  const [modalOpen, setModalOpen] = useState(false);

  const [articles, setArticles] = useState<any[]>(initialArticles);
  const [faqs, setFaqs] = useState<any[]>(initialFaqs);
  const [tickets, setTickets] = useState<any[]>([]);

  // Search filter inside FAQs
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedFaqIdx, setExpandedFaqIdx] = useState<number | null>(null);

  // Ticket Form state
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
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
      articles.length === 0 ? getPublicArticlesApi() : Promise.resolve({ data: null }),
      faqs.length === 0 ? getPublicFaqsApi() : Promise.resolve({ data: null }),
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
      setSuccess(t("ticketSuccess"));
      setSubject("");
      setMessage("");
      fetchSupportData();
      setTimeout(() => setModalOpen(false), 1500);
    } else {
      setError(res.error || t("ticketError"));
    }
    setLoading(false);
  };

  const filteredFaqs = faqs.filter((faq) => {
    if (!searchQuery) return true;
    const q = (faq.question || "").toLowerCase();
    const a = (faq.answer || "").toLowerCase();
    return q.includes(searchQuery.toLowerCase()) || a.includes(searchQuery.toLowerCase());
  });

  const filteredArticles = articles.filter((art) => {
    if (!searchQuery) return true;
    const title = (art.title || art.name || "").toLowerCase();
    return title.includes(searchQuery.toLowerCase());
  });

  return (
    <div className="space-y-6">
      {/* Navigation Tabs & Primary Action */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div className="flex items-center gap-2 p-1 bg-muted/30 rounded-xl border border-border shrink-0">
          <button
            onClick={() => setActiveTab("tickets")}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all",
              activeTab === "tickets"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <MessageSquare className="size-4 text-primary" />
            <span>{t("ticketsTab")}</span>
            <span className="px-1.5 py-0.5 rounded-full bg-primary/10 text-primary text-[10px]">
              {tickets.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("faqs")}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all",
              activeTab === "faqs"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <HelpCircle className="size-4 text-primary" />
            <span>{t("faqTab")}</span>
          </button>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-xs hover:bg-primary/90 transition-all shadow-md shadow-primary/20 flex items-center justify-center gap-2 cursor-pointer shrink-0"
        >
          <Plus className="size-4" />
          <span>{t("openNewTicket")}</span>
        </button>
      </div>

      {/* Main Grid: Content + Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Content Area */}
        <div className="lg:col-span-8 space-y-6">
          {activeTab === "tickets" ? (
            <div className="space-y-4">
              {tickets.length === 0 ? (
                <div className="p-12 border border-border rounded-2xl bg-background text-center space-y-3">
                  <LifeBuoy className="size-10 text-muted-foreground/40 mx-auto" />
                  <h3 className="text-base font-bold text-foreground">{t("noTickets")}</h3>
                  <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                    {t("noTicketsDesc")}
                  </p>
                  <button
                    onClick={() => setModalOpen(true)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground font-bold text-xs hover:bg-primary/90 transition-all mt-2"
                  >
                    <Plus className="size-4" />
                    <span>{t("openNewTicket")}</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {tickets.map((tItem, idx) => {
                    const isHigh = tItem.priority === "high";
                    const isMedium = tItem.priority === "medium";

                    return (
                      <div
                        key={idx}
                        className="p-4 sm:p-5 rounded-2xl border border-border bg-background hover:border-primary/40 transition-colors shadow-2xs space-y-2"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-2">
                            <span className="size-2 rounded-full bg-emerald-500" />
                            <h4 className="font-bold text-sm text-foreground">
                              {tItem.subject || "Support Ticket"}
                            </h4>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <span
                              className={cn(
                                "px-2 py-0.5 rounded-full text-[10px] font-bold",
                                isHigh
                                  ? "bg-red-500/10 text-red-600 dark:text-red-400"
                                  : isMedium
                                  ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                                  : "bg-blue-500/10 text-blue-600 dark:text-blue-400"
                              )}
                            >
                              {isHigh
                                ? t("priorityHigh")
                                : isMedium
                                ? t("priorityMedium")
                                : t("priorityLow")}
                            </span>

                            <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-[10px]">
                              {tItem.status || t("statusOpen")}
                            </span>
                          </div>
                        </div>

                        <p className="text-xs text-muted-foreground leading-relaxed ps-4">
                          {tItem.message}
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {/* FAQ Search */}
              <div className="relative">
                <Search className="absolute start-3.5 top-3 size-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder={t("searchFaqsPlaceholder")}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full ps-10 pe-4 py-2.5 rounded-xl border border-input bg-background text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* FAQs List */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <HelpCircle className="size-4 text-primary" />
                  <span>{t("faqsTitle")}</span>
                </h3>

                {filteredFaqs.length === 0 ? (
                  <p className="text-xs text-muted-foreground p-6 text-center border border-border rounded-xl">
                    {t("noFaqs")}
                  </p>
                ) : (
                  filteredFaqs.map((faq, idx) => {
                    const isOpen = expandedFaqIdx === idx;
                    return (
                      <div
                        key={idx}
                        className="border border-border rounded-xl bg-background overflow-hidden transition-all"
                      >
                        <button
                          onClick={() => setExpandedFaqIdx(isOpen ? null : idx)}
                          className="w-full p-4 flex items-center justify-between gap-3 text-start hover:bg-accent/40 transition-colors"
                        >
                          <span className="font-bold text-xs text-foreground">
                            {faq.question}
                          </span>
                          {isOpen ? (
                            <ChevronUp className="size-4 text-muted-foreground shrink-0" />
                          ) : (
                            <ChevronDown className="size-4 text-muted-foreground shrink-0" />
                          )}
                        </button>

                        {isOpen && (
                          <div className="p-4 pt-0 text-xs text-muted-foreground border-t border-border/50 bg-accent/10 leading-relaxed">
                            {faq.answer}
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>

              {/* Articles Grid */}
              <div className="space-y-3 pt-4 border-t border-border">
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <BookOpen className="size-4 text-primary" />
                  <span>{t("articlesTitle")}</span>
                </h3>

                {filteredArticles.length === 0 ? (
                  <p className="text-xs text-muted-foreground p-6 text-center border border-border rounded-xl">
                    {t("noArticles")}
                  </p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {filteredArticles.map((art, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-xl border border-border bg-background space-y-2 hover:border-primary/40 transition-colors"
                      >
                        <div className="flex items-center gap-2 text-[10px] font-bold text-primary">
                          <FileText className="size-3.5" />
                          <span>ARTICLE</span>
                        </div>
                        <h4 className="font-bold text-xs text-foreground line-clamp-2">
                          {art.title || art.name}
                        </h4>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar Panel: Direct Contact Details */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-5 border border-border rounded-2xl bg-background space-y-4 shadow-2xs">
            <div className="flex items-center gap-2 text-primary font-bold text-xs">
              <Clock className="size-4" />
              <span>{t("contactSupportTitle")}</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {t("contactSupportDesc")}
            </p>

            <div className="space-y-2.5 pt-2 border-t border-border/60 text-xs">
              <div className="flex items-center gap-2.5 font-semibold text-foreground">
                <div className="size-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <Phone className="size-3.5" />
                </div>
                <span>{t("phoneSupport")}</span>
              </div>

              <div className="flex items-center gap-2.5 font-semibold text-foreground">
                <div className="size-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <Mail className="size-3.5" />
                </div>
                <span>{t("emailSupport")}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* New Ticket Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-background border border-border rounded-3xl w-full max-w-lg shadow-2xl p-6 space-y-5 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div className="flex items-center gap-2.5">
                <div className="size-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
                  <MessageSquare className="size-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-foreground">{t("newTicketTitle")}</h3>
                  <p className="text-[11px] text-muted-foreground">{t("openModalDesc")}</p>
                </div>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1.5 text-muted-foreground hover:text-foreground rounded-lg hover:bg-accent transition-colors"
              >
                <X className="size-4" />
              </button>
            </div>

            {success && (
              <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold text-xs flex items-center gap-2">
                <CheckCircle2 className="size-4 shrink-0" />
                <span>{success}</span>
              </div>
            )}

            {error && (
              <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 font-bold text-xs flex items-center gap-2">
                <AlertCircle className="size-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleCreateTicket} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-foreground">{t("subject")}</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Cannot connect camera to Wi-Fi"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border border-input bg-background text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-foreground">{t("priority")}</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border border-input bg-background text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary font-medium"
                >
                  <option value="high">{t("priorityHigh")}</option>
                  <option value="medium">{t("priorityMedium")}</option>
                  <option value="low">{t("priorityLow")}</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-foreground">{t("message")}</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Describe your issue..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border border-input bg-background text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-border">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-input text-xs font-bold hover:bg-accent transition-colors"
                >
                  {t("cancel")}
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 rounded-xl bg-primary text-primary-foreground font-bold text-xs hover:bg-primary/90 transition-all shadow-md shadow-primary/20 flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="size-3.5 animate-spin" />
                      <span>{t("submitting")}</span>
                    </>
                  ) : (
                    <>
                      <Send className="size-3.5" />
                      <span>{t("sendTicket")}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
