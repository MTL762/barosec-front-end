import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import { useLocale } from "next-intl";
import type { FormInput } from "../Form/CustomFormTypes.types";

type RadioButtonInputProps = FormInput & {
	value?: string;
};

export default function RadioButtonInput({
	options,
	onChange,
	name,
	value,
}: RadioButtonInputProps) {
	const locale = useLocale();
	const isRtl = locale === "ar";

	return (
		<RadioGroup
			value={value?.toString()}
			onValueChange={(val) => onChange?.(val)}
			name={name}
			className={cn("flex flex-wrap gap-3", isRtl && "flex-row-reverse")}
		>
			{options?.map((option) => {
				const id = `${name}-${option.value}`;
				const isSelected = value?.toString() === option.value.toString();
				return (
					<label
						key={option.value.toString()}
						htmlFor={id}
						className={cn(
							"flex items-center gap-2 cursor-pointer select-none rounded-lg border px-3 py-1.5 text-sm transition-colors",
							isRtl && "flex-row-reverse",
							isSelected
								? "border-primary bg-primary/10 text-primary font-medium"
								: "border-input text-muted-foreground hover:border-primary/50 hover:text-foreground",
						)}
					>
						<RadioGroupItem id={id} value={option.value.toString()} />
						<span dangerouslySetInnerHTML={{ __html: option.label }} />
					</label>
				);
			})}
		</RadioGroup>
	);
}
