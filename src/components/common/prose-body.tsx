import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface IProseSection {
	heading?: string;
	eyebrow?: string;
	content: ReactNode;
}

export interface IProseBodyProps {
	sections?: IProseSection[];
	children?: ReactNode;
	className?: string;
}

export const ProseBody = ({
	sections,
	children,
	className,
}: IProseBodyProps) => {
	return (
		<div className={cn("flex flex-col gap-8", className)}>
			{sections?.map((section) => (
				<section
					key={section.heading ?? section.eyebrow ?? "section"}
					className="flex flex-col gap-3"
				>
					{section.eyebrow && (
						<span className="font-mono text-xs font-semibold tracking-wider text-muted-foreground uppercase">
							{section.eyebrow}
						</span>
					)}
					{section.heading && (
						<h2 className="font-title text-xl font-normal tracking-tight text-foreground sm:text-2xl">
							{section.heading}
						</h2>
					)}
					<div className="flex flex-col gap-3">{section.content}</div>
				</section>
			))}
			{children}
		</div>
	);
};

export const ProseParagraph = ({
	children,
	className,
}: {
	children: ReactNode;
	className?: string;
}) => {
	return (
		<p
			className={cn(
				"max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base",
				className,
			)}
		>
			{children}
		</p>
	);
};
