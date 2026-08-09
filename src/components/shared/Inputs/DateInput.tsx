import { CalendarIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { JSX, useEffect, useMemo, useRef } from "react";
import { toast } from "sonner";

interface DateInputProps {
	value?: Date | Date[];
	onChange: (date: Date | Date[] | string | string[] | undefined) => void;
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
	min,
	multiple = false
}: DateInputProps): JSX.Element {
	const t = useTranslations();
	const maxYear = new Date().getFullYear() + 1;
	const hasShownInvalidToast = useRef(false);

	const parsedMin = useMemo(() => {
		if (!min) return undefined;
		let d: Date;
		if (typeof min === "string") {
			const parts = min.split("-");
			if (parts.length === 3) {
				const year = parseInt(parts[0], 10);
				const month = parseInt(parts[1], 10) - 1;
				const day = parseInt(parts[2], 10);
				d = new Date(year, month, day);
			} else {
				d = new Date(min);
			}
		} else {
			d = new Date(min);
		}
		if (!Number.isNaN(d.getTime())) {
			d.setHours(0, 0, 0, 0);
			return d;
		}
		return undefined;
	}, [min]);

	const isValidDate = (date: unknown): date is Date =>
		date instanceof Date && !Number.isNaN(date.getTime());

	// Convert string values to Date objects
	const normalizeValue = (val: Date | Date[] | string | undefined): Date | Date[] | undefined => {
		if (!val) return undefined;

		if (Array.isArray(val)) {
			const parsedDates = val
				.map(v => (typeof v === "string" ? new Date(v) : v))
				.filter(isValidDate);

			return parsedDates.length > 0 ? parsedDates : undefined;
		}

		if (typeof val === 'string') {
			const parsedDate = new Date(val);
			return isValidDate(parsedDate) ? parsedDate : undefined;
		}

		return isValidDate(val) ? val : undefined;
	};

	const normalizedValue = useMemo(() => normalizeValue(value), [value]);

	useEffect(() => {
		const hasInvalidDate = Array.isArray(value)
			? value.some((item) => !isValidDate(typeof item === "string" ? new Date(item) : item))
			: !!value && !isValidDate(typeof value === "string" ? new Date(value) : value);

		if (hasInvalidDate && !hasShownInvalidToast.current) {
			toast.error("Invalid time value");
			hasShownInvalidToast.current = true;
		}

		if (!hasInvalidDate) {
			hasShownInvalidToast.current = false;
		}
	}, [value]);

	const formatDisplayValue = () => {
		if (!normalizedValue) return <span>{t("Pick a date")}</span>;

		if (multiple && Array.isArray(normalizedValue)) {
			if (normalizedValue.length === 0) return <span>{t("Pick a date")}</span>;
			if (normalizedValue.length === 1) return format(normalizedValue[0], "PPP");
			return <span>{normalizedValue.length} dates selected</span>;
		}

		return isValidDate(normalizedValue) ? format(normalizedValue, "PPP") : <span>{t("Pick a date")}</span>;
	};

	return (
		<>
			{/* <InputLabel label={label} /> */}
			<Popover>
				<PopoverTrigger asChild>
					<Button
						variant="outline"
						id={name}
						className={cn(
							" justify-start text-left w-full font-normal",
							!value && "text-muted-foreground",
							className
						)}
					>
						<CalendarIcon className="w-4 h-4 mr-2" />
						{formatDisplayValue()}
					</Button>
				</PopoverTrigger>
				<PopoverContent className="w-auto p-0 z-[9999]" align="start">
					{multiple ? (
						<Calendar
							mode="multiple"
							selected={Array.isArray(normalizedValue) ? normalizedValue : []}
							toYear={maxYear}
							disabled={parsedMin ? date => date < parsedMin : undefined}
							className="border rounded-md shadow-sm"
							required={false}
							onSelect={e => {
								if (Array.isArray(e)) {
									const isodates = e.map(date =>
										new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())).toISOString()
									);
									onChange(isodates);
								} else {
									onChange([]);
								}
							}}
							// initialFocus
							captionLayout="dropdown"
						/>
					) : (
						<Calendar
							mode="single"
							selected={normalizedValue as Date | undefined}
							toYear={maxYear}
							disabled={parsedMin ? date => date < parsedMin : undefined}
							className="border rounded-md shadow-sm"
							required={false}
							onSelect={e => {
								if (e) {
									const isoDate = new Date(Date.UTC(e.getFullYear(), e.getMonth(), e.getDate())).toISOString();
									onChange(isoDate);
								} else {
									onChange(undefined);
								}
							}}
							// initialFocus
							captionLayout="dropdown"
						/>
					)}
				</PopoverContent>
			</Popover>
		</>
	);
}
