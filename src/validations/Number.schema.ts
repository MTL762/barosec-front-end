import { z } from "zod";

export function PriceSchema(t: (key: string) => string, min = 0) {
	return z
		.union([
			z.number({
				required_error: t(`Validations.required`),
				invalid_type_error: t(`Validations.invalidType`),
			}),
			z
				.string()
				.refine((value) => !isNaN(Number.parseFloat(value)), {
					message: `${t(
						"Validations.shouldField_have_a_positive_number",
					)} ${min}`,
					params: { received: "string" },
				})
				.transform(Number.parseFloat),
		])
		.refine((value) => value >= min, {
			// message: `يجب أن يكون الرقم أكبر من أو يساوي ${min}`,
			message: `${t("Validations.should_number_grater_or_equal")} ${min}`,
			params: { received: "negative" },
		});
}

export function NumberSchema(t: TFunction) {
	return z.union([
		z.number({
			required_error: t(`Validations.required`),
			invalid_type_error: t(`Validations.invalidType`),
		}),
		z
			.string()
			.refine((value) => !isNaN(Number.parseFloat(value)), {
				message: t(`Validations.invalidType`),
				params: { received: "string" },
			})
			.transform(Number.parseFloat),
	]);
}

export function IntegerSchema(t: (key: string) => string, min = 0) {
	return z
		.union([
			z.number({
				required_error: t(`Validations.required`),
				invalid_type_error: t(`Validations.invalidType`),
			}),
			z
				.string()
				.refine((value) => !isNaN(Number.parseInt(value, 10)) && /^\d+$/.test(value.trim()), {
					message: t(`Validations.invalidType`),
					params: { received: "string" },
				})
				.transform((value) => Number.parseInt(value, 10)),
		])
		.refine((value) => Number.isInteger(value), {
			message: t(`Validations.invalidType`),
		})
		.refine((value) => value >= min, {
			message: `${t("Validations.should_number_grater_or_equal")} ${min}`,
			params: { received: "negative" },
		});
}

