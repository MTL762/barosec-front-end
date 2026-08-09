import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import type { Option } from "../Form/CustomFormTypes.types";

function CheckBoxOption({
	option,
	name,
	isChecked,
	onCheckedChange,
}: {
	option: Option;
	name: string;
	isChecked: boolean;
	onCheckedChange: (checked: boolean) => void;
}) {
	const t = useTranslations();
	return (
		<div
			className="flex items-start w-full gap-3 px-1 py-1 transition-colors duration-200 border border-transparent rounded-xl hover:border-slate-200 hover:bg-slate-50"
			key={option.value.toString()}
		>
			<Checkbox
				name={name}
				checked={isChecked}
				onCheckedChange={(checked) => onCheckedChange(!!checked)}
				id={option.value.toString()}
				className="mt-0.5 border-slate-300 data-[state=checked]:border-slate-900 data-[state=checked]:bg-slate-900"
			/>
			<label
				htmlFor={option.value.toString()}
				className="flex-1 gap-2 text-sm font-semibold leading-6 text-nowrap text-slate-700 peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
			>
				{/* {option.img && (
					<Image
						src={option.img}
						width={20}
						height={20}
						alt={option.label}
					/>
				)} */}
				{t(option.label)}
			</label>
		</div>
	);
}

export default function CheckBoxInput({
	value,
	onChange,
	name,
	options,
	className,
}: {
	className?: string;
	value?: string[];
	onChange: (e: string[]) => void;
	name: string;
	options: Option[];
}) {
	const handleCheckedChange = (checked: boolean, optionValue: string) => {
		const newValue = checked
			? [...(value || []), optionValue]
			: value?.filter((v) => v != optionValue) || [];

		onChange(newValue);
	};

	const isChecked = (optionValue: string): boolean => {
		return Array.isArray(value) ? value.includes(optionValue) : false;
	};
	return (
		<div className={cn("flex flex-row flex-wrap-reverse ", className)}>
			{options.map((option) => (
				<CheckBoxOption
					key={option.value.toString()}
					option={option}
					name={name}
					data-testid={name}
					isChecked={isChecked(option.value.toString())}
					onCheckedChange={(checked) =>
						handleCheckedChange(checked, option.value.toString())
					}
				/>
			))}
		</div>
	);
}
