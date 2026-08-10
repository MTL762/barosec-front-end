"use client";

import { Input } from "@/components/ui/input";
import { Phone } from "lucide-react";

export default function CustomPhoneInput({
	name,
	placeholder = "+966 50 000 0000",
	disabled,
	value,
	onChange,
}: {
	value?: string;
	name: string;
	placeholder?: string;
	disabled?: boolean;
	onChange: (value: string) => void;
}) {
	return (
		<div className="relative w-full">
			<Input
				type="tel"
				name={name}
				value={value || ""}
				disabled={disabled}
				placeholder={placeholder}
				onChange={(e) => onChange(e.target.value)}
				className="ps-10"
			/>
			<Phone className="size-4 text-muted-foreground absolute start-3 top-1/2 -translate-y-1/2" />
		</div>
	);
}
