import { setRequestLocale, getTranslations } from "next-intl/server";
import { SiteHeader } from "@/components/secure/site-header";
import { ScrollProgress } from "@/components/secure/scroll-progress";
import { SiteFooter } from "@/components/secure/site-footer";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Shield, Zap, BadgeCheck, AlertCircle, ShoppingCart, HelpCircle, PhoneCall } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Link } from "@/i18n/navigation";

type Props = {
  params: Promise<{ locale: string }>;
};

type BundleItem = {
  id: "starterKit" | "proKit" | "ultimateShield";
  price: string;
  originalPrice: string;
  saveAmount: string;
  badge?: string;
  icon: any;
  items: string[];
  imageUrl: string;
};

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Bundles" });
  return {
    title: `${t("title")} | Barosec`,
    description: t("subtitle"),
  };
}

export default async function BundlesPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Bundles");

  const BUNDLES: BundleItem[] = [
    {
      id: "starterKit",
      price: "$199.99",
      originalPrice: "$249.99",
      saveAmount: "$50",
      icon: Shield,
      imageUrl: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=600&q=80",
      items: [
        "1x Barosec Essential Camera (1080p)",
        "1x Barosec Video Doorbell",
        "1-Year Limited Warranty",
        "30-Day Free Secure Cloud Trial",
      ],
    },
    {
      id: "proKit",
      price: "$449.99",
      originalPrice: "$569.99",
      saveAmount: "$120",
      badge: locale === "ar" ? "الأكثر شعبية" : "Most Popular",
      icon: Zap,
      imageUrl: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=600&q=80",
      items: [
        "2x Barosec Pro 5S Cameras (2K HDR)",
        "1x Barosec Video Doorbell",
        "1x Solar Panel Charger",
        "1-Year Limited Warranty",
        "30-Day Free Secure Cloud Trial",
      ],
    },
    {
      id: "ultimateShield",
      price: "$899.99",
      originalPrice: "$1149.99",
      saveAmount: "$250",
      icon: BadgeCheck,
      imageUrl: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=600&q=80",
      items: [
        "3x Barosec Ultra 2 Cameras (4K HDR)",
        "1x Barosec Pro 3 Floodlight Camera",
        "1x Barosec Video Doorbell",
        "1x Barosec SmartHub Gateway",
        "1-Year Limited Warranty",
        "30-Day Free Secure Cloud Trial",
      ],
    },
  ];

  const faqItems = t.raw("faqItems") as { q: string; a: string }[];

  return (
    <>
      <ScrollProgress />
      <SiteHeader />
      <main className="flex-1 bg-background/50">
        {/* Header Section */}
        <section className="py-16 sm:py-24 border-b border-border">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 text-center space-y-4">
            <h1 className="font-heading text-4xl font-extrabold tracking-tight text-ink sm:text-5xl">
              {t("title")}
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              {t("subtitle")}
            </p>
          </div>
        </section>

        {/* Bundles Layout (Cardless Showcase Row Layout) */}
        <section className="py-16 sm:py-24">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="space-y-20">
              {BUNDLES.map((b, index) => {
                const itemT = t.raw(b.id);
                const IconComponent = b.icon;
                const isEven = index % 2 === 0;

                return (
                  <div
                    key={b.id}
                    className={cn(
                      "flex flex-col lg:flex-row items-center gap-10 lg:gap-16 py-8 border-b border-border/40 last:border-b-0",
                      isEven ? "lg:flex-row" : "lg:flex-row-reverse"
                    )}
                  >
                    {/* Bundle Visual Cover */}
                    <div className="w-full lg:w-1/2 relative group overflow-hidden rounded-2xl bg-muted aspect-video shadow-sm">
                      <img
                        src={b.imageUrl}
                        alt={itemT.name}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-102"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent" />
                      
                      {b.badge && (
                        <span className="absolute top-4 start-4 rounded-full bg-primary px-3 py-0.5 text-[10px] font-bold text-primary-foreground tracking-wider uppercase">
                          {b.badge}
                        </span>
                      )}

                      <div className="absolute bottom-4 end-4">
                        <span className="rounded-md bg-destructive px-3 py-1 text-[10px] font-bold text-destructive-foreground tracking-wider uppercase">
                          {t("save", { amount: b.saveAmount })}
                        </span>
                      </div>
                    </div>

                    {/* Bundle Info Section */}
                    <div className="w-full lg:w-1/2 space-y-6">
                      <div className="flex items-center gap-3">
                        <div className="rounded-xl bg-primary/10 p-2.5 text-primary">
                          <IconComponent className="size-5" />
                        </div>
                        <h3 className="font-heading text-2xl font-bold tracking-tight text-ink">
                          {itemT.name}
                        </h3>
                      </div>

                      <p className="text-base text-muted-foreground leading-relaxed">
                        {itemT.description}
                      </p>

                      <div className="flex items-baseline gap-2">
                        <span className="font-heading text-3xl font-extrabold text-ink">
                          {b.price}
                        </span>
                        <span className="text-sm text-muted-foreground line-through">
                          {b.originalPrice}
                        </span>
                      </div>

                      <div className="border-t border-border/50 pt-4" />

                      <div className="space-y-3">
                        <h4 className="text-xs font-bold text-ink uppercase tracking-wider">
                          {t("includes")}
                        </h4>
                        <ul className="grid gap-2.5 sm:grid-cols-2 text-sm text-muted-foreground">
                          {b.items.map((item, idx) => (
                            <li key={idx} className="flex items-start gap-2.5">
                              <span className="mt-2 flex size-1.5 shrink-0 rounded-full bg-primary" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="pt-4">
                        <a
                          href="#pricing"
                          className={cn(
                            buttonVariants({ variant: b.badge ? "default" : "outline", size: "lg" }),
                            "rounded-full px-8 cursor-pointer font-semibold transition-all duration-300 hover:scale-[1.02] inline-flex items-center gap-2"
                          )}
                        >
                          <ShoppingCart className="size-4" />
                          {t("buyBundle")}
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="py-16 sm:py-24 bg-card border-y border-border">
          <div className="mx-auto max-w-3xl px-4 sm:px-6">
            <h2 className="font-heading text-3xl font-bold text-ink text-center mb-10">
              {t("faqTitle")}
            </h2>
            <Accordion>
              {faqItems.map((item, i) => (
                <AccordionItem key={item.q} value={`bfaq-${i}`} className="border-b border-border py-2">
                  <AccordionTrigger className="text-start font-semibold text-base py-3 text-ink hover:text-primary hover:no-underline transition-colors duration-300">
                    {item.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed pt-1 pb-4">
                    {item.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        {/* Support Section */}
        <section className="py-16 sm:py-24">
          <div className="mx-auto max-w-4xl px-4 sm:px-6">
            <div className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-primary/10 via-background to-background p-8 md:p-12">
              <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                <div className="space-y-3">
                  <h3 className="font-heading text-2xl font-bold text-ink">
                    {t("supportTitle")}
                  </h3>
                  <p className="max-w-md text-sm text-muted-foreground">
                    {t("supportText")}
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link
                    href="/support"
                    className={cn(buttonVariants({ size: "lg" }), "rounded-full")}
                  >
                    <HelpCircle className="mr-2 size-4" />
                    {t("contactExpert")}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
