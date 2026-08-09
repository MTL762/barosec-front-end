"use client";

import { useState, type ReactNode } from "react";
import { useTranslations } from "next-intl";
import {
  Check,
  Minus,
  Film,
  Flame,
  History,
  MapPinned,
  Search,
  ShieldAlert,
  Sparkles,
  UserRound,
  Car,
  Volume2,
  Headphones,
  BadgePercent,
  Package,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  formatPrice,
  plans,
  type BillingPeriod,
  type PlanDefinition,
  type CameraTier,
} from "@/data/secure-plans";

const featureIcons: Record<string, ReactNode> = {
  videoHistory: <History className="size-4" />,
  activityZones: <MapPinned className="size-4" />,
  priorityCare: <Headphones className="size-4" />,
  theftReplacement: <Package className="size-4" />,
  discounts: <BadgePercent className="size-4" />,
  earlyWarning: <ShieldAlert className="size-4" />,
  basicDetection: <Sparkles className="size-4" />,
  personRecognition: <UserRound className="size-4" />,
  vehicleRecognition: <Car className="size-4" />,
  customDetection: <Sparkles className="size-4" />,
  fireDetection: <Flame className="size-4" />,
  audioDetection: <Volume2 className="size-4" />,
  eventCaptions: <Film className="size-4" />,
  videoSearch: <Search className="size-4" />,
  emergencyResponse: <ShieldAlert className="size-4" />,
  professionalMonitoring: <Headphones className="size-4" />,
  emergencyResponse247: <ShieldAlert className="size-4" />,
  barosecSafe: <ShieldAlert className="size-4" />,
  homeInsurance: <BadgePercent className="size-4" />,
  continuousRecording: <Film className="size-4" />,
};

type TableFeature = {
  key: string;
  category: "core" | "earlyWarning" | "emergency" | "recording";
};

const tableFeatures: TableFeature[] = [
  { key: "videoHistory", category: "core" },
  { key: "activityZones", category: "core" },
  { key: "priorityCare", category: "core" },
  { key: "theftReplacement", category: "core" },
  { key: "discounts", category: "core" },
  { key: "earlyWarning", category: "earlyWarning" },
  { key: "basicDetection", category: "earlyWarning" },
  { key: "personRecognition", category: "earlyWarning" },
  { key: "vehicleRecognition", category: "earlyWarning" },
  { key: "customDetection", category: "earlyWarning" },
  { key: "fireDetection", category: "earlyWarning" },
  { key: "audioDetection", category: "earlyWarning" },
  { key: "eventCaptions", category: "earlyWarning" },
  { key: "videoSearch", category: "earlyWarning" },
  { key: "professionalMonitoring", category: "emergency" },
  { key: "emergencyResponse247", category: "emergency" },
  { key: "barosecSafe", category: "emergency" },
  { key: "homeInsurance", category: "emergency" },
  { key: "continuousRecording", category: "recording" },
];

function hasFeature(plan: PlanDefinition, featureKey: string): boolean {
  return (
    plan.coreFeatureKeys.includes(featureKey) ||
    plan.earlyWarningKeys.includes(featureKey) ||
    (plan.emergencyKeys || []).includes(featureKey) ||
    (plan.recordingKeys || []).includes(featureKey)
  );
}

