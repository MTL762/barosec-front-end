import { Input } from "@/components/ui/input";
import type { FieldErrors } from "react-hook-form";
import ErrorMessage from "../Form/ErrorMessage";

interface NumberInputProps {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	errors?: FieldErrors<any>;
	name: string;
	disabled?: boolean;
	placeholder?: string;
}

export default function NumberInput({
	errors,
	name,
	disabled,
	placeholder,
	...props
}: NumberInputProps) {
	return (
		<div className="flex flex-col gap-3">
			<Input
				{...props}
				name={name}
				type="number"
				className="p-[15px] pl-[25px]"
				step="0.1"
				disabled={disabled}
				placeholder={placeholder}
				onWheel={(e) => (e.target as HTMLInputElement).blur()}
				onKeyPress={(e: { key: string; preventDefault: () => void }) => {
					// Allow numbers and decimal point
					if (!/[0-9.]/.test(e.key)) {
						e.preventDefault();
					}
				}}
			/>
			{errors && <ErrorMessage error={errors[name]?.message as string} />}
		</div>
	);
}
