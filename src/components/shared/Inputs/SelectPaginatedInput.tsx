"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

export interface SelectPaginatedProps {
  isMulti?: boolean;
  value?: any;
  placeholder?: string;
  onChange?: (val: any) => void;
  onControlChange?: (val: any) => void;
  name: string;
  idKey?: string;
  labelKey?: string;
  onLabelAction?: (data: any) => any;
  apiUrl: string;
  searchTermKey?: string;
  searchParamsFilter?: string[];
  searchFilters?: { key: string; value: string }[];
  allowNew?: boolean;
  groupBy?: string;
}

export default function SelectPaginated({
  value,
  placeholder,
  onChange,
  onControlChange,
  name,
}: SelectPaginatedProps) {
  const t = useTranslations();
  const [options, setOptions] = useState<{ label: string; value: any }[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    onChange?.(val);
    onControlChange?.(val);
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
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
