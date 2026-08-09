"use client";
import { API_IMG_URL } from "@/utils/config";
import { FileTextIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useEffect, useState } from "react";
import { MdImage } from "react-icons/md";

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
	const getFileType = (url: string) => {
		const extension = url.split(".").pop()?.toLowerCase();
		if (
			["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(extension || "")
		) {
			return "image";
		}
		if (extension === "pdf") {
			return "pdf";
		}
		return "other";
	};

	useEffect(() => {
		// Handle initial value
		if (value && typeof value === "string") {
			setPreviewUrl(API_IMG_URL + value);
			setFileName(value.split("/").pop() || "");
			setFileType(getFileType(value));
		}

		// Cleanup
		return () => {
			if (previewUrl && previewUrl.startsWith("blob:")) {
				URL.revokeObjectURL(previewUrl);
			}
		};
	}, [value]);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			setFileName(file.name);
			setFileType(getFileType(file.name));

			// Create preview URL for new file
			const objectUrl = URL.createObjectURL(file);
			if (previewUrl && previewUrl.startsWith("blob:")) {
				URL.revokeObjectURL(previewUrl);
			}
			setPreviewUrl(objectUrl);
			onChange?.(file);
		}
	};

	return (
		<div className={`flex flex-col gap-4 ${className}`}>
			{previewUrl && (
				<div className="relative w-32 h-32 rounded-xl overflow-hidden border-2 border-border/50 shadow-md group">
					{fileType === "image" || previewUrl ? (
						<>
							<Image
								src={previewUrl ?? ""}
								alt={alt || "Preview"}
								fill
								className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
							/>
							<div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
						</>
					) : fileType === "pdf" ? (
						<div className="w-full h-full flex flex-col items-center justify-center bg-red-50 text-red-600">
							<FileTextIcon className="w-8 h-8 mb-1" />
							<span className="text-xs font-medium">PDF</span>
						</div>
					) : (
						<div className="w-full h-full flex flex-col items-center justify-center bg-gray-50 text-gray-600">
							<MdImage className="w-8 h-8 mb-1" />
							<span className="text-xs font-medium">{t("File")}</span>
						</div>
					)}
				</div>
			)}
			<label
				className="flex items-center gap-4 p-4 border-2 border-dashed 
                  border-border/50 hover:border-primary/50 rounded-xl 
                  cursor-pointer transition-all duration-300 
                  bg-background/50 hover:bg-background/80 backdrop-blur-sm
                  hover:shadow-md focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2"
			>
				<div
					className="flex items-center justify-center w-10 h-10 
                    bg-primary/10 hover:bg-primary/20 rounded-lg 
                    text-primary transition-colors duration-200"
				>
					{fileType === "pdf" ? (
						<FileTextIcon className="w-6 h-6" />
					) : (
						<MdImage className="w-10 h-6" />
					)}
				</div>
				<div className="flex flex-col flex-1 min-w-0">
					{fileName ? (
						<div className="space-y-1">
							<span className="text-sm font-medium text-foreground truncate block">
								{fileName.slice(0, 40)}
								{fileName.length > 40 ? "..." : ""}
							</span>
							<span className="text-xs text-muted-foreground">
								{t("Click to change")}
							</span>
						</div>
					) : (
						<div className="space-y-1 flex gap-2">
							<span className="text-sm font-medium text-foreground">
								{t("Choose file")}
							</span>
							<span className="text-xs text-muted-foreground">
								{t("Click to browse or drag and drop")}
							</span>
						</div>
					)}
				</div>
				<input
					type="file"
					name={name}
					onChange={handleChange}
					className="hidden"
					aria-label={alt || "Choose file"}
				/>
			</label>
			{fileName && (
				<button
					onClick={() => {
						setFileName("");
						setPreviewUrl("");
						setFileType("image");
						if (previewUrl && previewUrl.startsWith("blob:")) {
							URL.revokeObjectURL(previewUrl);
						}
					}}
					className="self-start text-sm text-destructive hover:text-destructive/80 
                        transition-colors duration-200 hover:underline focus:outline-none 
                        focus:ring-2 focus:ring-destructive/20 rounded px-1"
					type="button"
				>
					{t("Remove file")}
				</button>
			)}
		</div>
	);
}
