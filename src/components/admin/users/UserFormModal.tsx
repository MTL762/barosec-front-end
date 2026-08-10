"use client";

import React, { useState, useEffect } from "react";
import { X, Loader2, UserPlus, Edit3, Eye, EyeOff, Shield, Mail, User, Phone, KeyRound } from "lucide-react";
import { useTranslations } from "next-intl";
import { AdminUserApiItem, CreateAdminUserParams, UpdateAdminUserParams } from "@/lib/api";

interface UserFormModalProps {
  isOpen: boolean;
  user: AdminUserApiItem | null;
  onClose: () => void;
  onSubmitCreate: (data: CreateAdminUserParams) => Promise<void>;
  onSubmitUpdate: (id: number | string, data: UpdateAdminUserParams) => Promise<void>;
}

export function UserFormModal({
  isOpen,
  user,
  onClose,
  onSubmitCreate,
  onSubmitUpdate,
}: UserFormModalProps) {
  const t = useTranslations("AdminUsers");
  const isEditing = Boolean(user);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState("admin");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
      setPhone(user.phone || "");
      setPassword("");
      const userRole = typeof user.role === "object" && user.role?.name ? user.role.name : String(user.role || "admin");
      setRole(userRole);
    } else {
      setName("");
      setEmail("");
      setPhone("");
      setPassword("");
      setRole("admin");
    }
    setErrorMsg(null);
  }, [user, isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && !loading) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, loading, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!name.trim()) {
      setErrorMsg(t("errorEnterName"));
      return;
    }

    if (!isEditing && !email.trim()) {
      setErrorMsg(t("errorEnterEmail"));
      return;
    }

    if (!isEditing && !password.trim()) {
      setErrorMsg(t("errorEnterPassword"));
      return;
    }

    setLoading(true);
    try {
      if (isEditing && user) {
        const updatePayload: UpdateAdminUserParams = {
          name: name.trim(),
          email: email.trim() || undefined,
          phone: phone.trim() || null,
        };
        if (password.trim()) {
          updatePayload.password = password.trim();
        }
        await onSubmitUpdate(user.id, updatePayload);
      } else {
        const createPayload: CreateAdminUserParams = {
          name: name.trim(),
          email: email.trim(),
          password: password.trim(),
          phone: phone.trim() || null,
        };
        await onSubmitCreate(createPayload);
      }
      onClose();
    } catch (err: any) {
      setErrorMsg(err?.message || t("errorSaveUser"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-lg bg-card text-card-foreground rounded-2xl border border-border shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-muted/30">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-primary/10 text-primary">
              {isEditing ? <Edit3 className="size-5" /> : <UserPlus className="size-5" />}
            </div>
            <div>
              <h3 className="text-base font-bold text-foreground">
                {isEditing ? t("editUser") : t("addUser")}
              </h3>
              <p className="text-xs text-muted-foreground">
                {isEditing ? `ID: #${user?.id}` : "POST /admin/users"}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            disabled={loading}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors disabled:opacity-50"
            aria-label={t("cancel")}
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs font-semibold">
              {errorMsg}
            </div>
          )}

          {/* Name Field */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
              <User className="size-3.5 text-muted-foreground" />
              <span>{t("name")}</span>
              <span className="text-destructive">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t("namePlaceholder")}
              className="w-full px-3.5 py-2.5 rounded-xl border border-input bg-background text-foreground text-xs focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
            />
          </div>

          {/* Email Field */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
              <Mail className="size-3.5 text-muted-foreground" />
              <span>{t("email")}</span>
              {!isEditing && <span className="text-destructive">*</span>}
            </label>
            <input
              type="email"
              required={!isEditing}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t("emailPlaceholder")}
              className="w-full px-3.5 py-2.5 rounded-xl border border-input bg-background text-foreground text-xs font-mono focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
            />
          </div>

          {/* Phone Field */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
              <Phone className="size-3.5 text-muted-foreground" />
              <span>{t("phone")}</span>
            </label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder={t("phonePlaceholder")}
              className="w-full px-3.5 py-2.5 rounded-xl border border-input bg-background text-foreground text-xs font-mono focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
            />
          </div>

          {/* Password Field */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
              <KeyRound className="size-3.5 text-muted-foreground" />
              <span>{t("password")}</span>
              {!isEditing && <span className="text-destructive">*</span>}
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required={!isEditing}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={isEditing ? t("passwordEditPlaceholder") : t("passwordPlaceholder")}
                className="w-full px-3.5 py-2.5 pe-10 rounded-xl border border-input bg-background text-foreground text-xs font-mono focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute end-3 top-2.5 text-muted-foreground hover:text-foreground transition-colors"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-border flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2.5 rounded-xl border border-input text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-accent transition-colors disabled:opacity-50 cursor-pointer"
            >
              {t("cancel")}
            </button>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 active:scale-[0.98] transition-all disabled:opacity-50 shadow-md cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  <span>{t("saving")}</span>
                </>
              ) : (
                <span>{isEditing ? t("saveChanges") : t("createUserSubmit")}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
