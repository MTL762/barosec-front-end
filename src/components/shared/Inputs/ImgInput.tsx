"use client";

import { FileTextIcon, ImageIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useEffect, useState } from "react";

interface ImgInputProps {
	alt?: string;
	name?: string;
	value?: string;
	className?: string;
	onChange?: (e: File) => void;
	accept?: string;
}

export default function ImgInput({
	alt,
	name,
	value,
	onChange,
	className,
}: ImgInputProps) {
	const [fileName, setFileName] = useState<string>("");
	const [previewUrl, setPreviewUrl] = useState<string>("");
	const [fileType, setFileType] = useState<"image" | "pdf" | "other">("image");
	const t = useTranslations();

	useEffect(() => {
		if (value && typeof value === "string") {
			setPreviewUrl(value);
			setFileName(value.split("/").pop() || "");
		}
	}, [value]);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			setFileName(file.name);
			const objectUrl = URL.createObjectURL(file);
			setPreviewUrl(objectUrl);
			onChange?.(file);
		}
	};

	return (
		<div className={`flex flex-col gap-4 ${className || ""}`}>
			{previewUrl && (
				<div className="relative w-32 h-32 rounded-xl overflow-hidden border border-border">
					<Image
						src={previewUrl}
						alt={alt || "Preview"}
						fill
						className="object-cover"
					/>
				</div>
			)}
			<label className="flex items-center gap-4 p-4 border-2 border-dashed border-border rounded-xl cursor-pointer hover:bg-accent/50">
				<ImageIcon className="size-6 text-muted-foreground" />
				<span className="text-sm font-medium">{fileName || t("Choose file")}</span>
				<input
					type="file"
					name={name}
					onChange={handleChange}
					className="hidden"
					accept="image/*"
				/>
			</label>
		</div>
	);
}
