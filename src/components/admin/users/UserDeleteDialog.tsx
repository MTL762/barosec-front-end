"use client";

import React, { useState } from "react";
import { AlertTriangle, Loader2, Trash2, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { AdminUserApiItem } from "@/lib/api";

interface UserDeleteDialogProps {
  isOpen: boolean;
  user: AdminUserApiItem | null;
  onClose: () => void;
  onConfirmDelete: (id: number | string) => Promise<void>;
}

export function UserDeleteDialog({
  isOpen,
  user,
  onClose,
  onConfirmDelete,
}: UserDeleteDialogProps) {
  const t = useTranslations("AdminUsers");
  const [loading, setLoading] = useState(false);

  if (!isOpen || !user) return null;

  const handleDelete = async () => {
    setLoading(true);
    try {
      await onConfirmDelete(user.id);
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-md bg-card text-card-foreground rounded-2xl border border-border shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 p-6 space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-full bg-destructive/10 text-destructive border border-destructive/20 shrink-0">
            <AlertTriangle className="size-6" />
          </div>

          <div className="space-y-1 flex-1">
            <h3 className="text-base font-bold text-foreground">
              {t("deleteConfirmTitle")}
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {t("deleteConfirmMessage")}
            </p>
          </div>
        </div>

        {/* User Card info */}
        <div className="p-3 rounded-xl bg-muted/40 border border-border flex items-center gap-3">
          <div className="size-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs uppercase shrink-0">
            {user.name ? user.name.slice(0, 2) : "US"}
          </div>
          <div className="min-w-0">
            <div className="text-xs font-bold text-foreground truncate">{user.name}</div>
            <div className="text-[11px] font-mono text-muted-foreground truncate">{user.email}</div>
          </div>
        </div>

        {/* Dialog Actions */}
        <div className="pt-2 flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 rounded-xl border border-input text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-accent transition-colors disabled:opacity-50 cursor-pointer"
          >
            {t("cancel")}
          </button>

          <button
            onClick={handleDelete}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-destructive text-destructive-foreground text-xs font-semibold hover:bg-destructive/90 transition-all disabled:opacity-50 shadow-md cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                <span>{t("deleting")}</span>
              </>
            ) : (
              <>
                <Trash2 className="size-4" />
                <span>{t("deleteUser")}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
