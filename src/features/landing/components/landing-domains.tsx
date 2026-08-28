import type { Icon } from "@tabler/icons-react";
import { IconArrowUpRight } from "@tabler/icons-react";
import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { DEFAULT_LOCALE, useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export interface ILandingDomainItem {
	id: string;
	tag: string;
	title: string;
	icon?: Icon;
}

export interface ILandingDomainsProps {
	title?: string;
	description?: string;
	domains: ILandingDomainItem[];
	cta?: ReactNode;
	className?: string;
}

const DomainIconMark = ({
	icon: DomainIcon,
	className,
}: {
	icon?: Icon;
	className?: string;
}) => {
	if (!DomainIcon) return null;

	return (
		<div
			className={cn(
				"flex shrink-0 items-center justify-center border border-border transition-colors duration-300 group-hover:border-primary-foreground/30",
				className,
			)}
		>
			<DomainIcon
				className="size-1/2 text-foreground/80 transition-colors duration-300 group-hover:text-primary-foreground"
				strokeWidth={1.5}
			/>
		</div>
	);
};

const DomainCell = ({
	domain,
	index,
	size,
}: {
	domain: ILandingDomainItem;
	index: number;
	size: "lg" | "sm";
}) => {
	const { locale } = useI18n();
	const indexLabel = String(index + 1).padStart(2, "0");
	const isLarge = size === "lg";

	return (
		<Link
			to="/{-$locale}/research/areas"
			params={{ locale: locale === DEFAULT_LOCALE ? undefined : locale }}
			className={cn(
				"group relative flex h-full flex-col justify-between gap-3 overflow-hidden border border-border bg-card p-4 transition-colors duration-300 hover:border-primary hover:bg-primary focus:outline-hidden focus-visible:ring-3 focus-visible:ring-ring/50",
				isLarge && "sm:p-5",
			)}
		>
			<div className="flex items-start justify-between">
				<DomainIconMark
					icon={domain.icon}
					className={isLarge ? "size-9" : "size-7"}
				/>
				<span
					aria-hidden="true"
					className={cn(
						"font-mono leading-none font-semibold text-foreground/10 select-none transition-colors duration-300 group-hover:text-primary-foreground/15",
						isLarge ? "text-4xl sm:text-5xl" : "text-2xl sm:text-3xl",
					)}
				>
					{indexLabel}
				</span>
			</div>
			<div className={isLarge ? "mt-4" : "mt-3"}>
				<span className="font-mono text-xs font-medium tracking-wider text-muted-foreground uppercase transition-colors duration-300 group-hover:text-primary-foreground/70">
					{domain.tag}
				</span>
				<h3
					className={cn(
						"mt-1 font-title font-normal tracking-tight text-foreground transition-colors duration-300 group-hover:text-primary-foreground",
						isLarge ? "text-lg sm:text-xl" : "text-sm",
					)}
				>
					{domain.title}
				</h3>
			</div>
			<IconArrowUpRight
				aria-hidden="true"
				className="absolute right-3 bottom-3 size-4 -translate-x-1 translate-y-1 text-primary-foreground opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100 sm:right-4 sm:bottom-4"
			/>
		</Link>
	);
};

export const LandingDomains = ({
	title,
	description,
	domains,
	cta,
	className,
}: ILandingDomainsProps) => {
	return (
		<section
			className={cn(
				"w-full overflow-hidden py-12 sm:py-16 lg:py-20",
				className,
			)}
		>
			<div className="w-full px-6 sm:px-10 md:px-14 lg:px-20 xl:px-24 2xl:px-32">
				{/* Header: title + description left, CTA right */}
				<div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
					<div className="flex max-w-2xl flex-col gap-2">
						<h2 className="font-title text-2xl font-normal tracking-tight text-foreground sm:text-3xl md:text-4xl">
							{title}
						</h2>
						{description && (
							<p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
								{description}
							</p>
						)}
					</div>
					{cta && <div className="shrink-0">{cta}</div>}
				</div>

				{/* Compact domain bento: a wide tile up front, a narrow pair, a wide row to close — same card everywhere, only the footprint changes */}
				<div className="mt-6 grid grid-cols-1 gap-2.5 sm:mt-8 sm:grid-cols-2 sm:gap-2.5 lg:grid-cols-4">
					{domains.map((domain, index) => {
						const isWide = index === 0 || index >= domains.length - 2;

						return (
							<div
								key={domain.id}
								className={cn(isWide && "sm:col-span-2 lg:col-span-2")}
							>
								<DomainCell
									domain={domain}
									index={index}
									size={isWide ? "lg" : "sm"}
								/>
							</div>
						);
					})}
				</div>
			</div>
		</section>
	);
};
