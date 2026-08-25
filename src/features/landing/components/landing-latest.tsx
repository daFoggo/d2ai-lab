import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { HERO_SCOPE_STYLE } from "../constants";
import type { TLandingLatestItem } from "../schemas";

export interface ILandingLatestProps {
	title?: string;
	items: TLandingLatestItem[];
	onSeePublications?: () => void;
	className?: string;
}

function LatestCard({
	item,
	className,
}: {
	item: TLandingLatestItem;
	className?: string;
}) {
	return (
		<article
			data-slot="landing-latest-card"
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
							className="flex h-full w-full items-center justify-center bg-background p-5"
						>
							<div className="flex flex-col items-center gap-1 text-center select-none">
								<span className="font-mono text-xs tracking-wider text-muted-foreground/50 uppercase">
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
						<span className="font-mono text-xs text-muted-foreground uppercase">
							{item.date}
						</span>
					</>
				)}
			</div>

			{/* Title */}
			<h3 className="mt-1 line-clamp-3 text-sm leading-snug font-medium tracking-tight text-foreground transition-colors group-hover:text-foreground/80 sm:text-base">
				<a href={item.href ?? "#"} className="focus:outline-hidden">
					{item.title}
				</a>
			</h3>
		</article>
	);
}

export function LandingLatest({
	title = "Read the latest",
	items,
	onSeePublications,
	className,
}: ILandingLatestProps) {
	const { t } = useI18n();

	return (
		<section
			data-slot="landing-latest"
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

					{onSeePublications && (
						<div>
							<Button onClick={onSeePublications}>
								{t("landing.latest.seeMore")}
							</Button>
						</div>
					)}
				</div>

				<div className="mt-6 grid grid-cols-1 gap-6 sm:mt-10 sm:grid-cols-2 sm:gap-8 lg:grid-cols-3">
					{items.map((item, index) => (
						<LatestCard
							key={item.id}
							item={item}
							className={cn(index >= 2 && "hidden lg:flex")}
						/>
					))}
				</div>
			</div>
		</section>
	);
}
