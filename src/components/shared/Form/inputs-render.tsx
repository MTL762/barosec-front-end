import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { ChangeEvent } from "react";
import { Suspense, lazy } from "react";
import type {
	ControllerRenderProps,
	FieldErrors,
	FieldValues,
} from "react-hook-form";
import TagInput from "../Inputs/tag-input";
import TextEditor from "../Inputs/text-editor.client";
import type { FormInput } from "./CustomFormTypes.types";
import ErrorMessage from "./ErrorMessage";
import { getNestedError } from "./helpers/errors";
import PasswordInput from "./password-input";

const InputSkeleton = () => (
	<div className="w-full space-y-2 animate-pulse">
		<div className="w-1/3 h-4 rounded-md bg-gray-200/70 dark:bg-gray-700/70" />
		<div className="w-full h-10 rounded-md bg-gray-200/70 dark:bg-gray-700/70" />
	</div>
);

const sectionSkeletonKeys = ["section-a", "section-b", "section-c"] as const;
const actionSkeletonKeys = ["primary-action", "secondary-action"] as const;

const FormSkeleton = () => (
	<div className="w-full space-y-6 animate-pulse">
		<div className="grid grid-cols-6 gap-4">
			{sectionSkeletonKeys.map((key) => (
				<div
					key={key}
					className="col-span-6 p-4 space-y-4 border rounded-lg md:col-span-3 lg:col-span-2"
				>
					<div className="w-1/3 h-4 rounded-md bg-gray-200/70 dark:bg-gray-700/70" />
					<div className="w-full h-10 rounded-md bg-gray-200/70 dark:bg-gray-700/70" />
				</div>
			))}
		</div>
		<div className="flex justify-end gap-3">
			{actionSkeletonKeys.map((key) => (
				<div
					key={key}
					className="w-20 h-10 rounded-md bg-gray-200/70 dark:bg-gray-700/70"
				/>
			))}
		</div>
	</div>
);

// Enhanced skeleton for different input types
const getInputTypeSkeleton = (type: string) => {
	switch (type) {
		case "textarea":
			return (
				<div className="w-full h-24 rounded-md bg-gray-200/70 dark:bg-gray-700/70" />
			);
		case "select":
		case "selectPaginated":
			return (
				<div className="relative w-full h-10 rounded-md bg-gray-200/70 dark:bg-gray-700/70">
					<div className="absolute w-4 h-4 transform -translate-y-1/2 rounded right-3 top-1/2 bg-gray-300/70" />
				</div>
			);
		case "time":
			return (
				<div className="w-full h-10 rounded-md bg-gray-200/70 dark:bg-gray-700/70" />
			);

		case "checkbox":
			return (
				<div className="flex items-center space-x-2">
					<div className="w-4 h-4 rounded bg-gray-200/70 dark:bg-gray-700/70" />
					<div className="w-20 h-4 rounded bg-gray-200/70 dark:bg-gray-700/70" />
				</div>
			);
		case "radioGroup":
			return (
				<div className="space-y-2">
					{[...Array(2)].map((_, i) => (
						<div key={i.toString()} className="flex items-center space-x-2">
							<div className="w-4 h-4 rounded-full bg-gray-200/70 dark:bg-gray-700/70" />
							<div className="w-16 h-4 rounded bg-gray-200/70 dark:bg-gray-700/70" />
						</div>
					))}
				</div>
			);
		case "rate":
			return (
				<div className="flex items-center gap-2">
					{Array.from({ length: 5 }).map((_, index) => (
						<div
							key={`rate-skeleton-${index.toString()}`}
							className="w-5 h-5 rounded-full bg-gray-200/70 dark:bg-gray-700/70"
						/>
					))}
				</div>
			);
		default:
			return (
				<div className="w-full h-10 rounded-md bg-gray-200/70 dark:bg-gray-700/70" />
			);
	}
};

const padTimePart = (value: number) => value.toString().padStart(2, "0");

const normalizeTimeValue = (value: unknown) => {
	if (typeof value === "string") {
		if (value.includes(":")) return value;
		if (value.length === 4) {
			const hours = value.slice(0, 2);
			const minutes = value.slice(2);
			return `${hours}:${minutes}`;
		}
		return value;
	}

	if (value instanceof Date) {
		return `${padTimePart(value.getHours())}:${padTimePart(value.getMinutes())}`;
	}

	return "";
};

