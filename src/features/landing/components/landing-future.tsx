import { IconArrowUpRight } from "@tabler/icons-react";
import type { ComponentProps, ReactNode } from "react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { cn } from "@/lib/utils";
import type { TLandingFutureItem } from "../schemas";

export interface ILandingFutureRootProps extends ComponentProps<"section"> {
	children: ReactNode;
	className?: string;
}

export function LandingFutureRoot({
	children,
	className,
	...props
}: ILandingFutureRootProps) {
	return (
		<section
			data-slot="landing-future"
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

export interface ILandingFutureHeaderProps extends ComponentProps<"div"> {
	title?: string;
	className?: string;
}

export function LandingFutureHeader({
	title = "Help us shape the future",
	className,
	...props
}: ILandingFutureHeaderProps) {
	return (
		<div
			data-slot="landing-future-header"
			className={cn("flex flex-col", className)}
			{...props}
		>
			<h2 className="font-title text-2xl font-normal tracking-tight text-foreground sm:text-3xl md:text-4xl">
				{title}
			</h2>
		</div>
	);
}

export interface ILandingFutureCardProps extends ComponentProps<"article"> {
	item: TLandingFutureItem;
	className?: string;
}

export function LandingFutureCard({
	item,
	className,
	...props
}: ILandingFutureCardProps) {
	return (
		<article
			data-slot="landing-future-card"
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
						<div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-zinc-900 via-zinc-950 to-zinc-900 p-6">
							<span className="font-title text-lg font-normal text-zinc-300 sm:text-xl">
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

export interface ILandingFuturePresetProps {
	title?: string;
	items: TLandingFutureItem[];
	className?: string;
}

export function LandingFuturePreset({
	title = "Help us shape the future",
	items,
	className,
}: ILandingFuturePresetProps) {
	return (
		<LandingFutureRoot className={className}>
			<LandingFutureHeader title={title} />

			<div className="mt-6 grid grid-cols-1 gap-6 sm:mt-10 sm:grid-cols-2 sm:gap-8 lg:gap-10">
				{items.map((item) => (
					<LandingFutureCard key={item.id} item={item} />
				))}
			</div>
		</LandingFutureRoot>
	);
}

export const LandingFuture = Object.assign(LandingFuturePreset, {
	Root: LandingFutureRoot,
	Header: LandingFutureHeader,
	Card: LandingFutureCard,
	Preset: LandingFuturePreset,
});
