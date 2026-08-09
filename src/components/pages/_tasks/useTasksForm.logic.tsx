"use client";

import { endpoints } from "@/utils/endpoints";
import { extractFormDefaultInputs } from "@/utils/extractFormDefaultInputs";
import { extractFormNameInputsV2 } from "@/utils/extractFormNameInputs-v2";
import { FormAction } from "@/utils/form-actions";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { TasksInputs } from "./tasks.inputs";
import { TasksSchema, type TasksType } from "./tasks.schema";
export default function useTasksLogic({ data }: { data?: TasksType }) {
	const t = useTranslations();
	const inputs = TasksInputs();
	const { control, handleSubmit, reset } = useForm<TasksType>({
		mode: "onSubmit",
		resolver: zodResolver(TasksSchema(t)),
		defaultValues: extractFormDefaultInputs(inputs, data) as TasksType,
	});

	const onSubmit = async (formData: TasksType) => {
		await FormAction({
			data: undefined,
			formData: await extractFormNameInputsV2(inputs, formData),
			endpoint: data?.id ? `${endpoints.tasks}/${data.id}` : endpoints.tasks,
			reset: reset,
			method: "POST",
			noId: true,
			redirectLink: "tasks",
			t,
		});
	};

	const formSubmit = handleSubmit(onSubmit);

	return {
		control,
		inputs,
		formSubmit,
		t,
	};
}
