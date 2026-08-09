import { z } from "zod";
export function dateSchema(t: TFunction) {
	return z.union([
		z
			.string({
				required_error: t(`Validations.required`),
				invalid_type_error: t(`Validations.invalidType`),
			})
			.refine((val) => !isNaN(Date.parse(val)), {
				message: t(`Validations.invalidDate`),
			}),
		z.date({
			required_error: t(`Validations.required`),
			invalid_type_error: t(`Validations.invalidType`),
		}),
	]);
}
