import type { FormInput } from "@/components/shared/Form/CustomFormTypes.types";

export const LoginInputs = (): FormInput[] => {
  return [
    {
      name: "email",
      type: "email",
      label: "Auth.email",
      placeholder: "Auth.emailPlaceholder",
      required: true,
      cardId: "default",
    },
    {
      name: "password",
      type: "password",
      label: "Auth.password",
      placeholder: "Auth.passwordPlaceholder",
      required: true,
      cardId: "default",
    },
  ];
};

export const RegisterInputs = (): FormInput[] => {
  return [
    {
      name: "name",
      type: "text",
      label: "Auth.name",
      placeholder: "Auth.namePlaceholder",
      required: true,
      cardId: "default",
    },
    {
      name: "email",
      type: "email",
      label: "Auth.email",
      placeholder: "Auth.emailPlaceholder",
      required: true,
      cardId: "default",
    },
    {
      name: "password",
      type: "password",
      label: "Auth.password",
      placeholder: "Auth.passwordPlaceholder",
      required: true,
      cardId: "default",
    },
    {
      name: "password_confirmation",
      type: "password",
      label: "Auth.passwordConfirm",
      placeholder: "Auth.passwordConfirmPlaceholder",
      required: true,
      cardId: "default",
    },
  ];
};
