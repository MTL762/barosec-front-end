import type React from "react";

export default function FormCardTitle({
	title,
	action,
}: {
	title?: string | React.ReactNode;
	action?: React.ReactNode;
}) {
	return (
		<div className="col-span-6 -mx-5 -mt-5 mb-1 border-b border-slate-200 bg-slate-50 px-5 py-4 text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 md:-mx-6 md:-mt-6 md:px-6">
			<div className="flex flex-wrap items-center justify-between gap-3">
				{title ? (
					<h3 className="text-base font-semibold tracking-tight text-slate-800 dark:text-slate-100">
						{title}
					</h3>
				) : (
					<div />
				)}
				{action}
			</div>
		</div>
	);
}
