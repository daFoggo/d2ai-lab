import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface ISectionDividerProps {
	children: ReactNode;
	subtitle?: string;
	className?: string;
}

/**
 * Đề mục lớn màu indigo đậm (font-title + text-primary) kiểu Notion —
 * dùng để tạo nhịp giữa các section và phá độ trắng.
 */
export function SectionDivider({
	children,
	subtitle,
	className,
}: ISectionDividerProps) {
	return (
		<div
			data-slot="section-divider"
			className={cn("flex flex-col items-center gap-3 text-center", className)}
		>
			<h2 className="font-title text-3xl font-normal tracking-tight text-primary text-balance sm:text-4xl md:text-5xl">
				{children}
			</h2>
			{subtitle && (
				<p className="max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
					{subtitle}
				</p>
			)}
		</div>
	);
}
