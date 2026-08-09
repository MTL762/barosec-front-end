import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export default function TextInput({
	className,
	...props
}: React.ComponentProps<"input">) {
	return (
		<Input
			{...props}
			className={cn(
				"transition-all duration-200 focus:shadow-md hover:border-primary/50",
				className,
			)}
		/>
	);
}
