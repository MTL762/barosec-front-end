"use client";

import dynamic from "next/dynamic";

import type { TextEditorProps } from "./text-editor.client";

const TextEditor = dynamic<TextEditorProps>(
	() => import("./text-editor.client"),
	{
		ssr: false,
		loading: () => (
			<div className="min-h-[200px] border rounded-md animate-pulse bg-gray-100 dark:bg-gray-800" />
		),
	},
);

export default TextEditor;
