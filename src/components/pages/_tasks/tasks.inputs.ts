import type { FormInput } from "@/components/common/Form/CustomFormTypes.types";
import { endpoints } from "@/utils/endpoints";

export const TasksInputs = () => {
	const inputs: FormInput[] = [
		{
			name: "user_ids",
			type: "selectPaginated",
			apiUrl: endpoints.usersSelectMenu,
			isMulti: true,
		},
		{ name: "name", type: "text", required: true },
		{ name: "description", type: "textarea" },
		{ name: "file", type: "img" },
	];
	return inputs;
};
