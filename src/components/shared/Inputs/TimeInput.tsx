"use client";

import { Clock } from "lucide-react";
import { useTranslations } from "next-intl";

interface TimeInputProps {
	name: string;
	value?: string | null;
	onChange?: (value: string) => void;
	disabled?: boolean;
	minuteStep?: number;
	className?: string;
}

export default function TimeInput({
	name,
	value,
	onChange,
	disabled,
	className,
}: TimeInputProps) {
	const t = useTranslations();

	return (
		<div className={`flex flex-col gap-2 ${className || ""}`}>
			<div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
				<Clock className="size-4 text-primary" />
				<span>{t("Select time")}</span>
			</div>
			<input
				type="time"
				name={name}
				value={value || ""}
				disabled={disabled}
				onChange={(e) => onChange?.(e.target.value)}
				className="w-full h-10 px-3 py-2 text-sm rounded-xl border border-input bg-background font-mono text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
			/>
		</div>
	);
}
