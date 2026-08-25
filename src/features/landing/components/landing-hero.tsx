import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { type ComponentProps, type ReactNode, useRef } from "react";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { HERO_SCOPE_STYLE } from "../constants";

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

			// Ultra-gentle, subtle breathing physics on accent icons
			gsap.to(".hero-icon-spark", {
				y: -3,
				rotation: 3,
				duration: 4.5,
				repeat: -1,
				yoyo: true,
				ease: "sine.inOut",
			});

			gsap.to(".hero-icon-highlight", {
				y: 3,
				rotation: -3,
				duration: 5,
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
			style={HERO_SCOPE_STYLE}
			className={cn(
				"relative flex min-h-screen w-full flex-col justify-center overflow-hidden bg-background pt-20 pb-14 text-foreground sm:pt-24 sm:pb-16 lg:pt-28 lg:pb-20",
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
	const { locale } = useI18n();

	return (
		<h1
			data-slot="landing-hero-title"
			className={cn(
				"font-title text-4xl leading-tight font-normal tracking-tight text-foreground text-balance select-none sm:text-5xl md:text-6xl",
				locale === "vi" ? "lg:text-6xl xl:text-7xl" : "lg:text-7xl xl:text-8xl",
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

export const LandingHero = Object.assign(LandingHeroRoot, {
	Root: LandingHeroRoot,
	Row: LandingHeroRow,
	Title: LandingHeroTitle,
	Description: LandingHeroDescription,
});
