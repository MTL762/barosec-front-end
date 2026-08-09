"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Camera, Shield, Eye, RotateCw, Sun, Check, ArrowRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type CameraTab = "indoor" | "outdoor" | "night" | "ptz" | "solar";

export function CameraShowcase() {
  const t = useTranslations("Showcase");
  const [activeTab, setActiveTab] = useState<CameraTab>("outdoor");

  const cameraModels = [
    {
      id: "indoor",
      name: "باروسك إنتيريور 4K (Barosic Indoor 4K)",
      category: "indoor",
      badge: "دقة 4K ULTRA HD",
      specs: "دقة 4K UHD، صوت ثنائي الاتجاه، رؤية ليلية بالأشعة تحت الحمراء، كشف حركة بالذكاء الاصطناعي، غطاء خصوصية إلكتروني.",
      ideal: "المنازل وغرف المعيشة والمكاتب الداخلية",
      price: "299 ر.س",
      image: "📷 4K Indoor Security Camera",
      features: [
        "بث مباشر بجودة 4K مع زاوية رؤية 160°",
        "ميكروفون وسماعة مدمجة للتحدث المباشر",
        "وضع الخصوصية التلقائي عند التواجد بالمنزل",
        "اتصال لاسلكي محمي Wi-Fi 2.4/5GHz"
      ]
    },
    {
      id: "outdoor",
      name: "باروسك آوتدور برو (Barosic Outdoor Pro)",
      category: "outdoor",
      badge: "مقاومة طقس IP67",
      specs: "مقاومة للطقس والعوامل الجوية IP67، كشاف LED مدمج، صفارة إنذار 105dB، كشف الأشخاص والمركبات.",
      ideal: "المداخل الرئيسية، الكراج، والحدائق الخارجية",
      price: "449 ر.س",
      image: "🛡️ Weatherproof Outdoor Camera",
      features: [
        "تصميم متين يعمل في درجات حرارة من -20° حتى 55°C",
        "كشاف إضاءة تلقائي عند الحركة بالليل",
        "إنذار صبي محلي لإخافة المقتحمين",
        "تنبيهات فورية عالية الدقة على المحمول"
      ]
    },
    {
      id: "night",
      name: "باروسك نايت فيجن (Barosic Color Night)",
      category: "night",
      badge: "رؤية ليلية بالألوان",
      specs: "تصوير ملون في الظلام التام بمستشعر Starlight، دقة 2K HDR، كشاف ذكي، بطارية تدوم 6 أشهر.",
      ideal: "المناطق المعتمة والزوايا المظلمة حول المبنى",
      price: "499 ر.س",
      image: "🌙 Color Night Vision Camera",
      features: [
        "مستشعر تصوير ملون في الظلام الدامس",
        "وضوح فائق للتفاصيل والوجوه بالليل",
        "كشافات LED دافئة قابلة للضبط",
        "بطارية قابلة للشحن سريعة التغيير"
      ]
    },
    {
      id: "ptz",
      name: "باروسك PTZ 360° (Barosic PTZ Motion Tracker)",
      category: "ptz",
      badge: "تتبع حركة 360 درجة",
      specs: "دوران أفقي 360° ورأسي 90°، تتبع تلقائي ذكي للأهداف، تقريب بصري 12x، صفارة إنذار مزدوجة.",
      ideal: "الساحات الكبيرة، المستودعات، والمنشآت التجارية",
      price: "599 ر.س",
      image: "🔄 360° PTZ Tracking Camera",
      features: [
        "تغطي مساحة كاملة بدون أي زوايا ميتة",
        "متابعة الأجسام المتحركة تلقائياً وملاحقتها",
        "تقريب بصري وفائق الجودة 12x Zoom",
        "إمكانية التحكم اليدوي بالاتجاهات عبر التطبيق"
      ]
    },
    {
      id: "solar",
      name: "باروسك سولار برو (Barosic Solar & Battery)",
      category: "solar",
      badge: "طاقة شمسية مستمرة",
      specs: "لاسلكية بالكامل 100%، لوح طاقة شمسية عالي الكفاءة مدمج، اتصال 4G LTE / Wi-Fi، مقاومة غبار ومااء.",
      ideal: "المزارع، الأماكن النائية، والمواقع بدون شبكة كهرباء",
      price: "649 ر.س",
      image: "☀️ Solar Powered Wireless Camera",
      features: [
        "عمل مستمر 365 يوماً دون الحاجة للشحن الكهربائي",
        "خيارات اتصال عبر شريحة البيانات 4G أو الواي فاي",
        "تركيب سهل وسريع في أي موقع خلال دقائق",
        "تسجيل محلي على بطاقة MicroSD وسحابي مشفر"
      ]
    }
  ];

  const currentModel = cameraModels.find((m) => m.category === activeTab) || cameraModels[1];

  return (
    <section id="cameras" className="py-20 bg-muted/40 border-y border-border/60">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary mb-3">
            <Camera className="size-3.5" />
            <span>منتجات باروسك الأحدث</span>
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-foreground">
            {t("title")}
          </h2>
          <p className="mt-3 text-base text-muted-foreground">
            {t("subtitle")}
          </p>
        </div>

        {/* Categories Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {[
            { id: "indoor", label: t("tabs.indoor"), icon: Camera },
            { id: "outdoor", label: t("tabs.outdoor"), icon: Shield },
            { id: "night", label: t("tabs.night"), icon: Eye },
            { id: "ptz", label: t("tabs.ptz"), icon: RotateCw },
            { id: "solar", label: t("tabs.solar"), icon: Sun },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as CameraTab)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold transition-all duration-200",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/20 scale-105"
                    : "bg-background text-muted-foreground hover:bg-accent hover:text-foreground border border-border/80"
                )}
              >
                <Icon className="size-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Featured Camera Showcase Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-background rounded-3xl border border-border/80 p-6 sm:p-8 shadow-xl shadow-muted/30">
          <div className="lg:col-span-6 space-y-6">
            <div>
              <span className="inline-block rounded-md bg-blue-500/10 px-3 py-1 text-xs font-bold text-blue-600 dark:text-blue-400 mb-2">
                {currentModel.badge}
              </span>
              <h3 className="text-2xl font-bold text-foreground sm:text-3xl">
                {currentModel.name}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {currentModel.specs}
              </p>
            </div>

            <div className="space-y-2.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                أبرز المميزات الفنية:
              </h4>
              {currentModel.features.map((feature, i) => (
                <div key={i} className="flex items-start gap-2.5 text-sm font-medium text-foreground">
                  <div className="flex size-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 mt-0.5">
                    <Check className="size-3.5 stroke-[3]" />
                  </div>
                  <span>{feature}</span>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-border flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="text-xs text-muted-foreground block">السعر الأساسي</span>
                <span className="text-3xl font-extrabold text-foreground">{currentModel.price}</span>
              </div>
              <a
                href="#pricing"
                className={cn(buttonVariants({ size: "lg" }), "rounded-full px-6 gap-2 shadow-lg shadow-primary/25")}
              >
                <span>طلب الكاميرا مع الاشتراك</span>
                <ArrowRight className="size-4 rtl:rotate-180" />
              </a>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="relative aspect-video sm:aspect-[4/3] rounded-2xl bg-gradient-to-tr from-slate-900 via-slate-800 to-blue-950 p-6 flex flex-col justify-between overflow-hidden border border-slate-700/60 shadow-2xl text-white">
              <div className="flex justify-between items-center z-10">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-red-500/90 px-3 py-0.5 text-xs font-bold text-white uppercase tracking-wider animate-pulse">
                  ● بث حقيقي 4K
                </span>
                <span className="text-xs font-mono text-slate-400">BAROSIC-CAM-LIVE</span>
              </div>

              <div className="my-auto text-center z-10 py-8">
                <div className="text-5xl mb-3">{currentModel.image.split(" ")[0]}</div>
                <div className="text-xl font-bold text-slate-100">{currentModel.name}</div>
                <div className="text-xs text-slate-400 mt-1">الاستخدام: {currentModel.ideal}</div>
              </div>

              <div className="flex justify-between items-center z-10 text-xs text-slate-400 bg-slate-900/80 backdrop-blur-md p-2.5 rounded-xl border border-slate-700/50">
                <span>جودة البث: 3840x2160p</span>
                <span>الحالة: نشط ومحمي 🛡️</span>
              </div>

              <div className="absolute -bottom-20 -right-20 size-64 rounded-full bg-blue-500/10 blur-3xl" />
            </div>
          </div>
        </div>

        {/* Detailed Specs Comparison Table */}
        <div className="mt-16 bg-background rounded-2xl border border-border/80 overflow-hidden shadow-sm">
          <div className="p-6 border-b border-border bg-muted/20">
            <h3 className="text-xl font-bold text-foreground">جدول مقارنة فئات ومواصفات الكاميرات</h3>
            <p className="text-xs text-muted-foreground mt-1">مقارنة الخصائص الفنية والأسعار لجميع الموديلات المتاحة في منظومة باروسك</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-right rtl:text-right text-foreground">
              <thead className="bg-muted/60 text-xs font-bold uppercase text-muted-foreground">
                <tr>
                  <th className="px-6 py-4">{t("tableHeader.model")}</th>
                  <th className="px-6 py-4">{t("tableHeader.specs")}</th>
                  <th className="px-6 py-4">{t("tableHeader.ideal")}</th>
                  <th className="px-6 py-4">{t("tableHeader.price")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {cameraModels.map((cam) => (
                  <tr key={cam.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4 font-bold text-foreground">{cam.name}</td>
                    <td className="px-6 py-4 text-xs text-muted-foreground max-w-xs">{cam.specs}</td>
                    <td className="px-6 py-4 text-xs text-muted-foreground">{cam.ideal}</td>
                    <td className="px-6 py-4 font-extrabold text-primary">{cam.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
