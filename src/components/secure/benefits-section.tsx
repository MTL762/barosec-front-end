import { getTranslations } from "next-intl/server";
import {
  Bell,
  Flame,
  MapPinned,
  Share2,
  ShieldAlert,
  Zap,
  Shield,
} from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export async function BenefitsSection() {
  const t = await getTranslations("Benefits");

  const configs: Record<
    string,
    {
      iconBg: string;
      iconColor: string;
      hasBadge?: boolean;
      badgeTextKey?: "badge";
      pulse?: boolean;
    }
  > = {
    spotDanger: {
      iconBg: "bg-red-500/10 border border-red-500/20",
      iconColor: "text-red-400",
      hasBadge: true,
      badgeTextKey: "badge",
      pulse: true,
    },
    smartZones: {
      iconBg: "bg-primary/10 border border-primary/20",
      iconColor: "text-primary",
    },
    emergency: {
      iconBg: "bg-primary/20 border border-primary/30",
      iconColor: "text-primary",
      hasBadge: true,
      badgeTextKey: "badge",
    },
    quickerAction: {
      iconBg: "bg-amber-500/10 border border-amber-500/20",
      iconColor: "text-amber-400",
    },
    storeShare: {
      iconBg: "bg-primary/10 border border-primary/20",
      iconColor: "text-primary",
    },
    personalized: {
      iconBg: "bg-emerald-500/10 border border-emerald-500/20",
      iconColor: "text-emerald-400",
    },
  };

  return (
    <section
      id="benefits"
      className="scroll-mt-20 border-y border-border/60 bg-[oklch(0.12_0.02_250)] py-16 text-white sm:py-24"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Dynamic visual status header */}
        <div className="watch-section-head flex flex-col md:flex-row md:items-end md:justify-between gap-6 pb-12 border-b border-white/10">
          <div className="space-y-4 max-w-2xl">
            {/* Modern live badge status indicator replaces standard tracked kicker */}
            <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 border border-primary/20 px-3 py-1 text-xs font-semibold text-primary">
              <span className="relative flex size-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex size-2 rounded-full bg-primary"></span>
              </span>
              <span className="tracking-wide uppercase text-[10px]">
                {t("eyebrow")}
              </span>
            </div>
            <h2 className="font-heading text-3xl font-bold sm:text-5xl tracking-tight text-white leading-tight">
              {t("title")}
            </h2>
          </div>
          <p className="max-w-md text-base sm:text-lg text-white/60 leading-relaxed">
            {t("subtitle")}
          </p>
        </div>

        {/* Asymmetric Bento Grid layout */}
        <div className="mt-14 grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          
          {/* Card 1: 24/7 Emergency Response (Spans 2 columns on desktop) */}
          <div className="benefit-watch group flex flex-col justify-between p-6 md:p-8 rounded-2xl border border-white/10 bg-white/[0.02] hover:border-primary/40 transition-colors lg:col-span-2">
            <div className="flex flex-col md:flex-row gap-6 justify-between items-start">
              <div className="space-y-3 max-w-md">
                <div className="flex flex-wrap items-center gap-3">
                  <div className={cn("inline-flex size-10 items-center justify-center rounded-xl transition-all duration-300 group-hover:scale-105", configs.emergency.iconBg, configs.emergency.iconColor)}>
                    <ShieldAlert className="size-5" />
                  </div>
                  <h3 className="font-heading text-xl font-bold tracking-tight text-white group-hover:text-primary transition-colors">
                    {t("emergency.title")}
                  </h3>
                  <span className="flex items-center gap-1.5 rounded-full bg-primary/20 text-primary border border-primary/30 px-2 py-0.5 text-[9px] font-bold tracking-wider uppercase">
                    {t("emergency.badge")}
                  </span>
                </div>
                <p className="text-sm leading-relaxed text-white/60">
                  {t("emergency.body")}
                </p>
              </div>

              {/* Dynamic dispatch signal simulation */}
              <div className="relative w-full md:w-48 h-32 shrink-0 overflow-hidden rounded-xl border border-white/5 bg-black/40 flex items-center justify-center">
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <span className="absolute inline-flex size-24 animate-ping rounded-full bg-primary/5 opacity-40"></span>
                  <span className="absolute inline-flex size-16 animate-ping rounded-full bg-primary/10 opacity-60"></span>
                  <span className="absolute inline-flex size-8 rounded-full bg-primary/20"></span>
                </div>
                <div className="relative z-10 flex size-10 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-[0_0_15px_oklch(var(--primary)/0.3)]">
                  <Shield className="size-4 animate-pulse" />
                </div>
                <div className="absolute bottom-2 start-2 text-[8px] font-mono text-white/40">
                  SECURE LINK
                </div>
                <div className="absolute top-2 end-2 text-[8px] font-mono text-primary flex items-center gap-1">
                  <span className="size-1 rounded-full bg-primary animate-pulse" /> 24/7 ACTIVE
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Spot Danger Before it Spreads (Spans 1 column) */}
          <div className="benefit-watch group flex flex-col justify-between p-6 rounded-2xl border border-white/10 bg-white/[0.02] hover:border-primary/40 transition-colors col-span-1">
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3">
                <div className={cn("inline-flex size-10 items-center justify-center rounded-xl transition-all duration-300 group-hover:scale-105", configs.spotDanger.iconBg, configs.spotDanger.iconColor)}>
                  <Flame className="size-5" />
                </div>
                <h3 className="font-heading text-lg font-bold tracking-tight text-white group-hover:text-primary transition-colors">
                  {t("spotDanger.title")}
                </h3>
              </div>
              <p className="text-sm leading-relaxed text-white/60">
                {t("spotDanger.body")}
              </p>
            </div>

            {/* Bounding box visual representation */}
            <div className="relative h-32 overflow-hidden rounded-xl border border-white/5 bg-black/40 p-3 flex flex-col justify-between">
              <div 
                className="absolute inset-0 opacity-40 bg-[url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80')] bg-cover bg-center"
              />
              <div className="relative z-10 flex items-center justify-between text-[8px] font-mono text-white/40">
                <span>CAM_01_FRONT</span>
                <span className="flex items-center gap-1 text-red-400">
                  <span className="size-1 rounded-full bg-red-500 animate-pulse" /> LIVE
                </span>
              </div>
              
              <div className="relative z-10 mx-auto my-auto w-3/4 h-14 border border-red-500 bg-red-500/10 rounded flex flex-col justify-between p-1">
                <span className="self-start text-[7px] font-bold font-mono bg-red-500 text-white px-1 py-0.5 rounded scale-95 origin-top-start">
                  {t("spotDanger.badge")} 99%
                </span>
                <div className="flex justify-between text-red-500 text-[6px]">
                  <span className="size-1 border-b border-s border-red-500" />
                  <span className="size-1 border-b border-e border-red-500" />
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: Take Quicker Action (Spans 1 column) */}
          <div className="benefit-watch group flex flex-col justify-between p-6 rounded-2xl border border-white/10 bg-white/[0.02] hover:border-primary/40 transition-colors col-span-1">
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3">
                <div className={cn("inline-flex size-10 items-center justify-center rounded-xl transition-all duration-300 group-hover:scale-105", configs.quickerAction.iconBg, configs.quickerAction.iconColor)}>
                  <Zap className="size-5" />
                </div>
                <h3 className="font-heading text-lg font-bold tracking-tight text-white group-hover:text-primary transition-colors">
                  {t("quickerAction.title")}
                </h3>
              </div>
              <p className="text-sm leading-relaxed text-white/60">
                {t("quickerAction.body")}
              </p>
            </div>

            {/* Smart Notification visual mockup */}
            <div className="relative h-32 overflow-hidden rounded-xl border border-white/5 bg-black/40 p-3 flex flex-col justify-end">
              <div className="absolute inset-0 bg-gradient-to-t from-amber-500/10 to-transparent" />
              <div className="relative z-10 rounded-lg border border-white/10 bg-white/5 p-2.5 text-[9px] backdrop-blur-md">
                <div className="flex items-center justify-between text-white/40 mb-1">
                  <span className="font-semibold text-white/80">BAROSEC SECURE</span>
                  <span>1m ago</span>
                </div>
                <p className="font-bold text-white">Motion · Person detected</p>
                <p className="text-white/60">Front Door · Verify alert</p>
                <div className="mt-1.5 flex gap-1">
                  <span className="rounded bg-primary/20 px-1.5 py-0.5 text-[7px] font-bold text-primary">Verify Video</span>
                  <span className="rounded bg-red-500/20 px-1.5 py-0.5 text-[7px] font-bold text-red-400">Call Police</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 4: Smart Activity Zones (Spans 1 column) */}
          <div className="benefit-watch group flex flex-col justify-between p-6 rounded-2xl border border-white/10 bg-white/[0.02] hover:border-primary/40 transition-colors col-span-1">
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3">
                <div className={cn("inline-flex size-10 items-center justify-center rounded-xl transition-all duration-300 group-hover:scale-105", configs.smartZones.iconBg, configs.smartZones.iconColor)}>
                  <MapPinned className="size-5" />
                </div>
                <h3 className="font-heading text-lg font-bold tracking-tight text-white group-hover:text-primary transition-colors">
                  {t("smartZones.title")}
                </h3>
              </div>
              <p className="text-sm leading-relaxed text-white/60">
                {t("smartZones.body")}
              </p>
            </div>

            {/* Interactive zone map vector mockup */}
            <div className="relative h-32 overflow-hidden rounded-xl border border-white/5 bg-black/40 p-3 flex flex-col justify-between">
              <div 
                className="absolute inset-0 opacity-25 bg-[url('https://images.unsplash.com/photo-1558036117-15d82a90b9b1?auto=format&fit=crop&w=600&q=80')] bg-cover bg-center"
              />
              <div className="relative z-10 flex items-center justify-between text-[8px] font-mono text-white/40">
                <span>ZONE_MAPPING</span>
                <span className="text-primary font-bold">ACTIVE</span>
              </div>
              <div className="relative z-10 w-full h-16 border border-white/10 rounded overflow-hidden bg-black/30">
                <svg className="absolute inset-0 size-full" viewBox="0 0 100 50">
                  <defs>
                    <pattern id="cardGrid" width="10" height="10" patternUnits="userSpaceOnUse">
                      <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5" strokeOpacity="0.08" />
                    </pattern>
                  </defs>
                  <rect width="100" height="50" fill="url(#cardGrid)" />
                  <polygon points="25,10 75,12 65,38 35,32" fill="oklch(var(--primary) / 0.15)" stroke="oklch(var(--primary))" strokeWidth="1.5" strokeDasharray="3 2" />
                  <circle cx="25" cy="10" r="1" fill="white" stroke="oklch(var(--primary))" strokeWidth="0.75" />
                  <circle cx="75" cy="12" r="1" fill="white" stroke="oklch(var(--primary))" strokeWidth="0.75" />
                  <circle cx="65" cy="38" r="1" fill="white" stroke="oklch(var(--primary))" strokeWidth="0.75" />
                  <circle cx="35" cy="32" r="1" fill="white" stroke="oklch(var(--primary))" strokeWidth="0.75" />
                </svg>
                <div className="absolute bottom-1 start-1.5 text-[6px] font-mono bg-primary text-primary-foreground px-1 py-0.5 rounded font-bold">
                  ZONE 1
                </div>
              </div>
            </div>
          </div>

          {/* Card 5: Store & Share Important Moments (Spans 1 column) */}
          <div className="benefit-watch group flex flex-col justify-between p-6 rounded-2xl border border-white/10 bg-white/[0.02] hover:border-primary/40 transition-colors col-span-1">
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3">
                <div className={cn("inline-flex size-10 items-center justify-center rounded-xl transition-all duration-300 group-hover:scale-105", configs.storeShare.iconBg, configs.storeShare.iconColor)}>
                  <Share2 className="size-5" />
                </div>
                <h3 className="font-heading text-lg font-bold tracking-tight text-white group-hover:text-primary transition-colors">
                  {t("storeShare.title")}
                </h3>
              </div>
              <p className="text-sm leading-relaxed text-white/60">
                {t("storeShare.body")}
              </p>
            </div>

            {/* Video timeline / Cloud sharing visual mockup */}
            <div className="relative h-32 overflow-hidden rounded-xl border border-white/5 bg-black/40 p-3 flex flex-col justify-between">
              <div className="relative z-10 flex items-center justify-between text-[8px] font-mono text-white/40">
                <span>CLOUD_STORAGE</span>
                <span>MP4 FORMAT</span>
              </div>
              <div className="relative z-10 flex flex-col gap-1.5 w-full">
                <div className="flex gap-2 items-center bg-white/5 border border-white/10 rounded-lg p-1.5 text-[9px]">
                  <div className="size-5 shrink-0 bg-primary/20 text-primary rounded flex items-center justify-center font-bold text-[7px]">
                    CLIP
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold truncate text-white">Event_Clip_14.mp4</p>
                    <p className="text-[7px] text-white/40">Cloud Saved</p>
                  </div>
                  <div className="size-5 rounded-full bg-white/10 flex items-center justify-center text-white/80">
                    <Share2 className="size-2.5" />
                  </div>
                </div>
                <div className="flex gap-1 items-center px-1 text-[7px] text-white/30 font-mono">
                  <span>0:00</span>
                  <div className="flex-1 h-0.5 bg-white/10 rounded-full overflow-hidden relative">
                    <div className="absolute top-0 start-0 h-full w-3/4 bg-primary" />
                  </div>
                  <span>0:30</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 6: Personalized Alerts (Spans all 3 columns at the bottom) */}
          <div className="benefit-watch group flex flex-col justify-between p-6 md:p-8 rounded-2xl border border-white/10 bg-white/[0.02] hover:border-primary/40 transition-colors lg:col-span-3">
            <div className="flex flex-col lg:flex-row gap-6 justify-between items-start lg:items-center w-full">
              <div className="space-y-3 max-w-xl">
                <div className="flex items-center gap-3">
                  <div className={cn("inline-flex size-10 items-center justify-center rounded-xl transition-all duration-300 group-hover:scale-105", configs.personalized.iconBg, configs.personalized.iconColor)}>
                    <Bell className="size-5" />
                  </div>
                  <h3 className="font-heading text-lg font-bold tracking-tight text-white group-hover:text-primary transition-colors">
                    {t("personalized.title")}
                  </h3>
                </div>
                <p className="text-sm leading-relaxed text-white/60">
                  {t("personalized.body")}
                </p>
              </div>

              {/* Custom Rule Builder simulator interface */}
              <div className="relative w-full lg:w-96 min-h-24 overflow-hidden rounded-xl border border-white/5 bg-black/40 p-4 flex flex-col justify-center shrink-0">
                <div className="flex flex-col gap-2 max-w-sm w-full mx-auto">
                  <div className="flex flex-wrap items-center gap-1.5 text-[9.5px] font-mono">
                    <span className="text-primary font-bold">IF</span>
                    <div className="bg-white/5 border border-white/10 px-1.5 py-0.5 rounded text-white font-semibold">
                      Backyard CAM
                    </div>
                    <span className="text-white/40">detects</span>
                    <div className="bg-red-500/10 border border-red-500/20 px-1.5 py-0.5 rounded text-red-400 font-semibold">
                      Person
                    </div>
                  </div>
                  <div className="h-2 w-0.5 bg-white/10 ms-2" />
                  <div className="flex flex-wrap items-center gap-1.5 text-[9.5px] font-mono">
                    <span className="text-primary font-bold">THEN</span>
                    <div className="bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded text-emerald-400 font-semibold">
                      Siren Alarm
                    </div>
                    <span className="text-white/40">&</span>
                    <div className="bg-white/5 border border-white/10 px-1.5 py-0.5 rounded text-white font-semibold">
                      Alert Family
                    </div>
                  </div>
                </div>
                <div className="absolute top-1.5 end-2 text-[7px] font-mono text-white/20 select-none">
                  RULE_BUILDER_V2
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Dynamic CTA at the bottom */}
        <div className="mt-16 text-center">
          <a
            href="#pricing"
            className={cn(
              buttonVariants({ size: "lg" }),
              "rounded-full px-8 transition-all duration-300 hover:scale-[1.02] cursor-pointer"
            )}
          >
            {t("cta")}
          </a>
        </div>
      </div>
    </section>
  );
}
