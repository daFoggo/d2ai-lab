import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface ILandingLayoutProps extends ComponentProps<"div"> {
	children: ReactNode;
	className?: string;
}

export function LandingLayout({
	children,
	className,
	...props
}: ILandingLayoutProps) {
	return (
		<div
			data-slot="landing-layout"
			className={cn(
				"relative flex min-h-screen w-full flex-col bg-background text-foreground antialiased selection:bg-foreground selection:text-background",
				className,
			)}
			{...props}
		>
			{children}
		</div>
	);
}

export interface ILandingContainerProps extends ComponentProps<"div"> {
	children: ReactNode;
	className?: string;
	as?: "div" | "section" | "main" | "header" | "footer";
}

export function LandingContainer({
	children,
	className,
	as: Component = "div",
	...props
}: ILandingContainerProps) {
	return (
		<Component
			data-slot="landing-container"
			className={cn(
				"w-full px-6 sm:px-10 md:px-14 lg:px-20 xl:px-24 2xl:px-32",
				className,
			)}
			{...props}
		>
			{children}
		</Component>
	);
}

LandingLayout.Container = LandingContainer;
