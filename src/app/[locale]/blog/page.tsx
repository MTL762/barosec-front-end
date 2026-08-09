import { setRequestLocale, getTranslations } from "next-intl/server";
import { SiteHeader } from "@/components/secure/site-header";
import { ScrollProgress } from "@/components/secure/scroll-progress";
import { SiteFooter } from "@/components/secure/site-footer";
import { BookOpen, Calendar, Clock, ArrowRight, Rss } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Props = {
  params: Promise<{ locale: string }>;
};

type Article = {
  id: "a1" | "a2" | "a3" | "a4";
  category: string;
  categoryBg: string;
  categoryText: string;
  date: string;
  readTime: string;
  imageBg: string;
  imageUrl: string;
};

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Blog" });
  return {
    title: `${t("title")} | Barosec`,
    description: t("subtitle"),
  };
}

export default async function BlogPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Blog");

  const ARTICLES: Article[] = [
    {
      id: "a1",
      category: locale === "ar" ? "إرشادات" : "Guides",
      categoryBg: "bg-teal-500/10",
      categoryText: "text-teal-600 dark:text-teal-400",
      date: "July 15, 2026",
      readTime: "5",
      imageBg: "",
      imageUrl: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80",
    },
    {
      id: "a2",
      category: locale === "ar" ? "نصائح أمنية" : "Tips",
      categoryBg: "bg-blue-500/10",
      categoryText: "text-blue-600 dark:text-blue-400",
      date: "July 10, 2026",
      readTime: "4",
      imageBg: "",
      imageUrl: "https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=600&q=80",
    },
    {
      id: "a3",
      category: locale === "ar" ? "منتجات" : "Hardware",
      categoryBg: "bg-purple-500/10",
      categoryText: "text-purple-600 dark:text-purple-400",
      date: "July 05, 2026",
      readTime: "6",
      imageBg: "",
      imageUrl: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80",
    },
    {
      id: "a4",
      category: locale === "ar" ? "تكنولوجيا" : "AI & Cloud",
      categoryBg: "bg-amber-500/10",
      categoryText: "text-amber-600 dark:text-amber-400",
      date: "June 28, 2026",
      readTime: "8",
      imageBg: "",
      imageUrl: "https://images.unsplash.com/photo-1507146426996-ef05306b995a?auto=format&fit=crop&w=600&q=80",
    },
  ];

  const featuredArticle = ARTICLES[0];
  const gridArticles = ARTICLES.slice(1);

  return (
    <>
      <ScrollProgress />
      <SiteHeader />
      <main className="flex-1 bg-background/50">
        {/* Header */}
        <section className="py-16 sm:py-24 border-b border-border">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div className="space-y-3">
                <h1 className="font-heading text-4xl font-extrabold tracking-tight text-ink sm:text-5xl">
                  {t("title")}
                </h1>
                <p className="max-w-2xl text-lg text-muted-foreground">
                  {t("subtitle")}
                </p>
              </div>
              <div className="flex shrink-0">
                <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-ink">
                  <Rss className="size-4 text-primary" />
                  RSS Feed
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Post (Cardless Showcase Split Layout) */}
        <section className="py-16">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <h2 className="mb-8 text-xs font-bold uppercase tracking-widest text-primary">
              {t("featured")}
            </h2>
            {featuredArticle && (
              <div className="group flex flex-col lg:flex-row items-stretch gap-8 lg:gap-16">
                {/* Visual Cover Image */}
                <div className="w-full lg:w-1/2 relative overflow-hidden rounded-2xl bg-muted aspect-video shadow-sm">
                  <img
                    src={featuredArticle.imageUrl}
                    alt={t(`articles.${featuredArticle.id}.title`)}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-102"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent" />
                  
                  {/* Viewfinder simulation */}
                  <div className="absolute inset-8 rounded-full border border-white/10 transition-all duration-500 group-hover:border-white/30 group-hover:scale-105" />
                  <div className="absolute inset-16 rounded-full border border-dashed border-white/20 transition-all duration-700 group-hover:rotate-45" />
                  <div className="absolute top-4 left-4 size-3 border-t-2 border-l-2 border-white/40 transition-transform duration-300 group-hover:-translate-x-1 group-hover:-translate-y-1" />
                  <div className="absolute top-4 right-4 size-3 border-t-2 border-r-2 border-white/40 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                  <div className="absolute bottom-4 left-4 size-3 border-b-2 border-l-2 border-white/40 transition-transform duration-300 group-hover:-translate-x-1 group-hover:translate-y-1" />
                  <div className="absolute bottom-4 right-4 size-3 border-b-2 border-r-2 border-white/40 transition-transform duration-300 group-hover:translate-x-1 group-hover:translate-y-1" />
                </div>

                {/* Content Details */}
                <div className="w-full lg:w-1/2 flex flex-col justify-center space-y-4">
                  <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                    <span
                      className={cn(
                        "rounded-full px-3 py-1 font-semibold tracking-wide uppercase",
                        featuredArticle.categoryBg,
                        featuredArticle.categoryText
                      )}
                    >
                      {featuredArticle.category}
                    </span>
                    <div className="flex items-center gap-1">
                      <Calendar className="size-3.5" />
                      <span>{featuredArticle.date}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="size-3.5" />
                      <span>{t("readTime", { minutes: featuredArticle.readTime })}</span>
                    </div>
                  </div>

                  <h3 className="font-heading text-2xl font-bold text-ink sm:text-3xl transition-colors group-hover:text-primary duration-300">
                    {t(`articles.${featuredArticle.id}.title`)}
                  </h3>
                  <p className="text-base text-muted-foreground leading-relaxed">
                    {t(`articles.${featuredArticle.id}.summary`)}
                  </p>

                  <div className="pt-2">
                    <button
                      className={cn(
                        buttonVariants({ variant: "outline" }),
                        "rounded-full transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary cursor-pointer font-medium"
                      )}
                    >
                      {t("readMore")}
                      <ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Articles Grid (Cardless Grid Layout) */}
        <section className="pb-24">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="grid gap-12 md:grid-cols-3">
              {gridArticles.map((art) => {
                const itemT = t.raw(`articles.${art.id}`);
                return (
                  <div
                    key={art.id}
                    className="group flex flex-col space-y-4"
                  >
                    <div className="relative h-48 overflow-hidden rounded-2xl bg-muted shadow-sm">
                      <img
                        src={art.imageUrl}
                        alt={itemT.title}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-102"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-transparent" />
                      
                      {/* Sub-focal viewfinder guide */}
                      <div className="absolute top-3 left-3 size-2 border-t border-l border-white/30 transition-transform duration-300 group-hover:-translate-x-0.5 group-hover:-translate-y-0.5" />
                      <div className="absolute top-3 right-3 size-2 border-t border-r border-white/30 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      <div className="absolute bottom-3 left-3 size-2 border-b border-l border-white/30 transition-transform duration-300 group-hover:-translate-x-0.5 group-hover:translate-y-0.5" />
                      <div className="absolute bottom-3 right-3 size-2 border-b border-r border-white/30 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:translate-y-0.5" />
                      <div className="absolute inset-6 rounded-full border border-white/5 group-hover:border-white/20 transition-all duration-500 group-hover:scale-105" />
                    </div>

                    <div className="flex flex-1 flex-col space-y-3">
                      <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                        <span
                          className={cn(
                            "rounded-full px-2.5 py-0.5 font-semibold uppercase text-[10px]",
                            art.categoryBg,
                            art.categoryText
                          )}
                        >
                          {art.category}
                        </span>
                        <span className="flex items-center gap-1 text-[11px]">
                          <Clock className="size-3" />
                          {t("readTime", { minutes: art.readTime })}
                        </span>
                      </div>

                      <h3 className="font-heading text-lg font-bold text-ink transition-colors group-hover:text-primary leading-snug">
                        {itemT.title}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {itemT.summary}
                      </p>

                      <div className="pt-2 border-t border-border/50 flex items-center justify-between">
                        <span className="text-[11px] text-muted-foreground">{art.date}</span>
                        <span className="text-xs font-semibold text-primary inline-flex items-center gap-1 cursor-pointer">
                          {t("readMore")}
                          <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
