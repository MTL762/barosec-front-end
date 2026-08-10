import { z } from "zod";

type TFunction = (key: string) => string;

export function PriceSchema(t: TFunction, min = 0) {
	return z
		.union([
			z.number(),
			z
				.string()
				.refine((value) => !isNaN(Number.parseFloat(value)), {
					message: `${t("Validations.shouldField_have_a_positive_number")} ${min}`,
				})
				.transform(Number.parseFloat),
		])
		.refine((value) => value >= min, {
			message: `${t("Validations.should_number_grater_or_equal")} ${min}`,
		});
}

export function NumberSchema(t: TFunction) {
	return z.union([
		z.number(),
		z
			.string()
			.refine((value) => !isNaN(Number.parseFloat(value)), {
				message: t(`Validations.invalidType`),
			})
			.transform(Number.parseFloat),
	]);
}

export function IntegerSchema(t: TFunction, min = 0) {
	return z
		.union([
			z.number(),
			z
				.string()
				.refine((value) => !isNaN(Number.parseInt(value, 10)) && /^\d+$/.test(value.trim()), {
					message: t(`Validations.invalidType`),
				})
				.transform((value) => Number.parseInt(value, 10)),
		])
		.refine((value) => Number.isInteger(value), {
			message: t(`Validations.invalidType`),
		})
		.refine((value) => value >= min, {
			message: `${t("Validations.should_number_grater_or_equal")} ${min}`,
		});
}
