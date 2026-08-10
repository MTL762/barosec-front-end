"use client";

import { Textarea } from "@/components/ui/textarea";

export interface TextEditorProps {
	name?: string;
	value?: string;
	className?: string;
	onChange?: (value: string) => void;
	placeholder?: string;
	disabled?: boolean;
}

export default function TextEditor({
	value = "",
	onChange,
	className = "",
	placeholder = "Enter text...",
	disabled = false,
	name,
}: TextEditorProps) {
	return (
		<Textarea
			name={name}
			value={value}
			onChange={(e) => onChange?.(e.target.value)}
			placeholder={placeholder}
			disabled={disabled}
			className={`w-full min-h-[120px] ${className}`}
		/>
	);
}
