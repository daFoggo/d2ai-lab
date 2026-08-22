import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { type ComponentProps, type ReactNode, useRef } from "react";
import { cn } from "@/lib/utils";

export interface ILandingHeroRootProps extends ComponentProps<"section"> {
	children: ReactNode;
	className?: string;
}

export function LandingHeroRoot({
	children,
	className,
	...props
}: ILandingHeroRootProps) {
	const containerRef = useRef<HTMLElement>(null);

	useGSAP(
		() => {
			if (typeof window === "undefined") return;

			const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

			// Staggered smooth entrance for hero titles and content
			tl.from("[data-slot='landing-hero-title']", {
				y: 40,
				opacity: 0,
				duration: 1,
				stagger: 0.15,
			}).from(
				"[data-slot='landing-hero-description']",
				{
					y: 25,
					opacity: 0,
					duration: 0.85,
				},
				"-=0.6",
			);

			// Subtle breathing / floating physics on accent icons
			gsap.to(".hero-icon-spark", {
				y: -8,
				rotation: 14,
				duration: 3.5,
				repeat: -1,
				yoyo: true,
				ease: "sine.inOut",
			});

			gsap.to(".hero-icon-highlight", {
				y: 8,
				rotation: -14,
				duration: 4,
				repeat: -1,
				yoyo: true,
				ease: "sine.inOut",
			});
		},
		{ scope: containerRef },
	);

	return (
		<section
			ref={containerRef}
			data-slot="landing-hero"
			className={cn(
				"relative flex min-h-[90vh] w-full flex-col justify-center overflow-hidden pt-20 pb-14 sm:min-h-[94vh] sm:pt-24 sm:pb-16 lg:min-h-[96vh] lg:pt-28 lg:pb-20 xl:min-h-[98vh]",
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

export interface ILandingHeroRowProps extends ComponentProps<"div"> {
	children: ReactNode;
	className?: string;
}

export function LandingHeroRow({
	children,
	className,
	...props
}: ILandingHeroRowProps) {
	return (
		<div
			data-slot="landing-hero-row"
			className={cn(
				"flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-end lg:gap-12",
				className,
			)}
			{...props}
		>
			{children}
		</div>
	);
}

export interface ILandingHeroTitleProps extends ComponentProps<"h1"> {
	children: ReactNode;
	className?: string;
}

export function LandingHeroTitle({
	children,
	className,
	...props
}: ILandingHeroTitleProps) {
	return (
		<h1
			data-slot="landing-hero-title"
			className={cn(
				"font-title text-4xl leading-[1.08] font-normal tracking-tight text-foreground select-none sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl",
				className,
			)}
			{...props}
		>
			{children}
		</h1>
	);
}

export interface ILandingHeroDescriptionProps extends ComponentProps<"p"> {
	children: ReactNode;
	className?: string;
}

export function LandingHeroDescription({
	children,
	className,
	...props
}: ILandingHeroDescriptionProps) {
	return (
		<p
			data-slot="landing-hero-description"
			className={cn(
				"max-w-xs text-sm leading-relaxed text-muted-foreground sm:max-w-sm sm:text-base md:max-w-md",
				className,
			)}
			{...props}
		>
			{children}
		</p>
	);
}

/**
 * Standard Full-Width Composable Hero Preset with viewport centering
 */
export interface ILandingHeroPresetProps {
	titleLine1?: string;
	titleLine2?: string;
	description?: string;
	className?: string;
}

export function LandingHeroPreset({
	titleLine1 = "Data to Intelligence,",
	titleLine2 = "Ideas to Impact.",
	description = "Our mission is to advance AI and data science, driving real-world breakthroughs that benefit society.",
	className,
}: ILandingHeroPresetProps) {
	return (
		<LandingHeroRoot className={className}>
			<div className="flex flex-col gap-10 sm:gap-14 lg:gap-18">
				{/* Row 1: Line 1 */}
				<div>
					<LandingHeroTitle>{titleLine1}</LandingHeroTitle>
				</div>

				{/* Row 2: Bottom-aligned Description on Left and Line 2 on Right */}
				<LandingHeroRow>
					<div className="max-w-sm sm:max-w-md lg:pb-1.5">
						<LandingHeroDescription>{description}</LandingHeroDescription>
					</div>

					<div className="flex shrink-0 items-end">
						<LandingHeroTitle>{titleLine2}</LandingHeroTitle>
					</div>
				</LandingHeroRow>
			</div>
		</LandingHeroRoot>
	);
}

export const LandingHero = Object.assign(LandingHeroPreset, {
	Root: LandingHeroRoot,
	Row: LandingHeroRow,
	Title: LandingHeroTitle,
	Description: LandingHeroDescription,
	Preset: LandingHeroPreset,
});
