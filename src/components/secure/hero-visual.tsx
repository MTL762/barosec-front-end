"use client";

import { useState, useEffect } from "react";
import { Sun, Moon, Wifi, Battery, ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";

interface SimulatorAlert {
  event: string;
  location: string;
}

interface HeroVisualProps {
  translations: {
    live: string;
    dayMode: string;
    nightVision: string;
    pills: {
      person: string;
      vehicle: string;
      package: string;
      animal: string;
    };
    alerts: {
      title: string;
      person: SimulatorAlert;
      vehicle: SimulatorAlert;
      package: SimulatorAlert;
      animal: SimulatorAlert;
    };
  };
}

type PillType = "person" | "vehicle" | "package" | "animal";

export function HeroVisual({ translations }: HeroVisualProps) {
  const [mode, setMode] = useState<"day" | "night">("day");
  const [selectedPill, setSelectedPill] = useState<PillType>("person");
  const [timeStr, setTimeStr] = useState("");
  const [triggerTransition, setTriggerTransition] = useState(false);
  const [animateAlertKey, setAnimateAlertKey] = useState(0);

  // Update time for the dynamic camera HUD feed
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Trigger scanline swipe animation when mode changes
  const handleModeChange = (newMode: "day" | "night") => {
    if (newMode !== mode) {
      setTriggerTransition(true);
      setMode(newMode);
      const timer = setTimeout(() => setTriggerTransition(false), 800);
      return () => clearTimeout(timer);
    }
  };

  // Change pill and restart notification animation
  const selectPill = (pill: PillType) => {
    setSelectedPill(pill);
    setAnimateAlertKey((prev) => prev + 1);
  };

  // Bounding box coordinates for different targets
  const getTargetPosition = () => {
    switch (selectedPill) {
      case "person":
        return {
          top: "22%",
          left: "48%",
          width: "22%",
          height: "56%",
          label: `${translations.pills.person} 99%`,
        };
      case "vehicle":
        return {
          top: "42%",
          left: "10%",
          width: "44%",
          height: "40%",
          label: `${translations.pills.vehicle} 97%`,
        };
      case "package":
        return {
          top: "54%",
          left: "75%",
          width: "14%",
          height: "16%",
          label: `${translations.pills.package} 95%`,
        };
      case "animal":
        return {
          top: "60%",
          left: "38%",
          width: "16%",
          height: "22%",
          label: `${translations.pills.animal} 91%`,
        };
    }
  };

  const target = getTargetPosition();
  const alertData = translations.alerts[selectedPill];

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* High Fidelity Camera Feed Screen */}
      <div className="relative aspect-[4/5] md:aspect-[4/3] overflow-hidden rounded-3xl border border-border/70 bg-black shadow-2xl shadow-primary/20">
        
        {/* Unsplash background image with Day/Night Filters */}
        <div
          className={cn(
            "absolute inset-0 size-full transition-all duration-700 ease-out select-none",
            mode === "night"
              ? "grayscale contrast-[1.25] brightness-[0.75] sepia-[20%] hue-rotate-[85deg]"
              : ""
          )}
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {/* Night Vision Overlay tint for authentic look */}
          {mode === "night" && (
            <div className="pointer-events-none absolute inset-0 bg-emerald-500/10 mix-blend-color-burn" />
          )}
        </div>

        {/* Scanline Sweep animation on mode change */}
        {triggerTransition && (
          <div className="pointer-events-none absolute inset-x-0 z-20 h-1 bg-primary shadow-[0_0_15px_oklch(var(--primary))] animate-scanline" />
        )}

        {/* Camera HUD Grid lines/brackets */}
        <div className="pointer-events-none absolute inset-0 z-10 p-4 md:p-6 flex flex-col justify-between text-white select-none">
          {/* Top HUD elements */}
          <div className="flex items-center justify-between text-[10px] md:text-[11px] font-mono tracking-wider bg-black/40 px-3 py-1.5 rounded-full backdrop-blur-sm w-full">
            <div className="flex items-center gap-1.5">
              <span className="relative flex size-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full size-2 bg-red-600"></span>
              </span>
              <span>{translations.live}</span>
            </div>
            <div>CAM_02</div>
            <div dir="ltr">{timeStr || "12:00:00"}</div>
            <div className="flex items-center gap-1.5" dir="ltr">
              <Wifi className="size-3" />
              <Battery className="size-3" />
              <span>85%</span>
            </div>
          </div>

          {/* Viewfinder brackets */}
          <div className="absolute inset-3 md:inset-4 pointer-events-none border border-white/5 rounded-2xl">
            {/* Top-left corner */}
            <div className="absolute top-0 left-0 size-3 md:size-4 border-t border-l border-white/40 rounded-tl" />
            {/* Top-right corner */}
            <div className="absolute top-0 right-0 size-3 md:size-4 border-t border-r border-white/40 rounded-tr" />
            {/* Bottom-left corner */}
            <div className="absolute bottom-0 left-0 size-3 md:size-4 border-b border-l border-white/40 rounded-bl" />
            {/* Bottom-right corner */}
            <div className="absolute bottom-0 right-0 size-3 md:size-4 border-b border-r border-white/40 rounded-br" />
          </div>

          {/* Dynamic target tracking bounding box */}
          <div
            className="absolute z-20 border border-primary bg-primary/10 transition-all duration-500 ease-out flex flex-col justify-between p-1 shadow-[0_0_10px_oklch(var(--primary)/0.25)] rounded"
            style={{
              top: target.top,
              left: target.left,
              width: target.width,
              height: target.height,
            }}
          >
            {/* Corner tags for bounding box */}
            <div className="absolute -top-1 -left-1 size-1.5 border-t border-l border-primary" />
            <div className="absolute -top-1 -right-1 size-1.5 border-t border-r border-primary" />
            <div className="absolute -bottom-1 -left-1 size-1.5 border-b border-l border-primary" />
            <div className="absolute -bottom-1 -right-1 size-1.5 border-b border-r border-primary" />
            
            {/* Target text label */}
            <span className="self-start text-[8px] md:text-[9px] font-bold font-mono bg-primary text-primary-foreground px-1 py-0.5 rounded shadow-sm scale-95 origin-top-left">
              {target.label}
            </span>
          </div>
        </div>

        {/* Early Warning Push Notification Alert Overlay */}
        <div key={animateAlertKey} className="absolute inset-x-4 bottom-4 z-20 md:inset-x-6 md:bottom-6 animate-slide-up">
          <div className="relative flex items-center justify-between gap-4 overflow-hidden rounded-2xl border border-white/10 bg-black/60 p-4 text-white backdrop-blur-md transition-all duration-300 shadow-xl select-none">
            <div className="flex items-start gap-3 text-start">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/25 text-primary border border-primary/35">
                <ShieldAlert className="size-5" />
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-white/70">
                  <span className="relative flex size-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
                    <span className="relative inline-flex rounded-full size-2 bg-primary"></span>
                  </span>
                  {translations.alerts.title}
                </div>
                <p className="text-sm font-semibold text-white tracking-wide leading-tight">
                  {alertData.event}
                </p>
                <p className="text-xs text-white/60">
                  {alertData.location}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Simulator Control Board */}
      <div className="flex flex-col gap-4 p-4 rounded-2xl bg-surface border border-border/50">
        <div className="flex flex-wrap gap-3 items-center justify-between">
          {/* Threat selector pills */}
          <div className="flex flex-wrap gap-1.5">
            {(["person", "vehicle", "package", "animal"] as PillType[]).map((pill) => (
              <button
                key={pill}
                onClick={() => selectPill(pill)}
                className={cn(
                  "px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-200 border cursor-pointer select-none",
                  selectedPill === pill
                    ? "bg-primary border-primary text-primary-foreground shadow-sm shadow-primary/25"
                    : "bg-background border-border hover:bg-muted text-muted-foreground hover:text-ink"
                )}
              >
                {translations.pills[pill]}
              </button>
            ))}
          </div>

          {/* Day / Night Switcher */}
          <div className="flex items-center bg-background border border-border/80 rounded-full p-1 self-end">
            <button
              onClick={() => handleModeChange("day")}
              title={translations.dayMode}
              className={cn(
                "p-1.5 rounded-full transition-all duration-200 cursor-pointer select-none",
                mode === "day"
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-ink"
              )}
            >
              <Sun className="size-4" />
            </button>
            <button
              onClick={() => handleModeChange("night")}
              title={translations.nightVision}
              className={cn(
                "p-1.5 rounded-full transition-all duration-200 cursor-pointer select-none",
                mode === "night"
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-ink"
              )}
            >
              <Moon className="size-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
