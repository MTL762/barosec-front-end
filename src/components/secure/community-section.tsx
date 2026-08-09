"use client";

import { useTranslations } from "next-intl";
import { Users, ShieldCheck, Star, BookOpen, MessageSquare, ArrowLeft } from "lucide-react";

export function CommunitySection() {
  const t = useTranslations("Community");

  const articles = [
    {
      title: "كيف تختار مكان التركيب المثالي لكاميرات المراقبة الخارجية؟",
      excerpt: "دليل شامل لتحديد الزوايا الميتة والارتفاع المناسب لضمان أقصى تغطية أمنية لمنزلك.",
      tag: "نصائح أمنية",
      date: "20 يوليو 2026",
    },
    {
      title: "أهمية الرؤية الليلية الملونة في التعرف على تفاصيل الأحداث",
      excerpt: "شرح تقني لمميزات مستشعرات Starlight وكيف تساهم في تقديم أدلة واضحة في الظلام.",
      tag: "تقنيات باروسك",
      date: "15 يوليو 2026",
    },
    {
      title: "حماية شبكة Wi-Fi الكاميرات من التداخل والاختراق",
      excerpt: "خطوات بسيطة لتأمين التشفير وتغيير الإعدادات لضمان عدم انقطاع البث.",
      tag: "أمان المعلومات",
      date: "10 يوليو 2026",
    },
  ];

  const stories = [
    {
      name: "د. خالد السعدون",
      role: "مالك فيلا - الرياض",
      quote: "فضل نظام باروسك وزر الطوارئ الفوري، تم إحباط محاولة تسلل للكراج وتنبيه الحراسة خلال ثوانٍ معدودة.",
      rating: 5,
    },
    {
      name: "م. سارة Al-Ghamdi",
      role: "مؤسسة مجمع مكاتب - جدة",
      quote: "الكاميرات المتحركة 360 مع التخزين السحابي المشفر أتاحت لنا متابعة المنشأة وتأمينها بالكامل بأعلى معايير الأمان.",
      rating: 5,
    },
    {
      name: "أحمد بن علي",
      role: "مشترك في باقة Premium",
      quote: "سهولة التطبيق باللغة العربية وميزة قفل الخصوصية عند التواجد بالبيت منحتنا راحة بال لا تقدر بثمن.",
      rating: 5,
    },
  ];

  return (
    <section id="community" className="py-20 bg-background border-b border-border/80">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-500/10 px-3.5 py-1 text-xs font-semibold text-blue-600 dark:text-blue-400 mb-3">
            <Users className="size-3.5" />
            <span>مجتمع وم مشتركي باروسك</span>
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-foreground">
            {t("title")}
          </h2>
          <p className="mt-3 text-base text-muted-foreground">
            {t("subtitle")}
          </p>
        </div>

        {/* Live Metrics Counter */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          <div className="bg-muted/30 border border-border/80 rounded-2xl p-6 text-center space-y-2 hover:border-primary/40 transition-colors">
            <div className="inline-flex size-12 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 mb-1">
              <Users className="size-6" />
            </div>
            <div className="text-4xl font-extrabold text-foreground">+50,000</div>
            <div className="text-sm font-medium text-muted-foreground">{t("subscribers")}</div>
          </div>

          <div className="bg-muted/30 border border-border/80 rounded-2xl p-6 text-center space-y-2 hover:border-primary/40 transition-colors">
            <div className="inline-flex size-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 mb-1">
              <ShieldCheck className="size-6" />
            </div>
            <div className="text-4xl font-extrabold text-foreground">+120,000</div>
            <div className="text-sm font-medium text-muted-foreground">{t("camerasConnected")}</div>
          </div>

          <div className="bg-muted/30 border border-border/80 rounded-2xl p-6 text-center space-y-2 hover:border-primary/40 transition-colors">
            <div className="inline-flex size-12 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 mb-1">
              <Star className="size-6 fill-amber-500 text-amber-500" />
            </div>
            <div className="text-4xl font-extrabold text-foreground">99.4%</div>
            <div className="text-sm font-medium text-muted-foreground">{t("satisfaction")}</div>
          </div>
        </div>

        {/* Success Stories Carousel / Grid */}
        <div className="mb-20">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-2xl font-bold text-foreground">{t("storiesTitle")}</h3>
              <p className="text-xs text-muted-foreground mt-1">شهادات حقيقية من عملائنا في مختلف المناطق</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {stories.map((story, i) => (
              <div key={i} className="bg-muted/20 border border-border/80 rounded-2xl p-6 flex flex-col justify-between space-y-4 hover:shadow-lg transition-all">
                <div className="space-y-3">
                  <div className="flex gap-1 text-amber-500">
                    {[...Array(story.rating)].map((_, idx) => (
                      <Star key={idx} className="size-4 fill-amber-500" />
                    ))}
                  </div>
                  <p className="text-sm text-foreground italic leading-relaxed">
                    &ldquo;{story.quote}&rdquo;
                  </p>
                </div>
                <div className="pt-4 border-t border-border/60">
                  <div className="font-bold text-foreground text-sm">{story.name}</div>
                  <div className="text-xs text-muted-foreground">{story.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Security Articles & Blog */}
        <div>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-2xl font-bold text-foreground">{t("articlesTitle")}</h3>
              <p className="text-xs text-muted-foreground mt-1">مقالات وأدلة تثقيفية لحماية وتأمين الممتلكات</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {articles.map((art, i) => (
              <div key={i} className="bg-background border border-border rounded-2xl p-6 space-y-4 hover:border-primary/50 transition-all flex flex-col justify-between">
                <div className="space-y-2.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="rounded-full bg-blue-500/10 px-2.5 py-0.5 font-bold text-blue-600 dark:text-blue-400">
                      {art.tag}
                    </span>
                    <span className="text-muted-foreground font-mono">{art.date}</span>
                  </div>
                  <h4 className="text-base font-bold text-foreground hover:text-primary transition-colors cursor-pointer">
                    {art.title}
                  </h4>
                  <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
                    {art.excerpt}
                  </p>
                </div>
                <button className="flex items-center gap-1.5 text-xs font-bold text-primary hover:underline pt-2">
                  <span>قراءة المقال الكاملاً</span>
                  <ArrowLeft className="size-3.5 rtl:rotate-180" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
