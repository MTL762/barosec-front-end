"use client";
import { API_IMG_URL } from "@/utils/config";
import {
	Camera,
	FileText,
	Image as ImageIcon,
	Trash2,
	UploadCloud,
} from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import type React from "react";
import { useEffect, useRef, useState } from "react";

interface ImgInputProps {
	alt?: string;
	name?: string;
	value?: any;
	className?: string;
	onChange?: (e: File) => void;
	accept?: string;
}

export default function PremiumImgInput({
	alt,
	name,
	value,
	onChange,
	className,
	accept = "image/*",
}: ImgInputProps) {
	const [fileName, setFileName] = useState<string>("");
	const [previewUrl, setPreviewUrl] = useState<string>("");
	const [fileType, setFileType] = useState<"image" | "pdf" | "other">("image");
	const [isDragActive, setIsDragActive] = useState<boolean>(false);
	const fileInputRef = useRef<HTMLInputElement>(null);
	const t = useTranslations("");

	const getFileType = (url: string) => {
		if (!url) return "image";
		const extension = url.split(".").pop()?.toLowerCase();
		if (extension === "pdf") {
			return "pdf";
		}
		// Default to image for this component, handling API URLs that might lack extensions
		return "image";
	};

	useEffect(() => {
		if (value) {
			if (typeof value === "string") {
				const isAbsolute =
					value.startsWith("http") ||
					value.startsWith("blob:") ||
					value.startsWith("data:");
				setPreviewUrl(
					isAbsolute
						? value
						: API_IMG_URL + (value.startsWith("/") ? value : `/${value}`),
				);
				setFileName(value.split("/").pop() || "");
				setFileType(getFileType(value));
			} else if (value instanceof File) {
				processFile(value);
			}
		}

		return () => {
			if (previewUrl && previewUrl.startsWith("blob:")) {
				URL.revokeObjectURL(previewUrl);
			}
		};
	}, [value]);

	const processFile = (file: File) => {
		if (file) {
			setFileName(file.name);
			setFileType(getFileType(file.name));

			const objectUrl = URL.createObjectURL(file);
			if (previewUrl && previewUrl.startsWith("blob:")) {
				URL.revokeObjectURL(previewUrl);
			}
			setPreviewUrl(objectUrl);
			onChange?.(file);
		}
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			processFile(file);
		}
	};

	const handleDrag = (e: React.DragEvent) => {
		e.preventDefault();
		e.stopPropagation();
		if (e.type === "dragenter" || e.type === "dragover") {
			setIsDragActive(true);
		} else if (e.type === "dragleave") {
			setIsDragActive(false);
		}
	};

	const handleDrop = (e: React.DragEvent) => {
		e.preventDefault();
		e.stopPropagation();
		setIsDragActive(false);

		const file = e.dataTransfer.files?.[0];
		if (file) {
			processFile(file);
		}
	};

	const handleRemove = (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();
		setFileName("");
		setPreviewUrl("");
		setFileType("image");
		if (previewUrl && previewUrl.startsWith("blob:")) {
			URL.revokeObjectURL(previewUrl);
		}
		// Note: trigger onChange with undefined/null or custom event if needed
	};

	const triggerFileInput = () => {
		fileInputRef.current?.click();
	};

	return (
		<div className={`w-full flex flex-col gap-4 ${className || ""}`}>
			{/* Hidden Real File Input */}
			<input
				ref={fileInputRef}
				type="file"
				name={name}
				onChange={handleChange}
				accept={accept}
				className="hidden"
				aria-label={alt || "Choose file"}
			/>

			{previewUrl ? (
				/* Premium Preview Container */
				<div className="flex flex-col sm:flex-row items-center gap-6 p-5 rounded-2xl border border-slate-100 bg-slate-50/50 dark:border-slate-800/80 dark:bg-slate-900/20 backdrop-blur-sm transition-all duration-300">
					<div
						onClick={triggerFileInput}
						className="relative w-28 h-28 rounded-2xl overflow-hidden border-2 border-indigo-100/60 dark:border-indigo-950/40 shadow-sm cursor-pointer group transition-all duration-300 hover:border-indigo-500/50 hover:shadow-md"
					>
						{fileType === "image" ? (
							<>
								<Image
									src={previewUrl}
									alt={alt || "Preview"}
									fill
									className="object-cover transition-transform duration-500 group-hover:scale-105"
								/>
								{/* Overlay on hover */}
								<div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center text-white gap-1 backdrop-blur-[2px]">
									<Camera className="w-5 h-5 animate-pulse" />
									<span className="text-[10px] font-medium tracking-wide uppercase">
										{t("Change")}
									</span>
								</div>
							</>
						) : fileType === "pdf" ? (
							<div className="w-full h-full flex flex-col items-center justify-center bg-red-50/80 dark:bg-red-950/20 text-red-600 dark:text-red-400 group-hover:bg-red-100/80 dark:group-hover:bg-red-950/30 transition-colors duration-300">
								<FileText className="w-8 h-8 mb-1" />
								<span className="text-[10px] font-bold tracking-wider">
									PDF
								</span>
								{/* Overlay on hover */}
								<div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center text-white">
									<Camera className="w-5 h-5" />
								</div>
							</div>
						) : (
							<div className="w-full h-full flex flex-col items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 group-hover:bg-slate-200 dark:group-hover:bg-slate-700 transition-colors duration-300">
								<ImageIcon className="w-8 h-8 mb-1" />
								<span className="text-[10px] font-bold tracking-wider uppercase">
									{t("File")}
								</span>
								{/* Overlay on hover */}
								<div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center text-white">
									<Camera className="w-5 h-5" />
								</div>
							</div>
						)}
					</div>

					<div className="flex flex-col items-center sm:items-start flex-1 min-w-0 gap-3">
						<div className="text-center sm:text-left">
							<span className="text-xs font-semibold uppercase tracking-wider text-indigo-500 dark:text-indigo-400 block mb-0.5">
								{t("Selected File") || "Selected File"}
							</span>
							<span
								className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate block max-w-[240px] sm:max-w-[320px]"
								title={fileName}
							>
								{fileName}
							</span>
						</div>

						<div className="flex items-center gap-2">
							<button
								type="button"
								onClick={triggerFileInput}
								className="inline-flex items-center justify-center px-3.5 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:text-slate-900 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
							>
								{t("Choose image file") || "Change Photo"}
							</button>
							<button
								type="button"
								onClick={handleRemove}
								className="inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-red-600 dark:text-red-400 bg-red-50/50 dark:bg-red-950/10 border border-red-100/50 dark:border-red-950/30 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/20 hover:text-red-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500/20"
							>
								<Trash2 className="w-3.5 h-3.5" />
								{t("Remove file") || "Remove file"}
							</button>
						</div>
					</div>
				</div>
			) : (
				/* Premium Drag & Drop Zone */
				<div
					onDragEnter={handleDrag}
					onDragOver={handleDrag}
					onDragLeave={handleDrag}
					onDrop={handleDrop}
					onClick={triggerFileInput}
					className={`relative flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-2xl cursor-pointer transition-all duration-300 select-none group ${
						isDragActive
							? "border-indigo-500 bg-indigo-50/30 dark:border-indigo-400 dark:bg-indigo-950/10 scale-[1.01]"
							: "border-slate-200 bg-slate-50/30 hover:border-indigo-500/50 hover:bg-slate-50/80 dark:border-slate-800 dark:bg-slate-900/10 dark:hover:border-indigo-400/40 dark:hover:bg-slate-900/20"
					}`}
				>
					<div className="flex flex-col items-center text-center gap-3">
						<div
							className={`flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-300 ${
								isDragActive
									? "bg-indigo-500 text-white scale-110 shadow-md shadow-indigo-500/20"
									: "bg-indigo-50 dark:bg-indigo-950/30 text-indigo-500 dark:text-indigo-400 group-hover:scale-105"
							}`}
						>
							<UploadCloud
								className={`w-6 h-6 transition-transform duration-300 ${
									isDragActive
										? "animate-pulse"
										: "group-hover:-translate-y-0.5"
								}`}
							/>
						</div>

						<div className="space-y-1.5">
							<span className="text-sm font-semibold text-slate-800 dark:text-slate-200 block">
								{t("Choose file") || "Choose file"}
							</span>
							<span className="text-xs text-slate-500 dark:text-slate-400 block max-w-xs">
								{t("Click to browse or drag and drop")}
							</span>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
