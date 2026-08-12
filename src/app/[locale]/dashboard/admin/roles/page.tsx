"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Key,
  Plus,
  Trash2,
  Loader2,
  Edit3,
  Shield,
  Check,
  X,
  Search,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  CheckSquare,
  Square,
  RefreshCw,
  Layers,
  Sparkles,
  Lock,
} from "lucide-react";
import { useTranslations } from "next-intl";
import {
  listRolesApi,
  createRoleApi,
  deleteRoleApi,
  updateRoleApi,
  RoleApiItem,
  PermissionApiItem,
  PaginationMeta,
} from "@/lib/api";
import { toast } from "sonner";

// ── Catalog Definition for All System Permissions ────────────────────────────

export interface PermissionDefinition {
  id: number;
  name: string;
  group: string;
}

export const ALL_PERMISSIONS: PermissionDefinition[] = [
  // Users
  { id: 1, name: "users.list", group: "Users" },
  { id: 2, name: "users.store", group: "Users" },
  { id: 3, name: "users.view", group: "Users" },
  { id: 4, name: "users.update", group: "Users" },
  { id: 5, name: "users.destroy", group: "Users" },
  // Roles
  { id: 6, name: "roles.list", group: "Roles" },
  { id: 7, name: "roles.store", group: "Roles" },
  { id: 8, name: "roles.view", group: "Roles" },
  { id: 9, name: "roles.update", group: "Roles" },
  { id: 10, name: "roles.destroy", group: "Roles" },
  // Cameras
  { id: 11, name: "cameras.list", group: "Cameras" },
  { id: 12, name: "cameras.store", group: "Cameras" },
  { id: 13, name: "cameras.view", group: "Cameras" },
  { id: 14, name: "cameras.update", group: "Cameras" },
  { id: 15, name: "cameras.destroy", group: "Cameras" },
  { id: 16, name: "cameras.pair", group: "Cameras" },
  { id: 17, name: "cameras.change_mode", group: "Cameras" },
  { id: 18, name: "cameras.toggle_lock", group: "Cameras" },
  // Camera Categories
  { id: 19, name: "camera_categories.list", group: "Camera Categories" },
  { id: 20, name: "camera_categories.store", group: "Camera Categories" },
  { id: 21, name: "camera_categories.view", group: "Camera Categories" },
  { id: 22, name: "camera_categories.update", group: "Camera Categories" },
  { id: 23, name: "camera_categories.destroy", group: "Camera Categories" },
  // Camera Models
  { id: 24, name: "camera_models.list", group: "Camera Models" },
  { id: 25, name: "camera_models.store", group: "Camera Models" },
  { id: 26, name: "camera_models.view", group: "Camera Models" },
  { id: 27, name: "camera_models.update", group: "Camera Models" },
  { id: 28, name: "camera_models.destroy", group: "Camera Models" },
  // Recordings
  { id: 29, name: "recordings.list", group: "Recordings" },
  { id: 30, name: "recordings.view", group: "Recordings" },
  { id: 31, name: "recordings.destroy", group: "Recordings" },
  { id: 32, name: "recordings.download", group: "Recordings" },
  { id: 33, name: "recordings.stream", group: "Recordings" },
  // Emergency
  { id: 34, name: "emergency.list", group: "Emergency SOS" },
  { id: 35, name: "emergency.view", group: "Emergency SOS" },
  { id: 36, name: "emergency.trigger_sos", group: "Emergency SOS" },
  { id: 37, name: "emergency.dispatch_police", group: "Emergency SOS" },
  { id: 38, name: "emergency.view_police_stations", group: "Emergency SOS" },
  // Subscriptions
  { id: 39, name: "subscriptions.list", group: "Subscriptions" },
  { id: 40, name: "subscriptions.store", group: "Subscriptions" },
  { id: 41, name: "subscriptions.view", group: "Subscriptions" },
  { id: 42, name: "subscriptions.update", group: "Subscriptions" },
  { id: 43, name: "subscriptions.cancel", group: "Subscriptions" },
  { id: 44, name: "subscriptions.renew", group: "Subscriptions" },
  // Invoices
  { id: 45, name: "invoices.list", group: "Invoices" },
  { id: 46, name: "invoices.view", group: "Invoices" },
  { id: 47, name: "invoices.download", group: "Invoices" },
  // Marketing
  { id: 48, name: "marketing.list", group: "Marketing & Campaigns" },
  { id: 49, name: "marketing.store", group: "Marketing & Campaigns" },
  { id: 50, name: "marketing.view", group: "Marketing & Campaigns" },
  { id: 51, name: "marketing.send_campaign", group: "Marketing & Campaigns" },
  // Support
  { id: 52, name: "support.list_tickets", group: "Support Center" },
  { id: 53, name: "support.reply_ticket", group: "Support Center" },
  { id: 54, name: "support.view_articles", group: "Support Center" },
  { id: 55, name: "support.view_faqs", group: "Support Center" },
];

