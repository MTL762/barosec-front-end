"use client";

import { useTranslations } from "next-intl";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type FaqItem = { q: string; a: string };

export function FaqSection() {
  const t = useTranslations("Faq");
  const generalItems = t.raw("generalItems") as FaqItem[];
  const trialItems = t.raw("trialItems") as FaqItem[];

  return (
    <section id="faq" className="scroll-mt-20 py-16 sm:py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <h2 className="watch-section-head mb-10 text-center font-heading text-3xl font-bold text-ink sm:text-4xl">
          {t("title")}
        </h2>

        <Tabs defaultValue="general" className="watch-block">
          <TabsList className="mx-auto mb-8 grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="general">{t("general")}</TabsTrigger>
            <TabsTrigger value="trial">{t("trial")}</TabsTrigger>
          </TabsList>

          <TabsContent value="general">
            <Accordion>
              {generalItems.map((item, i) => (
                <AccordionItem key={item.q} value={`g-${i}`}>
                  <AccordionTrigger className="text-start font-semibold">
                    {item.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">
                    {item.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </TabsContent>

          <TabsContent value="trial">
            <Accordion>
              {trialItems.map((item, i) => (
                <AccordionItem key={item.q} value={`t-${i}`}>
                  <AccordionTrigger className="text-start font-semibold">
                    {item.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">
                    {item.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}
