import { IconArrowUpRight } from "@tabler/icons-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface IRightRailLink {
	label: string;
	href: string;
}

export interface IStickyRightRailProps {
	title?: string;
	links?: IRightRailLink[];
	children?: ReactNode;
	className?: string;
}

export const StickyRightRail = ({
	title = "QUICK LINKS",
	links,
	children,
	className,
}: IStickyRightRailProps) => {
	return (
		<aside className={cn("flex flex-col gap-3", className)}>
			{title && (
				<span className="font-mono text-xs font-semibold tracking-wider text-muted-foreground uppercase">
					{title}
				</span>
			)}

			{links && links.length > 0 && (
				<ul className="flex flex-col">
					{links.map((link) => (
						<li key={link.href}>
							<a
								href={link.href}
								target="_blank"
								rel="noreferrer"
								className="group flex items-center gap-1.5 border-b border-border py-2.5 text-sm text-foreground transition-colors last:border-b-0 hover:text-foreground/80 focus:outline-hidden"
							>
								<span className="font-medium">{link.label}</span>
								<IconArrowUpRight className="size-3.5 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
							</a>
						</li>
					))}
				</ul>
			)}

			{children}
		</aside>
	);
};
