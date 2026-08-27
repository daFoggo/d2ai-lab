import { useEffect, useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

export const StickyInPageNav = ({
	title,
	items,
	className,
}: IStickyInPageNavProps) => {
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

	const handleValueChange = (value: string) => {
		document.getElementById(value)?.scrollIntoView({
			behavior: "smooth",
			block: "start",
		});
	};

	return (
		<Tabs
			orientation="vertical"
			value={activeId}
			onValueChange={handleValueChange}
			className={cn("flex flex-col gap-1", className)}
		>
			{title && (
				<span className="px-3 py-1.5 font-mono text-xs font-semibold tracking-wider text-muted-foreground uppercase">
					{title}
				</span>
			)}
			<TabsList variant="line" className="flex-col items-stretch gap-0.5 p-0">
				{items.map((item) => (
					<TabsTrigger
						key={item.id}
						value={item.id}
						className="justify-start rounded-none px-3 py-1.5 text-sm"
					>
						{item.label}
					</TabsTrigger>
				))}
			</TabsList>
		</Tabs>
	);
};
