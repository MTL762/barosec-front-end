"use client";

import React, { useState, useEffect } from "react";
import { Key, Plus, Trash2, Loader2, Edit3, Shield } from "lucide-react";
import {
  listRolesApi,
  createRoleApi,
  deleteRoleApi,
  updateRoleApi,
  RoleApiItem,
} from "@/lib/api";

export default function AdminRolesPage() {
  const [roles, setRoles] = useState<RoleApiItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const [newRole, setNewRole] = useState({
    name: "supervisor",
    permission_ids: "1, 2, 3",
  });

  const [editingRole, setEditingRole] = useState<RoleApiItem | null>(null);

  const fetchRoles = async () => {
    setLoading(true);
    const res = await listRolesApi();
    if (res.data && Array.isArray(res.data)) {
      setRoles(res.data as RoleApiItem[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const handleCreateRole = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);
    const ids = newRole.permission_ids.split(",").map((n) => Number(n.trim())).filter(Boolean);
    await createRoleApi({ name: newRole.name, permission_ids: ids });
    await fetchRoles();
    setActionLoading(false);
  };

  const handleUpdateRole = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRole) return;
    setActionLoading(true);
    const ids = (typeof editingRole.permission_ids === "string"
      ? (editingRole.permission_ids as string).split(",")
      : []
    ).map((n) => Number(n)).filter(Boolean);

    await updateRoleApi(editingRole.id, { name: editingRole.name, permission_ids: ids });
    setEditingRole(null);
    await fetchRoles();
    setActionLoading(false);
  };

  const handleDeleteRole = async (id: number | string) => {
    if (!confirm("هل أنت تأكد من رغبتك في حذف هذا الدور؟")) return;
    await deleteRoleApi(id);
    fetchRoles();
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="db-card p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
            <Key className="size-6 text-primary" />
            <span>وحدة إدارة الأدوار والصلاحيات (Role & Permission Management)</span>
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            إنشاء وإدارة أدوار النظام وتخصيص معرفات الصلاحيات (GET/POST/PUT/DELETE /roles)
          </p>
        </div>
        <div className="text-xs font-mono font-bold bg-primary/10 text-primary px-3 py-1.5 rounded-xl">
          {roles.length} أدوار معرفة
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Create / Edit Role Form */}
        <div className="lg:col-span-5 db-card p-6 space-y-4">
          <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
            <Plus className="size-4 text-primary" />
            <span>{editingRole ? `تعديل الدور: ${editingRole.name}` : "إنشاء دور جديد"}</span>
          </h2>

          {!editingRole ? (
            <form onSubmit={handleCreateRole} className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-foreground">اسم الدور (role name)</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. manager"
                  value={newRole.name}
                  onChange={(e) => setNewRole({ ...newRole, name: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border border-input text-xs bg-background"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-foreground">معرفات الصلاحيات (permission_ids)</label>
                <input
                  type="text"
                  required
                  placeholder="1, 2, 3, 4"
                  value={newRole.permission_ids}
                  onChange={(e) => setNewRole({ ...newRole, permission_ids: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border border-input text-xs font-mono bg-background"
                />
              </div>

              <button
                type="submit"
                disabled={actionLoading}
                className="w-full py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-xs hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                {actionLoading ? <Loader2 className="size-4 animate-spin" /> : "إنشاء الدور (POST /roles)"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleUpdateRole} className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-foreground">اسم الدور</label>
                <input
                  type="text"
                  required
                  value={editingRole.name}
                  onChange={(e) => setEditingRole({ ...editingRole, name: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border border-input text-xs bg-background"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="flex-1 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-xs hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  {actionLoading ? <Loader2 className="size-4 animate-spin" /> : "حفظ (PUT /roles/:id)"}
                </button>
                <button
                  type="button"
                  onClick={() => setEditingRole(null)}
                  className="px-4 py-2.5 rounded-xl border border-input text-xs font-bold hover:bg-accent"
                >
                  إلغاء
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Roles List */}
        <div className="lg:col-span-7 db-card p-6 space-y-4">
          <h2 className="text-sm font-bold text-foreground">قائمة الأدوار المعرفة (GET /roles)</h2>

          {loading ? (
            <div className="p-8 text-center text-xs text-muted-foreground flex items-center justify-center gap-2">
              <Loader2 className="size-4 animate-spin text-primary" />
              <span>جاري تحميل الأدوار...</span>
            </div>
          ) : roles.length === 0 ? (
            <div className="p-8 text-center text-xs text-muted-foreground">لا توجد أدوار مسجلة حالياً</div>
          ) : (
            <div className="divide-y divide-[--db-border] border border-[--db-border] rounded-xl overflow-hidden">
              {roles.map((r, i) => (
                <div key={i} className="p-4 flex items-center justify-between text-xs hover:bg-[--db-hover] transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="size-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold shrink-0">
                      <Shield className="size-4" />
                    </div>
                    <div>
                      <div className="font-bold text-foreground capitalize">{r.name}</div>
                      <div className="text-[10px] text-muted-foreground font-mono">
                        Permissions: {JSON.stringify(r.permission_ids || r.permissions || [])}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setEditingRole(r)}
                      className="p-1.5 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                      title="تعديل الدور"
                    >
                      <Edit3 className="size-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteRole(r.id)}
                      className="p-1.5 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                      title="حذف (DELETE /roles/:id)"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