const InputSkeletonWithType = ({ type }: { type: string }) => (
	<div className="w-full space-y-2 animate-pulse">
		<div className="w-1/3 h-4 rounded-md bg-gray-200/70 dark:bg-gray-700/70" />
		{getInputTypeSkeleton(type)}
	</div>
);
const CheckBoxInput = lazy(() => import("../Inputs/CheckBoxInput"));
const ColorInput = lazy(() => import("../Inputs/ColorInput"));
const DateInput = lazy(() =>
	import("../Inputs/DateInput").then((module) => ({
		default: module.DateInput,
	})),
);
const FilesUploadInput = lazy(() => import("../Inputs/FilesUploadInput"));
const ImgInput = lazy(() => import("../Inputs/PremiumImgInput"));
const MultiSelectInput = lazy(() => import("../Inputs/MultiSelectInput"));
const NumberInput = lazy(() => import("../Inputs/NumberInput"));
const CustomPhoneInput = lazy(() => import("../Inputs/PhoneInput.Lib"));
const RadioButtonInput = lazy(() => import("../Inputs/RadioButtonInput"));
const SelectInput = lazy(() => import("../Inputs/SelectInputs"));
const SelectPaginated = lazy(() => import("../Inputs/SelectPaginatedInput"));
const TextInput = lazy(() => import("../Inputs/TextInput"));
const RateInput = lazy(() => import("../Inputs/RateInput"));
const TimeInput = lazy(() => import("../Inputs/TimeInput"));

export const renderInput = ({
	item,
	field,
}: {
	item: FormInput;
	field: ControllerRenderProps<FieldValues, string>;
}) => {
	const onChange = (e: unknown) => {
		if (item.onChange) item.onChange(e);
		if (field.onChange) field.onChange(e);
	};
	const commonProps = {
		value: field.value,
		onChange: onChange,
		name: item.name,
	};
	switch (item.type) {
		case "rate": {
			const numericValue =
				typeof field.value === "number"
					? field.value
					: Number(field.value) || 0;
			return (
				<div className="p-4 transition-all duration-200 border border-dashed rounded-lg border-border/60 bg-background/40 hover:border-primary/50">
					<RateInput
						name={item.name}
						value={numericValue}
						onChange={(value: number) => {
							item.onChange?.(value);
							field.onChange?.(value);
						}}
						maxRating={item.max}
						showValue={true}
						disabled={item.disabled}
					/>
				</div>
			);
		}
		case "filesUpload":
			return (
				<div className="transition-all duration-200 rounded-lg hover:border-primary/50 focus-within:border-primary/50 bg-background/30">
					<FilesUploadInput
						onRemove={item.onRemove}
						{...commonProps}
						maxSelections={item.max}
					/>
				</div>
			);
		case "text-editor":
			return (
				<div className="overflow-hidden transition-all duration-200 border rounded-md border-input focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 hover:border-primary/50">
					<TextEditor
						value={field.value}
						onChange={(content) => field.onChange(content)}
						name={item.name}
						placeholder={item.placeholder}
						disabled={item.disabled}
					/>
				</div>
			);
		case "multiSelect":
			return (
				<div className="transition-all duration-200 focus-within:shadow-md">
					<MultiSelectInput
						value={field.value}
						onChange={(e) => field.onChange(e)}
						options={item.options || []}
						name={item.name}
						placeholder={item.placeholder}
					/>
				</div>
			);
		case "color":
			return (
				<div className="flex items-center gap-3 p-3 transition-all duration-200 border rounded-md border-input bg-background hover:border-primary/50 focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
					<ColorInput {...commonProps} />
				</div>
			);
		case "yy-mm-dd":
			return (
				<input
					id={field.name}
					type="date"
					className="flex w-full h-10 px-3 py-2 text-sm transition-all duration-200 border rounded-md border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 hover:border-primary/50 focus:shadow-md"
					placeholder="Select a date"
					disabled={item.disabled}
					{...commonProps}
				/>
			);
		case "selectPaginated":
			return (
				<div className="transition-all duration-200 focus-within:shadow-md">
					<SelectPaginated
						value={field.value}
						apiUrl={item.apiUrl || ""}
						onChange={(e) => item.onChange?.(e)}
						onControlChange={(e) => field.onChange(e)}
						name={item.name}
						allowNew={item.allowNew}
						onLabelAction={item.onLabelAction}
						isMulti={item.isMulti}
						searchParamsFilter={item.searchParamsFilter}
						labelKey={item.labelKey}
						placeholder={item.placeholder}
						searchFilters={item.searchFilters}
						idKey={item.idKey}
						groupBy={item.groupBy}
					/>
				</div>
			);
		case "checkbox":
			return <CheckBoxInput {...commonProps} options={item.options || []} />;
		case "radioGroup":
			return (
				<div className="p-3 space-y-3 transition-all duration-200 border rounded-md border-input bg-background/50 hover:border-primary/50 focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
					<RadioButtonInput {...item} {...commonProps} />
				</div>
			);
		case "select":
			return (
				<div className="transition-all duration-200 focus-within:shadow-md">
					<SelectInput
						{...commonProps}
						options={item.options || []}
						placeholder={item.placeholder}
					/>
				</div>
			);
		case "img":
			return <ImgInput {...commonProps} />;
		case "textarea":
			return (
				<Textarea
					className="w-full min-h-[80px] resize-y transition-all duration-200 focus:shadow-md"
					placeholder={item.placeholder}
					disabled={item.disabled}
					{...commonProps}
				/>
			);

		case "email":
			return (
				<TextInput
					value={field.value}
					onChange={(e: ChangeEvent<HTMLInputElement>) => field.onChange(e)}
					type="email"
					placeholder={item.placeholder}
					className="transition-all duration-200 focus:shadow-md"
				/>
			);
		case "date":
			return (
				<div className="transition-all duration-200 focus-within:shadow-md">
					<DateInput min={item?.min as any} {...commonProps} />
				</div>
			);
		case "text":
			return (
				<Input
					{...commonProps}
					type={item.type}
					placeholder={item.placeholder}
					disabled={item.disabled}
					className="transition-all duration-200 focus:shadow-md hover:border-primary/50"
				/>
			);
		case "time": {
			const timeValue = normalizeTimeValue(field.value);
			return (
				<div className="p-3 space-y-3 transition-all duration-200 border rounded-md border-input bg-background/40 hover:border-primary/50 focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
					<TimeInput
						name={item.name}
						value={timeValue}
						disabled={item.disabled}
						onChange={(nextValue: string) => {
							item.onChange?.(nextValue);
							field.onChange?.(nextValue);
						}}
					/>
				</div>
			);
		}
		case "tag-input":
			return (
				<>
					<TagInput {...commonProps} />
				</>
			);
		case "number":
			return (
				<div className="transition-all duration-200 focus-within:shadow-md">
					<NumberInput
						{...commonProps}
						disabled={item.disabled}
						placeholder={item.placeholder}
					/>
				</div>
			);
		case "password":
			return (
				<div className="transition-all duration-200 focus-within:shadow-md">
					<PasswordInput {...commonProps} />
				</div>
			);
		case "file":
			return (
				<div className="relative">
					<TextInput
						{...commonProps}
						type={item.type}
						placeholder={item.placeholder}
						className="transition-all duration-200 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
					/>
				</div>
			);
		case "tel":
			return (
				<div className="transition-all duration-200 focus-within:shadow-md">
					<CustomPhoneInput {...commonProps} />
				</div>
			);
		case "space":
			return <div className="h-4" />;
		default:
			return <></>;
	}
};

