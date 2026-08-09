export default function FormInputContainer({
	width,
	children,
	index,
}: {
	width: number;
	children: React.ReactNode;
	index: number;
}) {
	return (
		<div
			key={index}
			className={`space-y-1 ${
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
			}`}
		>
			{children}
		</div>
	);
}
