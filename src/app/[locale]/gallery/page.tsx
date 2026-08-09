import { setRequestLocale, getTranslations } from "next-intl/server";
import { SiteHeader } from "@/components/secure/site-header";
import { ScrollProgress } from "@/components/secure/scroll-progress";
import { SiteFooter } from "@/components/secure/site-footer";
import { ProductGallery } from "@/components/secure/product-gallery";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Gallery" });
  return {
    title: `${t("title")} | Barosec`,
    description: t("subtitle"),
  };
}

export default async function GalleryPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Gallery");

  return (
    <>
      <ScrollProgress />
      <SiteHeader />
      <main className="flex-1 bg-background/50 py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mx-auto mb-16 max-w-3xl text-center space-y-4">
            <h1 className="font-heading text-4xl font-extrabold tracking-tight text-ink sm:text-5xl">
              {t("title")}
            </h1>
            <p className="text-lg text-muted-foreground">
              {t("subtitle")}
            </p>
          </div>
          <ProductGallery />
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
