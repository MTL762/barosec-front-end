import { Checkbox } from "@/components/ui/checkbox";
import { useTranslations } from "next-intl";
import React from "react";
import {
	type Control,
	Controller,
	type FieldValues,
	type Path,
	type UseFormSetValue,
	useWatch,
} from "react-hook-form";
import type { FormInput, FormLangs } from "./CustomFormTypes.types";
import FormCardContainer from "./FormCardContainer";
import FormCardTitle from "./FormCardTitle.layout";
import FormInputContainer from "./FormInputContainer";
import { renderInputComponent } from "./inputs-render";

const locales = ["ar", "en"];

interface FormCardProps {
	animationIndex: number;
	cardId: string | number;
	cardInputs: FormInput[];
	cardConfig?: {
		id: number | string;
		title?: string | React.ReactNode;
		width: number;
		multiLang?: boolean;
		icon?: React.ReactNode;
		showSelectAll?: boolean;
	}[];
	control: Control<any>;
	setValue?: UseFormSetValue<FieldValues>;
	changeLang?: FormLangs;
}

export default function FormCard<T extends FieldValues>({
	animationIndex,
	cardId,
	cardInputs,
	cardConfig,
	control,
	setValue,
}: FormCardProps) {
	const t = useTranslations();
	const cardWidthObj = cardConfig?.find((cw) => cw.id === cardId);
	const colSpan = cardWidthObj ? cardWidthObj.width : 6;
	let cardTitle: any = null;
	if (cardConfig) {
		cardTitle = cardConfig.find((item) => item.id === cardId) || null;
	}

	const checkboxInputs = cardInputs.filter(
		(item) =>
			!item.isHidden && item.type === "checkbox" && item.options?.length,
	);
	const checkboxNames = checkboxInputs.map((item) => item.name) as Path<T>[];
	const watchedCheckboxValues = useWatch({
		control,
		name: checkboxNames,
	}) as Array<string[] | undefined>;
	const hasSelectAll = Boolean(
		cardTitle?.showSelectAll && setValue && checkboxInputs.length,
	);

	const areAllOptionsSelected =
		hasSelectAll &&
		checkboxInputs.every((input, inputIndex) => {
			const currentValues = Array.isArray(watchedCheckboxValues?.[inputIndex])
				? watchedCheckboxValues[inputIndex]
				: [];
			const optionValues = (input.options ?? []).map((option) =>
				option.value.toString(),
			);

			return (
				optionValues.length > 0 &&
				optionValues.every((optionValue) => currentValues.includes(optionValue))
			);
		});

	const hasAnySelection =
		hasSelectAll &&
		checkboxInputs.some((input, inputIndex) => {
			const currentValues = Array.isArray(watchedCheckboxValues?.[inputIndex])
				? watchedCheckboxValues[inputIndex]
				: [];
			return currentValues.length > 0;
		});

	const selectAllState = areAllOptionsSelected
		? true
		: hasAnySelection
			? false
			: false;

	const handleSelectAll = (checked: boolean) => {
		if (!setValue) return;

		checkboxInputs.forEach((input) => {
			const nextValues = checked
				? (input.options ?? []).map((option) => option.value.toString())
				: [];

			setValue(input.name as Path<FieldValues>, nextValues, {
				shouldDirty: true,
				shouldTouch: true,
				shouldValidate: true,
			});
		});
	};

	return (
		<FormCardContainer
			width={cardWidthObj?.width ?? colSpan}
			index={cardId}
			animationIndex={animationIndex}
		>
			{(cardTitle?.title || hasSelectAll) && (
				<FormCardTitle
					title={cardTitle?.title}
					action={
						hasSelectAll ? (
							<div className="flex items-center gap-2">
								<Checkbox
									id={`${String(cardId)}-select-all`}
									checked={selectAllState}
									onCheckedChange={(checked) =>
										handleSelectAll(checked === true)
									}
									className="mt-0 border-slate-300 data-[state=checked]:border-slate-900 data-[state=checked]:bg-slate-900"
								/>
								<label
									htmlFor={`${String(cardId)}-select-all`}
									className="cursor-pointer select-none text-sm font-semibold text-slate-700"
								>
									{t("Select All")}
								</label>
							</div>
						) : undefined
					}
				/>
			)}

			{cardInputs.map((item, index) => {
				const inputWidth = item.width ?? 3;
				const isMultiLang = item.multiLang && cardTitle?.multiLang;
				return (
					<React.Fragment key={item.name}>
						{!item.isHidden && (
							<FormInputContainer width={inputWidth} index={index}>
								<div className="flex items-baseline gap-2 text-black" />
								{isMultiLang ? (
									<>
										{locales.map((lang: string) => (
											<div key={`${item.name}${lang}`}>
												<div>
													<Controller
														name={`${item.name}${lang}` as Path<T>}
														control={control}
														render={({ field, formState: { errors } }: any) => {
															return renderInputComponent({
																errors: errors,
																item: {
																	...item,
																	name: `${item.name}${lang}`,
																},
																field,
															});
														}}
													/>
												</div>
											</div>
										))}
									</>
								) : (
									<Controller
										name={item.name as Path<T>}
										control={control}
										render={({ field, formState: { errors } }: any) =>
											renderInputComponent({
												errors: errors,
												item,
												field,
											})
										}
									/>
								)}
							</FormInputContainer>
						)}
					</React.Fragment>
				);
			})}
		</FormCardContainer>
	);
}
