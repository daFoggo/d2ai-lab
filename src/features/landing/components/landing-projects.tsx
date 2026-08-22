import type { ComponentProps, ReactNode } from "react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { TLandingProjectHero, TLandingProjectItem } from "../schemas";

export interface ILandingProjectsRootProps extends ComponentProps<"section"> {
	children: ReactNode;
	className?: string;
}

export function LandingProjectsRoot({
	children,
	className,
	...props
}: ILandingProjectsRootProps) {
	return (
		<section
			data-slot="landing-projects"
			className={cn(
				"w-full overflow-hidden py-10 sm:py-16 lg:py-20",
				className,
			)}
			{...props}
		>
			<div className="w-full px-6 sm:px-10 md:px-14 lg:px-20 xl:px-24 2xl:px-32">
				{children}
			</div>
		</section>
	);
}

export interface ILandingProjectsHeaderProps extends ComponentProps<"div"> {
	title?: string;
	onSeeProjects?: () => void;
	className?: string;
}

export function LandingProjectsHeader({
	title = "Our research drives real-world change",
	onSeeProjects,
	className,
	...props
}: ILandingProjectsHeaderProps) {
	return (
		<div
			data-slot="landing-projects-header"
			className={cn(
				"flex flex-col justify-between gap-4 sm:flex-row sm:items-center",
				className,
			)}
			{...props}
		>
			<h2 className="font-title text-2xl font-normal tracking-tight text-foreground sm:text-3xl md:text-4xl">
				{title}
			</h2>

			{onSeeProjects && (
				<div>
					<Button
						type="button"
						onClick={onSeeProjects}
						variant="default"
						size="sm"
						className="cursor-pointer rounded-full px-4 text-xs font-medium sm:text-sm"
					>
						See more projects
					</Button>
				</div>
			)}
		</div>
	);
}

export interface ILandingProjectsHeroProps extends ComponentProps<"div"> {
	hero: TLandingProjectHero;
	onCtaClick?: () => void;
	className?: string;
}

export function LandingProjectsHero({
	hero,
	onCtaClick,
	className,
	...props
}: ILandingProjectsHeroProps) {
	return (
		<div
			data-slot="landing-projects-hero"
			className={cn(
				"relative mt-6 grid grid-cols-1 items-center gap-6 sm:mt-8 sm:gap-8 md:grid-cols-12 lg:gap-12",
				className,
			)}
			{...props}
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
						<div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-zinc-900 via-zinc-950 to-zinc-900 p-5">
							<div className="flex flex-col items-center gap-1 text-center select-none">
								<span className="font-mono text-[10px] tracking-wider text-zinc-500 uppercase">
									{hero.category ?? "FEATURED APP"}
								</span>
								<span className="font-title text-base font-normal text-zinc-300">
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
					<span className="font-mono text-[11px] font-medium tracking-wider text-muted-foreground uppercase">
						{hero.category}
					</span>
				)}
				<h3 className="mt-1.5 font-title text-xl font-normal tracking-tight text-foreground sm:text-2xl lg:text-3xl">
					{hero.title}
				</h3>
				<p className="mt-2 text-xs leading-relaxed text-muted-foreground sm:text-sm">
					{hero.description}
				</p>

				<div className="mt-4 sm:mt-6">
					<Button
						type="button"
						onClick={onCtaClick}
						variant="default"
						size="sm"
						className="cursor-pointer rounded-full px-4 text-xs font-medium sm:text-sm"
					>
						{hero.ctaLabel}
					</Button>
				</div>
			</div>
		</div>
	);
}

export interface ILandingProjectsItemProps extends ComponentProps<"div"> {
	item: TLandingProjectItem;
	className?: string;
}

export function LandingProjectsItem({
	item,
	className,
	...props
}: ILandingProjectsItemProps) {
	return (
		<div
			data-slot="landing-projects-item"
			className={cn(
				"group flex items-start gap-3.5 rounded-2xl p-2.5 transition-colors hover:bg-muted/30",
				className,
			)}
			{...props}
		>
			{/* Square Compact Thumbnail */}
			<div className="relative size-14 shrink-0 overflow-hidden rounded-xl bg-gradient-to-br from-zinc-900 via-zinc-950 to-zinc-900 shadow-xs sm:size-16 sm:rounded-2xl">
				{item.thumbnail ? (
					<img
						src={item.thumbnail}
						alt={item.title}
						className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
					/>
				) : (
					<div className="flex h-full w-full items-center justify-center p-2 text-center select-none">
						<span className="font-mono text-[9px] text-zinc-500 uppercase">
							APP
						</span>
					</div>
				)}
			</div>

			{/* Info */}
			<div className="flex flex-col justify-center">
				<span className="font-mono text-[10px] font-medium tracking-wider text-muted-foreground uppercase">
					{item.category}
				</span>
				<h4 className="mt-1 line-clamp-2 text-xs leading-snug font-medium tracking-tight text-foreground transition-colors group-hover:text-foreground/80 sm:text-sm">
					<a href={item.href ?? "#"} className="focus:outline-hidden">
						{item.title}
					</a>
				</h4>
			</div>
		</div>
	);
}

export interface ILandingProjectsPresetProps {
	title?: string;
	hero: TLandingProjectHero;
	items: TLandingProjectItem[];
	onSeeProjects?: () => void;
	onHeroCtaClick?: () => void;
	className?: string;
}

export function LandingProjectsPreset({
	title = "Our research drives real-world change",
	hero,
	items,
	onSeeProjects,
	onHeroCtaClick,
	className,
}: ILandingProjectsPresetProps) {
	const displayItems = items.slice(0, 2);

	return (
		<LandingProjectsRoot className={className}>
			<LandingProjectsHeader title={title} onSeeProjects={onSeeProjects} />
			<LandingProjectsHero hero={hero} onCtaClick={onHeroCtaClick} />

			<div className="mt-6 grid grid-cols-1 gap-4 sm:mt-8 sm:grid-cols-2 lg:gap-6">
				{displayItems.map((item, index) => (
					<LandingProjectsItem
						key={item.id}
						item={item}
						className={cn(index > 0 && "hidden sm:flex")}
					/>
				))}
			</div>
		</LandingProjectsRoot>
	);
}

export const LandingProjects = Object.assign(LandingProjectsPreset, {
	Root: LandingProjectsRoot,
	Header: LandingProjectsHeader,
	Hero: LandingProjectsHero,
	Item: LandingProjectsItem,
	Preset: LandingProjectsPreset,
});
