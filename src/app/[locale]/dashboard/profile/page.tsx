import { getProfileApi } from "@/lib/api";
import { setRequestLocale } from "next-intl/server";
import { ProfilePageClient } from "./ProfilePageClient";
import type { UserProfile } from "@/lib/api/types";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function ProfileDashboardPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  // Server-side data fetch — fetchHelper reads the auth token from the request cookie
  let initialProfile: UserProfile | null = null;
  try {
    const { data } = await getProfileApi();
    if (data) {
      // API may return the profile wrapped in data.data or directly as data
      const raw = data as unknown as Record<string, unknown>;
      initialProfile = ((raw?.data as UserProfile) ?? (data as unknown as UserProfile)) || null;
    }
  } catch {
    // If SSR fetch fails (no token yet) the client component will use auth context
  }

  return <ProfilePageClient initialProfile={initialProfile} />;
}