export const renderInputComponent = ({
	item,
	field,
	errors,
}: {
	item: FormInput;
	// biome-ignore lint/suspicious/noExplicitAny: field is typed generic to any in wrapper
	field: any;
	errors: FieldErrors;
}) => {
	const errorMessage = getErrorMessage(errors, item.name);
	return (
		<Suspense fallback={<InputSkeletonWithType type={item.type} />}>
			<InputWrapper
				label={item.label ?? item.name}
				hideLabel={item.hideLabel}
				labelInfo={item.labelInfo}
				required={item.required}
				multiLang={item.multiLang}
				icon={item.icon}
				error={errorMessage}
			>
				{renderInput({ item, field })}
			</InputWrapper>
		</Suspense>
	);
};
const InputWrapper = ({
	children,
	error,
	required,
	label,
	hideLabel,
	labelInfo,
	icon,
}: {
	multiLang?: boolean;
	required?: boolean;
	label?: string | React.ReactNode;
	hideLabel?: boolean;
	labelInfo?: React.ReactNode;
	icon?: React.ReactNode;
	children: React.ReactNode;
	error?: string;
}) => (
	<div className="w-full space-y-2 group">
		{label && !hideLabel && (
			<div className="flex items-center gap-2">
				<div className="flex items-center gap-1.5">
					{icon && (
						<span className="text-muted-foreground group-focus-within:text-primary transition-colors duration-200">
							{icon}
						</span>
					)}
					<div className="text-sm font-semibold text-gray-700 transition-colors duration-200 dark:text-gray-300 flex items-center gap-0.5">
						{label}
						{required && (
							<span
								className="text-xs font-bold text-red-500 select-none ml-0.5"
								aria-hidden="true"
							>
								*
							</span>
						)}
					</div>
				</div>
				{labelInfo && (
					<div className="ml-2 text-sm text-muted-foreground">{labelInfo}</div>
				)}
			</div>
		)}
		<div className="relative">
			{children}
			{error && (
				<div className="mt-1 duration-200 animate-in slide-in-from-top-1">
					<ErrorMessage error={error} />
				</div>
			)}
		</div>
	</div>
);

const getErrorMessage = (errors: FieldErrors, name: string) => {
	return name.split(".").length === 3
		? getNestedError(errors, name)
		: (errors[name]?.message as string);
};

// Export skeleton components for use in other parts of the app
export { FormSkeleton, InputSkeleton, InputSkeletonWithType };
