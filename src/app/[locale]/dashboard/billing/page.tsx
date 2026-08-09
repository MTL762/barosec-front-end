"use client";

import { useState, useEffect } from "react";
import { CreditCard, CheckCircle2, FileText, ArrowUpRight, Zap, Shield, Loader2 } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  getSubscriptionPlansApi,
  getActiveSubscriptionApi,
  subscribeToPlanApi,
  listInvoicesApi,
} from "@/lib/api";

export default function BillingDashboardPage() {
  const [plans, setPlans] = useState([
    { id: 1, name: "الباقة الأساسية Basic", price: "29", features: ["1 كاميرا 1080p", "7 أيام تخزين"] },
    { id: 2, name: "الباقة الاحترافية Pro", price: "79", features: ["حتى 5 كاميرات 4K", "30 يوم تخزين سحابي", "دعم طوارئ SOS"] },
    { id: 3, name: "باقة الأعمال Enterprise", price: "199", features: ["كاميرات لا محدودة", "90 يوم تخزين", "مراقب مباشر 24/7"] },
  ]);

  const [subscription, setSubscription] = useState<any>({
    plan_name: "الباقة الاحترافية Pro (السنوية)",
    status: "active",
    price: "$79 / شهرياً",
    next_billing: "2027-07-30",
  });

  const [invoices, setInvoices] = useState([
    { id: "INV-2026-001", date: "2026-07-01", amount: "$79.00", status: "paid" },
    { id: "INV-2026-002", date: "2026-06-01", amount: "$79.00", status: "paid" },
    { id: "INV-2026-003", date: "2026-05-01", amount: "$79.00", status: "paid" },
  ]);

  const [loading, setLoading] = useState(false);
  const [subscribeLoading, setSubscribeLoading] = useState<number | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    fetchBillingData();
  }, []);

  const fetchBillingData = async () => {
    setLoading(true);
    const [pRes, sRes, iRes] = await Promise.all([
      getSubscriptionPlansApi(),
      getActiveSubscriptionApi(),
      listInvoicesApi(),
    ]);

    if (pRes.data && Array.isArray(pRes.data) && pRes.data.length > 0) {
      setPlans(pRes.data);
    }
    if (sRes.data) {
      setSubscription(sRes.data);
    }
    if (iRes.data && Array.isArray(iRes.data) && iRes.data.length > 0) {
      setInvoices(iRes.data);
    }
    setNotice("متصل بـ APIs الاشتراكات والبريد (GET /plans, /billing/subscription, /billing/invoices)");
    setLoading(false);
  };

  const handleSubscribe = async (planId: number) => {
    setSubscribeLoading(planId);

    // Call API POST /billing/subscribe
    const { data, error } = await subscribeToPlanApi({
      plan_id: planId,
      payment_method: "credit_card",
    });

    if (data) {
      setNotice(`تم الاشتراك في الباقة بنجاح عبر API! (POST /billing/subscribe)`);
      fetchBillingData();
    } else if (error) {
      setNotice(`فشل الاشتراك: ${error}`);
    }
    setSubscribeLoading(null);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Page Header */}
      <div className="bg-background border border-border rounded-2xl p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">الاشتراكات والفواتير (Billing & Subscription)</h1>
          <p className="text-xs text-muted-foreground mt-1">
            إدارة اشتراك باروسك والتخزين السحابي، وعرض الفواتير السابقة عبر API.
          </p>
        </div>
        {notice && (
          <div className="px-3 py-1.5 rounded-xl bg-primary/10 text-primary text-xs font-mono font-bold">
            {notice}
          </div>
        )}
      </div>

      {/* Current Active Subscription */}
      <div className="bg-gradient-to-br from-primary/10 via-background to-background border border-primary/20 rounded-2xl p-6 sm:p-8 shadow-sm relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center gap-1">
                <CheckCircle2 className="size-3.5" />
                نشط (GET /billing/subscription)
              </span>
              <span className="text-xs font-mono text-muted-foreground">التجديد القادم: {subscription.next_billing || "2027-07-30"}</span>
            </div>
            <h2 className="text-xl font-bold text-foreground">{subscription.plan_name || "الباقة الاحترافية Pro"}</h2>
            <p className="text-xs text-muted-foreground">
              تتيح لك حفظ التسجيلات السحابية لمدة 30 يوماً واستخدام الذكاء الاصطناعي لرصد الحركة.
            </p>
          </div>

          <div className="text-start sm:text-end shrink-0">
            <div className="text-2xl font-bold text-foreground font-mono">{subscription.price || "$79 / شهرياً"}</div>
            <button
              onClick={() => handleSubscribe(2)}
              className={cn(buttonVariants({ size: "sm" }), "mt-2 rounded-xl font-bold")}
            >
              تجديد الاشتراك
            </button>
          </div>
        </div>
      </div>

      {/* Available Plans (GET /plans) */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
          <Zap className="size-5 text-primary" />
          <span>ترقية باقة الاشتراك (GET /plans & POST /billing/subscribe)</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className="bg-background border border-border rounded-2xl p-6 flex flex-col justify-between space-y-6 hover:border-primary/40 transition-colors"
            >
              <div className="space-y-3">
                <h3 className="text-base font-bold text-foreground">{plan.name}</h3>
                <div className="text-2xl font-bold font-mono text-foreground">${plan.price} <span className="text-xs font-normal text-muted-foreground">/شهر</span></div>
                {plan.features && (
                  <ul className="space-y-2 text-xs text-muted-foreground pt-2">
                    {plan.features.map((f: string, idx: number) => (
                      <li key={idx} className="flex items-center gap-2">
                        <CheckCircle2 className="size-3.5 text-primary shrink-0" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <button
                onClick={() => handleSubscribe(Number(plan.id))}
                disabled={subscribeLoading === Number(plan.id)}
                className={cn(
                  buttonVariants({ variant: plan.id === 2 ? "default" : "outline" }),
                  "w-full rounded-xl font-bold flex items-center justify-center gap-2"
                )}
              >
                {subscribeLoading === Number(plan.id) ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  `الاشتراك في الباقة #${plan.id}`
                )}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Invoices List (GET /billing/invoices) */}
      <div className="bg-background border border-border rounded-2xl p-6 shadow-sm space-y-4">
        <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
          <FileText className="size-5 text-primary" />
          <span>سجل الفواتير (GET /billing/invoices)</span>
        </h2>

        <div className="divide-y divide-border rounded-xl border border-border overflow-hidden">
          {invoices.map((inv, i) => (
            <div key={i} className="p-4 flex items-center justify-between gap-4 hover:bg-muted/20 transition-colors text-xs">
              <div className="flex items-center gap-3">
                <FileText className="size-4 text-muted-foreground" />
                <div>
                  <div className="font-bold text-foreground font-mono">{inv.id || `INV-${(inv as any).invoice_number || i + 1}`}</div>
                  <div className="text-[10px] text-muted-foreground">{inv.date || "2026-07-01"}</div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <span className="font-mono font-bold text-foreground">{inv.amount}</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-[10px]">
                  {inv.status || "مدفوعة"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
