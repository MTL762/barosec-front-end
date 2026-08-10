"use client";

import React from "react";
import {
  Search,
  X,
  Edit3,
  Trash2,
  Shield,
  UserCheck,
  UserX,
  CheckCircle2,
  AlertCircle,
  Mail,
  Phone,
  ChevronLeft,
  ChevronRight,
  User,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { AdminUserApiItem, PaginationMeta } from "@/lib/api";

interface UsersTableProps {
  users: AdminUserApiItem[];
  meta: PaginationMeta | null;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  roleFilter: string;
  onRoleFilterChange: (role: string) => void;
  onEditUser: (user: AdminUserApiItem) => void;
  onDeleteUser: (user: AdminUserApiItem) => void;
  onPageChange: (page: number) => void;
  loading?: boolean;
}

export function UsersTable({
  users,
  meta,
  searchQuery,
  onSearchChange,
  roleFilter,
  onRoleFilterChange,
  onEditUser,
  onDeleteUser,
  onPageChange,
  loading = false,
}: UsersTableProps) {
  const t = useTranslations("AdminUsers");

  const getRoleName = (u: AdminUserApiItem) => {
    if (!u.role) return t("roleUnknown");
    if (typeof u.role === "string") return u.role;
    return u.role.name || t("roleUnknown");
  };

  const isRoleAdmin = (u: AdminUserApiItem) => {
    const r = getRoleName(u).toLowerCase();
    return r.includes("admin") || r.includes("مسؤول");
  };

  return (
    <div className="db-card rounded-2xl border border-border bg-card shadow-sm overflow-hidden space-y-0">
      {/* Table Toolbar */}
      <div className="p-4 border-b border-border bg-muted/20 flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute start-3 top-2.5 size-4 text-muted-foreground" />
          <input
            type="text"
            placeholder={t("searchPlaceholder")}
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full ps-9 pe-8 py-2 rounded-xl border border-input bg-background text-foreground text-xs focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute end-2.5 top-2.5 text-muted-foreground hover:text-foreground p-0.5 rounded-full"
            >
              <X className="size-3.5" />
            </button>
          )}
        </div>

        {/* Role Filter & Counter */}
        <div className="w-full sm:w-auto flex items-center justify-between sm:justify-end gap-3">
          <select
            value={roleFilter}
            onChange={(e) => onRoleFilterChange(e.target.value)}
            className="px-3 py-2 rounded-xl border border-input bg-background text-foreground text-xs font-semibold focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all cursor-pointer"
          >
            <option value="all">{t("filterRole")}</option>
            <option value="admin">{t("roleAdmin")}</option>
            <option value="user">{t("roleUser")}</option>
          </select>

          <div className="text-xs font-mono font-bold bg-primary/10 text-primary border border-primary/20 px-3 py-1.5 rounded-xl whitespace-nowrap">
            {users.length} {t("roleUser")}
          </div>
        </div>
      </div>

      {/* Users Desktop Table & Mobile Cards */}
      {loading ? (
        <div className="p-12 text-center text-xs text-muted-foreground space-y-2">
          <div className="inline-block size-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <div>{t("loadingUsers")}</div>
        </div>
      ) : users.length === 0 ? (
        <div className="p-12 text-center space-y-2">
          <div className="p-3 rounded-full bg-muted w-fit mx-auto text-muted-foreground">
            <UserX className="size-6" />
          </div>
          <div className="text-sm font-bold text-foreground">{t("noUsersFound")}</div>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            {t("noUsersDesc")}
          </p>
          {searchQuery && (
            <button
              onClick={() => onSearchChange("")}
              className="mt-2 px-3 py-1.5 rounded-lg bg-primary/10 text-primary font-semibold text-xs hover:bg-primary/20 transition-colors"
            >
              {t("clearSearch")}
            </button>
          )}
        </div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-start text-xs border-collapse">
              <thead>
                <tr className="border-b border-border bg-muted/40 text-muted-foreground font-semibold text-[11px] uppercase tracking-wider">
                  <th className="py-3 px-4 text-start">ID</th>
                  <th className="py-3 px-4 text-start">{t("name")}</th>
                  <th className="py-3 px-4 text-start">{t("email")}</th>
                  <th className="py-3 px-4 text-start">{t("role")}</th>
                  <th className="py-3 px-4 text-start">{t("status")}</th>
                  <th className="py-3 px-4 text-end">{t("actions")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {users.map((user) => {
                  const isAdmin = isRoleAdmin(user);
                  const roleName = getRoleName(user);
                  const isEmailVerified = Boolean(user.email_verified_at);

                  return (
                    <tr
                      key={String(user.id)}
                      className="hover:bg-muted/30 transition-colors group"
                    >
                      {/* ID */}
                      <td className="py-3.5 px-4 font-mono text-[11px] text-muted-foreground font-medium">
                        #{user.id}
                      </td>

                      {/* Name & Avatar */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="relative size-9 rounded-full bg-gradient-to-tr from-primary/20 to-primary/5 border border-primary/20 text-primary flex items-center justify-center font-bold text-xs uppercase shrink-0 shadow-xs">
                            {user.avatar ? (
                              <img
                                src={user.avatar}
                                alt={user.name}
                                className="size-full rounded-full object-cover"
                              />
                            ) : user.name ? (
                              user.name.slice(0, 2)
                            ) : (
                              <User className="size-4" />
                            )}
                          </div>
                          <div>
                            <div className="font-bold text-foreground group-hover:text-primary transition-colors flex items-center gap-1.5">
                              <span>{user.name}</span>
                              {isAdmin && (
                                <Shield className="size-3.5 text-amber-500 fill-amber-500/20" />
                              )}
                            </div>
                            {user.phone && (
                              <div className="text-[10px] text-muted-foreground font-mono flex items-center gap-1 mt-0.5">
                                <Phone className="size-2.5" />
                                <span>{user.phone}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Email */}
                      <td className="py-3.5 px-4 font-mono text-muted-foreground">
                        <div className="flex items-center gap-1.5">
                          <Mail className="size-3 text-muted-foreground/70" />
                          <span>{user.email}</span>
                        </div>
                      </td>

                      {/* Role Badge */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold border ${
                            isAdmin
                              ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
                              : "bg-muted text-foreground border-border"
                          }`}
                        >
                          {isAdmin ? (
                            <Shield className="size-3" />
                          ) : (
                            <User className="size-3" />
                          )}
                          <span>{roleName}</span>
                        </span>
                      </td>

                      {/* Verification Status */}
                      <td className="py-3.5 px-4">
                        {isEmailVerified ? (
                          <span
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-[11px] font-semibold"
                            title={user.email_verified_at ? `Verified: ${user.email_verified_at}` : undefined}
                          >
                            <CheckCircle2 className="size-3" />
                            <span>{t("verified")}</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 text-[11px] font-semibold">
                            <AlertCircle className="size-3" />
                            <span>{t("unverified")}</span>
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-end">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onEditUser(user)}
                            className="p-2 rounded-xl text-muted-foreground hover:text-primary hover:bg-primary/10 border border-transparent hover:border-primary/20 transition-all cursor-pointer"
                            title={t("editUser")}
                          >
                            <Edit3 className="size-4" />
                          </button>
                          <button
                            onClick={() => onDeleteUser(user)}
                            className="p-2 rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/10 border border-transparent hover:border-destructive/20 transition-all cursor-pointer"
                            title={t("deleteUser")}
                          >
                            <Trash2 className="size-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="block md:hidden divide-y divide-border">
            {users.map((user) => {
              const isAdmin = isRoleAdmin(user);
              const roleName = getRoleName(user);
              const isEmailVerified = Boolean(user.email_verified_at);

              return (
                <div key={String(user.id)} className="p-4 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="size-10 rounded-full bg-gradient-to-tr from-primary/20 to-primary/5 border border-primary/20 text-primary flex items-center justify-center font-bold text-xs uppercase shrink-0">
                        {user.avatar ? (
                          <img src={user.avatar} alt={user.name} className="size-full rounded-full object-cover" />
                        ) : user.name ? (
                          user.name.slice(0, 2)
                        ) : (
                          <User className="size-4" />
                        )}
                      </div>
                      <div>
                        <div className="font-bold text-foreground text-sm flex items-center gap-1.5">
                          <span>{user.name}</span>
                          {isAdmin && <Shield className="size-3.5 text-amber-500" />}
                        </div>
                        <div className="text-xs font-mono text-muted-foreground">{user.email}</div>
                      </div>
                    </div>

                    <span className="text-[10px] font-mono text-muted-foreground">#{user.id}</span>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-md bg-muted text-foreground text-[10px] font-semibold border border-border">
                        {roleName}
                      </span>
                      {isEmailVerified ? (
                        <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-semibold border border-emerald-500/20">
                          {t("verified")}
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[10px] font-semibold border border-amber-500/20">
                          {t("unverified")}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => onEditUser(user)}
                        className="p-1.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                      >
                        <Edit3 className="size-4" />
                      </button>
                      <button
                        onClick={() => onDeleteUser(user)}
                        className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination Controls */}
          {meta && meta.last_page > 1 && (
            <div className="p-4 border-t border-border bg-muted/20 flex items-center justify-between text-xs">
              <div className="text-muted-foreground font-medium">
                {t("pageInfo", { current: meta.current_page, total: meta.last_page })}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onPageChange(meta.current_page - 1)}
                  disabled={meta.current_page <= 1}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-input bg-background font-semibold text-foreground hover:bg-accent disabled:opacity-50 transition-all cursor-pointer"
                >
                  <ChevronRight className="size-4 rtl:rotate-180" />
                  <span>{t("prev")}</span>
                </button>

                <button
                  onClick={() => onPageChange(meta.current_page + 1)}
                  disabled={meta.current_page >= meta.last_page}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-input bg-background font-semibold text-foreground hover:bg-accent disabled:opacity-50 transition-all cursor-pointer"
                >
                  <span>{t("next")}</span>
                  <ChevronLeft className="size-4 rtl:rotate-180" />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
