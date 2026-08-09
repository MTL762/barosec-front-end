"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { useAuth } from "@/lib/auth-context";
import { LoginInputs, RegisterInputs } from "./auth.inputs";
import { LoginSchema, RegisterSchema } from "./auth.schema";

export default function useAuthFormLogic() {
  const t = useTranslations("Auth");
  const { login, register, isAuthenticated, token } = useAuth();
  const router = useRouter();

  const [mode, setMode] = useState<"login" | "register">("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loginInputs = LoginInputs();
  const registerInputs = RegisterInputs();
  const inputs = mode === "login" ? loginInputs : registerInputs;

  const currentSchema = mode === "login" ? LoginSchema(t) : RegisterSchema(t);

  const { control, handleSubmit, reset } = useForm<any>({
    mode: "onSubmit",
    resolver: zodResolver(currentSchema),
    defaultValues:
      mode === "login"
        ? { email: "", password: "" }
        : { name: "", email: "", password: "", password_confirmation: "" },
  });

  useEffect(() => {
    reset(
      mode === "login"
        ? { email: "", password: "" }
        : { name: "", email: "", password: "", password_confirmation: "" }
    );
    setError(null);
  }, [mode, reset]);

  useEffect(() => {
    if (isAuthenticated || token) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, token, router]);

  const onSubmit = async (formData: any) => {
    setLoading(true);
    setError(null);

    if (mode === "login") {
      const res = await login({ email: formData.email, password: formData.password });
      if (res.success) {
        router.push("/dashboard");
      } else {
        setError(res.error || t("loginFailed"));
      }
    } else {
      const res = await register({
        name: formData.name || "client",
        email: formData.email,
        password: formData.password,
        password_confirmation: formData.password_confirmation,
      });
      if (res.success) {
        router.push("/dashboard");
      } else {
        setError(res.error || t("registerFailed"));
      }
    }
    setLoading(false);
  };

  const formSubmit = handleSubmit(onSubmit);

  return {
    mode,
    setMode,
    control,
    inputs,
    formSubmit,
    loading,
    error,
    t,
  };
}
