export type inputTypes =
	| "select"
	| "text"
	| "textarea"
	| "number"
	| "img"
	| "checkbox"
	| "email"
	| "tel"
	| "rate"
	| "multiSelect"
	| "map"
	| "password"
	| "selectPaginated"
	| "tag-input"
	| "filesUpload"
	| "time"
	| "file"
	| "radioGroup"
	| "text-editor"
	| "yy-mm-dd"
	| "title"
	| "space"
	| "color"
	| "date";
export type formInputWithFalse = FormInput | undefined | false;
import type { ReactNode } from "react";

type FormInputBase = {
	name: string;
	type: inputTypes;
	label?: string;
	hideLabel?: boolean;
	/**
	 * Optional icon rendered next to the field label.
	 */
	icon?: ReactNode;
	/**
	 * Optional JSX to render next to the label (e.g. help icon, hint, small badge).
	 */
	labelInfo?: ReactNode;
	defaultValue?: string;
	id?: string;
	min?: Date | number | string;
	searchParamsFilter?: string[];
	apiUrl?: string;
	allowNew?: boolean;
	placeholder?: string;
	onLabelAction?: (data: any) => any;
	multiLang?: boolean;
	idKey?: string;
	labelKey?: string;
	availableLanguages?: string[];
	value?: string | number;
	isMulti?: boolean;
	width?: number;
	onRemove?: (index: string) => void;
	disabled?: boolean;
	required?: boolean;
	map?: {
		center: {
			lat: number;
			lng: number;
		};
	};
	cardId?: number | string;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	onChange?: (value: string | any) => void;
	options?: Option[];
	max?: number;
	isHidden?: boolean;
	alwaysShow?: boolean;
	searchFilters?: { key: string; value: string }[];
	groupBy?: string;
};

type SelectPaginatedInput = FormInputBase & {
	type: "selectPaginated";
	apiUrl: string; // REQUIRED here only
};

type OtherInputs = FormInputBase & {
	type: Exclude<inputTypes, "selectPaginated">;
	apiUrl?: string; // optional for all others
};

export type FormInput = SelectPaginatedInput | OtherInputs;

export type FormLangs =
	| string
	| "Ar"
	| "En"
	| "default"
	| "changetoAr"
	| "changetoEn";
export interface Option {
	label: string;
	value: string | number | boolean;
}
