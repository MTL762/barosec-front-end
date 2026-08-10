export const customStyles = (isDarkMode: boolean) => ({
	control: (base: Record<string, any>, state: { isFocused?: boolean }) => ({
		...base,
		pointerEvents: "auto",
		backgroundColor: isDarkMode ? "transparent" : "#ffffff",
		borderColor: state.isFocused
			? "#3b82f6"
			: isDarkMode
				? "#1f2937"
				: "#d1d5db",
		boxShadow: state.isFocused ? "0 0 0 2px rgba(59, 130, 246, 0.5)" : "none",
		"&:hover": {
			borderColor: state.isFocused
				? "#3b82f6"
				: isDarkMode
					? "#1f2937"
					: "#d1d5db",
		},
	}),
	menu: (base: Record<string, any>) => ({
		...base,
		zIndex: 99999,
		backgroundColor: isDarkMode ? "#111827" : "#ffffff",
		border: isDarkMode ? "1px solid #374151" : "1px solid #d1d5db",
		pointerEvents: "auto",
	}),
	menuPortal: (base: Record<string, any>) => ({
		...base,
		zIndex: 99999,
		pointerEvents: "auto",
	}),
	option: (base: Record<string, any>, state: { isFocused?: boolean }) => ({
		...base,
		backgroundColor: state.isFocused
			? isDarkMode
				? "#1f2937"
				: "#e5e7eb"
			: "transparent",
		color: isDarkMode ? "#ffffff" : "#000000",
	}),
	singleValue: (base: Record<string, any>) => ({
		...base,
		color: isDarkMode ? "#ffffff" : "#000000",
	}),
	input: (base: Record<string, any>) => ({
		...base,
		color: isDarkMode ? "#ffffff" : "#000000",
	}),
	multiValue: (base: Record<string, any>) => ({
		...base,
		color: "#9ca3af",
	}),
	placeholder: (base: Record<string, any>) => ({
		...base,
		color: isDarkMode ? "#9ca3af" : "#6b7280", // Placeholder text color
	}),
});

export interface SelectPaginatedProps {
	isMulti?: boolean;
	value?: string | string[]; // Allow both single and multi-select values
	placeholder?: string;
	onChange?: (value: Option[] | undefined | string) => void;
	onControlChange?: (value: Option[] | undefined | string) => void;
	name: string;
	idKey?: string;
	onLabelAction?: (data: any) => any;
	labelKey?: string;
	apiUrl: string;
	searchParamsFilter?: string[];
	searchTermKey?: string;
	searchFilters?: { key: string; value: string }[];
	allowNew?: boolean; // New prop to allow creating new options
	// formatCreateLabel?: (inputValue: string) => string;
	groupBy?: string;
}
export interface Option {
	label: string;
	value: string | number;
	icon?: React.ReactElement;
	__isNew__?: boolean;
	group?: string;
}

// Define the props interface with strict typing

// Define the API response item shape
export interface ApiResponseItem {
	[key: string]: any;
	id?: string | number;
	name?: string;
}
