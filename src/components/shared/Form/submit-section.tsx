"use client";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

export default function SubmitSection({
	id,
	disabled,
	btnLabel,
	cancelLabel,
	onCancel,
}: {
	btnLabel?: string;
	id?: string;
	disabled?: boolean;
	cancelLabel?: string;
	onCancel?: () => void;
}) {
	const t = useTranslations();
	return (
		<div className="flex flex-col items-center justify-end gap-3 sm:flex-row">
			<Button
				type="button"
				variant="outline"
				onClick={() => {
					if (onCancel) {
						onCancel();
					} else window.history.back();
				}}
				className="order-2 w-full hover:text-red-600 sm:w-auto sm:order-1"
			>
				{cancelLabel ? t(cancelLabel) : t("cancel")}
			</Button>
			<Button
				type="submit"
				disabled={disabled}
				className="order-1 w-full sm:w-auto sm:order-2 bg-primary hover:bg-primary/90 text-primary-foreground"
			>
				{btnLabel ? t(btnLabel) : id ? t("update") : t("submit")}
			</Button>
		</div>
	);
}
