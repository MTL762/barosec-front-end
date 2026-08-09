import PageType from "@/utils/PageType";
import { GlobalLoading } from "global-loading-state";
import { useTranslations } from "next-intl";
import React from "react";
import type {
	FieldErrors,
	FieldValues,
	UseFormSetValue
} from "react-hook-form";
import type { FormInput, FormLangs } from "./CustomFormTypes.types";
import FormCard from "./form-card";
import SubmitSection from "./submit-section";

export default function CustomForm<T extends FieldValues>({
	inputs,
	control,
	setValue,
	handleSubmit,
	cardConfig,
	children,
	onCancelClick,
	cancelLabel = "Cancel",
	btnLabel,
	isMasonry,
}: {
	errors?: FieldErrors;
	// biome-ignore lint/suspicious/noExplicitAny: control is typed generic to any in wrapper
	control: any;
	// biome-ignore lint/suspicious/noExplicitAny: setValue is typed generic to any in wrapper
	setValue?: UseFormSetValue<any>;
	children?: React.ReactNode;
	onCancelClick?: () => void;
	cancelLabel?: string;
	btnLabel?: string;
	inputs: FormInput[];
	handleSubmit: (e?: React.BaseSyntheticEvent) => Promise<void> | void;
	cardConfig?: {
		id: number | string;
		title?: string | React.JSX.Element;
		width: number;
		multiLang?: boolean;
		icon?: React.JSX.Element;
		showSelectAll?: boolean;
	}[];
	changeLang?: FormLangs;
	isMasonry?: boolean;
}) {
	const t = useTranslations();
	const { id } = PageType();
	const groupedInputs = inputs.reduce(
		(acc, input) => {
			const cardId = input?.cardId ?? "default";
			if (!acc[cardId]) {
				acc[cardId] = [];
			}
			acc[cardId].push({
				...input,
				label: input?.label ? t(`${input?.label}`) : t(`${input?.name}`),
				id: input?.name,
				defaultValue: input?.defaultValue ?? t(`${input?.name}`),
				placeholder: input?.placeholder
					? t(`${input?.placeholder}`)
					: input?.label
						? t(`${input?.label}`)
						: t(`${input?.name}`),
			});
			return acc;
		},
		{} as Record<string | number, FormInput[]>,
	);

	return (
		<div className="w-full">
			<form onSubmit={handleSubmit} className="space-y-8">
				<div className="space-y-8">
					<div
						className={
							isMasonry
								? "columns-1 md:columns-2 xl:columns-3 gap-6 space-y-6 *:-mt-0 *:!mb-6"
								: "grid grid-cols-6 gap-6"
						}
					>
						{Object.entries(groupedInputs).map(
							([cardId, cardInputs], index) => {
								const content = (
									<FormCard<T>
										key={cardId}
										animationIndex={index}
										cardId={cardId}
										cardInputs={cardInputs}
										cardConfig={cardConfig}
										control={control}
										setValue={setValue}
									/>
								);
								return isMasonry ? (
									<div key={cardId} className="w-full break-inside-avoid h-fit">
										{content}
									</div>
								) : (
									<React.Fragment key={cardId}>{content}</React.Fragment>
								);
							},
						)}
					</div>

					{children && (
						<div className="w-full pt-6 duration-500 border-t animate-in slide-in-from-bottom-4">
							{children}
						</div>
					)}

					<div className="pt-6 duration-500 border-t animate-in slide-in-from-bottom-4">
						<SubmitSection
							id={id}
							disabled={GlobalLoading()}
							btnLabel={btnLabel}
							cancelLabel={cancelLabel}
							onCancel={onCancelClick}
						/>
					</div>
				</div>
			</form>
		</div>
	);
}
