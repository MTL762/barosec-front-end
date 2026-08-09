"use client";

import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import {
	MdCode,
	MdFormatAlignCenter,
	MdFormatAlignLeft,
	MdFormatAlignRight,
	MdFormatBold,
	MdFormatItalic,
	MdFormatListBulleted,
	MdFormatListNumbered,
	MdFormatQuote,
	MdFormatStrikethrough,
	MdFormatUnderlined,
	MdLink,
	MdRedo,
	MdUndo,
} from "react-icons/md";

export interface TextEditorProps {
	alt?: string;
	name?: string;
	value?: string;
	className?: string;
	onChange?: (value: string) => void;
	placeholder?: string;
	disabled?: boolean;
}

interface ToolbarButtonProps {
	onClick: () => void;
	isActive?: boolean;
	disabled?: boolean;
	children: React.ReactNode;
	title?: string;
}

function ToolbarButton({
	onClick,
	isActive,
	disabled,
	children,
	title,
}: ToolbarButtonProps) {
	const { theme } = useTheme();
	return (
		<button
			type="button"
			onClick={onClick}
			disabled={disabled}
			title={title}
			className={`p-1.5 rounded transition-colors ${
				isActive
					? theme === "dark"
						? "bg-gray-600 text-white"
						: "bg-gray-300 text-gray-900"
					: theme === "dark"
						? "text-gray-300 hover:bg-gray-700"
						: "text-gray-700 hover:bg-gray-200"
			} ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
		>
			{children}
		</button>
	);
}

function ToolbarDivider() {
	return <div className="w-px h-6 mx-1 bg-gray-300 dark:bg-gray-600" />;
}

export default function TextEditor({
	value = "",
	onChange,
	className = "",
	placeholder = "Enter text...",
	disabled = false,
	name,
}: TextEditorProps) {
	const { theme } = useTheme();
	const [mounted, setMounted] = useState(false);

	const editor = useEditor({
		immediatelyRender: false,
		extensions: [
			StarterKit,
			Underline,
			TextAlign.configure({
				types: ["heading", "paragraph"],
			}),
			Link.configure({
				openOnClick: false,
			}),
			Placeholder.configure({
				placeholder,
			}),
		],
		content: value,
		editable: !disabled,
		onUpdate: ({ editor }) => {
			onChange?.(editor.getHTML());
		},
	});

	useEffect(() => {
		setMounted(true);
	}, []);

	useEffect(() => {
		if (editor && value !== editor.getHTML()) {
			editor.commands.setContent(value);
		}
	}, [value, editor]);

	useEffect(() => {
		if (editor) {
			editor.setEditable(!disabled);
		}
	}, [disabled, editor]);

	if (!mounted) {
		return (
			<div
				className={`min-h-[200px] border rounded-md animate-pulse bg-gray-100 dark:bg-gray-800 ${className}`}
			/>
		);
	}

	const addLink = () => {
		const url = window.prompt("Enter URL:");
		if (url) {
			editor?.chain().focus().setLink({ href: url }).run();
		}
	};

	return (
		<div id={name} className={`text-editor-container ${className}`}>
			<style jsx global>{`
            .tiptap-editor {
               border: 1px solid ${theme === "dark" ? "#374151" : "#d1d5db"};
               background: ${theme === "dark" ? "#1f2937" : "#ffffff"};
               border-radius: 0.375rem;
               overflow: hidden;
            }
            .tiptap-toolbar {
               background: ${theme === "dark" ? "#111827" : "#f9fafb"};
               border-bottom: 1px solid ${theme === "dark" ? "#374151" : "#e5e7eb"};
               padding: 0.5rem;
               display: flex;
               flex-wrap: wrap;
               gap: 0.25rem;
               align-items: center;
            }
            .ProseMirror {
               min-height: 150px;
               padding: 0.75rem;
               outline: none;
               color: ${theme === "dark" ? "#e5e7eb" : "#374151"};
               font-size: 14px;
               line-height: 1.6;
            }
            .ProseMirror p.is-editor-empty:first-child::before {
               color: ${theme === "dark" ? "#6b7280" : "#9ca3af"};
               content: attr(data-placeholder);
               float: left;
               height: 0;
               pointer-events: none;
            }
            .ProseMirror h1 { font-size: 2em; font-weight: bold; margin: 0.5em 0; }
            .ProseMirror h2 { font-size: 1.5em; font-weight: bold; margin: 0.5em 0; }
            .ProseMirror h3 { font-size: 1.25em; font-weight: bold; margin: 0.5em 0; }
            .ProseMirror ul { list-style: disc; padding-left: 1.5em; }
            .ProseMirror ol { list-style: decimal; padding-left: 1.5em; }
            .ProseMirror blockquote {
               border-left: 3px solid ${theme === "dark" ? "#4b5563" : "#d1d5db"};
               padding-left: 1em;
               margin-left: 0;
               color: ${theme === "dark" ? "#9ca3af" : "#6b7280"};
            }
            .ProseMirror code {
               background: ${theme === "dark" ? "#374151" : "#f3f4f6"};
               padding: 0.2em 0.4em;
               border-radius: 0.25em;
               font-family: monospace;
            }
            .ProseMirror pre {
               background: ${theme === "dark" ? "#374151" : "#f3f4f6"};
               padding: 0.75em;
               border-radius: 0.375em;
               overflow-x: auto;
            }
            .ProseMirror a {
               color: ${theme === "dark" ? "#60a5fa" : "#2563eb"};
               text-decoration: underline;
            }
         `}</style>

			<div className="tiptap-editor">
				<div className="tiptap-toolbar">
					<ToolbarButton
						onClick={() => editor?.chain().focus().toggleBold().run()}
						isActive={editor?.isActive("bold")}
						disabled={disabled}
						title="Bold"
					>
						<MdFormatBold className="w-5 h-5" />
					</ToolbarButton>
					<ToolbarButton
						onClick={() => editor?.chain().focus().toggleItalic().run()}
						isActive={editor?.isActive("italic")}
						disabled={disabled}
						title="Italic"
					>
						<MdFormatItalic className="w-5 h-5" />
					</ToolbarButton>
					<ToolbarButton
						onClick={() => editor?.chain().focus().toggleUnderline().run()}
						isActive={editor?.isActive("underline")}
						disabled={disabled}
						title="Underline"
					>
						<MdFormatUnderlined className="w-5 h-5" />
					</ToolbarButton>
					<ToolbarButton
						onClick={() => editor?.chain().focus().toggleStrike().run()}
						isActive={editor?.isActive("strike")}
						disabled={disabled}
						title="Strikethrough"
					>
						<MdFormatStrikethrough className="w-5 h-5" />
					</ToolbarButton>

					<ToolbarDivider />

					<ToolbarButton
						onClick={() => editor?.chain().focus().toggleBulletList().run()}
						isActive={editor?.isActive("bulletList")}
						disabled={disabled}
						title="Bullet List"
					>
						<MdFormatListBulleted className="w-5 h-5" />
					</ToolbarButton>
					<ToolbarButton
						onClick={() => editor?.chain().focus().toggleOrderedList().run()}
						isActive={editor?.isActive("orderedList")}
						disabled={disabled}
						title="Numbered List"
					>
						<MdFormatListNumbered className="w-5 h-5" />
					</ToolbarButton>

					<ToolbarDivider />

					<ToolbarButton
						onClick={() => editor?.chain().focus().setTextAlign("left").run()}
						isActive={editor?.isActive({ textAlign: "left" })}
						disabled={disabled}
						title="Align Left"
					>
						<MdFormatAlignLeft className="w-5 h-5" />
					</ToolbarButton>
					<ToolbarButton
						onClick={() => editor?.chain().focus().setTextAlign("center").run()}
						isActive={editor?.isActive({ textAlign: "center" })}
						disabled={disabled}
						title="Align Center"
					>
						<MdFormatAlignCenter className="w-5 h-5" />
					</ToolbarButton>
					<ToolbarButton
						onClick={() => editor?.chain().focus().setTextAlign("right").run()}
						isActive={editor?.isActive({ textAlign: "right" })}
						disabled={disabled}
						title="Align Right"
					>
						<MdFormatAlignRight className="w-5 h-5" />
					</ToolbarButton>

					<ToolbarDivider />

					<ToolbarButton
						onClick={() => editor?.chain().focus().toggleBlockquote().run()}
						isActive={editor?.isActive("blockquote")}
						disabled={disabled}
						title="Quote"
					>
						<MdFormatQuote className="w-5 h-5" />
					</ToolbarButton>
					<ToolbarButton
						onClick={() => editor?.chain().focus().toggleCodeBlock().run()}
						isActive={editor?.isActive("codeBlock")}
						disabled={disabled}
						title="Code Block"
					>
						<MdCode className="w-5 h-5" />
					</ToolbarButton>
					<ToolbarButton
						onClick={addLink}
						isActive={editor?.isActive("link")}
						disabled={disabled}
						title="Add Link"
					>
						<MdLink className="w-5 h-5" />
					</ToolbarButton>

					<ToolbarDivider />

					<ToolbarButton
						onClick={() => editor?.chain().focus().undo().run()}
						disabled={disabled || !editor?.can().undo()}
						title="Undo"
					>
						<MdUndo className="w-5 h-5" />
					</ToolbarButton>
					<ToolbarButton
						onClick={() => editor?.chain().focus().redo().run()}
						disabled={disabled || !editor?.can().redo()}
						title="Redo"
					>
						<MdRedo className="w-5 h-5" />
					</ToolbarButton>
				</div>

				<EditorContent
					editor={editor}
					className={disabled ? "opacity-60 cursor-not-allowed" : ""}
				/>
			</div>
		</div>
	);
}
