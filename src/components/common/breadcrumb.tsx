import { IconChevronRight } from "@tabler/icons-react";
import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

export interface IBreadcrumbItem {
	label: string;
	to?: string;
	params?: Record<string, unknown>;
}

export interface IBreadcrumbProps {
	items: IBreadcrumbItem[];
	className?: string;
}

function BreadcrumbItem({
	item,
	isLast,
}: {
	item: IBreadcrumbItem;
	isLast: boolean;
}) {
	const content = isLast ? (
		<span className="text-foreground" aria-current="page">
			{item.label}
		</span>
	) : (
		<Link
			to={item.to}
			params={item.params as never}
			className="transition-colors hover:text-foreground focus:outline-hidden"
		>
			{item.label}
		</Link>
	);

	return (
		<li className="flex items-center gap-1.5">
			{content}
			{!isLast && (
				<IconChevronRight className="size-3.5 text-muted-foreground/60" />
			)}
		</li>
	);
}

export function Breadcrumb({ items, className }: IBreadcrumbProps) {
	return (
		<nav
			data-slot="breadcrumb"
			aria-label="Breadcrumb"
			className={cn("flex", className)}
		>
			<ol className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground sm:text-sm">
				{items.map((item, index) => (
					<BreadcrumbItem
						key={item.label}
						item={item}
						isLast={index === items.length - 1}
					/>
				))}
			</ol>
		</nav>
	);
}
