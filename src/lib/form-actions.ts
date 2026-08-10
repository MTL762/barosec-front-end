/* eslint-disable @typescript-eslint/no-explicit-any */

import { endLoading, startLoading } from "global-loading-state";
import type { FieldValues, UseFormReset } from "react-hook-form";
import { toast } from "sonner";
import type { routesKey, Tags } from "./endpoints";
import { fetchHelper } from "./fetch";
import {
	redirectServer,
	revalidateTagServer,
} from "./revalidatePathServer";

export async function FormAction({
	data,
	formData,
	endpoint,
	redirectLink,
	reset,
	revalidateTag,
	noId = false,
	t,
	method,
	showToast = true,
}: {
	noId?: boolean;
	revalidateTag?: Tags;
	t: TFunction;
	reset?: any;
	data?: any;
	method?: "POST" | "PATCH" | "PUT";
	redirectLink?: routesKey | boolean | string;
	// redirectLink?: allRoutes;
	endpoint: string;
	formData: any;
	customReset?: (res?: any) => void;
	showToast?: boolean;
}) {
	startLoading();
	let res: any = {
		message: "",
		success: false,
		type: "",
		redirectUrl: "",
		errors: {},
	};

	const targetEndpoint = `${endpoint}${noId ? "" : data?.id ? `/${data?.id}` : ""}`;
	let fetchRes;

	if (method === "PATCH") {
		fetchRes = await fetchHelper({
			endPoint: targetEndpoint,
			method: "PATCH",
			body: formData,
		});
	} else if (method === "PUT" || data?.id) {
		fetchRes = await fetchHelper({
			endPoint: targetEndpoint,
			method: "PUT",
			body: formData,
		});
	} else {
		fetchRes = await fetchHelper({
			endPoint: endpoint,
			method: "POST",
			body: formData,
		});
	}

	res = {
		message: fetchRes.error || fetchRes.result?.message || (fetchRes.success ? "Success" : "Failed"),
		success: fetchRes.success,
		type: fetchRes.result?.type || "",
		redirectUrl: fetchRes.result?.redirectUrl || "",
		errors: fetchRes.result?.errors || {},
		errorCode: fetchRes.result?.errorCode,
		toaster: fetchRes.result?.toaster,
		data: fetchRes.data,
		...(fetchRes.result || {}),
	};
	endLoading();
	if (showToast) {
		MessageToast({
			res: res,
			reset: reset,
			t,
		});
	}
	// Set the redirect URL in the response if the operation was successful
	if (res?.success && revalidateTag) {
		await revalidateTagServer(revalidateTag);
	}
	if (res?.success && redirectLink != false) {
		await redirectServer(redirectLink as string);
		// await redirectServer(routes[redirectLink]);
	}
	return res;
}

export function MessageToast<T>({
	res,
}: {
	t?: TFunction;
	res: {
		type: string;
		message: string;
		success: boolean;
		errorCode?: string;
		toaster?:
			| string
			| {
					message: string;
			  };
	};

	reset?: UseFormReset<FieldValues>;
	customReset?: () => void;
}) {
	if (res.errorCode) {
		toast.error(res?.errorCode, {});
	}
	if (res?.success) {
		// reset && reset();
		// customReset && customReset();
		toast.success(
			res.message ?? "Success",
			// description: t(`${res.message}`),
		);
	} else {
		let message = "";
		if (typeof res?.toaster === "string") {
			message = res?.toaster;
		} else if (typeof res?.toaster === "object") {
			message = res?.toaster.message;
		} else if (res?.message) {
			message = res?.message;
		}
		toast.error(message);
	}
}
