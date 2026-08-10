import { z } from "zod";

type TFunction = (key: string) => string;

export function StringReq(t: TFunction, min = 2, max = 7000) {
	return z
		.string()
		.min(min, { message: `${t(`Validations.min`)} ${min}` })
		.refine((val) => val.length >= min, {
			message: `${t(`Validations.min`)} ${min}`,
		})
		.refine((val) => val !== "", { message: t(`Validations.required`) })
		.refine((val) => val.length <= max, {
			message: `${t(`Validations.max`)} ${max}`,
		});
}

export function PhoneReq(t: TFunction) {
	return z
		.string()
		.startsWith("+", { message: t(`Validations.startsWithPlus`) })
		.refine((val) => val !== "", { message: t(`Validations.required`) });
}

export function PasswordSchema(t: TFunction) {
	return z
		.string()
		.min(8, { message: t(`Validations.min8`) })
		.refine((val) => val.length >= 8, { message: t(`Validations.min8`) })
		.refine((val) => val !== "", { message: t(`Validations.required`) });
}

export function StringNotReq() {
	return z.union([
		z.string().nullable().optional(),
		z.number().nullable().optional(),
		z.array(z.string().optional()),
	]);
}

export function EmailReq(t: TFunction) {
	return z
		.string()
		.email({
			message: t(`Validations.invalidEmail`),
		})
		.refine((val) => val.length >= 3, { message: t(`Validations.min3`) })
		.refine((val) => val !== "", { message: t(`Validations.required`) });
}

export function noSchema() {
	return z.any();
}

export function LinkSchema(t: TFunction) {
	return z
		.string()
		.url({ message: t(`Validations.invalidUrl`) })
		.refine((val) => val.length >= 3, { message: t(`Validations.min3`) })
		.refine((val) => val !== "", { message: t(`Validations.required`) });
}
