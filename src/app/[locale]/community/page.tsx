import { setRequestLocale } from "next-intl/server";
import { SiteHeader } from "@/components/secure/site-header";
import { SiteFooter } from "@/components/secure/site-footer";
import { CommunitySection } from "@/components/secure/community-section";
import { ScrollProgress } from "@/components/secure/scroll-progress";

type Props = { params: Promise<{ locale: string }> };

export default async function CommunityPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <ScrollProgress />
      <SiteHeader />
      <main className="flex-1">
        <CommunitySection />
      </main>
      <SiteFooter />
    </>
  );
}
