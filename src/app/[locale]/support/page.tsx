import { setRequestLocale, getTranslations } from "next-intl/server";
import { SiteHeader } from "@/components/secure/site-header";
import { ScrollProgress } from "@/components/secure/scroll-progress";
import { SiteFooter } from "@/components/secure/site-footer";
import {
  Search,
  Wrench,
  CreditCard,
  AlertTriangle,
  RefreshCcw,
  MessageSquare,
  Phone,
  Mail,
  ArrowUpRight,
  Wifi,
  ShieldCheck,
  Camera,
  Check,
  Zap,
} from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { SupportTicketsSection } from "@/components/support/support-tickets-section";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Support" });
  return {
    title: `${t("title")} | Barosec Support`,
    description: t("subtitle"),
  };
}

export default async function SupportPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Support");

  return (
    <>
      <ScrollProgress />
      <SiteHeader />
      <main className="flex-1 bg-background">
        {/* Search Header */}
        <section className="relative overflow-hidden border-b border-border bg-gradient-to-b from-primary/5 to-background py-16 sm:py-24">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,var(--hero-glow),transparent_55%)]" />
          <div className="mx-auto max-w-4xl px-4 sm:px-6 text-center space-y-6">

            {/* Real-time Status Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/5 px-3.5 py-1 text-xs font-medium text-emerald-600 dark:text-emerald-400 shadow-sm animate-fade-in">
              <span className="relative flex size-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75"></span>
                <span className="relative inline-flex size-2 rounded-full bg-emerald-500"></span>
              </span>
              <span>
                {locale === "ar"
                  ? "جميع الأنظمة نشطة · خطوط الدعم متصلة الآن"
                  : "All Systems Operational · Support Lines Active"}
              </span>
            </div>

            <h1 className="font-heading text-4xl font-extrabold tracking-tight text-ink sm:text-5xl leading-tight">
              {t("title")}
            </h1>
            <p className="mx-auto max-w-xl text-base sm:text-lg text-muted-foreground leading-relaxed">
              {t("subtitle")}
            </p>

            {/* Premium Search Bar with Glassmorphic feel */}
            <div className="mx-auto max-w-xl relative group mt-4">
              <div className="absolute inset-0 -z-10 rounded-full bg-primary/5 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-all duration-300 blur-md" />
              <Search className="absolute top-3.5 start-4.5 size-5 text-muted-foreground/80 transition-colors group-focus-within:text-primary" />
              <input
                type="text"
                placeholder={t("searchPlaceholder")}
                className="w-full rounded-full border border-border bg-card/70 backdrop-blur-md py-3.5 pe-4 ps-12 text-sm text-ink placeholder:text-muted-foreground/60 shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all"
              />
              <kbd className="hidden sm:inline-flex absolute top-3 end-4 h-6 select-none items-center gap-1 rounded border border-border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground/80 pointer-events-none">
                {locale === "ar" ? "بحث" : "/"}
              </kbd>
            </div>
          </div>
        </section>

        {/* Categories Section - Asymmetric Bento Grid */}
        <section className="py-16 sm:py-24">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="grid gap-6 md:grid-cols-3">

              {/* Card 1: Setup & Install (Spans 2 columns on desktop) */}
              <div className="group relative flex flex-col sm:flex-row justify-between gap-6 rounded-2xl border border-border bg-card p-6 md:p-8 transition-all duration-300 hover:-translate-y-1 hover:border-primary/45 hover:shadow-md cursor-pointer md:col-span-2 overflow-hidden">
                <div className="flex flex-col justify-between flex-1 space-y-4">
                  <div>
                    <div className="size-11 rounded-xl flex items-center justify-center mb-4 text-teal-500 bg-teal-500/10 transition-all duration-300 group-hover:scale-105 group-hover:rotate-3">
                      <Wrench className="size-5" />
                    </div>
                    <h3 className="font-heading text-lg font-bold text-ink flex items-center gap-2 group-hover:text-primary transition-colors">
                      {t("categories.setup")}
                      <ArrowUpRight className="size-4 opacity-0 transition-opacity group-hover:opacity-100 text-primary" />
                    </h3>
                    <p className="mt-2 text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-sm">
                      {locale === "ar"
                        ? "أدلة خطوة بخطوة لتثبيت الكاميرات، وتكوين اتصال لاسلكي آمن، ومزامنتها مع تطبيق الهاتف المحمول."
                        : "Step-by-step guides to mount your cameras, configure secure wireless connection, and sync with the mobile app."}
                    </p>
                  </div>
                  <div className="text-[11px] font-semibold text-primary/80 flex items-center gap-1">
                    {locale === "ar" ? "ابدأ الإعداد الذاتي ←" : "Start self-guided setup ←"}
                  </div>
                </div>

                {/* Device sync status widget simulator */}
                <div className="relative w-36 h-48 rounded-xl border border-border/80 bg-background/50 shadow-inner flex flex-col justify-between p-3 overflow-hidden self-center sm:self-auto shrink-0 select-none">
                  <div className="flex items-center justify-between text-[7px] font-mono text-muted-foreground/60">
                    <span>BAROSEC CAM</span>
                    <span className="flex items-center gap-0.5 text-emerald-500">
                      <span className="size-1 rounded-full bg-emerald-500 animate-pulse" /> LIVE
                    </span>
                  </div>

                  <div className="relative flex items-center justify-center my-auto">
                    {/* Ring Pulses */}
                    <div className="absolute size-10 rounded-full border border-primary/20 animate-ping opacity-70" />
                    <div className="absolute size-16 rounded-full border border-primary/10 animate-ping [animation-delay:1s] opacity-50" />

                    <div className="relative z-10 size-9 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                      <Camera className="size-4.5" />
                    </div>
                  </div>

                  <div className="rounded bg-emerald-500/10 border border-emerald-500/20 py-1 px-1.5 flex items-center gap-1 justify-center">
                    <Check className="size-3 text-emerald-500" />
                    <span className="text-[7.5px] font-bold text-emerald-600 dark:text-emerald-400 font-mono tracking-tight">
                      {locale === "ar" ? "اتصال آمن" : "SECURE SYNC"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Card 2: Troubleshooting (Spans 1 column) */}
              <div className="group relative flex flex-col justify-between gap-6 rounded-2xl border border-border bg-card p-6 md:p-8 transition-all duration-300 hover:-translate-y-1 hover:border-primary/45 hover:shadow-md cursor-pointer md:col-span-1 overflow-hidden">
                <div className="space-y-4">
                  <div className="size-11 rounded-xl flex items-center justify-center text-amber-500 bg-amber-500/10 transition-all duration-300 group-hover:scale-105 group-hover:rotate-3">
                    <AlertTriangle className="size-5" />
                  </div>
                  <div>
                    <h3 className="font-heading text-lg font-bold text-ink flex items-center gap-2 group-hover:text-primary transition-colors">
                      {t("categories.trouble")}
                      <ArrowUpRight className="size-4 opacity-0 transition-opacity group-hover:opacity-100 text-primary" />
                    </h3>
                    <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                      {locale === "ar"
                        ? "استكشف أخطاء الشبكة وإصلاحها، وحسّن قوة إشارة الكاميرا، واختبر أداء البطارية، وأعد ضبط أجهزتك."
                        : "Resolve network issues, optimize camera signal strength, test battery performance, and reset your devices."}
                    </p>
                  </div>
                </div>

                {/* Diagnostics checklist widget */}
                <div className="rounded-xl border border-border/80 bg-background/50 p-3 space-y-2 select-none">
                  <div className="flex items-center justify-between text-[8px] font-mono text-muted-foreground">
                    <span>{locale === "ar" ? "الفحص الذكي" : "SMART CHECK"}</span>
                    <span className="text-[7px] bg-amber-500/10 text-amber-600 border border-amber-500/20 px-1 rounded">100% OK</span>
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[9px]">
                      <span className="text-muted-foreground flex items-center gap-1 font-mono">
                        <Wifi className="size-3 text-emerald-500" /> WiFi Signal
                      </span>
                      <span className="font-bold text-emerald-500 font-mono">94%</span>
                    </div>
                    <div className="flex items-center justify-between text-[9px]">
                      <span className="text-muted-foreground flex items-center gap-1 font-mono">
                        <ShieldCheck className="size-3 text-emerald-500" /> SSL Cloud
                      </span>
                      <span className="font-bold text-emerald-500 font-mono">ACTIVE</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 3: Billing & Subscriptions (Spans 1 column) */}
              <div className="group relative flex flex-col justify-between gap-6 rounded-2xl border border-border bg-card p-6 md:p-8 transition-all duration-300 hover:-translate-y-1 hover:border-primary/45 hover:shadow-md cursor-pointer md:col-span-1 overflow-hidden">
                <div className="space-y-4">
                  <div className="size-11 rounded-xl flex items-center justify-center text-blue-500 bg-blue-500/10 transition-all duration-300 group-hover:scale-105 group-hover:rotate-3">
                    <CreditCard className="size-5" />
                  </div>
                  <div>
                    <h3 className="font-heading text-lg font-bold text-ink flex items-center gap-2 group-hover:text-primary transition-colors">
                      {t("categories.billing")}
                      <ArrowUpRight className="size-4 opacity-0 transition-opacity group-hover:opacity-100 text-primary" />
                    </h3>
                    <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                      {locale === "ar"
                        ? "إدارة خطط اشتراكك النشطة، وتحديث طرق الدفع، والوصول إلى الفواتير، وترقية الميزات."
                        : "Manage your active subscription plans, update billing methods, access invoices, and upgrade features."}
                    </p>
                  </div>
                </div>

                {/* Sub Card mockup */}
                <div className="relative aspect-[1.58/1] w-full max-w-[160px] mx-auto rounded-xl bg-gradient-to-br from-primary/90 to-primary text-primary-foreground p-3 flex flex-col justify-between shadow-md shadow-primary/10 overflow-hidden select-none group-hover:scale-[1.02] transition-transform">
                  <div className="absolute -right-6 -bottom-6 size-20 rounded-full bg-white/5" />
                  <div className="flex justify-between items-start">
                    <span className="text-[7.5px] font-extrabold tracking-wider font-mono">BAROSEC</span>
                    <span className="size-4.5 rounded-sm bg-amber-400/80 flex items-center justify-center text-[7px]" />
                  </div>
                  <div>
                    <div className="text-[8px] opacity-75">{locale === "ar" ? "اشتراك نشط" : "ACTIVE PLAN"}</div>
                    <div className="text-[10px] font-bold tracking-wide font-mono">SECURE PLUS</div>
                  </div>
                </div>
              </div>

              {/* Card 4: Warranty & Returns (Spans 2 columns on desktop) */}
              <div className="group relative flex flex-col sm:flex-row justify-between gap-6 rounded-2xl border border-border bg-card p-6 md:p-8 transition-all duration-300 hover:-translate-y-1 hover:border-primary/45 hover:shadow-md cursor-pointer md:col-span-2 overflow-hidden">
                <div className="flex flex-col justify-between flex-1 space-y-4">
                  <div>
                    <div className="size-11 rounded-xl flex items-center justify-center mb-4 text-purple-500 bg-purple-500/10 transition-all duration-300 group-hover:scale-105 group-hover:rotate-3">
                      <RefreshCcw className="size-5" />
                    </div>
                    <h3 className="font-heading text-lg font-bold text-ink flex items-center gap-2 group-hover:text-primary transition-colors">
                      {t("categories.warranty")}
                      <ArrowUpRight className="size-4 opacity-0 transition-opacity group-hover:opacity-100 text-primary" />
                    </h3>
                    <p className="mt-2 text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-sm">
                      {locale === "ar"
                        ? "تعرف على ضمان الأجهزة لمدة عامين، وحماية استبدال الكاميرا في حالة السرقة مدى الحياة، وسياسات الإرجاع."
                        : "Read about our 2-year hardware warranty, lifetime theft replacement protection, and standard return policies."}
                    </p>
                  </div>
                  <div className="text-[11px] font-semibold text-primary/80 flex items-center gap-1">
                    {locale === "ar" ? "الضمان والاستبدال ←" : "Warranty & returns policy ←"}
                  </div>
                </div>

                {/* Guarantee seal visual */}
                <div className="relative size-32 rounded-full border border-dashed border-primary/20 bg-primary/5 flex items-center justify-center self-center sm:self-auto shrink-0 select-none group-hover:rotate-6 transition-transform duration-500">
                  <div className="absolute inset-2 rounded-full border border-primary/10 bg-card flex flex-col items-center justify-center text-center p-2">
                    <ShieldCheck className="size-6 text-primary mb-1 animate-pulse" />
                    <span className="text-[8px] font-extrabold tracking-wider text-ink font-mono leading-none">
                      {locale === "ar" ? "حماية كاملة" : "SECURE COV"}
                    </span>
                    <span className="text-[7px] text-muted-foreground mt-0.5">
                      {locale === "ar" ? "ضمان ممتد" : "EXTENDED"}
                    </span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Contact Support Channels */}
        <section id="contact" className="py-16 sm:py-24 bg-card border-t border-border">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">

            <div className="text-center space-y-3 mb-16">
              <h2 className="font-heading text-2xl font-bold sm:text-3xl text-ink tracking-tight">
                {t("contactTitle")}
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground max-w-md mx-auto">
                {t("contactSubtitle")}
              </p>
            </div>

            {/* Split layout: Primary call console + stacked secondary options */}
            <div className="grid gap-8 lg:grid-cols-5 items-stretch">

              {/* Call Hotline Console - Spans 3 columns on large screens */}
              <div className="group relative flex flex-col justify-between p-6 sm:p-8 rounded-2xl border border-primary/30 bg-background shadow-md shadow-primary/5 transition-all duration-300 hover:border-primary hover:shadow-lg lg:col-span-3">
                <span className="absolute -top-3 start-6 px-3 py-0.5 rounded-full bg-primary text-[10px] font-semibold text-primary-foreground tracking-wider uppercase">
                  {locale === "ar" ? "موصى به" : "Recommended"}
                </span>

                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary transition-transform duration-300 group-hover:scale-105 shrink-0">
                      <Phone className="size-5.5" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-heading text-xl font-bold text-ink">{t("call")}</h3>
                      <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                        {t("callDesc")}
                      </p>
                    </div>
                  </div>

                  {/* Active Operator Status dashboard */}
                  <div className="rounded-xl border border-border bg-card p-4 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      {/* Avatar group simulation */}
                      <div className="flex -space-x-2 rtl:space-x-reverse">
                        <div className="size-8 rounded-full bg-teal-500 border-2 border-card flex items-center justify-center text-[10px] font-bold text-white">MA</div>
                        <div className="size-8 rounded-full bg-blue-500 border-2 border-card flex items-center justify-center text-[10px] font-bold text-white">KB</div>
                        <div className="size-8 rounded-full bg-purple-500 border-2 border-card flex items-center justify-center text-[10px] font-bold text-white">RY</div>
                      </div>
                      <div className="space-y-0.5">
                        <div className="text-[11px] font-bold text-ink">
                          {locale === "ar" ? "خبراء الأمن متصلون" : "Security Experts Online"}
                        </div>
                        <div className="text-[9.5px] text-muted-foreground font-mono">
                          {locale === "ar" ? "متوسط الانتظار: 24 ثانية" : "Avg wait: 24s"}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-[9px] font-bold text-emerald-600 dark:text-emerald-400">
                      <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      {locale === "ar" ? "نشط الآن" : "ACTIVE NOW"}
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex flex-col sm:flex-row items-center gap-4">
                  <a
                    href={`tel:${t("callNumber").replace(/\s+/g, "")}`}
                    className={cn(
                      buttonVariants({ size: "lg" }),
                      "rounded-full w-full sm:w-auto px-8 transition-all duration-300 group-hover:scale-[1.02] active:scale-[0.98] cursor-pointer font-semibold shadow-md shadow-primary/20 text-center flex items-center justify-center gap-2"
                    )}
                  >
                    <Phone className="size-4" />
                    {locale === "ar" ? "اتصل الآن" : "Call Now"}
                  </a>
                  <span className="font-mono font-bold text-ink text-base sm:text-lg select-all">
                    {t("callNumber")}
                  </span>
                </div>
              </div>

              {/* Stacked Secondary Options - Spans 2 columns on large screens */}
              <div className="flex flex-col gap-6 lg:col-span-2">

                {/* Live Chat Option */}
                <div className="group flex-1 flex flex-col justify-between p-6 rounded-2xl border border-border bg-background transition-all duration-300 hover:border-primary/35 hover:shadow-sm">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary transition-transform duration-300 group-hover:scale-105 shrink-0">
                        <MessageSquare className="size-4.5" />
                      </div>
                      <h4 className="font-heading text-base font-bold text-ink">{t("chat")}</h4>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {t("chatDesc")}
                    </p>
                  </div>
                  <button
                    className={cn(
                      buttonVariants({ variant: "outline", size: "sm" }),
                      "mt-5 rounded-full w-full transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary cursor-pointer font-medium"
                    )}
                  >
                    {locale === "ar" ? "ابدأ الدردشة" : "Start Chat"}
                  </button>
                </div>

                {/* Ticket Option */}
                <div className="group flex-1 flex flex-col justify-between p-6 rounded-2xl border border-border bg-background transition-all duration-300 hover:border-primary/35 hover:shadow-sm">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary transition-transform duration-300 group-hover:scale-105 shrink-0">
                        <Mail className="size-4.5" />
                      </div>
                      <h4 className="font-heading text-base font-bold text-ink">{t("ticket")}</h4>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {t("ticketDesc")}
                    </p>
                  </div>
                  <button
                    className={cn(
                      buttonVariants({ variant: "outline", size: "sm" }),
                      "mt-5 rounded-full w-full transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary cursor-pointer font-medium"
                    )}
                  >
                    {locale === "ar" ? "تقديم طلب" : "Submit Ticket"}
                  </button>
                </div>

              </div>

            </div>
          </div>
        </section>

        {/* API-driven Support Tickets & FAQs */}
        <section className="bg-background border-t border-border">
          <SupportTicketsSection />
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
