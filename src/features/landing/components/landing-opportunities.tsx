import { IconArrowUpRight } from "@tabler/icons-react";
import { Link } from "@tanstack/react-router";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { DEFAULT_LOCALE, useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import type { TLandingOpportunityItem } from "../schemas";

export interface ILandingOpportunitiesProps {
	title: string;
	items: TLandingOpportunityItem[];
	className?: string;
}

const OpportunityCard = ({
	item,
	className,
}: {
	item: TLandingOpportunityItem;
	className?: string;
}) => {
	const { locale } = useI18n();

	return (
		<article
			data-slot="landing-opportunities-card"
			className={cn(
				"group flex flex-col overflow-hidden transition-all duration-300",
				className,
			)}
		>
			{/* Thumbnail with Standardized AspectRatio and No Border */}
			<div className="w-full overflow-hidden rounded-2xl shadow-xs sm:rounded-3xl">
				<AspectRatio ratio={2 / 1}>
					{item.thumbnail ? (
						<img
							src={item.thumbnail}
							alt={item.title}
							className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
						/>
					) : (
						<div className="flex h-full w-full items-center justify-center bg-muted/50 p-6">
							<span className="font-title text-lg font-normal text-muted-foreground sm:text-xl">
								{item.title}
							</span>
						</div>
					)}
				</AspectRatio>
			</div>

			{/* Content */}
			<h3 className="mt-3 font-title text-lg font-normal tracking-tight text-foreground transition-colors group-hover:text-foreground/80 sm:text-xl">
				{item.title}
			</h3>
			<p className="mt-1.5 text-xs leading-relaxed text-muted-foreground sm:text-sm">
				{item.description}
			</p>

			{/* Link with Clean Arrow */}
			{item.to && (
				<div className="mt-3 flex items-center gap-1.5 font-medium text-foreground">
					<Link
						to={item.to}
						params={{ locale: locale === DEFAULT_LOCALE ? undefined : locale }}
						className="text-xs transition-colors hover:text-foreground/80 focus:outline-hidden sm:text-sm"
					>
						{item.linkLabel}
					</Link>
					<IconArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
				</div>
			)}
		</article>
	);
};

export const LandingOpportunities = ({
	title,
	items,
	className,
}: ILandingOpportunitiesProps) => {
	return (
		<section
			data-slot="landing-opportunities"
			className={cn(
				"w-full overflow-hidden py-10 sm:py-14 lg:py-16",
				className,
			)}
		>
			<div className="w-full px-6 sm:px-10 md:px-14 lg:px-20 xl:px-24 2xl:px-32">
				<h2 className="font-title text-2xl font-normal tracking-tight text-foreground sm:text-3xl md:text-4xl">
					{title}
				</h2>

				<div className="mt-4 grid grid-cols-1 gap-4 sm:mt-6 sm:grid-cols-2 sm:gap-6 lg:gap-8">
					{items.map((item) => (
						<OpportunityCard key={item.id} item={item} />
					))}
				</div>
			</div>
		</section>
	);
};
