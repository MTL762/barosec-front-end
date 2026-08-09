"use client";

import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Clock } from "lucide-react";
import { useTranslations } from "next-intl";
import { useMemo } from "react";

interface TimeInputProps {
	name: string;
	value?: string | null;
	onChange?: (value: string) => void;
	disabled?: boolean;
	minuteStep?: number;
	className?: string;
}

const padTime = (value: number) => value.toString().padStart(2, "0");

const parseTimeValue = (value?: string | null) => {
	if (!value) {
		return {
			hour: undefined,
			minute: undefined,
		};
	}

	const [rawHour, rawMinute] = value.split(":");

	const hour = Number.isNaN(Number(rawHour))
		? undefined
		: padTime(Number(rawHour));
	const minute = Number.isNaN(Number(rawMinute))
		? undefined
		: padTime(Number(rawMinute));

	return { hour, minute };
};

export default function TimeInput({
	name,
	value,
	onChange,
	disabled,
	minuteStep = 5,
	className,
}: TimeInputProps) {
	const { hour, minute } = parseTimeValue(value);
	const t = useTranslations();
	const safeMinuteStep = Math.min(Math.max(1, minuteStep), 60);

	const hours = useMemo(
		() => Array.from({ length: 24 }, (_, index) => padTime(index)),
		[],
	);
	const minutes = useMemo(() => {
		const items: string[] = [];
		for (let current = 0; current < 60; current += safeMinuteStep) {
			items.push(padTime(current));
		}
		if (items[items.length - 1] !== "59") {
			items.push("59");
		}
		return items;
	}, [safeMinuteStep]);

	const emitChange = (nextHour?: string, nextMinute?: string) => {
		const resolvedHour =
			typeof nextHour === "string" ? nextHour : (hour ?? "00");
		const resolvedMinute =
			typeof nextMinute === "string" ? nextMinute : (minute ?? "00");
		onChange?.(`${resolvedHour}:${resolvedMinute}`);
	};

	const handleClear = () => {
		onChange?.("");
	};

	return (
		<div className={cn("flex flex-col gap-3", className)}>
			<div className="flex items-center justify-between text-xs uppercase tracking-wide text-muted-foreground">
				<div className="flex items-center gap-2 font-medium text-foreground/80">
					<Clock className="h-4 w-4 text-primary" />
					<span>{t("Select time")}</span>
				</div>
				<button
					type="button"
					onClick={handleClear}
					disabled={disabled || (!hour && !minute)}
					className="text-[11px] font-semibold text-muted-foreground transition-colors hover:text-primary disabled:opacity-40 disabled:cursor-not-allowed"
				>
					{t("Clear")}
				</button>
			</div>
			<div className="grid grid-cols-2 gap-4">
				<div className="space-y-2">
					<Label
						htmlFor={`${name}-hour`}
						className="text-xs text-muted-foreground"
					>
						{t("Hour")}
					</Label>
					<Select
						value={hour}
						onValueChange={(newHour) => emitChange(newHour, undefined)}
						disabled={disabled}
					>
						<SelectTrigger id={`${name}-hour`}>
							<SelectValue placeholder="HH" />
						</SelectTrigger>
						<SelectContent className="max-h-60 z-[9999]">
							{hours.map((hourOption) => (
								<SelectItem key={hourOption} value={hourOption}>
									{hourOption}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
				<div className="space-y-2">
					<Label
						htmlFor={`${name}-minute`}
						className="text-xs text-muted-foreground"
					>
						{t("Minute")}
					</Label>
					<Select
						value={minute}
						onValueChange={(newMinute) => emitChange(undefined, newMinute)}
						disabled={disabled}
					>
						<SelectTrigger id={`${name}-minute`}>
							<SelectValue placeholder="MM" />
						</SelectTrigger>
						<SelectContent className="max-h-60 z-[9999]">
							{minutes.map((minuteOption) => (
								<SelectItem key={minuteOption} value={minuteOption}>
									{minuteOption}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
			</div>
			<input type="hidden" name={name} value={value ?? ""} readOnly />
		</div>
	);
}
