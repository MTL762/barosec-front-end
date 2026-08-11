"use client";

import { useState, useEffect } from "react";
import { CheckCircle2, FileText, Zap, Loader2, Download, AlertCircle, RefreshCw } from "lucide-react";
import { useTranslations } from "next-intl";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  getSubscriptionPlansApi,
  getActiveSubscriptionApi,
  subscribeToPlanApi,
  listInvoicesApi,
  PlanApiItem,
  SubscriptionApiItem,
  InvoiceApiItem,
} from "@/lib/api";

export default function BillingDashboardPage() {
  const t = useTranslations("Dashboard.Billing");

  const [plans, setPlans] = useState<PlanApiItem[]>([]);
  const [subscription, setSubscription] = useState<SubscriptionApiItem | null>(null);
  const [invoices, setInvoices] = useState<InvoiceApiItem[]>([]);

  const [loading, setLoading] = useState(true);
  const [subscribeLoading, setSubscribeLoading] = useState<number | string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [errorNotice, setErrorNotice] = useState<string | null>(null);

  useEffect(() => {
    fetchBillingData();
  }, []);

  const fetchBillingData = async () => {
    setLoading(true);
    setErrorNotice(null);

    try {
      const [pRes, sRes, iRes] = await Promise.all([
        getSubscriptionPlansApi(),
        getActiveSubscriptionApi(),
        listInvoicesApi(),
      ]);

      // Unpack plans
      const fetchedPlans = Array.isArray(pRes.data)
        ? pRes.data
        : Array.isArray((pRes.data as any)?.data)
        ? (pRes.data as any).data
        : Array.isArray((pRes.result as any)?.data)
        ? (pRes.result as any).data
        : [];
      setPlans(fetchedPlans as PlanApiItem[]);

      // Unpack subscription
      const subData = sRes.data?.data || sRes.data || (sRes.result as any)?.data || sRes.result || null;
      if (
        subData &&
        typeof subData === "object" &&
        !Array.isArray(subData) &&
        (subData.id || subData.plan_id || subData.plan_name || subData.status)
      ) {
        setSubscription(subData as SubscriptionApiItem);
      } else {
        setSubscription(null);
      }

      // Unpack invoices
      const fetchedInvoices = Array.isArray(iRes.data)
        ? iRes.data
        : Array.isArray((iRes.data as any)?.data)
        ? (iRes.data as any).data
        : Array.isArray((iRes.result as any)?.data)
        ? (iRes.result as any).data
        : [];
      setInvoices(fetchedInvoices as InvoiceApiItem[]);
    } catch (err: any) {
      console.error("[fetchBillingData] Error:", err);
      setErrorNotice(err?.message || t("loadFailed"));
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async (planId: number | string) => {
    setSubscribeLoading(planId);
    setNotice(null);
    setErrorNotice(null);

    const numericPlanId = typeof planId === "number" ? planId : parseInt(String(planId), 10) || 1;

    const { data, error } = await subscribeToPlanApi({
      plan_id: numericPlanId,
      payment_method: "credit_card",
    });

    if (data || !error) {
      setNotice(t("subscribeSuccess"));
      await fetchBillingData();
    } else {
      setErrorNotice(t("subscribeFailed", { error: error || "API Error" }));
    }
    setSubscribeLoading(null);
  };

  // Helper to format price
  const formatPlanPrice = (price?: number | string) => {
    if (price === undefined || price === null || price === "") return "0";
    if (typeof price === "number") return price.toString();
    return String(price).replace(/[^0-9.]/g, "") || String(price);
  };

  // Helper to parse features list
  const parseFeatures = (features?: any): string[] => {
    if (Array.isArray(features)) return features.map(String);
    if (typeof features === "string") {
      try {
        const parsed = JSON.parse(features);
        if (Array.isArray(parsed)) return parsed.map(String);
      } catch {
        return features.split(",").map((s) => s.trim());
      }
    }
    return [];
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Page Header */}
      <div className="bg-background border border-border rounded-2xl p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{t("title")}</h1>
          <p className="text-xs text-muted-foreground mt-1">{t("description")}</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchBillingData}
            disabled={loading}
            className={cn(buttonVariants({ variant: "outline", size: "sm" }), "rounded-xl text-xs gap-1.5 font-bold")}
          >
            <RefreshCw className={cn("size-3.5", loading && "animate-spin")} />
            <span>{t("refresh")}</span>
          </button>
        </div>
      </div>

      {notice && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="size-4 shrink-0" />
          <span>{notice}</span>
        </div>
      )}

      {errorNotice && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs font-bold flex items-center gap-2">
          <AlertCircle className="size-4 shrink-0" />
          <span>{errorNotice}</span>
        </div>
      )}

      {loading ? (
        <div className="p-16 bg-background border border-border rounded-2xl flex flex-col items-center justify-center gap-3 text-muted-foreground shadow-sm">
          <Loader2 className="size-8 animate-spin text-primary" />
          <span className="text-sm font-bold">{t("loading")}</span>
        </div>
      ) : (
        <>
          {/* Current Active Subscription */}
          <div className="bg-gradient-to-br from-primary/10 via-background to-background border border-primary/20 rounded-2xl p-6 sm:p-8 shadow-sm relative overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      "px-2.5 py-0.5 rounded-full text-xs font-bold flex items-center gap-1",
                      subscription && (subscription.status === "active" || subscription.status === "نشط" || !subscription.status)
                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    <CheckCircle2 className="size-3.5" />
                    {subscription
                      ? subscription.status === "active" || subscription.status === "نشط"
                        ? t("statusActive")
                        : String(subscription.status)
                      : t("notSubscribed")}
                  </span>
                  {subscription && (subscription.ends_at || (subscription as any).next_billing) && (
                    <span className="text-xs font-mono text-muted-foreground">
                      {t("nextRenewal", { date: String(subscription.ends_at || (subscription as any).next_billing) })}
                    </span>
                  )}
                </div>

                <h2 className="text-xl font-bold text-foreground">
                  {subscription
                    ? String(
                        subscription.plan?.name ||
                          (subscription as any).plan_name ||
                          (subscription as any).name ||
                          `Plan #${subscription.plan_id || subscription.id}`
                      )
                    : t("noActiveSub")}
                </h2>
                <p className="text-xs text-muted-foreground">
                  {subscription ? t("activeSubDesc") : t("noActiveSubDesc")}
                </p>
              </div>

              {subscription && (
                <div className="text-start sm:text-end shrink-0">
                  <div className="text-2xl font-bold text-foreground font-mono">
                    {subscription.plan?.price
                      ? `$${subscription.plan.price} / ${subscription.plan.billing_cycle || t("monthly")}`
                      : typeof (subscription as any).price === "string" || typeof (subscription as any).price === "number"
                      ? String((subscription as any).price)
                      : "—"}
                  </div>
                  <button
                    onClick={() => handleSubscribe(subscription.plan_id || subscription.id)}
                    disabled={subscribeLoading === (subscription.plan_id || subscription.id)}
                    className={cn(buttonVariants({ size: "sm" }), "mt-2 rounded-xl font-bold flex items-center gap-1.5")}
                  >
                    {subscribeLoading === (subscription.plan_id || subscription.id) && (
                      <Loader2 className="size-3.5 animate-spin" />
                    )}
                    <span>{t("renewSubscription")}</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Available Plans (GET /plans) */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <Zap className="size-5 text-primary" />
              <span>{t("availablePlansTitle")}</span>
            </h2>

            {plans.length === 0 ? (
              <div className="bg-background border border-border rounded-2xl p-8 text-center text-xs text-muted-foreground space-y-2">
                <AlertCircle className="size-8 mx-auto text-muted-foreground/50" />
                <p>{t("noPlansAvailable")}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {plans.map((plan) => {
                  const feats = parseFeatures(plan.features);
                  const isCurrent =
                    subscription &&
                    (String(subscription.plan_id) === String(plan.id) ||
                      (subscription.plan && String(subscription.plan.id) === String(plan.id)));
                  return (
                    <div
                      key={plan.id}
                      className={cn(
                        "bg-background border rounded-2xl p-6 flex flex-col justify-between space-y-6 transition-colors shadow-sm",
                        isCurrent ? "border-primary ring-1 ring-primary/20" : "border-border hover:border-primary/40"
                      )}
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="text-base font-bold text-foreground">{String(plan.name)}</h3>
                          {isCurrent && (
                            <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold">
                              {t("currentPlanBadge")}
                            </span>
                          )}
                        </div>

                        <div className="text-2xl font-bold font-mono text-foreground">
                          ${formatPlanPrice(plan.price)}{" "}
                          <span className="text-xs font-normal text-muted-foreground">
                            /{plan.billing_cycle || t("month")}
                          </span>
                        </div>

                        {feats.length > 0 && (
                          <ul className="space-y-2 text-xs text-muted-foreground pt-2">
                            {feats.map((f: string, idx: number) => (
                              <li key={idx} className="flex items-center gap-2">
                                <CheckCircle2 className="size-3.5 text-primary shrink-0" />
                                <span>{f}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>

                      <button
                        onClick={() => handleSubscribe(plan.id)}
                        disabled={subscribeLoading === plan.id}
                        className={cn(
                          buttonVariants({ variant: isCurrent ? "outline" : "default" }),
                          "w-full rounded-xl font-bold flex items-center justify-center gap-2"
                        )}
                      >
                        {subscribeLoading === plan.id ? (
                          <Loader2 className="size-4 animate-spin" />
                        ) : isCurrent ? (
                          t("renewPlan")
                        ) : (
                          t("subscribePlan")
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Invoices List (GET /billing/invoices) */}
          <div className="bg-background border border-border rounded-2xl p-6 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <FileText className="size-5 text-primary" />
              <span>{t("invoicesTitle")}</span>
            </h2>

            {invoices.length === 0 ? (
              <div className="p-8 text-center text-xs text-muted-foreground space-y-1">
                <FileText className="size-8 mx-auto text-muted-foreground/40 mb-2" />
                <p>{t("noInvoices")}</p>
              </div>
            ) : (
              <div className="divide-y divide-border rounded-xl border border-border overflow-hidden">
                {invoices.map((inv, i) => {
                  const invId = String(inv.invoice_number || inv.id || `INV-${i + 1}`);
                  const invDate = typeof inv.date === "string" ? inv.date : typeof inv.created_at === "string" ? inv.created_at : "—";
                  const invAmount = typeof inv.amount === "number" ? `$${inv.amount}` : typeof inv.amount === "string" ? inv.amount : "—";
                  const rawStatus = typeof inv.status === "string" ? inv.status : "paid";
                  const invStatus = rawStatus === "paid" || rawStatus === "مدفوعة" ? t("paid") : rawStatus;

                  return (
                    <div
                      key={inv.id ? String(inv.id) : i}
                      className="p-4 flex items-center justify-between gap-4 hover:bg-muted/20 transition-colors text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="size-4 text-muted-foreground" />
                        <div>
                          <div className="font-bold text-foreground font-mono">{invId}</div>
                          <div className="text-[10px] text-muted-foreground">{invDate}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <span className="font-mono font-bold text-foreground">{invAmount}</span>
                        <span
                          className={cn(
                            "px-2 py-0.5 rounded-full font-bold text-[10px]",
                            rawStatus === "paid" || rawStatus === "مدفوعة"
                              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                              : "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                          )}
                        >
                          {invStatus}
                        </span>
                        {inv.download_url && typeof inv.download_url === "string" && (
                          <a
                            href={inv.download_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground"
                            title={t("downloadInvoice")}
                          >
                            <Download className="size-3.5" />
                          </a>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
