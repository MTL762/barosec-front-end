import { setRequestLocale } from "next-intl/server";
import { listUsersAdminApi } from "@/lib/api";
import type { AdminUserApiItem, PaginationMeta } from "@/lib/api/types";
import AdminUsersClient from "@/components/admin/users/AdminUsersClient";

interface PageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ page?: string; search?: string }>;
}

export default async function AdminUsersPage({ params, searchParams }: PageProps) {
  const { locale } = await params;
  const { page, search } = await searchParams;

  setRequestLocale(locale);

  const pageNum = page ? Math.max(1, parseInt(page, 10) || 1) : 1;

  let initialUsers: AdminUserApiItem[] = [];
  let initialMeta: PaginationMeta | null = null;

  try {
    const res = await listUsersAdminApi(pageNum, search);

    if (res.data && Array.isArray(res.data)) {
      initialUsers = res.data as AdminUserApiItem[];
    } else if (res.result && Array.isArray((res.result as any).data)) {
      initialUsers = (res.result as any).data as AdminUserApiItem[];
    }

    if (res.meta) {
      initialMeta = res.meta as PaginationMeta;
    } else if (res.result && (res.result as any).meta) {
      initialMeta = (res.result as any).meta as PaginationMeta;
    }
  } catch (error) {
    console.error("[AdminUsersPage SSR Fetch Error]:", error);
  }

  return (
    <AdminUsersClient
      initialUsers={initialUsers}
      initialMeta={initialMeta}
      initialPage={pageNum}
    />
  );
}