export function PricingSection() {
  const t = useTranslations("Pricing");
  const tPlans = useTranslations("Plans");
  const tFeatures = useTranslations("Features");

  const [billing, setBilling] = useState<BillingPeriod>("annual");
  const [cameraOption, setCameraOption] = useState<CameraTier>("single");

  // Get active pricing tier for each plan
  const getActivePrice = (plan: PlanDefinition) => {
    const activeTier = plan.tiers.find((t) => t.id === cameraOption) || plan.tiers[0];
    return billing === "annual" ? activeTier.annual : activeTier.monthly;
  };

  const getPlanBillingLabel = (plan: PlanDefinition) => {
    const activeTier = plan.tiers.find((t) => t.id === cameraOption) || plan.tiers[0];
    const isFallback = activeTier.id !== cameraOption;
    if (isFallback) return t("unlimitedCameras");
    return cameraOption === "single" ? t("singleCamera") : t("unlimitedCameras");
  };

  return (
    <section id="pricing" className="scroll-mt-20 bg-background py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Header Block */}
        <div className="mx-auto max-w-2xl text-center space-y-4">
          <h2 className="font-heading text-4xl font-extrabold tracking-tight text-ink sm:text-5xl">
            {t("title")}
          </h2>
          <p className="text-lg text-muted-foreground">
            Compare our subscription plans. No card boxes, no unnecessary frames. Clear details, readable hierarchy.
          </p>

          {/* Sleek Segmented Toggles */}
          <div className="pt-4 flex flex-col items-center justify-center gap-4 sm:flex-row">
            {/* Billing Toggle */}
            <div className="inline-flex rounded-full border border-border/80 bg-surface p-1 shadow-sm">
              {(["annual", "monthly"] as const).map((period) => (
                <button
                  key={period}
                  type="button"
                  onClick={() => setBilling(period)}
                  className={cn(
                    "rounded-full px-5 py-2 text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer",
                    billing === period
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {period === "annual" ? t("annual") : t("monthly")}
                </button>
              ))}
            </div>

            {/* Camera Options Toggle */}
            <div className="inline-flex rounded-full border border-border/80 bg-surface p-1 shadow-sm">
              {(["single", "unlimited"] as const).map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setCameraOption(option)}
                  className={cn(
                    "rounded-full px-5 py-2 text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer",
                    cameraOption === option
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {option === "single" ? t("singleCamera") : t("unlimitedCameras")}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 1. Desktop Comparison Layout (Grid-based table structure) */}
        <div className="hidden lg:block mt-16 overflow-hidden">
          <div className="grid grid-cols-4 border-b border-border/50 pb-8 items-end">
            {/* Header Column 1: Blank */}
            <div className="pr-4">
              <h3 className="font-heading text-lg font-bold text-ink">Plans & Pricing</h3>
              <p className="text-xs text-muted-foreground mt-1">Select the features that fit your security needs.</p>
            </div>

            {/* Header Columns 2, 3, 4: Plans */}
            {plans.map((plan) => {
              const price = getActivePrice(plan);
              return (
                <div
                  key={plan.id}
                  className={cn(
                    "px-6 text-center flex flex-col items-center relative",
                    plan.popular && "before:absolute before:-top-10 before:inset-x-0 before:mx-auto before:w-fit before:bg-primary before:text-primary-foreground before:text-[10px] before:font-bold before:px-3 before:py-1 before:rounded-full before:content-['MOST_POPULAR']"
                  )}
                >
                  <h4 className="font-heading text-xl font-bold text-ink">
                    {tPlans(`${plan.id}.name` as "plus.name")}
                  </h4>
                  <p className="text-xs text-muted-foreground mt-1">{getPlanBillingLabel(plan)}</p>
                  
                  <div className="my-4 flex items-baseline justify-center gap-1 text-ink">
                    <span className="text-4xl font-extrabold tracking-tight">${formatPrice(price)}</span>
                    <span className="text-xs text-muted-foreground font-medium">
                      {billing === "annual" ? t("billedAnnually") : t("billedMonthly")}
                    </span>
                  </div>

                  <a
                    href="#pricing"
                    className={cn(
                      buttonVariants({
                        size: "sm",
                        variant: plan.popular ? "default" : "outline",
                      }),
                      "rounded-full w-full max-w-[180px] font-semibold text-xs tracking-wider cursor-pointer"
                    )}
                  >
                    {t("getPlan")}
                  </a>
                </div>
              );
            })}
          </div>

          {/* Table Body rows */}
          <div className="divide-y divide-border/30">
            {/* Group headings & features */}
            {["core", "earlyWarning", "emergency", "recording"].map((cat) => {
              const catFeatures = tableFeatures.filter((f) => f.category === cat);
              if (catFeatures.length === 0) return null;

              // Check if any plan has emergency/recording features to render the category
              if (cat === "emergency" && !plans.some((p) => p.hasEmergency)) return null;
              if (cat === "recording" && !plans.some((p) => p.hasRecording)) return null;

              return (
                <div key={cat} className="py-4">
                  {/* Category Header Row */}
                  <div className="grid grid-cols-4 py-3 bg-surface/40 px-4 rounded-lg font-heading text-xs font-bold text-primary uppercase tracking-wider">
                    <div className="col-span-4">
                      {cat === "core" && t("core")}
                      {cat === "earlyWarning" && t("earlyWarningGroup")}
                      {cat === "emergency" && t("emergencyGroup")}
                      {cat === "recording" && t("recordingGroup")}
                    </div>
                  </div>

                  {/* Feature Rows */}
                  <div className="divide-y divide-border/20">
                    {catFeatures.map((feat) => (
                      <div key={feat.key} className="grid grid-cols-4 py-4 px-4 items-center hover:bg-surface/20 transition-colors">
                        <div className="flex items-center gap-3 pr-4">
                          <span className="text-muted-foreground">{featureIcons[feat.key]}</span>
                          <span className="text-sm font-medium text-foreground">{tFeatures(feat.key as "videoHistory")}</span>
                        </div>

                        {plans.map((plan) => {
                          const hasFeat = hasFeature(plan, feat.key);
                          return (
                            <div key={plan.id} className="flex justify-center text-center">
                              {hasFeat ? (
                                <span className="inline-flex size-6 items-center justify-center rounded-full bg-primary/10 text-primary">
                                  <Check className="size-4 stroke-[3]" />
                                </span>
                              ) : (
                                <span className="text-muted-foreground/35">
                                  <Minus className="size-4" />
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 2. Mobile & Tablet Layout (Open sequential typographic layout instead of cards) */}
        <div className="lg:hidden mt-12 divide-y divide-border">
          {plans.map((plan) => {
            const price = getActivePrice(plan);
            return (
              <div key={plan.id} className="py-10 first:pt-0 last:pb-0 space-y-6">
                {/* Plan Header */}
                <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-heading text-2xl font-bold text-ink">
                        {tPlans(`${plan.id}.name` as "plus.name")}
                      </h3>
                      {plan.popular && (
                        <Badge className="bg-primary text-primary-foreground font-semibold text-[10px] rounded-full">
                          {t("popular")}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {getPlanBillingLabel(plan)}
                    </p>
                  </div>

                  <div className="flex items-baseline gap-1 text-ink">
                    <span className="text-3xl font-extrabold">${formatPrice(price)}</span>
                    <span className="text-xs text-muted-foreground">
                      {billing === "annual" ? t("billedAnnually") : t("billedMonthly")}
                    </span>
                  </div>
                </div>

                <a
                  href="#pricing"
                  className={cn(
                    buttonVariants({
                      size: "lg",
                      variant: plan.popular ? "default" : "outline",
                    }),
                    "w-full rounded-full cursor-pointer transition-transform duration-300 active:scale-[0.98] font-semibold tracking-wide"
                  )}
                >
                  {t("getPlan")}
                </a>

                {/* Features Included List */}
                <div className="space-y-4 pt-4">
                  <h4 className="text-xs font-extrabold uppercase tracking-widest text-primary">
                    Included Features
                  </h4>
                  <ul className="grid gap-3 sm:grid-cols-2 text-sm text-foreground/90">
                    {/* List only positive inclusions */}
                    {tableFeatures
                      .filter((f) => hasFeature(plan, f.key))
                      .map((feat) => (
                        <li key={feat.key} className="flex items-start gap-2.5">
                          <span className="mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                            <Check className="size-3.5 stroke-[3]" />
                          </span>
                          <span className="leading-tight">{tFeatures(feat.key as "videoHistory")}</span>
                        </li>
                      ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
