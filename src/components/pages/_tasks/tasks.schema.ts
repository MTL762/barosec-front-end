import { z } from "zod";

import { MultiSelectReqWithMax } from "@/validations/Select.schema";
import { StringReq, noSchema } from "@/validations/String.schema";
export const TasksSchema = (t: TFunction) => {
	return z.object({
		user_ids: MultiSelectReqWithMax(t),
		name: StringReq(t),
		description: noSchema(),
		file: noSchema(),
	});
};

export type TasksType = z.infer<ReturnType<typeof TasksSchema>> & {
	id?: number;
};
