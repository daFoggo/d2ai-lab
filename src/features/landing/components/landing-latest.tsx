import type { ComponentProps, ReactNode } from "react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { TLandingLatestItem } from "../schemas";

export interface ILandingLatestRootProps extends ComponentProps<"section"> {
	children: ReactNode;
	className?: string;
}

export function LandingLatestRoot({
	children,
	className,
	...props
}: ILandingLatestRootProps) {
	return (
		<section
			data-slot="landing-latest"
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

export interface ILandingLatestHeaderProps extends ComponentProps<"div"> {
	title?: string;
	onSeePublications?: () => void;
	className?: string;
}

export function LandingLatestHeader({
	title = "Read the latest",
	onSeePublications,
	className,
	...props
}: ILandingLatestHeaderProps) {
	return (
		<div
			data-slot="landing-latest-header"
			className={cn(
				"flex flex-col justify-between gap-4 sm:flex-row sm:items-center",
				className,
			)}
			{...props}
		>
			<h2 className="font-title text-2xl font-normal tracking-tight text-foreground sm:text-3xl md:text-4xl">
				{title}
			</h2>

			{onSeePublications && (
				<div>
					<Button
						type="button"
						onClick={onSeePublications}
						variant="default"
						size="sm"
						className="cursor-pointer rounded-full px-4 text-xs font-medium sm:text-sm"
					>
						See more publications
					</Button>
				</div>
			)}
		</div>
	);
}

export interface ILandingLatestCardProps extends ComponentProps<"article"> {
	item: TLandingLatestItem;
	className?: string;
}

export function LandingLatestCard({
	item,
	className,
	...props
}: ILandingLatestCardProps) {
	return (
		<article
			data-slot="landing-latest-card"
			className={cn(
				"group flex flex-col overflow-hidden transition-all duration-300",
				className,
			)}
			{...props}
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
						<div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-zinc-900 via-zinc-950 to-zinc-900 p-5">
							<div className="flex flex-col items-center gap-1 text-center select-none">
								<span className="font-mono text-[10px] tracking-wider text-zinc-500 uppercase">
									{item.category}
								</span>
								<span className="line-clamp-2 text-xs font-medium text-zinc-400">
									{item.title}
								</span>
							</div>
						</div>
					)}
				</AspectRatio>
			</div>

			{/* Meta: Category & Date */}
			<div className="mt-3 flex items-center gap-2">
				<span className="font-mono text-[11px] font-medium tracking-wider text-muted-foreground uppercase">
					{item.category}
				</span>
				{item.date && (
					<>
						<span className="text-xs text-muted-foreground/50">·</span>
						<span className="font-mono text-[11px] text-muted-foreground uppercase">
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

export interface ILandingLatestPresetProps {
	title?: string;
	items: TLandingLatestItem[];
	onSeePublications?: () => void;
	className?: string;
}

export function LandingLatestPreset({
	title = "Read the latest",
	items,
	onSeePublications,
	className,
}: ILandingLatestPresetProps) {
	return (
		<LandingLatestRoot className={className}>
			<LandingLatestHeader
				title={title}
				onSeePublications={onSeePublications}
			/>

			<div className="mt-6 grid grid-cols-1 gap-6 sm:mt-10 sm:grid-cols-2 sm:gap-8 lg:grid-cols-3">
				{items.map((item, index) => (
					<LandingLatestCard
						key={item.id}
						item={item}
						className={cn(index >= 2 && "hidden lg:flex")}
					/>
				))}
			</div>
		</LandingLatestRoot>
	);
}

export const LandingLatest = Object.assign(LandingLatestPreset, {
	Root: LandingLatestRoot,
	Header: LandingLatestHeader,
	Card: LandingLatestCard,
	Preset: LandingLatestPreset,
});
