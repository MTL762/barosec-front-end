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
  { id: 48, name: "marketing.list", group: "Marketing" },
  { id: 49, name: "marketing.store", group: "Marketing" },
  { id: 50, name: "marketing.view", group: "Marketing" },
  { id: 51, name: "marketing.update", group: "Marketing" },
  { id: 52, name: "marketing.destroy", group: "Marketing" },
  { id: 53, name: "marketing.send_campaign", group: "Marketing" },
  // Support Tickets
  { id: 54, name: "support_tickets.list", group: "Support Tickets" },
  { id: 55, name: "support_tickets.store", group: "Support Tickets" },
  { id: 56, name: "support_tickets.view", group: "Support Tickets" },
  { id: 57, name: "support_tickets.update", group: "Support Tickets" },
  { id: 58, name: "support_tickets.destroy", group: "Support Tickets" },
  { id: 59, name: "support_tickets.reply", group: "Support Tickets" },
  { id: 60, name: "support_tickets.close", group: "Support Tickets" },
  // Articles
  { id: 61, name: "articles.list", group: "Articles" },
  { id: 62, name: "articles.store", group: "Articles" },
  { id: 63, name: "articles.view", group: "Articles" },
  { id: 64, name: "articles.update", group: "Articles" },
  { id: 65, name: "articles.destroy", group: "Articles" },
  // FAQs
  { id: 66, name: "faqs.list", group: "FAQs" },
  { id: 67, name: "faqs.store", group: "FAQs" },
  { id: 68, name: "faqs.view", group: "FAQs" },
  { id: 69, name: "faqs.update", group: "FAQs" },
  { id: 70, name: "faqs.destroy", group: "FAQs" },
];

