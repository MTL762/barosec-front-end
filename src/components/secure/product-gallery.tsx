"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Camera, Shield, Zap, Info } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ProductKey = "ultra2" | "pro5s" | "essential" | "doorbell" | "floodlight";

type ProductItem = {
  id: ProductKey;
  category: "camera" | "doorbell" | "floodlight";
  price: string;
  imageUrl: string;
};

const gallery: ProductItem[] = [
  {
    id: "ultra2",
    category: "camera",
    price: "$299.99",
    imageUrl: "https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "pro5s",
    category: "camera",
    price: "$189.99",
    imageUrl: "https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "essential",
    category: "camera",
    price: "$99.99",
    imageUrl: "https://images.unsplash.com/photo-1528319725582-ddc096101511?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "doorbell",
    category: "doorbell",
    price: "$149.99",
    imageUrl: "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "floodlight",
    category: "floodlight",
    price: "$249.99",
    imageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
  },
];

export function ProductGallery() {
  const t = useTranslations("Gallery");
  const [activeFilter, setActiveFilter] = useState<"all" | "camera" | "doorbell" | "floodlight">("all");

  const filteredGallery = gallery.filter(
    (p) => activeFilter === "all" || p.category === activeFilter
  );

  return (
    <div className="space-y-16">
      {/* Category Filter Tabs */}
      <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
        {(["all", "camera", "doorbell", "floodlight"] as const).map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={cn(
              "rounded-full px-5 py-2 text-xs font-semibold uppercase tracking-wider transition-all duration-300 cursor-pointer border",
              activeFilter === filter
                ? "bg-primary text-primary-foreground border-primary shadow-md shadow-primary/10"
                : "bg-surface text-muted-foreground border-border/80 hover:bg-accent hover:text-foreground"
            )}
          >
            {filter === "all" && t("filterAll")}
            {filter === "camera" && t("filterCameras")}
            {filter === "doorbell" && t("filterDoorbells")}
            {filter === "floodlight" && t("filterFloodlights")}
          </button>
        ))}
      </div>

      {/* Cardless Split Row Layout */}
      <div className="space-y-20">
        {filteredGallery.map((p, index) => {
          const itemT = t.raw(`gallaryList.${p.id}`);
          const isEven = index % 2 === 0;

          return (
            <div
              key={p.id}
              className={cn(
                "flex flex-col lg:flex-row items-center gap-8 lg:gap-16 py-8 border-b border-border/40 last:border-b-0",
                isEven ? "lg:flex-row" : "lg:flex-row-reverse"
              )}
            >
              {/* Product Image Section */}
              <div className="w-full lg:w-1/2 relative group overflow-hidden rounded-2xl bg-muted aspect-video shadow-sm">
                <img
                  src={p.imageUrl}
                  alt={itemT.name}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-102"
                />
                
                {/* Minimal Overlay & Viewfinder Lines */}
                <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent" />
                <div className="absolute top-4 start-4 flex size-8 items-center justify-center rounded-lg bg-background/90 text-primary shadow-sm backdrop-blur-sm">
                  {p.category === "camera" && <Camera className="size-4" />}
                  {p.category === "doorbell" && <Shield className="size-4" />}
                  {p.category === "floodlight" && <Zap className="size-4" />}
                </div>

                <div className="absolute top-4 end-4 rounded-full bg-primary px-3 py-0.5 text-[10px] font-bold text-primary-foreground tracking-wider uppercase">
                  {itemT.tag}
                </div>
              </div>

              {/* Product Info Section */}
              <div className="w-full lg:w-1/2 space-y-6">
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="font-heading text-2xl font-bold tracking-tight text-ink">
                    {itemT.name}
                  </h3>
                  <span className="font-heading text-xl font-extrabold text-primary">
                    {p.price}
                  </span>
                </div>

                <p className="text-base text-muted-foreground leading-relaxed">
                  {itemT.description}
                </p>

                {/* Specs Grid */}
                <div className="pt-2">
                  <h4 className="text-[10px] font-bold text-ink uppercase tracking-widest flex items-center gap-2 mb-3">
                    <Info className="size-3.5 text-primary" />
                    {t("specs")}
                  </h4>
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div className="border-l border-border/80 pl-3">
                      <span className="block text-muted-foreground/80 mb-0.5">
                        {t("resolution")}
                      </span>
                      <span className="font-bold text-ink">{itemT.resolution}</span>
                    </div>
                    <div className="border-l border-border/80 pl-3">
                      <span className="block text-muted-foreground/80 mb-0.5">
                        {t("fov")}
                      </span>
                      <span className="font-bold text-ink">{itemT.fov}</span>
                    </div>
                    <div className="border-l border-border/80 pl-3">
                      <span className="block text-muted-foreground/80 mb-0.5">
                        {t("power")}
                      </span>
                      <span className="font-bold text-ink">{itemT.power}</span>
                    </div>
                    <div className="border-l border-border/80 pl-3">
                      <span className="block text-muted-foreground/80 mb-0.5">
                        {t("connection")}
                      </span>
                      <span className="font-bold text-ink">{itemT.connection}</span>
                    </div>
                  </div>
                </div>

                {/* Action CTA */}
                <div className="pt-4">
                  <a
                    href="#pricing"
                    className={cn(
                      buttonVariants({ variant: "default", size: "lg" }),
                      "rounded-full px-8 cursor-pointer font-semibold transition-all duration-300 hover:scale-[1.02]"
                    )}
                  >
                    {t("buyNow")}
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
