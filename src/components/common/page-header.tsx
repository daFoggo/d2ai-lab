import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface IPageHeaderProps {
	eyebrow?: string;
	title: string;
	description?: string;
	children?: ReactNode;
	className?: string;
	/* compact: dành cho vùng làm việc (dashboard) — title nhỏ, không eyebrow/desc. */
	size?: "default" | "compact";
}

export const PageHeader = ({
	eyebrow,
	title,
	description,
	children,
	className,
	size = "default",
}: IPageHeaderProps) => {
	return (
		<header className={cn("flex flex-col gap-3", className)}>
			{size === "default" && eyebrow && (
				<span className="font-mono text-xs font-medium tracking-wider text-muted-foreground uppercase">
					{eyebrow}
				</span>
			)}
			<h1
				className={cn(
					"font-title font-semibold tracking-tight text-primary text-balance",
					size === "compact" ? "text-2xl" : "text-3xl sm:text-4xl md:text-5xl",
				)}
			>
				{title}
			</h1>
			{size === "default" && description && (
				<p className="max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
					{description}
				</p>
			)}
			{children}
		</header>
	);
};
