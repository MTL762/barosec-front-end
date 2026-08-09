import { setRequestLocale } from "next-intl/server";
import { SiteHeader } from "@/components/secure/site-header";
import { SiteFooter } from "@/components/secure/site-footer";
import { PricingSection } from "@/components/secure/pricing-section";
import { ScrollProgress } from "@/components/secure/scroll-progress";
import { getSubscriptionPlansApi } from "@/lib/api";

type Props = { params: Promise<{ locale: string }> };

export default async function PlansPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  // Server Side Data Fetching
  const plansRes = await getSubscriptionPlansApi();
  const initialPlans = (plansRes.data && Array.isArray(plansRes.data)) ? plansRes.data : [];

  return (
    <>
      <ScrollProgress />
      <SiteHeader />
      <main className="flex-1">
        <PricingSection initialPlans={initialPlans} />
      </main>
      <SiteFooter />
    </>
  );
}
