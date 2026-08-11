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
	const safeTranslate = (key?: string, fallbackDefault?: string) => {
		if (key) {
			try {
				if (t.has(key as any)) return t(key as any);
			} catch {}
			return key;
		}
		if (fallbackDefault) {
			try {
				if (t.has(fallbackDefault as any)) return t(fallbackDefault as any);
			} catch {}
			return fallbackDefault;
		}
		return "";
	};

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
				{safeTranslate(cancelLabel, "cancel")}
			</Button>
			<Button
				type="submit"
				disabled={disabled}
				className="order-1 w-full sm:w-auto sm:order-2 bg-primary hover:bg-primary/90 text-primary-foreground"
			>
				{safeTranslate(btnLabel, id ? "update" : "submit")}
			</Button>
		</div>
	);
}
