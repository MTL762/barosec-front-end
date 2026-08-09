"use client";

import CustomForm from "@/components/common/Form/custom-form";
import type { TasksType } from "./tasks.schema";
import useTasksLogic from "./useTasksForm.logic";

export default function TasksFormPage({ data }: { data?: TasksType }) {
	const { inputs, t, control, formSubmit } = useTasksLogic({ data });

	return (
		<CustomForm
			handleSubmit={formSubmit}
			control={control}
			cardConfig={[
				{
					id: "lang",
					title: t("Tasks Information"),
					multiLang: true,
					width: 6,
				},
			]}
			inputs={inputs}
		/>
	);
}
