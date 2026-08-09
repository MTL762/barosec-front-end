"use client";

import { useTranslations } from "next-intl";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { featureDetailKeys } from "@/data/secure-plans";

export function FeatureDetails() {
  const t = useTranslations("FeatureDetails");

  return (
    <section id="features" className="scroll-mt-20 py-16 sm:py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <h2 className="watch-section-head mb-10 text-center font-heading text-3xl font-bold text-ink sm:text-4xl">
          {t("title")}
        </h2>
        <Accordion className="watch-block w-full">
          {featureDetailKeys.map((key) => {
            const bullets = t.raw(`${key}.bullets`) as string[];
            return (
              <AccordionItem key={key} value={key}>
                <AccordionTrigger className="text-start text-base font-semibold">
                  {t(`${key}.title`)}
                </AccordionTrigger>
                <AccordionContent>
                  <p className="mb-3 text-muted-foreground leading-relaxed">
                    {t(`${key}.body`)}
                  </p>
                  {Array.isArray(bullets) && bullets.length > 0 && (
                    <ul className="space-y-2 ps-1">
                      {bullets.map((item) => (
                        <li
                          key={item}
                          className="flex gap-2 text-sm text-foreground/85"
                        >
                          <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </div>
    </section>
  );
}
