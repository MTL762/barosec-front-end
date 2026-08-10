import type { FormInput } from "@/components/shared/Form/CustomFormTypes.types";

export const LoginInputs = (): FormInput[] => {
  return [
    {
      name: "email",
      type: "email",
      width:6,
      placeholder: "Auth.emailPlaceholder",
      required: true,
      cardId: "default",
    },
    {
      name: "password",
      type: "password",
      width:6,
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
      width:6,
      placeholder: "Auth.namePlaceholder",
      required: true,
      cardId: "default",
    },
    {
      name: "email",
      type: "email",
      width:6,
      placeholder: "Auth.emailPlaceholder",
      required: true,
      cardId: "default",
    },
    {
      name: "password",
      type: "password",
      width:6,
      placeholder: "Auth.passwordPlaceholder",
      required: true,
      cardId: "default",
    },
    {
      name: "password_confirmation",
      type: "password",
      width:6,
      placeholder: "Auth.passwordConfirmPlaceholder",
      required: true,
      cardId: "default",
    },
  ];
};
