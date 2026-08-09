import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Logo } from "./logo";

export async function SiteFooter() {
  const t = await getTranslations("Footer");
  const year = new Date().getFullYear();

  const columns = [
    { title: t("shop"), links: t.raw("shopLinks") as string[] },
    { title: t("company"), links: t.raw("companyLinks") as string[] },
    { title: t("support"), links: t.raw("supportLinks") as string[] },
    { title: t("partners"), links: t.raw("partnerLinks") as string[] },
  ];

  const getHref = (title: string, index: number) => {
    if (title === t("shop")) {
      if (index === 0) return "/#pricing";
      if (index === 5) return "/bundles"; // Security System / Bundle
      return "/gallery";
    }
    if (title === t("company")) {
      if (index === 0) return "/#benefits";
      if (index === 4) return "/blog";
      return "/";
    }
    if (title === t("support")) {
      if (index === 0) return "/support";
      if (index === 1) return "/support#contact";
      if (index === 2) return "/support";
      if (index === 3) return "/support#contact"; // Returns goes to support page
      if (index === 4) return "/support#contact"; // Product Warranty goes to support page
      return "/support";
    }
    return "/";
  };

  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Link
              href="/"
              className="flex items-center gap-2 font-heading text-xl font-bold text-ink"
            >
              <Logo className="size-6" />
              Barosec
            </Link>
            <p className="mt-2 max-w-sm text-sm text-muted-foreground">
              {t("tagline")}
            </p>
          </div>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="mb-3 text-sm font-semibold text-ink">
                {col.title}
              </h3>
              <ul className="space-y-2">
                {col.links.map((label, idx) => (
                  <li key={label}>
                    <Link
                      href={getHref(col.title, idx)}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-border pt-8 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>{t("copyright", { year })}</p>
          <div className="flex flex-wrap gap-4">
            <a href="#" className="hover:text-foreground">
              {t("privacy")}
            </a>
            <a href="#" className="hover:text-foreground">
              {t("terms")}
            </a>
            <a href="#" className="hover:text-foreground">
              {t("legal")}
            </a>
            <a href="#" className="hover:text-foreground">
              {t("accessibility")}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
