import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { DEFAULT_LOCALE, useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { HERO_SCOPE_STYLE } from "../constants";
import type { TLandingProjectHero, TLandingProjectItem } from "../schemas";

export interface ILandingProjectsProps {
	title?: string;
	hero: TLandingProjectHero;
	items: TLandingProjectItem[];
	/** Nút "see more" do route compose sẵn (Button + Link). */
	seeMore?: ReactNode;
	/** Nút CTA của project nổi bật do route compose sẵn. */
	heroCta?: ReactNode;
	className?: string;
}

function ProjectsHero({
	hero,
	cta,
}: {
	hero: TLandingProjectHero;
	cta?: ReactNode;
}) {
	const { t } = useI18n();

	return (
		<div
			data-slot="landing-projects-hero"
			className="relative mt-6 grid grid-cols-1 items-center gap-6 sm:mt-8 sm:gap-8 md:grid-cols-12 lg:gap-12"
		>
			{/* Left Visual Media (Compact AspectRatio) */}
			<div className="w-full overflow-hidden rounded-2xl shadow-xs sm:rounded-3xl md:col-span-5">
				<AspectRatio ratio={16 / 10}>
					{hero.thumbnail ? (
						<img
							src={hero.thumbnail}
							alt={hero.title}
							className="h-full w-full object-cover"
						/>
					) : (
						<div
							style={HERO_SCOPE_STYLE}
							className="flex h-full w-full items-center justify-center bg-background p-5"
						>
							<div className="flex flex-col items-center gap-1 text-center select-none">
								<span className="font-mono text-xs tracking-wider text-muted-foreground/50 uppercase">
									{hero.category ?? t("landing.projects.featuredApp")}
								</span>
								<span className="font-title text-base font-normal text-foreground/70">
									{hero.title}
								</span>
							</div>
						</div>
					)}
				</AspectRatio>
			</div>

			{/* Right Description & Action (Compact Typography) */}
			<div className="flex flex-col justify-center md:col-span-7 md:pl-2">
				{hero.category && (
					<span className="font-mono text-xs font-medium tracking-wider text-muted-foreground uppercase">
						{hero.category}
					</span>
				)}
				<h3 className="mt-1.5 font-title text-xl font-normal tracking-tight text-foreground sm:text-2xl lg:text-3xl">
					{hero.title}
				</h3>
				<p className="mt-2 text-xs leading-relaxed text-muted-foreground sm:text-sm">
					{hero.description}
				</p>

				<div className="mt-4 sm:mt-6">{cta && cta}</div>
			</div>
		</div>
	);
}

function ProjectsItem({
	item,
	className,
}: {
	item: TLandingProjectItem;
	className?: string;
}) {
	const { t, locale } = useI18n();

	return (
		<div
			data-slot="landing-projects-item"
			className={cn(
				"group flex items-start gap-3.5 rounded-2xl p-2.5 transition-colors hover:bg-muted/30",
				className,
			)}
		>
			{/* Square Compact Thumbnail */}
			<div
				style={HERO_SCOPE_STYLE}
				className="relative size-14 shrink-0 overflow-hidden rounded-xl bg-background shadow-xs sm:size-16 sm:rounded-2xl"
			>
				{item.thumbnail ? (
					<img
						src={item.thumbnail}
						alt={item.title}
						className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
					/>
				) : (
					<div className="flex h-full w-full items-center justify-center p-2 text-center select-none">
						<span className="font-mono text-xs text-muted-foreground/50 uppercase">
							{t("landing.projects.appTag")}
						</span>
					</div>
				)}
			</div>

			{/* Info */}
			<div className="flex flex-col justify-center">
				<span className="font-mono text-xs font-medium tracking-wider text-muted-foreground uppercase">
					{item.category}
				</span>
				<h4 className="mt-1 line-clamp-2 text-xs leading-snug font-medium tracking-tight text-foreground transition-colors group-hover:text-foreground/80 sm:text-sm">
					<Link
						to={item.to ?? "/{-$locale}"}
						params={{ locale: locale === DEFAULT_LOCALE ? undefined : locale }}
						className="focus:outline-hidden"
					>
						{item.title}
					</Link>
				</h4>
			</div>
		</div>
	);
}

export function LandingProjects({
	title = "Our research drives real-world change",
	hero,
	items,
	seeMore,
	heroCta,
	className,
}: ILandingProjectsProps) {
	const displayItems = items.slice(0, 2);

	return (
		<section
			data-slot="landing-projects"
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

					{seeMore && <div>{seeMore}</div>}
				</div>

				<ProjectsHero hero={hero} cta={heroCta} />

				<div className="mt-6 grid grid-cols-1 gap-4 sm:mt-8 sm:grid-cols-2 lg:gap-6">
					{displayItems.map((item, index) => (
						<ProjectsItem
							key={item.id}
							item={item}
							className={cn(index > 0 && "hidden sm:flex")}
						/>
					))}
				</div>
			</div>
		</section>
	);
}
