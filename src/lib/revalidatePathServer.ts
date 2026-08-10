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

export const redirectServer = async (link?: string) => {
	// const referer = (await headers()).get("referer");
	// const currentPath = referer ? new URL(referer).pathname : "/";

	// // Extract the locale from the referer URL
	// const locale = await getLocale();
	// // routing.locales.find(loc => currentPath.startsWith(`/${loc}`)) || routing.defaultLocale;
	// if (link?.includes("/")) {
	// 	// Ensure the link has the locale prefix
	// 	const newPath = link.startsWith(`/${locale}`) ? link : `/${locale}${link}`;
	// 	redirect(newPath);
	// } else if (link && routes[link] != undefined) {
	// 	// Redirect using predefined routes, ensuring the locale is included
	// 	const newPath = routes[link].startsWith(`/${locale}`)
	// 		? routes[link]
	// 		: `/${locale}${routes[link]}`;
	// 	redirect(newPath);
	// } else {
	// 	// Ensure the cleaned path includes the locale
	// 	const cleanedPath = cleanPath(currentPath);
	// 	const newPath = cleanedPath.startsWith(`/${locale}`)
	// 		? cleanedPath
	// 		: `/${locale}${cleanedPath}`;
	// 	redirect(newPath);
	// }
};
function cleanPath(path: string): string {
	// Match "/create" or "/{id}/edit" at the end of the path
	const cleanedPath = path.replace(/\/(?:\d+\/edit|create)$/, "");
	return cleanedPath;
}

export const getCurrentURL = async () => {
	const currentHeaders = await headers();
	const pathname = currentHeaders.get("header-URL") || "";
	return pathname;
};
