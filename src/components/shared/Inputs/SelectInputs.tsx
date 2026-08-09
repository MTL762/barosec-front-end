"use client";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import Select, { type SingleValue } from "react-select";
import type { Option } from "../Form/CustomFormTypes.types";
import { customStyles } from "./select.config";

interface CustomSelectProps {
	options: Option[];
	value?: string | number;
	placeholder?: string;
	onChange?: (selectedOption: string | null) => void; // Allow null for clearing
	controllerChange?: (selectedOption: string | null) => void;
	name: string;
	pageSize?: number;
}

export default function SelectInput({
	options,
	value,
	placeholder,
	onChange,
	name,
	controllerChange,
	pageSize = 500,
}: CustomSelectProps) {
	const t = useTranslations();
	const [displayedOptions, setDisplayedOptions] = useState<Option[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const { theme, systemTheme } = useTheme();

	useEffect(() => {
		setDisplayedOptions(options.slice(0, pageSize));
	}, [options, pageSize]);

	const handleChange = (selectedOption: SingleValue<Option>) => {
		if (selectedOption) {
			// If a value is selected, pass the string value
			const selectedValue = selectedOption.value.toString();
			onChange?.(selectedValue);
			controllerChange?.(selectedValue);
		} else {
			// If cleared, pass null to indicate no selection
			onChange?.(null);
			controllerChange?.(null);
		}
	};

	return (
		<div className="flex flex-col w-full gap-3">
			<Select
				isClearable
				isMulti={false}
				onChange={handleChange}
				options={displayedOptions}
				value={
					value
						? displayedOptions.find(
								(opt) => opt.value.toString() === value.toString(),
							)
						: null
				}
				placeholder={placeholder || t("select")}
				name={name}
				classNames={{
					control: () => "border-0 shadow-none",
				}}
				styles={customStyles(
					theme === "dark" || (theme === "system" && systemTheme === "dark"),
				)}
				className="w-full dark:bg-red"
				menuPortalTarget={
					typeof document !== "undefined" ? document.body : null
				}
				menuPosition="fixed"
				onMenuScrollToBottom={() => {
					if (!isLoading) {
						setIsLoading(true);
						const currentLength = displayedOptions.length;
						const nextBatch = options.slice(
							currentLength,
							currentLength + pageSize,
						);

						if (nextBatch.length > 0) {
							setDisplayedOptions((prev) => [...prev, ...nextBatch]);
						}
						setIsLoading(false);
					}
				}}
				isLoading={isLoading}
			/>
		</div>
	);
}
