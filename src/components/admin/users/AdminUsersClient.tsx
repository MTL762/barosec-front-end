"use client";

import React, { useState, useTransition, useMemo } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { CheckCircle2, AlertCircle, RefreshCw } from "lucide-react";
import {
  AdminUserApiItem,
  PaginationMeta,
  createUserAdminApi,
  updateUserAdminApi,
  deleteUserAdminApi,
  listUsersAdminApi,
  CreateAdminUserParams,
  UpdateAdminUserParams,
} from "@/lib/api";
import { UsersStatsHeader } from "./UsersStatsHeader";
import { UsersTable } from "./UsersTable";
import { UserFormModal } from "./UserFormModal";
import { UserDeleteDialog } from "./UserDeleteDialog";

interface AdminUsersClientProps {
  initialUsers: AdminUserApiItem[];
  initialMeta: PaginationMeta | null;
  initialPage?: number;
}

export default function AdminUsersClient({
  initialUsers,
  initialMeta,
  initialPage = 1,
}: AdminUsersClientProps) {
  const t = useTranslations("AdminUsers");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [users, setUsers] = useState<AdminUserApiItem[]>(initialUsers);
  const [meta, setMeta] = useState<PaginationMeta | null>(initialMeta);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [loading, setLoading] = useState(false);

  // Modal States
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [selectedUserForForm, setSelectedUserForForm] = useState<AdminUserApiItem | null>(null);
  const [deletingUser, setDeletingUser] = useState<AdminUserApiItem | null>(null);

  // Feedback Alerts
  const [alert, setAlert] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const showAlert = (type: "success" | "error", message: string) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 4000);
  };

  const fetchUsers = async (page = 1, search = searchQuery) => {
    setLoading(true);
    try {
      const res = await listUsersAdminApi(page, search);
      if (res.data && Array.isArray(res.data)) {
        setUsers(res.data as AdminUserApiItem[]);
      } else if (res.result && Array.isArray((res.result as any).data)) {
        setUsers((res.result as any).data as AdminUserApiItem[]);
      }

      if (res.meta) {
        setMeta(res.meta as PaginationMeta);
      } else if (res.result && (res.result as any).meta) {
        setMeta((res.result as any).meta as PaginationMeta);
      }
    } catch (err: any) {
      showAlert("error", err?.message || t("errorFetchUsers"));
    } finally {
      setLoading(false);
    }
  };

  // Client-side filtering when search or role changes
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      // Role Filter
      if (roleFilter !== "all") {
        const uRole = typeof u.role === "object" && u.role?.name ? u.role.name : String(u.role || "");
        const isUserAdmin = uRole.toLowerCase().includes("admin") || uRole.toLowerCase().includes("مسؤول");
        if (roleFilter === "admin" && !isUserAdmin) return false;
        if (roleFilter === "user" && isUserAdmin) return false;
      }

      // Search Query Filter
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      const nameMatch = (u.name || "").toLowerCase().includes(q);
      const emailMatch = (u.email || "").toLowerCase().includes(q);
      const phoneMatch = (u.phone || "").toLowerCase().includes(q);
      const idMatch = String(u.id).includes(q);

      return nameMatch || emailMatch || phoneMatch || idMatch;
    });
  }, [users, roleFilter, searchQuery]);

  // Actions
  const handleOpenAddModal = () => {
    setSelectedUserForForm(null);
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (user: AdminUserApiItem) => {
    setSelectedUserForForm(user);
    setIsFormModalOpen(true);
  };

  const handleCreateUser = async (data: CreateAdminUserParams) => {
    const res = await createUserAdminApi(data);
    if (res.error) {
      throw new Error(res.error);
    }
    showAlert("success", t("userCreatedSuccess"));
    await fetchUsers(meta?.current_page || 1);
  };

  const handleUpdateUser = async (id: number | string, data: UpdateAdminUserParams) => {
    const res = await updateUserAdminApi(id, data);
    if (res.error) {
      throw new Error(res.error);
    }
    showAlert("success", t("userUpdatedSuccess"));
    await fetchUsers(meta?.current_page || 1);
  };

  const handleDeleteUser = async (id: number | string) => {
    const res = await deleteUserAdminApi(id);
    if (res.error) {
      showAlert("error", res.error);
      return;
    }
    showAlert("success", t("userDeletedSuccess"));
    await fetchUsers(meta?.current_page || 1);
  };

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(newPage));
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
    fetchUsers(newPage);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Toast Alert */}
      {alert && (
        <div
          className={`fixed top-5 end-5 z-50 p-4 rounded-2xl border shadow-xl flex items-center gap-3 text-xs font-semibold animate-in slide-in-from-top-4 duration-300 ${
            alert.type === "success"
              ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30 backdrop-blur-md"
              : "bg-destructive/10 text-destructive border-destructive/30 backdrop-blur-md"
          }`}
        >
          {alert.type === "success" ? (
            <CheckCircle2 className="size-5 shrink-0" />
          ) : (
            <AlertCircle className="size-5 shrink-0" />
          )}
          <span>{alert.message}</span>
        </div>
      )}

      {/* KPI Stats Header */}
      <UsersStatsHeader
        users={users}
        totalFromMeta={meta?.total}
        onOpenAddModal={handleOpenAddModal}
      />

      {/* Main Table & Filters */}
      <UsersTable
        users={filteredUsers}
        meta={meta}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        roleFilter={roleFilter}
        onRoleFilterChange={setRoleFilter}
        onEditUser={handleOpenEditModal}
        onDeleteUser={(u) => setDeletingUser(u)}
        onPageChange={handlePageChange}
        loading={loading || isPending}
      />

      {/* Create / Edit Form Modal */}
      <UserFormModal
        isOpen={isFormModalOpen}
        user={selectedUserForForm}
        onClose={() => setIsFormModalOpen(false)}
        onSubmitCreate={handleCreateUser}
        onSubmitUpdate={handleUpdateUser}
      />

      {/* Delete User Confirmation Dialog */}
      <UserDeleteDialog
        isOpen={Boolean(deletingUser)}
        user={deletingUser}
        onClose={() => setDeletingUser(null)}
        onConfirmDelete={handleDeleteUser}
      />
    </div>
  );
}
