/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button";
import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import type { UseFieldArrayRemove } from "react-hook-form";
import type { FormInput } from "./CustomFormTypes.types";
import FormCard from "./form-card";

export default function CustomGeneratedInputs({
	fields,
	append,
	name,
	remove,
	control,
	generatedInputs,
	minRequired,
	swap,
}: {
	minRequired?: number;
	generatedInputs: FormInput[];
	fields: any;
	append?: any;
	remove?: UseFieldArrayRemove;
	swap?: (indexA: number, indexB: number) => void;
	control: any;
	name: string;
}) {
	const t = useTranslations();
	return (
		<div className="space-y-4">
			{fields.map((item: FormInput, index: number) => {
				const cardInputs = generatedInputs?.map((input) => {
					return {
						...input,
						name: `${name}.${index}.${input.name}`,
						label: input?.label || t(`${input?.name}`),
						id: `${name}.${index}.${input.name}`,
						defaultValue: input?.defaultValue || t(`${input?.name}`),
						placeholder: input?.placeholder || t(`${input?.name}`),
					};
				});

				return (
					<div
						key={item.id}
						className="duration-500 group animate-in slide-in-from-bottom-4"
						style={{ animationDelay: `${index * 100}ms` }}
					>
						<div className="relative duration-300 border-2 border-dashed border-border/50 hover:border-primary/30 hover:shadow-lg">
							<div className="absolute z-10 flex gap-2 top-3 end-3">
								{swap && index > 0 && (
									<Button
										type="button"
										variant="outline"
										size="sm"
										onClick={() => swap(index, index - 1)}
										className="duration-200 shadow-sm opacity-0 group-hover:opacity-100"
									>
										<ArrowUp className="w-4 h-4" />
									</Button>
								)}
								{swap && index < fields.length - 1 && (
									<Button
										type="button"
										variant="outline"
										size="sm"
										onClick={() => swap(index, index + 1)}
										className="duration-200 shadow-sm opacity-0 group-hover:opacity-100"
									>
										<ArrowDown className="w-4 h-4" />
									</Button>
								)}
								{remove && fields.length > (minRequired || 0) && (
									<Button
										type="button"
										variant="destructive"
										size="sm"
										onClick={() => remove(index)}
										className="duration-200 shadow-lg opacity-0 group-hover:opacity-100"
									>
										<Trash2 className="w-4 h-4" />
									</Button>
								)}
							</div>
							<div className="p-6">
								<div className="flex items-center gap-2 mb-4">
									<div className="w-2 h-2 rounded-full bg-primary" />
									<h4 className="text-sm font-medium text-muted-foreground">
										{t("item")} {index + 1}
									</h4>
								</div>
								<FormCard
									animationIndex={index}
									cardConfig={[
										{
											id: item.id?.toString() || "",
											title: null,
											width: 6,
											multiLang: false,
										},
									]}
									cardInputs={cardInputs}
									cardId={item.id?.toString() || ""}
									control={control}
								/>
							</div>
						</div>
					</div>
				);
			})}
			{append && (
				<div className="flex justify-start pt-4">
					<Button
						type="button"
						variant="outline"
						onClick={append}
						className="border-2 border-dashed group border-primary/30 bg-primary/5 hover:bg-primary/10 hover:border-primary/50 hover:shadow-md"
					>
						<Plus className="w-4 h-4 mr-2 duration-300 group-hover:rotate-90" />
						{t("append")}
					</Button>
				</div>
			)}
		</div>
	);
}
