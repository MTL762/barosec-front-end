"use client";
import { Input } from "@/components/ui/input";
import type React from "react";
import { useState } from "react";

interface ColorInputProps {
	value: string;
	onChange: (color: string) => void;
	name?: string;
}

const ColorInput: React.FC<ColorInputProps> = ({ value, onChange, name }) => {
	const [hexValue, setHexValue] = useState(value || "#000000");

	const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const newColor = e.target.value;
		setHexValue(newColor);
		onChange(newColor);
	};

	return (
		<div className="flex flex-col gap-3">
			<div className="flex items-center gap-3 p-3 border border-input rounded-lg bg-background transition-all duration-200 hover:border-primary/50 focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
				<div className="relative">
					<Input
						type="color"
						value={hexValue}
						onChange={handleColorChange}
						name={name}
						className="w-12 h-12 p-1 rounded-lg border-2 border-border/50 cursor-pointer transition-all duration-200 hover:border-primary/50 hover:shadow-md"
						aria-label="Choose color"
					/>
					<div className="absolute inset-0 rounded-lg ring-2 ring-transparent hover:ring-primary/20 transition-all duration-200 pointer-events-none" />
				</div>

				<div className="flex-1 space-y-2">
					<Input
						type="text"
						value={hexValue}
						onChange={handleColorChange}
						placeholder="#000000"
						className="font-mono text-sm transition-all duration-200 focus:shadow-md"
						pattern="^#([A-Fa-f0-9]{6})$"
					/>
					<div className="text-xs text-muted-foreground">
						Enter hex color code
					</div>
				</div>

				<div className="flex flex-col items-center gap-2">
					<div
						className="w-12 h-12 rounded-lg border-2 border-border/50 shadow-sm transition-all duration-200 hover:shadow-md"
						style={{ backgroundColor: hexValue }}
						aria-label="Color preview"
					/>
					<span className="text-xs text-muted-foreground">Preview</span>
				</div>
			</div>
		</div>
	);
};

export default ColorInput;