export default function AdminRolesPage() {
  const [roles, setRoles] = useState<RoleApiItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [paginationMeta, setPaginationMeta] = useState<PaginationMeta | null>(null);

  // Form State for Create / Edit
  const [modalOpen, setModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<RoleApiItem | null>(null);
  const [roleName, setRoleName] = useState("");
  const [selectedPermissionIds, setSelectedPermissionIds] = useState<number[]>([]);
  const [permSearch, setPermSearch] = useState("");

  // Card expansion state
  const [expandedRoleIds, setExpandedRoleIds] = useState<Record<string | number, boolean>>({});

  const fetchRoles = async (page = 1) => {
    setLoading(true);
    const res = await listRolesApi(page);
    if (res.data) {
      const rolesArray = Array.isArray(res.data)
        ? (res.data as RoleApiItem[])
        : (res.result?.data as RoleApiItem[]) || [];
      setRoles(rolesArray);

      if (res.meta) {
        setPaginationMeta(res.meta as PaginationMeta);
      } else if (res.result?.meta) {
        setPaginationMeta(res.result.meta as PaginationMeta);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRoles(currentPage);
  }, [currentPage]);

  // Open modal for Create
  const handleOpenCreate = () => {
    setEditingRole(null);
    setRoleName("");
    setSelectedPermissionIds([]);
    setPermSearch("");
    setModalOpen(true);
  };

  // Open modal for Edit
  const handleOpenEdit = (role: RoleApiItem) => {
    setEditingRole(role);
    setRoleName(role.name || "");
    setPermSearch("");

    let permIds: number[] = [];
    if (Array.isArray(role.permissions)) {
      permIds = role.permissions
        .map((p) => (typeof p === "object" && p !== null ? (p as PermissionApiItem).id : Number(p)))
        .filter((n) => !isNaN(n));
    } else if (typeof role.permission_ids === "string") {
      permIds = role.permission_ids
        .split(",")
        .map((id) => Number(id.trim()))
        .filter((n) => !isNaN(n) && n > 0);
    } else if (Array.isArray(role.permission_ids)) {
      permIds = role.permission_ids.map((id) => Number(id)).filter((n) => !isNaN(n) && n > 0);
    }

    setSelectedPermissionIds(permIds);
    setModalOpen(true);
  };

  const handleTogglePermission = (id: number) => {
    setSelectedPermissionIds((prev) =>
      prev.includes(id) ? prev.filter((pId) => pId !== id) : [...prev, id]
    );
  };

  const handleToggleGroup = (groupPermissions: PermissionDefinition[]) => {
    const groupIds = groupPermissions.map((p) => p.id);
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
      toast.error("يرجى إدخال اسم الدور");
      return;
    }

    setActionLoading(true);
    if (editingRole) {
      const { error } = await updateRoleApi(editingRole.id, {
        name: roleName.trim(),
        permission_ids: selectedPermissionIds,
      });

      if (error) {
        toast.error(error || "حدث خطأ أثناء تحديث الدور");
      } else {
        toast.success("تم تحديث الدور بنجاح!");
        setModalOpen(false);
        fetchRoles(currentPage);
      }
    } else {
      const { error } = await createRoleApi({
        name: roleName.trim(),
        permission_ids: selectedPermissionIds,
      });

      if (error) {
        toast.error(error || "حدث خطأ أثناء إنشاء الدور");
      } else {
        toast.success("تم إنشاء الدور بنجاح!");
        setModalOpen(false);
        fetchRoles(currentPage);
      }
    }
    setActionLoading(false);
  };

  const handleDeleteRole = async (role: RoleApiItem) => {
    if (!confirm(`هل أنت تأكد من رغبتك في حذف الدور "${role.name}"؟`)) return;

    const { error } = await deleteRoleApi(role.id);
    if (error) {
      toast.error(error || "فشل حذف الدور");
    } else {
      toast.success("تم حذف الدور بنجاح");
      fetchRoles(currentPage);
    }
  };

  const toggleExpand = (id: string | number) => {
    setExpandedRoleIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Grouped permissions catalog
  const groupedPermissions = useMemo(() => {
    const map: Record<string, PermissionDefinition[]> = {};
    ALL_PERMISSIONS.forEach((p) => {
      if (
        permSearch.trim() === "" ||
        p.name.toLowerCase().includes(permSearch.toLowerCase()) ||
        p.group.toLowerCase().includes(permSearch.toLowerCase())
      ) {
        if (!map[p.group]) map[p.group] = [];
        map[p.group].push(p);
      }
    });
    return map;
  }, [permSearch]);

  // Filtered Roles
  const filteredRoles = useMemo(() => {
    return roles.filter((role) => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      const matchName = role.name.toLowerCase().includes(q);
      const matchPerms = role.permissions?.some((p) =>
        typeof p === "object" && p !== null
          ? (p as PermissionApiItem).name?.toLowerCase().includes(q)
          : String(p).toLowerCase().includes(q)
      );
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
            <span>نظام إدارة الصلاحيات والأدوار</span>
          </div>
          <h1 className="text-2xl font-extrabold text-foreground tracking-tight">
            الأدوار والصلاحيات (Roles & Permissions)
          </h1>
          <p className="text-xs text-muted-foreground max-w-2xl">
            إدارة الأدوار الوظيفية في النظام وتخصيص صلاحيات الوصول بدقة على مستوى النماذج والإجراءات.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <button
            onClick={() => fetchRoles(currentPage)}
            className="p-2.5 rounded-xl border border-input hover:bg-accent text-foreground transition-colors shrink-0"
            title="تحديث البيانات"
          >
            <RefreshCw className={`size-4 ${loading ? "animate-spin text-primary" : ""}`} />
          </button>
          <button
            onClick={handleOpenCreate}
            className="w-full md:w-auto px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-xs hover:bg-primary/90 transition-all shadow-md shadow-primary/20 flex items-center justify-center gap-2 shrink-0 cursor-pointer"
          >
            <Plus className="size-4" />
            <span>إنشاء دور جديد</span>
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
            <div className="text-xs text-muted-foreground font-medium">إجمالي الأدوار المعرفة</div>
          </div>
        </div>

        <div className="bg-background border border-border rounded-2xl p-5 flex items-center gap-4 shadow-sm">
          <div className="size-12 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold shrink-0">
            <Shield className="size-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-foreground">{ALL_PERMISSIONS.length}</div>
            <div className="text-xs text-muted-foreground font-medium">إجمالي الصلاحيات المتاحة</div>
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
            <div className="text-xs text-muted-foreground font-medium">الوحدات والوحدات الفرعية</div>
          </div>
        </div>
      </div>

      {/* ── Search & Filter Controls ── */}
      <div className="bg-background border border-border rounded-2xl p-4 shadow-sm flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="size-4 absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="بحث باسم الدور أو الصلاحية (مثال: admin, users.list, cameras)..."
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
          <span className="font-semibold">جاري تحميل الأدوار والصلاحيات...</span>
        </div>
      ) : filteredRoles.length === 0 ? (
        <div className="bg-background border border-border rounded-2xl p-12 text-center text-xs text-muted-foreground flex flex-col items-center justify-center gap-2">
          <Lock className="size-8 text-muted-foreground opacity-50" />
          <p className="font-bold text-sm text-foreground">لم يتم العثور على أدوار مطابقة</p>
          <p className="text-xs">جرب تغيير كلمة البحث أو قم بإنشاء دور جديد.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredRoles.map((role) => {
            const rolePerms = role.permissions || [];
            const isExpanded = !!expandedRoleIds[role.id];

            // Group permissions of this role for presentation
            const groupedRolePerms: Record<string, PermissionApiItem[]> = {};
            if (Array.isArray(rolePerms)) {
              rolePerms.forEach((p) => {
                if (typeof p === "object" && p !== null) {
                  const permObj = p as PermissionApiItem;
                  const [moduleName] = permObj.name.split(".");
                  const formattedModule = moduleName ? moduleName.replace(/_/g, " ") : "General";
                  if (!groupedRolePerms[formattedModule]) {
                    groupedRolePerms[formattedModule] = [];
                  }
                  groupedRolePerms[formattedModule].push(permObj);
                }
              });
            }

            const totalPermCount = Array.isArray(rolePerms) ? rolePerms.length : 0;
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
                            صلاحية كاملة (Full Access)
                          </span>
                        ) : (
                          <span className="px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold text-[10px]">
                            {totalPermCount} صلاحية
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
                      <span>{isExpanded ? "إخفاء التفاصيل" : "عرض الصلاحيات"}</span>
                      {isExpanded ? <ChevronUp className="size-3.5" /> : <ChevronDown className="size-3.5" />}
                    </button>
                    <button
                      onClick={() => handleOpenEdit(role)}
                      className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-xl transition-colors"
                      title="تعديل الدور"
                    >
                      <Edit3 className="size-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteRole(role)}
                      className="p-2 text-red-500 hover:bg-red-500/10 rounded-xl transition-colors"
                      title="حذف الدور"
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
                      <span>قائمة الصلاحيات المخصصة لـ ({role.name}):</span>
                    </div>

                    {Object.keys(groupedRolePerms).length === 0 ? (
                      <div className="text-xs text-muted-foreground italic font-mono bg-background p-3 rounded-xl border border-border">
                        {Array.isArray(role.permissions) && role.permissions.length > 0
                          ? JSON.stringify(role.permissions)
                          : "لا توجد صلاحيات مخصصة لهدا الدور."}
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
            عرض الصفحة <span className="font-bold text-foreground">{paginationMeta.current_page}</span> من{" "}
            <span className="font-bold text-foreground">{paginationMeta.last_page}</span> ({paginationMeta.total} دور)
          </div>
          <div className="flex items-center gap-2">
            <button
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="px-3 py-1.5 rounded-xl border border-input text-xs font-bold disabled:opacity-50 hover:bg-accent"
            >
              السابق
            </button>
            <button
              disabled={currentPage >= paginationMeta.last_page}
              onClick={() => setCurrentPage((p) => Math.min(paginationMeta.last_page, p + 1))}
              className="px-3 py-1.5 rounded-xl border border-input text-xs font-bold disabled:opacity-50 hover:bg-accent"
            >
              التالي
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
                    {editingRole ? `تعديل الدور: ${editingRole.name}` : "إنشاء دور جديد"}
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    قم بإدخال اسم الدور وتحديد الصلاحيات المخصصة له.
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
                  اسم الدور <span className="text-red-500">*</span>
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
                      <span>تحديد الصلاحيات ({selectedPermissionIds.length} صلاحية مختارة)</span>
                    </label>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleSelectAll}
                      className="px-2.5 py-1 rounded-lg bg-primary/10 text-primary text-xs font-bold hover:bg-primary/20 transition-colors flex items-center gap-1"
                    >
                      <CheckSquare className="size-3.5" />
                      <span>تحديد الكل</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleDeselectAll}
                      className="px-2.5 py-1 rounded-lg border border-input text-muted-foreground text-xs font-bold hover:bg-accent transition-colors flex items-center gap-1"
                    >
                      <Square className="size-3.5" />
                      <span>إلغاء الكل</span>
                    </button>
                  </div>
                </div>

                {/* Filter Permissions inside Modal */}
                <div className="relative">
                  <Search className="size-3.5 absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="تصفية قائمة الصلاحيات..."
                    value={permSearch}
                    onChange={(e) => setPermSearch(e.target.value)}
                    className="w-full pr-9 pl-3 py-1.5 rounded-xl border border-input bg-background text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                {/* Categories Grid */}
                <div className="space-y-4 max-h-[360px] overflow-y-auto pr-1">
                  {Object.keys(groupedPermissions).length === 0 ? (
                    <div className="text-xs text-center py-6 text-muted-foreground">
                      لا توجد صلاحيات تطابق البحث.
                    </div>
                  ) : (
                    Object.entries(groupedPermissions).map(([groupName, groupPerms]) => {
                      const allGroupSelected = groupPerms.every((p) =>
                        selectedPermissionIds.includes(p.id)
                      );
                      const someGroupSelected = groupPerms.some((p) =>
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
                              {allGroupSelected ? "إلغاء تحديد المجموعة" : "تحديد المجموعة"}
                            </button>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {groupPerms.map((perm) => {
                              const isChecked = selectedPermissionIds.includes(perm.id);
                              return (
                                <label
                                  key={perm.id}
                                  onClick={() => handleTogglePermission(perm.id)}
                                  className={`flex items-center gap-2.5 p-2.5 rounded-xl border text-xs cursor-pointer transition-all select-none ${
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
                                </label>
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
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-xs hover:bg-primary/90 transition-all shadow-md shadow-primary/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {actionLoading ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      <span>جاري الحفظ...</span>
                    </>
                  ) : editingRole ? (
                    "حفظ التغييرات"
                  ) : (
                    "إنشاء الدور"
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
