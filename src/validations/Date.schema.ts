import { z } from "zod";

type TFunction = (key: string) => string;

export function dateSchema(t: TFunction) {
	return z.union([
		z
			.string()
			.refine((val) => !isNaN(Date.parse(val)), {
				message: t(`Validations.invalidDate`),
			}),
		z.date(),
	]);
}
