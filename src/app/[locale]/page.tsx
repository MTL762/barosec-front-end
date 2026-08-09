import { setRequestLocale } from "next-intl/server";
import { SiteHeader } from "@/components/secure/site-header";
import { ScrollProgress } from "@/components/secure/scroll-progress";
import { Hero } from "@/components/secure/hero";
import { CameraShowcase } from "@/components/secure/camera-showcase";
import { PricingSection } from "@/components/secure/pricing-section";
import { FeatureDetails } from "@/components/secure/feature-details";
import { BenefitsSection } from "@/components/secure/benefits-section";
import { CommunitySection } from "@/components/secure/community-section";
import { SupportSection } from "@/components/secure/support-section";
import { FaqSection } from "@/components/secure/faq-section";
import { Footnotes } from "@/components/secure/footnotes";
import { SiteFooter } from "@/components/secure/site-footer";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function SecurePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <ScrollProgress />
      <SiteHeader />
      <main className="flex-1">
        <Hero />
        {/* <CameraShowcase /> */}
        <PricingSection />
        <FeatureDetails />
        <BenefitsSection />
        {/* <CommunitySection /> */}
        {/* <SupportSection /> */}
        <FaqSection />
        <Footnotes />
      </main>
      <SiteFooter />
    </>
  );
}
