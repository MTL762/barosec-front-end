"use client";

import { cn } from "@/lib/utils";
import { Cloud, FileText, X } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useCallback, useRef, useState } from "react";

export default function FilesUploadInput({
	name,
	maxSelections,
	onChange,
	minSelections,
	value,
	onRemove,
}: {
	onRemove?: (value: string) => void;
	name?: string;
	maxSelections?: number;
	minSelections?: number;
	onChange?: (files: (File | string)[]) => void;
	value: File[];
}) {
	const [files, setFiles] = useState<any>(value ?? []);
	const [dragActive, setDragActive] = useState(false);
	const inputRef = useRef<HTMLInputElement>(null);

	const onDragOver = useCallback((e: React.DragEvent) => {
		e.preventDefault();
		e.stopPropagation();
		setDragActive(true);
	}, []);

	const onDragLeave = useCallback((e: React.DragEvent) => {
		e.preventDefault();
		e.stopPropagation();
		setDragActive(false);
	}, []);

	const t = useTranslations();

	const onDrop = useCallback((e: React.DragEvent) => {
		e.preventDefault();
		e.stopPropagation();
		setDragActive(false);

		const droppedFiles = Array.from(e.dataTransfer.files);
		handleFiles(droppedFiles);
	}, []);

	const handleFiles = (newFiles: File[]) => {
		const validFiles = newFiles;
		onChange?.([...files, ...validFiles]);
		setFiles((prev: any) => {
			const newFileList = [...prev, ...validFiles];
			return newFileList.slice(0, 24);
		});
	};

	const onFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files.length > 0) {
			const selectedFiles = Array.from(e.target.files);
			handleFiles(selectedFiles);
		}
	};

	const removeFile = (index: number) => {
		setFiles((prev: any[]) => {
			const updatedFiles = prev.filter((_, i) => i !== index);
			onChange?.(updatedFiles);
			return updatedFiles;
		});

		if (typeof files[index]?.id === "number") {
			onRemove?.(files[index]?.id);
			return;
		}
	};

	const openFileDialog = () => {
		inputRef.current?.click();
	};

	return (
		<div className="w-full space-y-4">
			<div
				onClick={openFileDialog}
				onDragOver={onDragOver}
				onDragLeave={onDragLeave}
				onDrop={onDrop}
				className={cn(
					"relative border-2 border-dashed border-border/50 rounded-xl p-6",
					"hover:border-primary/50 hover:bg-background/80 transition-all duration-300 cursor-pointer",
					"focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
					dragActive && "border-primary bg-primary/5 shadow-lg",
					"min-h-[200px] backdrop-blur-sm",
					"group",
				)}
			>
				<input
					ref={inputRef}
					type="file"
					multiple
					name={name}
					min={minSelections}
					max={maxSelections}
					accept="image/jpeg,image/png,application/pdf"
					onChange={(e) => {
						if (onChange) {
							onChange(Array.from(e.target.files || []));
						}
						onFileSelect(e);
					}}
					className="hidden"
				/>

				{files.length === 0 ? (
					<div className="h-full min-h-[200px] flex flex-col items-center justify-center gap-4">
						<div className="relative">
							<Cloud className="w-16 h-16 transition-colors duration-300 text-muted-foreground/50 group-hover:text-primary/70" />
						</div>
						<div className="space-y-2 text-center">
							<p className="text-lg font-medium transition-colors duration-300 text-foreground group-hover:text-primary">
								{t("dragImagesHereOrClickToBrowse")}
							</p>
							<p className="text-sm text-muted-foreground">
								Support for images and PDF files
							</p>
						</div>
					</div>
				) : (
					<div className="space-y-4">
						<div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
							{files.map((file: any, index: number) => {
								const isFile = file instanceof File;
								const isPdf = isFile
									? file.type === "application/pdf"
									: (file.url || "").toLowerCase().endsWith(".pdf");

								const src = isFile
									? URL.createObjectURL(file as File)
									: (file as { id: string; url: string }).url;

								return (
									<div
										key={index}
										className="relative overflow-hidden transition-all duration-200 border rounded-lg group aspect-square border-border/50 hover:border-primary/50 hover:shadow-md"
									>
										{isPdf ? (
											<div className="flex flex-col items-center justify-center w-full h-full bg-red-500/10">
												<FileText className="w-8 h-8 text-red-500" />
												<span className="mt-1 text-xs text-red-500">PDF</span>
											</div>
										) : (
											<Image
												src={src}
												alt={`Uploaded file ${index + 1}`}
												fill
												className="object-cover transition-transform duration-300 group-hover:scale-105"
											/>
										)}
										<button
											type="button"
											onClick={(e) => {
												e.preventDefault();
												e.stopPropagation();
												removeFile(index);
											}}
											className="absolute z-10 p-1 transition-all duration-200 rounded-full shadow-lg opacity-0 top-1 end-1 bg-destructive text-destructive-foreground group-hover:opacity-100"
										>
											<X className="w-3 h-3" />
										</button>
									</div>
								);
							})}
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
