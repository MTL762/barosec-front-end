"use server";
import { revalidatePath, revalidateTag } from "next/cache";
import { headers } from "next/headers";
import { Tags } from "./endpoints";

export const revalidatePathServer = async (path: string) => {
	"use server";
	revalidatePath(path);
};

export const revalidateTagServer = async (tag: Tags | string) => {
	"use server";
	revalidateTag(tag, "fast");
};

export const redirectServer = async (_link?: string) => {
	// Redirect server action stub
};

export const getCurrentURL = async () => {
	const currentHeaders = await headers();
	const pathname = currentHeaders.get("header-URL") || "";
	return pathname;
};
