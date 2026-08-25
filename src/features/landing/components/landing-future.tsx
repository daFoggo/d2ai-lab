import { IconArrowUpRight } from "@tabler/icons-react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { cn } from "@/lib/utils";
import { HERO_SCOPE_STYLE } from "../constants";
import type { TLandingFutureItem } from "../schemas";

export interface ILandingFutureProps {
	title?: string;
	items: TLandingFutureItem[];
	className?: string;
}

function FutureCard({
	item,
	className,
}: {
	item: TLandingFutureItem;
	className?: string;
}) {
	return (
		<article
			data-slot="landing-future-card"
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
						<div
							style={HERO_SCOPE_STYLE}
							className="flex h-full w-full items-center justify-center bg-background p-6"
						>
							<span className="font-title text-lg font-normal text-muted-foreground sm:text-xl">
								{item.title}
							</span>
						</div>
					)}
				</AspectRatio>
			</div>

			{/* Content */}
			<h3 className="mt-4 font-title text-xl font-normal tracking-tight text-foreground transition-colors group-hover:text-foreground/80 sm:text-2xl">
				{item.title}
			</h3>
			<p className="mt-2 text-xs leading-relaxed text-muted-foreground sm:text-sm">
				{item.description}
			</p>

			{/* Link with Clean Arrow */}
			<div className="mt-4 flex items-center gap-1.5 font-medium text-foreground">
				<a
					href={item.href}
					className="text-xs transition-colors hover:text-foreground/80 focus:outline-hidden sm:text-sm"
				>
					{item.linkLabel}
				</a>
				<IconArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
			</div>
		</article>
	);
}

export function LandingFuture({
	title = "Help us shape the future",
	items,
	className,
}: ILandingFutureProps) {
	return (
		<section
			data-slot="landing-future"
			className={cn(
				"w-full overflow-hidden py-14 sm:py-20 lg:py-24",
				className,
			)}
		>
			<div className="w-full px-6 sm:px-10 md:px-14 lg:px-20 xl:px-24 2xl:px-32">
				<h2 className="font-title text-2xl font-normal tracking-tight text-foreground sm:text-3xl md:text-4xl">
					{title}
				</h2>

				<div className="mt-6 grid grid-cols-1 gap-6 sm:mt-10 sm:grid-cols-2 sm:gap-8 lg:gap-10">
					{items.map((item) => (
						<FutureCard key={item.id} item={item} />
					))}
				</div>
			</div>
		</section>
	);
}
