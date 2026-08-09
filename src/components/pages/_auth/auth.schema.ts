import { z } from "zod";

export const LoginSchema = (t?: (key: string) => string) => {
  return z.object({
    email: z.string().email(t ? t("invalidEmail") : "Invalid email address"),
    password: z.string().min(6, t ? t("minPassword") : "Password must be at least 6 characters"),
  });
};

export const RegisterSchema = (t?: (key: string) => string) => {
  return z
    .object({
      name: z.string().min(2, t ? t("nameRequired") : "Name is required"),
      email: z.string().email(t ? t("invalidEmail") : "Invalid email address"),
      password: z.string().min(6, t ? t("minPassword") : "Password must be at least 6 characters"),
      password_confirmation: z.string().min(6),
    })
    .refine((data) => data.password === data.password_confirmation, {
      message: t ? t("passwordsDoNotMatch") : "Passwords do not match",
      path: ["password_confirmation"],
    });
};

export type LoginType = z.infer<ReturnType<typeof LoginSchema>>;
export type RegisterType = z.infer<ReturnType<typeof RegisterSchema>>;
