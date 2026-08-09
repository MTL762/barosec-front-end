"use client";

import { cn } from "@/lib/utils";
import { Cloud, X } from "lucide-react"; // Add FilePdf
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useCallback, useRef, useState } from "react";
import { BsFilePdf } from "react-icons/bs";

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
		const validFiles = newFiles.filter(() => {
			// const isValidType = ['image/jpeg', 'image/png'].includes(file.type)
			const isValidType = true;
			// const isValidSize = file.size <= 1024 * 1024 // 1MB
			const isValidSize = true;
			return isValidType && isValidSize;
		});
		onChange?.([...files, ...validFiles]);
		setFiles((prev) => {
			const newFileList = [...prev, ...validFiles];
			return newFileList.slice(0, 24); // Maximum 24 files
		});
	};

	const onFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files.length > 0) {
			const selectedFiles = Array.from(e.target.files);
			handleFiles(selectedFiles);
			// Reset input value so the same file can be selected again
			// e.target.value = ''
		}
	};

	const removeFile = (index: number) => {
		setFiles((prev) => {
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
							<div className="absolute inset-0 transition-opacity duration-300 rounded-full opacity-0 bg-primary/10 blur-xl group-hover:opacity-100" />
						</div>
						<div className="space-y-2 text-center">
							<p className="text-lg font-medium transition-colors duration-300 text-foreground group-hover:text-primary">
								{t("dragImagesHereOrClickToBrowse")}
							</p>
							<p className="text-sm text-muted-foreground">
								Support for images and PDF files
							</p>
							<p className="text-xs text-muted-foreground">
								Maximum {maxSelections || 24} files
							</p>
						</div>
					</div>
				) : (
					<div className="space-y-4">
						<div className="flex items-center justify-between">
							<h4 className="text-sm font-medium text-foreground">
								Uploaded Files ({files.length})
							</h4>
							<button
								type="button"
								onClick={openFileDialog}
								className="text-sm transition-colors duration-200 text-primary hover:text-primary/80 hover:underline"
							>
								Add more
							</button>
						</div>
						<div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
							{files.map((file, index) => {
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
											<div className="flex flex-col items-center justify-center w-full h-full bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20">
												<BsFilePdf className="w-8 h-8 text-red-500" />
												<span className="mt-1 text-xs text-red-600 dark:text-red-400">
													PDF
												</span>
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
											className="absolute z-10 p-1 transition-all duration-200 rounded-full shadow-lg opacity-0 top-1 end-1 bg-destructive text-destructive-foreground group-hover:opacity-100 hover:scale-110"
										>
											<X className="w-3 h-3" />
										</button>
										<div className="absolute bottom-0 left-0 right-0 p-2 transition-opacity duration-200 opacity-0 bg-black/50 backdrop-blur-sm group-hover:opacity-100">
											<p className="text-xs text-white truncate">
												{isFile ? file.name : file.url.split("/").pop()}
											</p>
										</div>
									</div>
								);
							})}
							{files.length < (maxSelections || 24) && (
								<button
									onClick={openFileDialog}
									type="button"
									className="flex flex-col items-center justify-center transition-all duration-200 border-2 border-dashed rounded-lg aspect-square border-border/50 hover:border-primary/50 hover:bg-primary/5 group"
								>
									<Cloud className="w-6 h-6 transition-colors duration-200 text-muted-foreground group-hover:text-primary" />
									<span className="mt-1 text-xs text-muted-foreground">
										Add more
									</span>
								</button>
							)}
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
