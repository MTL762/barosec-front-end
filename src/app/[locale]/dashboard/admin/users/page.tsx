"use client";

import React, { useState, useEffect } from "react";
import { Users, UserPlus, Trash2, Loader2, Search, Edit3 } from "lucide-react";
import {
  listUsersAdminApi,
  createUserAdminApi,
  deleteUserAdminApi,
  updateUserAdminApi,
  AdminUserApiItem,
} from "@/lib/api";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUserApiItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  const [newUser, setNewUser] = useState({
    name: "New System User",
    email: "user@example.com",
    password: "password123",
  });

  const [editingUser, setEditingUser] = useState<AdminUserApiItem | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    const res = await listUsersAdminApi();
    if (res.data && Array.isArray(res.data)) {
      setUsers(res.data as AdminUserApiItem[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);
    await createUserAdminApi(newUser);
    await fetchUsers();
    setActionLoading(false);
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    setActionLoading(true);
    await updateUserAdminApi(editingUser.id, { name: editingUser.name });
    setEditingUser(null);
    await fetchUsers();
    setActionLoading(false);
  };

  const handleDeleteUser = async (id: number | string) => {
    if (!confirm("هل أنت تأكد من رغبتك في حذف هذا المستخدم؟")) return;
    await deleteUserAdminApi(id);
    fetchUsers();
  };

  const filteredUsers = users.filter((u) => {
    if (!searchQuery) return true;
    const name = String(u.name || "").toLowerCase();
    const email = String(u.email || "").toLowerCase();
    return name.includes(searchQuery.toLowerCase()) || email.includes(searchQuery.toLowerCase());
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="db-card p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
            <Users className="size-6 text-primary" />
            <span>وحدة إدارة المستخدمين (Admin User Management)</span>
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            عرض، إضافة، تعديل وحذف مستخدمين النظام عبر الـ APIs الرسمية (/admin/users)
          </p>
        </div>
        <div className="text-xs font-mono font-bold bg-primary/10 text-primary px-3 py-1.5 rounded-xl">
          {users.length} مستخدم مسجل
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Create / Edit Form */}
        <div className="lg:col-span-5 db-card p-6 space-y-4">
          <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
            <UserPlus className="size-4 text-primary" />
            <span>{editingUser ? `تعديل البيانات: ${editingUser.name}` : "إضافة مستخدم جديد"}</span>
          </h2>

          {!editingUser ? (
            <form onSubmit={handleCreateUser} className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-foreground">اسم المستخدم</label>
                <input
                  type="text"
                  required
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border border-input text-xs bg-background"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-foreground">البريد الإلكتروني</label>
                <input
                  type="email"
                  required
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border border-input text-xs font-mono bg-background"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-foreground">كلمة المرور</label>
                <input
                  type="password"
                  required
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border border-input text-xs font-mono bg-background"
                />
              </div>

              <button
                type="submit"
                disabled={actionLoading}
                className="w-full py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-xs hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                {actionLoading ? <Loader2 className="size-4 animate-spin" /> : "إضافة المستخدم (POST /admin/users)"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleUpdateUser} className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-foreground">الاسم المعدل</label>
                <input
                  type="text"
                  required
                  value={editingUser.name}
                  onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border border-input text-xs bg-background"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="flex-1 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-xs hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  {actionLoading ? <Loader2 className="size-4 animate-spin" /> : "حفظ التعديل"}
                </button>
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2.5 rounded-xl border border-input text-xs font-bold hover:bg-accent"
                >
                  إلغاء
                </button>
              </div>
            </form>
          )}
        </div>

        {/* User List */}
        <div className="lg:col-span-7 db-card p-6 space-y-4">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-sm font-bold text-foreground">قائمة المستخدمين (GET /admin/users)</h2>
            <div className="relative w-48">
              <Search className="absolute start-3 top-2.5 size-3.5 text-muted-foreground" />
              <input
                type="text"
                placeholder="بحث..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full ps-8 pe-3 py-1.5 rounded-lg border border-input text-xs bg-background"
              />
            </div>
          </div>

          {loading ? (
            <div className="p-8 text-center text-xs text-muted-foreground flex items-center justify-center gap-2">
              <Loader2 className="size-4 animate-spin text-primary" />
              <span>جاري تحميل المستخدمين...</span>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="p-8 text-center text-xs text-muted-foreground">لا يوجد مستخدمون محملون حالياً</div>
          ) : (
            <div className="divide-y divide-[--db-border] border border-[--db-border] rounded-xl overflow-hidden">
              {filteredUsers.map((u) => (
                <div key={String(u.id)} className="p-4 flex items-center justify-between text-xs hover:bg-[--db-hover] transition-colors">
                  <div>
                    <div className="font-bold text-foreground">{u.name}</div>
                    <div className="text-[10px] text-muted-foreground font-mono">{u.email}</div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setEditingUser(u)}
                      className="p-1.5 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                      title="تعديل المستخدم"
                    >
                      <Edit3 className="size-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteUser(u.id)}
                      className="p-1.5 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                      title="حذف (DELETE /admin/users/:id)"
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
