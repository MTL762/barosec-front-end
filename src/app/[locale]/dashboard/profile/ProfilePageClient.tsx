"use client";

import { VerificationCard } from "@/components/auth/verification-card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { changePasswordApi, updateProfileApi } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import type { UserProfile } from "@/lib/api/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, CheckCircle2, KeyRound, Loader2, User } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

// ── Schemas ──────────────────────────────────────────────────────────────────

const profileSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
});

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your new password"),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type ProfileFormValues = z.infer<typeof profileSchema>;
type PasswordFormValues = z.infer<typeof passwordSchema>;

// ── Props ─────────────────────────────────────────────────────────────────────

interface Props {
  initialProfile: UserProfile | null;
}

// ── Component ─────────────────────────────────────────────────────────────────

export function ProfilePageClient({ initialProfile }: Props) {
  const { user: ctxUser, refreshProfile } = useAuth();
  const t = useTranslations("Profile");

  // Prefer live context user, fallback to server-fetched initial profile
  const user = ctxUser ?? initialProfile;

  // ── Profile form ────────────────────────────────────────────────────────────
  const [profileSuccess, setProfileSuccess] = useState<string | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);

  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name ?? "",
      email: user?.email ?? "",
    },
  });

  const onProfileSubmit = async (values: ProfileFormValues) => {
    setProfileSuccess(null);
    setProfileError(null);

    const { error } = await updateProfileApi(values);
    if (error) {
      setProfileError(error);
    } else {
      setProfileSuccess(t("profileUpdated"));
      await refreshProfile();
    }
  };

  // ── Password form ───────────────────────────────────────────────────────────
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onPasswordSubmit = async (values: PasswordFormValues) => {
    setPasswordSuccess(null);
    setPasswordError(null);

    const { error } = await changePasswordApi({
      current_password: values.currentPassword,
      old_password: values.currentPassword,
      password: values.newPassword,
      password_confirmation: values.confirmPassword,
    });

    if (error) {
      setPasswordError(error);
    } else {
      setPasswordSuccess(t("passwordChanged"));
      passwordForm.reset();
    }
  };

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Page Header */}
      <div className="bg-background border border-border rounded-2xl p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-foreground">{t("title")}</h1>
        <p className="text-xs text-muted-foreground mt-1">{t("subtitle")}</p>
      </div>

      {/* Verification Card (Email & Phone OTP) */}
      <VerificationCard />

      {/* Profile + Password Forms */}
      <div className="bg-background border border-border rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
        {/* ── Profile Form ── */}
        <Form {...profileForm}>
          <form
            onSubmit={profileForm.handleSubmit(onProfileSubmit)}
            className="space-y-6"
          >
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <User className="size-5 text-primary" />
              <span>{t("basicInfo")}</span>
            </h2>

            {/* Success / Error banners */}
            <StatusBanner success={profileSuccess} error={profileError} />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={profileForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("fullName")}</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={profileForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("emailAddress")}</FormLabel>
                    <FormControl>
                      <Input type="email" className="font-mono" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full rounded-xl font-bold shadow-lg shadow-primary/20"
              disabled={profileForm.formState.isSubmitting}
            >
              {profileForm.formState.isSubmitting ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  {t("saving")}
                </>
              ) : (
                t("saveProfile")
              )}
            </Button>
          </form>
        </Form>

        {/* ── Password Form ── */}
        <Form {...passwordForm}>
          <form
            onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}
            className="pt-6 border-t border-border space-y-6"
          >
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <KeyRound className="size-5 text-primary" />
              <span>{t("changePassword")}</span>
            </h2>

            {/* Success / Error banners */}
            <StatusBanner success={passwordSuccess} error={passwordError} />

            <div className="space-y-4">
              <FormField
                control={passwordForm.control}
                name="currentPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("currentPassword")}</FormLabel>
                    <FormControl>
                      <Input type="password" className="font-mono" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={passwordForm.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("newPassword")}</FormLabel>
                      <FormControl>
                        <Input type="password" className="font-mono" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={passwordForm.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("confirmNewPassword")}</FormLabel>
                      <FormControl>
                        <Input type="password" className="font-mono" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="outline"
              size="lg"
              className="w-full rounded-xl font-bold"
              disabled={passwordForm.formState.isSubmitting}
            >
              {passwordForm.formState.isSubmitting ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  {t("saving")}
                </>
              ) : (
                t("changePasswordBtn")
              )}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}

// ── StatusBanner ──────────────────────────────────────────────────────────────

function StatusBanner({
  success,
  error,
}: {
  success: string | null;
  error: string | null;
}) {
  if (success) {
    return (
      <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-4 flex items-center gap-3 text-emerald-600 dark:text-emerald-400 font-bold text-sm">
        <CheckCircle2 className="size-5 shrink-0" />
        <span>{success}</span>
      </div>
    );
  }
  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-4 flex items-center gap-3 text-red-600 dark:text-red-400 font-bold text-sm">
        <AlertCircle className="size-5 shrink-0" />
        <span>{error}</span>
      </div>
    );
  }
  return null;
}
