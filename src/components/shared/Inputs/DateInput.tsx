"use client";

import { useTranslations } from "next-intl";

interface DateInputProps {
  value?: Date | Date[] | string;
  onChange: (date: any) => void;
  className?: string;
  name: string;
  min?: Date | string;
  multiple?: boolean;
}

export function DateInput({
  value,
  onChange,
  className,
  name,
}: DateInputProps) {
  const t = useTranslations();

  const formattedValue = typeof value === "string" ? value.split("T")[0] : "";

  return (
    <input
      type="date"
      name={name}
      value={formattedValue}
      onChange={(e) => onChange(e.target.value)}
      className={`w-full h-10 px-3 py-2 text-sm rounded-xl border border-input bg-background font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary ${
        className || ""
      }`}
    />
  );
}
