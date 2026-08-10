"use client";

import { useTranslations } from "next-intl";
import type { Option } from "../Form/CustomFormTypes.types";

interface CustomSelectProps {
  options: Option[];
  placeholder?: string;
  name?: string;
  onChange?: (selectedOptions: (string | number | boolean)[]) => void;
  value?: (string | number | boolean)[];
}

export default function MultiSelectInput({
  options,
  placeholder,
  name,
  onChange,
  value = [],
}: CustomSelectProps) {
  const t = useTranslations();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = Array.from(e.target.selectedOptions, (option) => option.value);
    onChange?.(selected);
  };

  return (
    <select
      multiple
      name={name}
      value={value.map(String)}
      onChange={handleChange}
      className="w-full min-h-[80px] p-2 text-sm rounded-xl border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
    >
      {options.map((opt) => (
        <option key={String(opt.value)} value={String(opt.value)}>
          {t(opt.label)}
        </option>
      ))}
    </select>
  );
}