export default function AdminRolesPage() {
  const t = useTranslations("Dashboard.Roles");

  const [roles, setRoles] = useState<RoleApiItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [paginationMeta, setPaginationMeta] = useState<PaginationMeta | null>(null);

  // Modal / Drawer State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<RoleApiItem | null>(null);
  const [roleName, setRoleName] = useState("");
  const [selectedPermissionIds, setSelectedPermissionIds] = useState<number[]>([]);
  const [actionLoading, setActionLoading] = useState(false);

  // Collapsible role details
  const [expandedRoleIds, setExpandedRoleIds] = useState<Record<string | number, boolean>>({});

  // Filter permissions inside modal
  const [permSearch, setPermSearch] = useState("");

  const getRolePermissionObjects = (role: RoleApiItem): PermissionApiItem[] => {
    const result: PermissionApiItem[] = [];
    const seenIds = new Set<number>();

    // 1. Process role.permissions array if available
    if (Array.isArray(role.permissions)) {
      role.permissions.forEach((p, idx) => {
        if (typeof p === "object" && p !== null && p.name) {
          const pId = typeof p.id === "number" ? p.id : Number(p.id) || idx + 1;
          if (!seenIds.has(pId)) {
            seenIds.add(pId);
            result.push({ id: pId, name: String(p.name) });
          }
        } else if (typeof p === "string") {
          const num = Number(p);
          if (!isNaN(num)) {
            const match = ALL_PERMISSIONS.find((ap) => ap.id === num);
            if (match && !seenIds.has(match.id)) {
              seenIds.add(match.id);
              result.push({ id: match.id, name: match.name });
            }
          } else {
            const match = ALL_PERMISSIONS.find((ap) => ap.name === p);
            const pId = match ? match.id : idx + 1000;
            if (!seenIds.has(pId)) {
              seenIds.add(pId);
              result.push({ id: pId, name: String(p) });
            }
          }
        } else if (typeof p === "number") {
          const match = ALL_PERMISSIONS.find((ap) => ap.id === p);
          if (match && !seenIds.has(match.id)) {
            seenIds.add(match.id);
            result.push({ id: match.id, name: match.name });
          }
        }
      });
    }

    // 2. Process role.permission_ids if available (array or string)
    let rawIds: (number | string)[] = [];
    if (Array.isArray(role.permission_ids)) {
      rawIds = role.permission_ids;
    } else if (typeof role.permission_ids === "string" && role.permission_ids.trim()) {
      try {
        const parsed = JSON.parse(role.permission_ids);
        if (Array.isArray(parsed)) rawIds = parsed;
        else rawIds = role.permission_ids.split(",");
      } catch {
        rawIds = role.permission_ids.split(",");
      }
    }

    rawIds.forEach((idVal) => {
      const num = Number(idVal);
      if (!isNaN(num)) {
        const match = ALL_PERMISSIONS.find((ap) => ap.id === num);
        if (match && !seenIds.has(match.id)) {
          seenIds.add(match.id);
          result.push({ id: match.id, name: match.name });
        }
      }
    });

    return result;
  };

  const fetchRoles = async (page = 1) => {
    setLoading(true);
    const res = await listRolesApi(page);
    const data = res.data;
    const meta = res.meta;
    if (data && Array.isArray(data)) {
      setRoles(data);
    } else if (res.result && Array.isArray((res.result as any).data)) {
      setRoles((res.result as any).data);
    }
    if (meta && typeof meta === "object" && "total" in meta) {
      setPaginationMeta(meta as PaginationMeta);
    } else if (res.result && (res.result as any).meta) {
      setPaginationMeta((res.result as any).meta as PaginationMeta);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRoles(currentPage);
  }, [currentPage]);

  // Group catalog permissions by module
  const groupedPermissions = useMemo(() => {
    const map: Record<string, PermissionDefinition[]> = {};
    ALL_PERMISSIONS.forEach((perm) => {
      if (
        permSearch.trim() &&
        !perm.name.toLowerCase().includes(permSearch.toLowerCase()) &&
        !perm.group.toLowerCase().includes(permSearch.toLowerCase())
      ) {
        return;
      }
      if (!map[perm.group]) {
        map[perm.group] = [];
      }
      map[perm.group].push(perm);
    });
    return map;
  }, [permSearch]);

  const handleOpenCreate = () => {
    setEditingRole(null);
    setRoleName("");
    setSelectedPermissionIds([]);
    setModalOpen(true);
  };

  const handleOpenEdit = (role: RoleApiItem) => {
    setEditingRole(role);
    setRoleName(role.name || "");
    const permObjs = getRolePermissionObjects(role);
    setSelectedPermissionIds(permObjs.map((p) => p.id));
    setModalOpen(true);
  };

  const handleTogglePermission = (id: number) => {
    setSelectedPermissionIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleToggleGroup = (groupPerms: PermissionDefinition[]) => {
    const groupIds = groupPerms.map((p) => p.id);
    const allSelected = groupIds.every((id) => selectedPermissionIds.includes(id));

    if (allSelected) {
      setSelectedPermissionIds((prev) => prev.filter((id) => !groupIds.includes(id)));
    } else {
      setSelectedPermissionIds((prev) => Array.from(new Set([...prev, ...groupIds])));
    }
  };

  const handleSelectAll = () => {
    setSelectedPermissionIds(ALL_PERMISSIONS.map((p) => p.id));
  };

  const handleDeselectAll = () => {
    setSelectedPermissionIds([]);
  };

  const handleSubmitRole = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roleName.trim()) {
      toast.error(t("enterRoleNameError"));
      return;
    }

    setActionLoading(true);
    const selectedNames = ALL_PERMISSIONS
      .filter((p) => selectedPermissionIds.includes(p.id))
      .map((p) => p.name);

    const payload = {
      name: roleName.trim(),
      permission_ids: selectedPermissionIds,
      permissions: selectedNames,
    };

    if (editingRole) {
      const { error } = await updateRoleApi(editingRole.id, payload);

      if (error) {
        toast.error(typeof error === "string" ? error : t("updateError"));
      } else {
        toast.success(t("updateSuccess"));
        setModalOpen(false);
        fetchRoles(currentPage);
      }
    } else {
      const { error } = await createRoleApi(payload);

      if (error) {
        toast.error(typeof error === "string" ? error : t("createError"));
      } else {
        toast.success(t("createSuccess"));
        setModalOpen(false);
        fetchRoles(currentPage);
      }
    }
    setActionLoading(false);
  };

  const handleDeleteRole = async (role: RoleApiItem) => {
    if (!confirm(t("deleteConfirm", { name: role.name }))) return;

    const { error } = await deleteRoleApi(role.id);
    if (error) {
      toast.error(error || t("deleteError"));
    } else {
      toast.success(t("deleteSuccess"));
      fetchRoles(currentPage);
    }
  };

  const toggleExpand = (id: string | number) => {
    setExpandedRoleIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredRoles = useMemo(() => {
    if (!searchQuery.trim()) return roles;
    const q = searchQuery.toLowerCase();
    return roles.filter((r) => {
      const matchName = r.name?.toLowerCase().includes(q);
      const matchPerms = Array.isArray(r.permissions)
        ? r.permissions.some((p) =>
            typeof p === "object" && p ? p.name?.toLowerCase().includes(q) : String(p).includes(q)
          )
        : false;
      return matchName || matchPerms;
    });
  }, [roles, searchQuery]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* ── Page Header & Stats ── */}
      <div className="bg-background border border-border rounded-2xl p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold">
            <ShieldCheck className="size-4" />
            <span>{t("systemBadge")}</span>
          </div>
          <h1 className="text-2xl font-extrabold text-foreground tracking-tight">
            {t("title")}
          </h1>
          <p className="text-xs text-muted-foreground max-w-2xl">
            {t("subtitle")}
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <button
            onClick={() => fetchRoles(currentPage)}
            className="p-2.5 rounded-xl border border-input hover:bg-accent text-foreground transition-colors shrink-0"
            title={t("refresh")}
          >
            <RefreshCw className={`size-4 ${loading ? "animate-spin text-primary" : ""}`} />
          </button>
          <button
            onClick={handleOpenCreate}
            className="w-full md:w-auto px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-xs hover:bg-primary/90 transition-all shadow-md shadow-primary/20 flex items-center justify-center gap-2 shrink-0 cursor-pointer"
          >
            <Plus className="size-4" />
            <span>{t("createNewRole")}</span>
          </button>
        </div>
      </div>

      {/* ── Stats Summary Bar ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-background border border-border rounded-2xl p-5 flex items-center gap-4 shadow-sm">
          <div className="size-12 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold shrink-0">
            <Key className="size-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-foreground">
              {paginationMeta?.total ?? roles.length}
            </div>
            <div className="text-xs text-muted-foreground font-medium">{t("totalRoles")}</div>
          </div>
        </div>

        <div className="bg-background border border-border rounded-2xl p-5 flex items-center gap-4 shadow-sm">
          <div className="size-12 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold shrink-0">
            <Shield className="size-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-foreground">{ALL_PERMISSIONS.length}</div>
            <div className="text-xs text-muted-foreground font-medium">{t("totalPermissions")}</div>
          </div>
        </div>

        <div className="bg-background border border-border rounded-2xl p-5 flex items-center gap-4 shadow-sm">
          <div className="size-12 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold shrink-0">
            <Layers className="size-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-foreground">
              {Object.keys(groupedPermissions).length}
            </div>
            <div className="text-xs text-muted-foreground font-medium">{t("totalModules")}</div>
          </div>
        </div>
      </div>

      {/* ── Search & Filter Controls ── */}
      <div className="bg-background border border-border rounded-2xl p-4 shadow-sm flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="size-4 absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder={t("searchPlaceholder")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pr-10 pl-4 py-2 rounded-xl border border-input bg-background text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="size-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* ── Roles Cards / Table ── */}
      {loading ? (
        <div className="bg-background border border-border rounded-2xl p-12 text-center text-xs text-muted-foreground flex flex-col items-center justify-center gap-3">
          <Loader2 className="size-8 animate-spin text-primary" />
          <span className="font-semibold">{t("loading")}</span>
        </div>
      ) : filteredRoles.length === 0 ? (
        <div className="bg-background border border-border rounded-2xl p-12 text-center text-xs text-muted-foreground flex flex-col items-center justify-center gap-2">
          <Lock className="size-8 text-muted-foreground opacity-50" />
          <p className="font-bold text-sm text-foreground">{t("noRolesTitle")}</p>
          <p className="text-xs">{t("noRolesDesc")}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredRoles.map((role) => {
            const rolePermObjs = getRolePermissionObjects(role);
            const isExpanded = !!expandedRoleIds[role.id];

            // Group permissions of this role for presentation
            const groupedRolePerms: Record<string, PermissionApiItem[]> = {};
            rolePermObjs.forEach((permObj) => {
              const [moduleName] = permObj.name.split(".");
              const formattedModule = moduleName ? moduleName.replace(/_/g, " ") : "General";
              if (!groupedRolePerms[formattedModule]) {
                groupedRolePerms[formattedModule] = [];
              }
              groupedRolePerms[formattedModule].push(permObj);
            });

            const totalPermCount = rolePermObjs.length;
            const isFullAdmin = totalPermCount >= ALL_PERMISSIONS.length || role.name === "admin";

            return (
              <div
                key={role.id}
                className="bg-background border border-border hover:border-primary/40 rounded-2xl transition-all shadow-sm overflow-hidden"
              >
                {/* Header Row */}
                <div className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <div className="size-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold shrink-0">
                      <Shield className="size-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-extrabold text-base text-foreground capitalize tracking-wide">
                          {role.name}
                        </h3>
                        {isFullAdmin ? (
                          <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-[10px]">
                            {t("fullAccess")}
                          </span>
                        ) : (
                          <span className="px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold text-[10px]">
                            {t("permissionsCount", { count: totalPermCount })}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5 font-mono">
                        ID: #{role.id}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end border-t sm:border-t-0 pt-3 sm:pt-0 border-border">
                    <button
                      onClick={() => toggleExpand(role.id)}
                      className="px-3 py-1.5 rounded-xl border border-input text-xs font-semibold hover:bg-accent text-foreground transition-colors flex items-center gap-1.5"
                    >
                      <span>{isExpanded ? t("hideDetails") : t("showDetails")}</span>
                      {isExpanded ? <ChevronUp className="size-3.5" /> : <ChevronDown className="size-3.5" />}
                    </button>
                    <button
                      onClick={() => handleOpenEdit(role)}
                      className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-xl transition-colors"
                      title={t("editRole")}
                    >
                      <Edit3 className="size-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteRole(role)}
                      className="p-2 text-red-500 hover:bg-red-500/10 rounded-xl transition-colors"
                      title={t("deleteRole")}
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </div>

                {/* Collapsible Permissions Details */}
                {isExpanded && (
                  <div className="px-5 pb-5 pt-2 border-t border-border bg-accent/30 space-y-4">
                    <div className="text-xs font-bold text-foreground flex items-center gap-2">
                      <Sparkles className="size-4 text-primary" />
                      <span>{t("customPermissionsFor", { name: role.name })}</span>
                    </div>

                    {Object.keys(groupedRolePerms).length === 0 ? (
                      <div className="text-xs text-muted-foreground italic font-mono bg-background p-3 rounded-xl border border-border">
                        {Array.isArray(role.permissions) && role.permissions.length > 0
                          ? JSON.stringify(role.permissions)
                          : t("noCustomPermissions")}
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {Object.entries(groupedRolePerms).map(([moduleName, perms]) => (
                          <div
                            key={moduleName}
                            className="bg-background border border-border rounded-xl p-3.5 space-y-2 shadow-2xs"
                          >
                            <div className="text-[11px] font-bold text-primary uppercase tracking-wider flex items-center justify-between">
                              <span>{moduleName}</span>
                              <span className="text-[10px] font-mono text-muted-foreground px-1.5 py-0.5 rounded bg-muted">
                                {perms.length}
                              </span>
                            </div>
                            <div className="flex flex-wrap gap-1.5">
                              {perms.map((p) => (
                                <PermissionBadge key={p.id} name={p.name} />
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ── Pagination Footer ── */}
      {paginationMeta && paginationMeta.last_page > 1 && (
        <div className="bg-background border border-border rounded-2xl p-4 flex items-center justify-between text-xs shadow-sm">
          <div className="text-muted-foreground">
            {t("pageOf", {
              current: paginationMeta.current_page,
              last: paginationMeta.last_page,
              total: paginationMeta.total,
            })}
          </div>
          <div className="flex items-center gap-2">
            <button
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="px-3 py-1.5 rounded-xl border border-input text-xs font-bold disabled:opacity-50 hover:bg-accent"
            >
              {t("prev")}
            </button>
            <button
              disabled={currentPage >= paginationMeta.last_page}
              onClick={() => setCurrentPage((p) => Math.min(paginationMeta.last_page, p + 1))}
              className="px-3 py-1.5 rounded-xl border border-input text-xs font-bold disabled:opacity-50 hover:bg-accent"
            >
              {t("next")}
            </button>
          </div>
        </div>
      )}

      {/* ── Create / Edit Role Drawer Modal ── */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-background border border-border rounded-3xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-6 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-bold">
                  <ShieldCheck className="size-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-foreground">
                    {editingRole ? t("editTitle", { name: editingRole.name }) : t("createTitle")}
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    {t("modalSubtitle")}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-2 text-muted-foreground hover:text-foreground rounded-xl hover:bg-accent transition-colors"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmitRole} className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Role Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground">
                  {t("roleNameLabel")} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. support-agent, manager, auditor"
                  value={roleName}
                  onChange={(e) => setRoleName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-input bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary font-medium"
                />
              </div>

              {/* Permissions Selector Header */}
              <div className="space-y-3 pt-2 border-t border-border">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <label className="text-xs font-bold text-foreground flex items-center gap-2">
                      <Key className="size-4 text-primary" />
                      <span>{t("selectedPermissions", { count: selectedPermissionIds.length })}</span>
                    </label>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleSelectAll}
                      className="px-2.5 py-1 rounded-lg bg-primary/10 text-primary text-xs font-bold hover:bg-primary/20 transition-colors flex items-center gap-1"
                    >
                      <CheckSquare className="size-3.5" />
                      <span>{t("selectAll")}</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleDeselectAll}
                      className="px-2.5 py-1 rounded-lg border border-input text-muted-foreground text-xs font-bold hover:bg-accent transition-colors flex items-center gap-1"
                    >
                      <Square className="size-3.5" />
                      <span>{t("deselectAll")}</span>
                    </button>
                  </div>
                </div>

                {/* Filter Permissions inside Modal */}
                <div className="relative">
                  <Search className="size-3.5 absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder={t("filterPermissions")}
                    value={permSearch}
                    onChange={(e) => setPermSearch(e.target.value)}
                    className="w-full pr-9 pl-3 py-1.5 rounded-xl border border-input bg-background text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                {/* Categories Grid */}
                <div className="space-y-4 max-h-[360px] overflow-y-auto pr-1">
                  {Object.keys(groupedPermissions).length === 0 ? (
                    <div className="text-xs text-center py-6 text-muted-foreground">
                      {t("noMatchingPerms")}
                    </div>
                  ) : (
                    Object.entries(groupedPermissions).map(([groupName, groupPerms]) => {
                      const allGroupSelected = groupPerms.every((p) =>
                        selectedPermissionIds.includes(p.id)
                      );

                      return (
                        <div
                          key={groupName}
                          className="bg-accent/20 border border-border rounded-2xl p-4 space-y-3"
                        >
                          <div className="flex items-center justify-between border-b border-border/60 pb-2">
                            <div className="flex items-center gap-2">
                              <span className="font-extrabold text-xs text-foreground">
                                {groupName}
                              </span>
                              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                                {groupPerms.filter((p) => selectedPermissionIds.includes(p.id)).length} / {groupPerms.length}
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleToggleGroup(groupPerms)}
                              className="text-xs font-bold text-primary hover:underline cursor-pointer"
                            >
                              {allGroupSelected ? t("deselectGroup") : t("selectGroup")}
                            </button>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {groupPerms.map((perm) => {
                              const isChecked = selectedPermissionIds.includes(perm.id);
                              return (
                                <button
                                  type="button"
                                  key={perm.id}
                                  onClick={() => handleTogglePermission(perm.id)}
                                  className={`flex items-center gap-2.5 p-2.5 rounded-xl border text-xs cursor-pointer transition-all select-none text-right ${
                                    isChecked
                                      ? "bg-primary/10 border-primary/40 text-foreground font-semibold"
                                      : "bg-background border-border hover:border-border/80 text-muted-foreground"
                                  }`}
                                >
                                  <div
                                    className={`size-4 rounded border flex items-center justify-center shrink-0 transition-colors ${
                                      isChecked
                                        ? "bg-primary border-primary text-primary-foreground"
                                        : "border-input bg-background"
                                    }`}
                                  >
                                    {isChecked && <Check className="size-3 stroke-[3]" />}
                                  </div>
                                  <span className="font-mono text-[11px] truncate" title={perm.name}>
                                    {perm.name}
                                  </span>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Modal Actions */}
              <div className="pt-4 border-t border-border flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-input text-xs font-bold hover:bg-accent transition-colors"
                >
                  {t("cancel")}
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-xs hover:bg-primary/90 transition-all shadow-md shadow-primary/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {actionLoading ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      <span>{t("saving")}</span>
                    </>
                  ) : editingRole ? (
                    t("saveChanges")
                  ) : (
                    t("createSubmit")
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// Helper Badge for permissions
function PermissionBadge({ name }: { name: string }) {
  const action = name.split(".")[1] || name;

  let colorClasses = "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20";
  if (action === "store" || action === "update") {
    colorClasses = "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20";
  } else if (action === "destroy") {
    colorClasses = "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20";
  } else if (["pair", "trigger_sos", "dispatch_police", "send_campaign"].includes(action)) {
    colorClasses = "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20";
  }

  return (
    <span
      className={`px-2 py-0.5 rounded-lg border font-mono text-[10px] font-medium tracking-tight ${colorClasses}`}
    >
      {name}
    </span>
  );
}
