import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { DEFAULT_LOCALE, useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import type { TLandingPublicationItem } from "../schemas";

export interface ILandingPublicationsProps {
	title: string;
	items: TLandingPublicationItem[];
	action?: ReactNode;
	className?: string;
}

const PublicationCard = ({
	item,
	className,
}: {
	item: TLandingPublicationItem;
	className?: string;
}) => {
	const { locale } = useI18n();

	return (
		<article
			className={cn(
				"group flex flex-col overflow-hidden transition-all duration-300",
				className,
			)}
		>
			{/* Thumbnail with Standardized AspectRatio and No Border */}
			<div className="w-full overflow-hidden rounded-2xl shadow-xs sm:rounded-3xl">
				<AspectRatio ratio={16 / 10}>
					{item.thumbnail ? (
						<img
							src={item.thumbnail}
							alt={item.title}
							className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
						/>
					) : (
						<div className="flex h-full w-full items-center justify-center bg-muted/50 p-5">
							<div className="flex flex-col items-center gap-1 text-center select-none">
								<span className="font-mono text-xs tracking-wider text-muted-foreground/70 uppercase">
									{item.category}
								</span>
								<span className="line-clamp-2 text-xs font-medium text-muted-foreground">
									{item.title}
								</span>
							</div>
						</div>
					)}
				</AspectRatio>
			</div>

			{/* Meta: Category & Date */}
			<div className="mt-3 flex items-center gap-2">
				<span className="font-mono text-xs font-medium tracking-wider text-muted-foreground uppercase">
					{item.category}
				</span>
				{item.date && (
					<>
						<span className="text-xs text-muted-foreground/50">·</span>
						<span className="font-mono text-xs font-medium tracking-wider text-muted-foreground uppercase">
							{item.date}
						</span>
					</>
				)}
			</div>

			{/* Title */}
			<h3 className="mt-1 line-clamp-3 text-sm leading-snug font-medium tracking-tight text-foreground transition-colors group-hover:text-foreground/80 sm:text-base">
				<Link
					to={item.to ?? "/{-$locale}"}
					params={{ locale: locale === DEFAULT_LOCALE ? undefined : locale }}
					className="focus:outline-hidden"
				>
					{item.title}
				</Link>
			</h3>
		</article>
	);
};

export const LandingPublications = ({
	title,
	items,
	action,
	className,
}: ILandingPublicationsProps) => {
	return (
		<section
			className={cn(
				"w-full overflow-hidden py-14 sm:py-20 lg:py-24",
				className,
			)}
		>
			<div className="w-full px-6 sm:px-10 md:px-14 lg:px-20 xl:px-24 2xl:px-32">
				<div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
					<h2 className="font-title text-2xl font-normal tracking-tight text-foreground sm:text-3xl md:text-4xl">
						{title}
					</h2>

					{action && <div>{action}</div>}
				</div>

				<div className="mt-6 grid grid-cols-1 gap-6 sm:mt-10 sm:grid-cols-2 sm:gap-8 lg:grid-cols-3">
					{items.map((item, index) => (
						<PublicationCard
							key={item.id}
							item={item}
							className={cn(index >= 2 && "hidden lg:flex")}
						/>
					))}
				</div>
			</div>
		</section>
	);
};
