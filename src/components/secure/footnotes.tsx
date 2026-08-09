import { getTranslations } from "next-intl/server";

export async function Footnotes() {
  const t = await getTranslations("Footnotes");

  return (
    <section className="border-t border-border/60 bg-surface/50 py-10">
      <div className="mx-auto max-w-6xl space-y-2 px-4 text-xs leading-relaxed text-muted-foreground sm:px-6">
        {(["1", "2", "3", "4", "5", "6"] as const).map((n) => (
          <p key={n}>{t(n)}</p>
        ))}
      </div>
    </section>
  );
}
