export default function FormCardContainer({
	width,
	children,
	index,
	animationIndex,
}: {
	width: number;
	children: React.ReactNode;
	index: number | string;
	animationIndex?: number;
}) {
	const delay = typeof animationIndex === "number" ? animationIndex * 80 : 0;

	return (
		<div
			key={index}
			className={`group overflow-hidden rounded-3xl border bg-white dark:border-slate-700 dark:bg-slate-900 shadow-[0_10px_30px_rgba(15,23,42,0.05)] dark:shadow-[0_10px_30px_rgba(0,0,0,0.6)] transition-all duration-300 hover:shadow-[0_14px_36px_rgba(15,23,42,0.08)] dark:hover:shadow-[0_14px_36px_rgba(0,0,0,0.64)] focus-within:border-slate-300 dark:focus-within:border-slate-500 ${
				width === 1
					? "lg:col-span-1 md:col-span-2 col-span-6"
					: width === 2
						? "lg:col-span-2 md:col-span-3 col-span-6"
						: width === 3
							? "lg:col-span-3 md:col-span-3 col-span-6"
							: width === 4
								? "lg:col-span-4 md:col-span-4 col-span-6"
								: width === 5
									? "lg:col-span-5 md:col-span-6 col-span-6"
									: "lg:col-span-6 md:col-span-6 col-span-6"
			}
				animate-in slide-in-from-bottom-4 duration-700
         `}
			style={{ animationDelay: `${delay}ms` }}
		>
			<div className="grid grid-cols-6 gap-5 p-5 md:p-6">{children}</div>
		</div>
	);
}
