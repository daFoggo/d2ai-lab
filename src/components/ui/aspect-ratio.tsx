import type * as React from "react";
import { cn } from "@/lib/utils";

interface AspectRatioProps extends React.HTMLAttributes<HTMLDivElement> {
	ratio?: number;
}

function AspectRatio({
	ratio = 16 / 9,
	className,
	children,
	style,
	...props
}: AspectRatioProps) {
	return (
		<div
			data-slot="aspect-ratio"
			style={{
				aspectRatio: ratio,
				...style,
			}}
			className={cn("relative w-full overflow-hidden", className)}
			{...props}
		>
			{children}
		</div>
	);
}

export { AspectRatio, type AspectRatioProps };
