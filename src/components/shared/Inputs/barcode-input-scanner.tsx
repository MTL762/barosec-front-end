"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Camera, Search } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function BarcodeInputScanner({
	title,
	link,
}: {
	link: string;
	toaster?: {
		type: string;
		message: string;
	};
	title?: string;
}) {
	const [barcodeInput, setBarcodeInput] = useState("");
	const router = useRouter();
	const t = useTranslations();

	const handleInputSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		if (barcodeInput) {
			router.push(`${link}?code=${barcodeInput}`);
			setBarcodeInput("");
		}
	};

	return (
		<Card className="w-full max-w-md border-none h-fit">
			{title && (
				<CardHeader>
					<CardTitle>{title}</CardTitle>
				</CardHeader>
			)}
			<CardContent>
				<form className="flex gap-2" onSubmit={handleInputSubmit}>
					<div className="relative flex-1">
						<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
						<Input
							id="barcode-input"
							type="text"
							placeholder={t("Enter barcode number")}
							value={barcodeInput}
							className="pl-9 h-9 w-full"
							onChange={(e) => setBarcodeInput(e.target.value)}
						/>
					</div>
					<Button
						type="submit"
						variant="outline"
						size="icon"
						className="h-9 w-9 flex-shrink-0"
					>
						<Camera className="h-4 w-4" />
					</Button>
				</form>
			</CardContent>
		</Card>
	);
}
