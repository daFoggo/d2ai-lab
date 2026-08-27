import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface IPageHeaderProps {
	eyebrow?: string;
	title: string;
	description?: string;
	children?: ReactNode;
	className?: string;
}

export const PageHeader = ({
	eyebrow,
	title,
	description,
	children,
	className,
}: IPageHeaderProps) => {
	return (
		<header
			data-slot="page-header"
			className={cn("flex flex-col gap-3", className)}
		>
			{eyebrow && (
				<span className="font-mono text-xs font-medium tracking-wider text-muted-foreground uppercase">
					{eyebrow}
				</span>
			)}
			<h1 className="font-title text-3xl font-semibold tracking-tight text-primary text-balance sm:text-4xl md:text-5xl">
				{title}
			</h1>
			{description && (
				<p className="max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
					{description}
				</p>
			)}
			{children}
		</header>
	);
};
