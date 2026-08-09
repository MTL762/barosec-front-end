import { getTranslations } from "next-intl/server";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Shield } from "lucide-react";
import { cn } from "@/lib/utils";
import { HeroVisual } from "./hero-visual";

export async function Hero() {
  const t = await getTranslations("Hero");

  const simulatorTranslations = {
    live: t("simulator.live"),
    dayMode: t("simulator.dayMode"),
    nightVision: t("simulator.nightVision"),
    pills: {
      person: t("simulator.pills.person"),
      vehicle: t("simulator.pills.vehicle"),
      package: t("simulator.pills.package"),
      animal: t("simulator.pills.animal"),
    },
    alerts: {
      title: t("simulator.alerts.title"),
      person: {
        event: t("simulator.alerts.person.event"),
        location: t("simulator.alerts.person.location"),
      },
      vehicle: {
        event: t("simulator.alerts.vehicle.event"),
        location: t("simulator.alerts.vehicle.location"),
      },
      package: {
        event: t("simulator.alerts.package.event"),
        location: t("simulator.alerts.package.location"),
      },
      animal: {
        event: t("simulator.alerts.animal.event"),
        location: t("simulator.alerts.animal.location"),
      },
    },
  };

  return (
    <section className="relative overflow-hidden border-b border-border/60">
      <div
        aria-hidden
        className="hero-glow-scroll pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 70% 20%, var(--hero-glow), transparent 55%), linear-gradient(160deg, var(--hero-gradient-start) 0%, var(--background) 45%, var(--hero-gradient-end) 100%)",
        }}
      />
      <div
        aria-hidden
        className="hero-glow-scroll pointer-events-none absolute -end-24 top-10 size-72 rounded-full opacity-40 blur-3xl"
        style={{ background: "var(--hero-glow)" }}
      />

      <div className="relative mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 sm:py-24 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:py-28">
        <div className="hero-copy-scroll space-y-6">
          <Badge className="rounded-full bg-primary/15 px-3 py-1 text-primary hover:bg-primary/20">
            <Shield className="me-1.5 size-3.5" />
            {t("badge")}
          </Badge>
          <h1 className="max-w-xl text-4xl font-bold leading-[1.15] text-ink sm:text-5xl lg:text-[3.25rem]">
            {t("title")}
          </h1>
          <p className="max-w-lg text-lg text-muted-foreground sm:text-xl">
            {t("subtitle")}
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <a
              href="#pricing"
              className={cn(
                buttonVariants({ size: "lg" }),
                "rounded-full px-7"
              )}
            >
              {t("ctaSubscribe")}
            </a>
            <a
              href="#features"
              className={cn(
                buttonVariants({ size: "lg", variant: "outline" }),
                "rounded-full px-7"
              )}
            >
              {t("ctaLearn")}
            </a>
          </div>
        </div>

        <div className="hero-visual-scroll relative mx-auto w-full max-w-md lg:max-w-none">
          <HeroVisual translations={simulatorTranslations} />
        </div>
      </div>
    </section>
  );
}

