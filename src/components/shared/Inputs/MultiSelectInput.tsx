import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import Select, { type MultiValue } from "react-select";
import type { Option } from "../Form/CustomFormTypes.types";
import { customStyles } from "./select.config";

interface CustomSelectProps {
	options: Option[];
	placeholder?: string;
	name?: string;
	onChange?: (selectedOptions: (string | number | boolean)[]) => void;
	value?: (string | number | boolean)[];
}

export default function MultiSelectInput({
	options,
	placeholder,
	name,
	onChange,
	value = [],
}: CustomSelectProps) {
	const { theme } = useTheme();

	const t = useTranslations();
	return (
		<>
			<Select
				isMulti={true}
				value={options.filter((option) => value.includes(option.value))}
				onChange={(selectedOptions: MultiValue<Option>) => {
					const data = selectedOptions.map((item) => item.value);
					onChange?.(data);
				}}
				options={options}
				styles={customStyles(theme === "dark")}
				menuPortalTarget={
					typeof document !== "undefined" ? document.body : null
				}
				menuPosition="fixed"
				isClearable={true}
				placeholder={placeholder ? placeholder : t("select")}
				name={name}
			/>
		</>
	);
}
