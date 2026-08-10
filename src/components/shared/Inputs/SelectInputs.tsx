"use client";

import { useTranslations } from "next-intl";
import type { Option } from "../Form/CustomFormTypes.types";

interface CustomSelectProps {
  options: Option[];
  value?: string | number;
  placeholder?: string;
  onChange?: (selectedOption: string | null) => void;
  controllerChange?: (selectedOption: string | null) => void;
  name: string;
  pageSize?: number;
}

export default function SelectInput({
  options,
  value,
  placeholder,
  onChange,
  name,
  controllerChange,
}: CustomSelectProps) {
  const t = useTranslations();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value || null;
    onChange?.(val);
    controllerChange?.(val);
  };

  return (
    <div className="flex flex-col w-full gap-3">
      <select
        name={name}
        value={value ?? ""}
        onChange={handleChange}
        className="w-full h-10 px-3 py-2 text-sm rounded-xl border border-input bg-background font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
      >
        <option value="" disabled>
          {placeholder || t("select")}
        </option>
        {options.map((opt) => (
          <option key={String(opt.value)} value={String(opt.value)}>
            {t(opt.label)}
          </option>
        ))}
      </select>
    </div>
  );
}
