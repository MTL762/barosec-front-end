import { z } from "zod";

type TFunction = (key: string) => string;

export function selectNotReq() {
	return z.union([
		z.string().nullable().optional(),
		z.number().nullable().optional(),
		z.undefined(),
	]);
}

export function SelectReq(t: TFunction) {
	return z.union([
		z.string().min(1, { message: t("Validations.required") }),
		z.number().min(0, { message: t("Validations.required") }),
	]);
}

export function MultiSelectReqWithMax(
	t: TFunction,
	max?: number,
) {
	return z
		.array(SelectReq(t))
		.max(max ?? 500000, `${t(`Validations.max`)} ${max}`);
}

export function BooleanReq(_t?: TFunction) {
	return z.union([
		z.string().startsWith("false"),
		z.string().startsWith("true"),
		z.boolean(),
	]);
}
