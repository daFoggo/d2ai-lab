import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export interface IInPageNavItem {
	id: string;
	label: string;
}

export interface IStickyInPageNavProps {
	title?: string;
	items: IInPageNavItem[];
	className?: string;
}

export function StickyInPageNav({
	title,
	items,
	className,
}: IStickyInPageNavProps) {
	const [activeId, setActiveId] = useState<string>(items[0]?.id ?? "");

	useEffect(() => {
		const elements = items
			.map((item) => document.getElementById(item.id))
			.filter((el): el is HTMLElement => Boolean(el));

		if (elements.length === 0) return;

		const observer = new IntersectionObserver(
			(entries) => {
				const visible = entries
					.filter((entry) => entry.isIntersecting)
					.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
				if (visible[0]) {
					setActiveId(visible[0].target.id);
				}
			},
			{ rootMargin: "-40% 0px -55% 0px", threshold: 0 },
		);

		elements.forEach((el) => {
			observer.observe(el);
		});
		return () => observer.disconnect();
	}, [items]);

	return (
		<nav
			data-slot="sticky-in-page-nav"
			aria-label={title ?? "On this page"}
			className={cn("flex flex-col gap-1", className)}
		>
			{title && (
				<span className="px-3 py-1.5 font-mono text-xs font-semibold tracking-wider text-muted-foreground uppercase">
					{title}
				</span>
			)}
			{items.map((item) => (
				<a
					key={item.id}
					href={`#${item.id}`}
					className={cn(
						"rounded-lg border-l-2 px-3 py-1.5 text-sm transition-colors",
						activeId === item.id
							? "border-primary bg-muted font-semibold text-foreground"
							: "border-transparent text-muted-foreground hover:bg-muted hover:text-foreground",
					)}
				>
					{item.label}
				</a>
			))}
		</nav>
	);
}
