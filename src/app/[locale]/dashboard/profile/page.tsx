"use client";

import { VerificationCard } from "@/components/auth/verification-card";
import { buttonVariants } from "@/components/ui/button";
import { changePasswordApi, updateProfileApi } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { cn } from "@/lib/utils";
import { AlertCircle, CheckCircle2, KeyRound, Loader2, User } from "lucide-react";
import { useEffect, useState } from "react";

export default function ProfileDashboardPage() {
  const { user, refreshProfile, isAuthenticated } = useAuth();

  const [name, setName] = useState(user?.name || "John Doe");
  const [email, setEmail] = useState(user?.email || "john@example.com");

  // Password change state
  const [currentPassword, setCurrentPassword] = useState("password123");
  const [newPassword, setNewPassword] = useState("newpassword123");
  const [confirmPassword, setConfirmPassword] = useState("newpassword123");

  const [profileLoading, setProfileLoading] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState<string | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);

  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
    }
  }, [user]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileLoading(true);
    setProfileSuccess(null);
    setProfileError(null);

    const { data, error } = await updateProfileApi({ name, email });
    if (error) {
      setProfileError(error);
    } else {
      setProfileSuccess("تم تحديث معلومات الملف الشخصي بنجاح! (POST /auth/profile)");
      await refreshProfile();
    }
    setProfileLoading(false);
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setPasswordError("كلمتا السر غير متطابقتين");
      return;
    }
    setPasswordLoading(true);
    setPasswordSuccess(null);
    setPasswordError(null);

    const { error } = await changePasswordApi({
      current_password: currentPassword,
      old_password: currentPassword,
      password: newPassword,
      password_confirmation: confirmPassword,
    });

    if (error) {
      setPasswordError(error);
    } else {
      setPasswordSuccess("تم تغيير كلمة السر بنجاح! (PUT /auth/change_password)");
    }
    setPasswordLoading(false);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Page Header */}
      <div className="bg-background border border-border rounded-2xl p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-foreground">الملف الشخصي وإعدادات الأمان (Profile & Security)</h1>
        <p className="text-xs text-muted-foreground mt-1">
          إدارة بيانات الحساب الشخصي وتغيير كلمة السر وتوثيق الحساب عبر API.
        </p>
      </div>

      {/* Verification Card (Email & Phone OTP) */}
      <VerificationCard />

      {/* Profile Form */}
      <div className="bg-background border border-border rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
        <form onSubmit={handleUpdateProfile} className="space-y-6">
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            <User className="size-5 text-primary" />
            <span>البيانات الأساسية </span>
          </h2>

          {profileSuccess && (
            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-4 flex items-center gap-3 text-emerald-600 dark:text-emerald-400 font-bold text-sm">
              <CheckCircle2 className="size-5" />
              <span>{profileSuccess}</span>
            </div>
          )}

          {profileError && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-4 flex items-center gap-3 text-red-600 dark:text-red-400 font-bold text-sm">
              <AlertCircle className="size-5" />
              <span>{profileError}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground">الاسم الكامل</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-input bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground">البريد الإلكتروني</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-input bg-background text-sm font-mono text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={profileLoading}
            className={cn(buttonVariants({ size: "lg" }), "w-full rounded-xl font-bold shadow-lg shadow-primary/20 flex items-center justify-center gap-2")}
          >
            {profileLoading ? <Loader2 className="size-4 animate-spin" /> : "حفظ بيانات الملف الشخصي"}
          </button>
        </form>

        {/* Change Password Form */}
        <form onSubmit={handleChangePassword} className="pt-6 border-t border-border space-y-6">
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            <KeyRound className="size-5 text-primary" />
            <span>تغيير كلمة السر (PUT /auth/change_password)</span>
          </h2>

          {passwordSuccess && (
            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-4 flex items-center gap-3 text-emerald-600 dark:text-emerald-400 font-bold text-sm">
              <CheckCircle2 className="size-5" />
              <span>{passwordSuccess}</span>
            </div>
          )}

          {passwordError && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-4 flex items-center gap-3 text-red-600 dark:text-red-400 font-bold text-sm">
              <AlertCircle className="size-5" />
              <span>{passwordError}</span>
            </div>
          )}

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground">كلمة السر الحالية</label>
              <input
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-input bg-background text-sm font-mono text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground">كلمة السر الجديدة</label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-input bg-background text-sm font-mono text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground">تأكيد كلمة السر الجديدة</label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-input bg-background text-sm font-mono text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={passwordLoading}
            className={cn(buttonVariants({ variant: "outline", size: "lg" }), "w-full rounded-xl font-bold flex items-center justify-center gap-2")}
          >
            {passwordLoading ? <Loader2 className="size-4 animate-spin" /> : "تغيير كلمة السر"}
          </button>
        </form>
      </div>
    </div>
  );
}
