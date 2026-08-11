import type { FormInput } from "@/components/shared/Form/CustomFormTypes.types";

export const LoginInputs = (): FormInput[] => {
  return [
    {
      name: "email",
      label: "Auth.email",
      type: "email",
      width: 6,
      placeholder: "Auth.emailPlaceholder",
      required: true,
      cardId: "default",
    },
    {
      name: "password",
      label: "Auth.password",
      type: "password",
      width: 6,
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
      label: "Auth.name",
      type: "text",
      width: 6,
      placeholder: "Auth.namePlaceholder",
      required: true,
      cardId: "default",
    },
    {
      name: "email",
      label: "Auth.email",
      type: "email",
      width: 6,
      placeholder: "Auth.emailPlaceholder",
      required: true,
      cardId: "default",
    },
    {
      name: "password",
      label: "Auth.password",
      type: "password",
      width: 6,
      placeholder: "Auth.passwordPlaceholder",
      required: true,
      cardId: "default",
    },
    {
      name: "password_confirmation",
      label: "Auth.passwordConfirm",
      type: "password",
      width: 6,
      placeholder: "Auth.passwordConfirmPlaceholder",
      required: true,
      cardId: "default",
    },
  ];
};
