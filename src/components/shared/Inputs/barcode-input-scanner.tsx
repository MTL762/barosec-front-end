/* eslint-disable no-console */
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
	BarcodeFormat,
	BrowserMultiFormatReader,
	DecodeHintType,
	type Result,
} from "@zxing/library";
import { Camera, Search, X } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import type React from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

export default function BarcodeInputScanner({
	title,
	toaster,
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
	const [scanResult, setScanResult] = useState("");
	const [isScanning, setIsScanning] = useState(false);
	const videoRef = useRef<HTMLVideoElement>(null);
	const readerRef = useRef<BrowserMultiFormatReader | null>(null);
	const router = useRouter();
	const locale = useLocale();
	const t = useTranslations();
	useEffect(() => {
		if (toaster?.message) {
			toast(toaster?.message);
		}
	}, [toaster]);

	useEffect(() => {
		if (scanResult) {
			router.push(`${link}?code=${scanResult}`);
		}
	}, [scanResult, locale, router]);

	const initializeReader = useCallback(() => {
		const hints = new Map();
		const formats = [
			BarcodeFormat.QR_CODE,
			BarcodeFormat.EAN_13,
			BarcodeFormat.CODE_128,
		];
		hints.set(DecodeHintType.POSSIBLE_FORMATS, formats);
		readerRef.current = new BrowserMultiFormatReader(hints);
	}, []);

	const startScanning = useCallback(() => {
		if (!readerRef.current) {
			initializeReader();
		}

		if (videoRef.current && readerRef.current) {
			setIsScanning(true);
			readerRef.current
				.decodeFromConstraints(
					{
						audio: false,
						video: { facingMode: "environment" },
					},
					videoRef.current,
					(result: Result | null, error: Error | undefined) => {
						if (result && result.getText()) {
							setScanResult(result.getText());
							setBarcodeInput(result.getText());
							stopScanning();
						}
						if (error) {
							console.error("Scanning error:", error);
						}
					},
				)
				.catch((err: Error) => {
					console.error("Failed to start scanning:", err);
					setIsScanning(false);
				});
		}
	}, [initializeReader]);

	const stopScanning = useCallback(() => {
		if (readerRef.current) {
			readerRef.current.reset();
			setIsScanning(false);
		}
	}, []);

	const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setBarcodeInput(event.target.value);
	};

	const handleInputSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setScanResult(barcodeInput);
		router.push(`${link}?code=${barcodeInput}`);
		setBarcodeInput("");
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
						<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-blue-600" />
						<Input
							id="barcode-input"
							type="text"
							placeholder={t("Enter barcode number")}
							value={barcodeInput}
							className="pl-9 h-9 w-full"
							onChange={handleInputChange}
						/>
						{/* <Button type="submit">Submit</Button> */}
					</div>
					<Button
						variant="outline"
						onClick={isScanning ? stopScanning : startScanning}
						size="icon"
						className="h-9 w-9 flex-shrink-0"
					>
						{isScanning ? (
							<>
								<X className="h-4 w-4" />
							</>
						) : (
							<>
								<Camera className="h-4 w-4" />
							</>
						)}
					</Button>
				</form>

				<div>
					<div
						className={`${
							isScanning ? "block" : "hidden"
						} relative aspect-video`}
					>
						<video
							ref={videoRef}
							className={` w-full object-cover rounded-lg`}
						/>
						{isScanning && (
							<div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg">
								<p className="text-white">Scanning...</p>
							</div>
						)}
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
