import { useTranslations } from "next-intl";
import { z } from "zod";

export function ImageFileSchema() {
	const t = useTranslations();

	return z
		.any()
		.refine((file) => file instanceof File, {
			message: t("Validations.required"), // File should exist
		})
		.refine(
			(file) => ["image/jpeg", "image/png", "image/gif", "image/jpg"
				
			].includes(file?.type),
			{
				message: "Invalid file type", // Validate the file type (JPEG, PNG, GIF)
			},
		)
		.refine((file) => file?.size <= 5 * 1024 * 1024, {
			message: "File is too large", // Validate the file size (max 5MB)
		});
}
