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

			// Staggered smooth entrance for hero titles, content and actions
			tl.from("[data-slot='landing-hero-title']", {
				y: 35,
				opacity: 0,
				duration: 0.9,
				stagger: 0.15,
			})
				.from(
					"[data-slot='landing-hero-description']",
					{
						y: 20,
						opacity: 0,
						duration: 0.8,
					},
					"-=0.5",
				)
				.from(
					"[data-slot='landing-hero-actions']",
					{
						y: 15,
						opacity: 0,
						duration: 0.7,
					},
					"-=0.5",
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
			{/* Subtle ambient lighting aura for visual depth */}
			<div
				aria-hidden="true"
				className="pointer-events-none absolute inset-0 -z-10 overflow-hidden select-none"
			>
				<div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 size-80 rounded-full bg-foreground/[0.04] blur-3xl sm:size-96 lg:size-[500px]" />
			</div>

			<div className="w-full px-4 sm:px-6 md:px-10 lg:px-16 xl:px-20 2xl:px-24">
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
				"flex flex-col items-start justify-between gap-6 sm:gap-8 lg:flex-row lg:items-end lg:gap-12",
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
				"font-title text-3xl leading-tight font-normal tracking-tight text-foreground text-balance select-none sm:text-4xl md:text-5xl",
				locale === "vi"
					? "lg:text-5xl xl:text-6xl 2xl:text-7xl"
					: "lg:text-6xl xl:text-7xl 2xl:text-8xl",
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
				"text-sm leading-relaxed text-muted-foreground sm:text-base md:text-base",
				className,
			)}
			{...props}
		>
			{children}
		</p>
	);
}

export interface ILandingHeroActionsProps extends ComponentProps<"div"> {
	children: ReactNode;
	className?: string;
}

export function LandingHeroActions({
	children,
	className,
	...props
}: ILandingHeroActionsProps) {
	return (
		<div
			data-slot="landing-hero-actions"
			className={cn(
				"flex flex-wrap items-center gap-3 pt-2 sm:pt-4",
				className,
			)}
			{...props}
		>
			{children}
		</div>
	);
}

export const LandingHero = Object.assign(LandingHeroRoot, {
	Root: LandingHeroRoot,
	Row: LandingHeroRow,
	Title: LandingHeroTitle,
	Description: LandingHeroDescription,
	Actions: LandingHeroActions,
});
