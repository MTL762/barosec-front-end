"use client";

import { cn } from "@/lib/utils";
import { Star } from "lucide-react";
import { useState } from "react";

export type RateInputProps = {
	name: string;
	value?: number;
	onChange?: (value: number) => void;
	maxRating?: number;
	allowClear?: boolean;
	showValue?: boolean;
	labels?: string[];
	disabled?: boolean;
};

export default function RateInput({
	name,
	value = 0,
	onChange,
	maxRating = 5,
	allowClear = false,
	showValue = true,
	labels = [],
	disabled = false,
}: RateInputProps) {
	const [hoveredValue, setHoveredValue] = useState<number | null>(null);
	const displayValue = hoveredValue ?? value ?? 0;

	const handleSelect = (rating: number) => {
		if (disabled) return;
		if (allowClear && rating === value) {
			onChange?.(0);
			return;
		}
		onChange?.(rating);
	};

	const getLabel = (current: number) => {
		if (!labels?.length) return null;
		return labels[current - 1] ?? null;
	};

	return (
		<div
			className="flex flex-col gap-2"
			aria-label="rating selector"
			data-rating-name={name}
		>
			<div className="flex items-center gap-1">
				{Array.from({ length: maxRating }).map((_, index) => {
					const ratingValue = index + 1;
					const isActive = ratingValue <= displayValue;

					return (
						<button
							key={ratingValue}
							type="button"
							disabled={disabled}
							onMouseEnter={() => setHoveredValue(ratingValue)}
							onMouseLeave={() => setHoveredValue(null)}
							onFocus={() => setHoveredValue(ratingValue)}
							onBlur={() => setHoveredValue(null)}
							onClick={() => handleSelect(ratingValue)}
							aria-label={`Rate ${ratingValue} out of ${maxRating}`}
							className={cn(
								"p-1 rounded-md transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-ring disabled:cursor-not-allowed",
								isActive ? "text-amber-400" : "text-muted-foreground/40",
							)}
						>
							<Star
								className={cn(
									"h-6 w-6",
									isActive ? "fill-current" : "fill-transparent",
								)}
								strokeWidth={1.5}
							/>
						</button>
					);
				})}
			</div>
			{showValue && (
				<div
					className="flex items-center gap-2 text-sm text-muted-foreground"
					aria-live="polite"
				>
					<span className="font-medium text-foreground">{displayValue}</span>
					<span>/ {maxRating}</span>
					{getLabel(displayValue) && (
						<span className="text-xs text-muted-foreground/80">
							({getLabel(displayValue)})
						</span>
					)}
				</div>
			)}
		</div>
	);
}
