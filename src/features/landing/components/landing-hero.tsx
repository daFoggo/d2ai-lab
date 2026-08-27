import type { ComponentProps, ReactNode } from "react";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export interface ILandingHeroRootProps extends ComponentProps<"section"> {
	children: ReactNode;
	className?: string;
}

export const LandingHeroRoot = ({
	children,
	className,
	...props
}: ILandingHeroRootProps) => {
	return (
		<section
			data-slot="landing-hero"
			className={cn(
				"relative flex min-h-screen w-full flex-col justify-center overflow-hidden bg-primary pt-20 pb-14 text-primary-foreground sm:pt-24 sm:pb-16 lg:pt-28 lg:pb-20",
				className,
			)}
			{...props}
		>
			{/* Subtle ambient lighting aura for visual depth */}
			<div
				aria-hidden="true"
				className="pointer-events-none absolute inset-0 -z-10 overflow-hidden select-none"
			>
				<div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 size-80 rounded-full bg-primary-foreground/4 blur-3xl sm:size-96 lg:size-[500px]" />
			</div>

			<div className="w-full px-4 sm:px-6 md:px-10 lg:px-16 xl:px-20 2xl:px-24">
				{children}
			</div>
		</section>
	);
};

export interface ILandingHeroRowProps extends ComponentProps<"div"> {
	children: ReactNode;
	className?: string;
}

export const LandingHeroRow = ({
	children,
	className,
	...props
}: ILandingHeroRowProps) => {
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
};

export interface ILandingHeroTitleProps extends ComponentProps<"h1"> {
	children: ReactNode;
	className?: string;
}

export const LandingHeroTitle = ({
	children,
	className,
	...props
}: ILandingHeroTitleProps) => {
	const { locale } = useI18n();

	return (
		<h1
			data-slot="landing-hero-title"
			className={cn(
				"font-title text-3xl leading-tight font-normal tracking-tight text-primary-foreground text-balance select-none sm:text-4xl md:text-5xl",
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
};

export interface ILandingHeroDescriptionProps extends ComponentProps<"p"> {
	children: ReactNode;
	className?: string;
}

export const LandingHeroDescription = ({
	children,
	className,
	...props
}: ILandingHeroDescriptionProps) => {
	return (
		<p
			data-slot="landing-hero-description"
			className={cn(
				"text-sm leading-relaxed text-primary-foreground/80 sm:text-base md:text-base",
				className,
			)}
			{...props}
		>
			{children}
		</p>
	);
};

export interface ILandingHeroActionsProps extends ComponentProps<"div"> {
	children: ReactNode;
	className?: string;
}

export const LandingHero = Object.assign(LandingHeroRoot, {
	Root: LandingHeroRoot,
	Row: LandingHeroRow,
	Title: LandingHeroTitle,
	Description: LandingHeroDescription,
});
