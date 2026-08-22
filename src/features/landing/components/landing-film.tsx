import type { ComponentProps, ReactNode } from "react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { cn } from "@/lib/utils";

export interface ILandingFilmRootProps extends ComponentProps<"section"> {
	children: ReactNode;
	className?: string;
}

export function LandingFilmRoot({
	children,
	className,
	...props
}: ILandingFilmRootProps) {
	return (
		<section
			data-slot="landing-film"
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

export interface ILandingFilmContentProps extends ComponentProps<"div"> {
	title: string;
	description: string;
	className?: string;
}

export function LandingFilmContent({
	title,
	description,
	className,
	...props
}: ILandingFilmContentProps) {
	return (
		<div
			data-slot="landing-film-content"
			className={cn("flex flex-col justify-center", className)}
			{...props}
		>
			<h2 className="font-title text-2xl leading-[1.15] font-normal tracking-tight text-foreground sm:text-3xl md:text-4xl">
				{title}
			</h2>
			<p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:mt-5 sm:text-base md:max-w-xl">
				{description}
			</p>
		</div>
	);
}

export interface ILandingFilmVideoProps extends ComponentProps<"div"> {
	brandText?: string;
	thumbnailSrc?: string;
	className?: string;
}

export function LandingFilmVideo({
	brandText = "D2AI Lab",
	thumbnailSrc,
	className,
	...props
}: ILandingFilmVideoProps) {
	return (
		<div
			data-slot="landing-film-video"
			className={cn(
				"w-full overflow-hidden rounded-2xl shadow-xs sm:rounded-3xl",
				className,
			)}
			{...props}
		>
			<AspectRatio ratio={16 / 9}>
				{thumbnailSrc ? (
					<img
						src={thumbnailSrc}
						alt={brandText}
						className="h-full w-full object-cover"
					/>
				) : (
					<div className="flex h-full w-full items-center justify-center bg-linear-to-br from-zinc-900 via-zinc-950 to-zinc-900 p-8">
						<span className="font-title text-2xl font-normal text-zinc-400 select-none sm:text-3xl md:text-4xl">
							{brandText}
						</span>
					</div>
				)}
			</AspectRatio>
		</div>
	);
}

export interface ILandingFilmPresetProps {
	title?: string;
	description?: string;
	brandText?: string;
	thumbnailSrc?: string;
	className?: string;
}

export function LandingFilmPreset({
	title = "Amplifying human ingenuity",
	description = "As we realize new possibilities with AI, we maintain a human-centered approach. We advance scientific progress by publishing impactful research each year and collaborating with universities, NGOs, partners, and communities worldwide.",
	brandText = "D2AI Lab",
	thumbnailSrc,
	className,
}: ILandingFilmPresetProps) {
	return (
		<LandingFilmRoot className={className}>
			<div className="grid grid-cols-1 items-center gap-8 sm:gap-12 lg:grid-cols-2 lg:gap-16">
				<LandingFilmContent title={title} description={description} />
				<LandingFilmVideo brandText={brandText} thumbnailSrc={thumbnailSrc} />
			</div>
		</LandingFilmRoot>
	);
}

export const LandingFilm = Object.assign(LandingFilmPreset, {
	Root: LandingFilmRoot,
	Content: LandingFilmContent,
	Video: LandingFilmVideo,
	Preset: LandingFilmPreset,
});
