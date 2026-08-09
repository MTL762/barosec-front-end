"use client";

import { useState } from "react";
import { Mail, Phone, CheckCircle2, AlertCircle, Loader2, Send, ShieldCheck, MessageSquare } from "lucide-react";
import { sendEmailCodeApi, verifyEmailApi, sendPhoneCodeApi, verifyPhoneCodeApi } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";

export function VerificationCard() {
  const { user, refreshProfile } = useAuth();

  // Email verification states
  const [emailCode, setEmailCode] = useState("");
  const [emailSending, setEmailSending] = useState(false);
  const [emailVerifying, setEmailVerifying] = useState(false);
  const [emailSuccess, setEmailSuccess] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);

  // Phone verification states
  const [phoneCode, setPhoneCode] = useState("");
  const [phoneSending, setPhoneSending] = useState(false);
  const [phoneVerifying, setPhoneVerifying] = useState(false);
  const [phoneSuccess, setPhoneSuccess] = useState<string | null>(null);
  const [phoneError, setPhoneError] = useState<string | null>(null);

  const isEmailVerified = Boolean(user?.email_verified_at || user?.email_verified);
  const isPhoneVerified = Boolean(user?.phone_verified_at || user?.phone_verified);

  // 1. Email Send Code
  const handleSendEmailCode = async () => {
    setEmailSending(true);
    setEmailSuccess(null);
    setEmailError(null);

    const res = await sendEmailCodeApi();
    if (res.data || res.status === 200) {
      setEmailSuccess("تم إرسال رمز التحقق (4 أرقام) إلى بريدك الإلكتروني بنجاح!");
    } else {
      setEmailError(res.error || "فشل إرسال رمز البريد الإلكتروني");
    }
    setEmailSending(false);
  };

  // 2. Email Verify Code
  const handleVerifyEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailCode.trim()) return;
    setEmailVerifying(true);
    setEmailSuccess(null);
    setEmailError(null);

    const res = await verifyEmailApi({ code: emailCode.trim() });
    if (res.data?.email_verified || res.status === 200) {
      setEmailSuccess("تم توثيق البريد الإلكتروني بنجاح! ✓");
      await refreshProfile();
    } else {
      setEmailError(res.error || "رمز التحقق غير صحيح أو منتهي الصلاحية.");
    }
    setEmailVerifying(false);
  };

  // 3. Phone Send Code
  const handleSendPhoneCode = async () => {
    setPhoneSending(true);
    setPhoneSuccess(null);
    setPhoneError(null);

    const res = await sendPhoneCodeApi();
    if (res.data || res.status === 200) {
      setPhoneSuccess("تم إرسال رمز التحقق (4 أرقام) إلى رقم هاتفك عبر واتساب بنجاح!");
    } else {
      setPhoneError(res.error || "فشل إرسال رمز الواتساب/الهاتف");
    }
    setPhoneSending(false);
  };

  // 4. Phone Verify Code
  const handleVerifyPhone = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneCode.trim()) return;
    setPhoneVerifying(true);
    setPhoneSuccess(null);
    setPhoneError(null);

    const res = await verifyPhoneCodeApi({ code: phoneCode.trim() });
    if (res.data?.phone_verified || res.status === 200) {
      setPhoneSuccess("تم توثيق رقم الهاتف عبر واتساب بنجاح! ✓");
      await refreshProfile();
    } else {
      setPhoneError(res.error || "رمز التحقق غير صحيح أو منتهي الصلاحية.");
    }
    setPhoneVerifying(false);
  };

  return (
    <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-6">
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div>
          <h2 className="text-lg font-bold text-ink flex items-center gap-2">
            <ShieldCheck className="size-5 text-primary" />
            <span>توثيق الحساب والبريد والهاتف (Account Verification)</span>
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            توثيق البريد الإلكتروني ورقم الواتساب للوصول لكافة الميزات وتفادي تقييد middleware.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Email Verification Box */}
        <div className="p-5 rounded-2xl border border-border bg-background space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="size-9 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                  <Mail className="size-4.5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-ink">توثيق البريد الإلكتروني</h3>
                  <p className="text-[10px] text-muted-foreground font-mono">{user?.email || "غير محدد"}</p>
                </div>
              </div>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  isEmailVerified
                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                    : "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                }`}
              >
                {isEmailVerified ? "مُوثق ✓" : "غير موثق"}
              </span>
            </div>

            {emailSuccess && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="size-4 shrink-0" />
                <span>{emailSuccess}</span>
              </div>
            )}

            {emailError && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs font-bold flex items-center gap-2">
                <AlertCircle className="size-4 shrink-0" />
                <span>{emailError}</span>
              </div>
            )}

            {!isEmailVerified && (
              <form onSubmit={handleVerifyEmail} className="space-y-3 pt-2">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleSendEmailCode}
                    disabled={emailSending}
                    className="px-3 py-2 rounded-xl bg-primary/10 text-primary text-xs font-bold hover:bg-primary/20 transition-colors shrink-0 flex items-center gap-1 cursor-pointer"
                  >
                    {emailSending ? <Loader2 className="size-3.5 animate-spin" /> : <><Send className="size-3" /> إرسال الرمز</>}
                  </button>
                  <input
                    type="text"
                    maxLength={6}
                    placeholder="رمز 4 أرقام"
                    value={emailCode}
                    onChange={(e) => setEmailCode(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-xl border border-input text-xs font-mono text-center tracking-widest"
                  />
                </div>
                <button
                  type="submit"
                  disabled={emailVerifying || !emailCode.trim()}
                  className="w-full py-2 rounded-xl bg-primary text-primary-foreground font-bold text-xs hover:bg-primary/90 disabled:opacity-40 flex items-center justify-center gap-1 cursor-pointer"
                >
                  {emailVerifying ? <Loader2 className="size-3.5 animate-spin" /> : "تأكيد رمز البريد"}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Phone Verification Box */}
        <div className="p-5 rounded-2xl border border-border bg-background space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="size-9 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <MessageSquare className="size-4.5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-ink">توثيق الهاتف عبر واتساب</h3>
                  <p className="text-[10px] text-muted-foreground font-mono">{user?.phone ? String(user.phone) : "غير محدد"}</p>
                </div>
              </div>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  isPhoneVerified
                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                    : "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                }`}
              >
                {isPhoneVerified ? "مُوثق ✓" : "غير موثق"}
              </span>
            </div>

            {phoneSuccess && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="size-4 shrink-0" />
                <span>{phoneSuccess}</span>
              </div>
            )}

            {phoneError && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs font-bold flex items-center gap-2">
                <AlertCircle className="size-4 shrink-0" />
                <span>{phoneError}</span>
              </div>
            )}

            {!isPhoneVerified && (
              <form onSubmit={handleVerifyPhone} className="space-y-3 pt-2">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleSendPhoneCode}
                    disabled={phoneSending}
                    className="px-3 py-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold hover:bg-emerald-500/20 transition-colors shrink-0 flex items-center gap-1 cursor-pointer"
                  >
                    {phoneSending ? <Loader2 className="size-3.5 animate-spin" /> : <><Send className="size-3" /> إرسال عبر واتساب</>}
                  </button>
                  <input
                    type="text"
                    maxLength={6}
                    placeholder="رمز 4 أرقام"
                    value={phoneCode}
                    onChange={(e) => setPhoneCode(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-xl border border-input text-xs font-mono text-center tracking-widest"
                  />
                </div>
                <button
                  type="submit"
                  disabled={phoneVerifying || !phoneCode.trim()}
                  className="w-full py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 disabled:opacity-40 flex items-center justify-center gap-1 cursor-pointer"
                >
                  {phoneVerifying ? <Loader2 className="size-3.5 animate-spin" /> : "تأكيد رمز الهاتف"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
