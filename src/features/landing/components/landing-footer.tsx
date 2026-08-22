import {
	IconArrowUp,
	IconBrandGithub,
	IconBrandLinkedin,
	IconBrandX,
	IconBrandYoutube,
} from "@tabler/icons-react";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface ILandingFooterRootProps extends ComponentProps<"footer"> {
	children: ReactNode;
	className?: string;
}

export function LandingFooterRoot({
	children,
	className,
	...props
}: ILandingFooterRootProps) {
	return (
		<footer
			data-slot="landing-footer"
			className={cn(
				"w-full overflow-hidden border-t border-border/70 bg-background pt-10 pb-8 sm:pt-14 sm:pb-10",
				className,
			)}
			{...props}
		>
			<div className="w-full px-6 sm:px-10 md:px-14 lg:px-20 xl:px-24 2xl:px-32">
				{children}
			</div>
		</footer>
	);
}

const DEFAULT_LABS = [
	{ label: "Data Science Hub", href: "#" },
	{ label: "AI & Multimedia Lab", href: "#" },
	{ label: "IoT & Ambient Computing", href: "#" },
	{ label: "Cyber Security & Networks", href: "#" },
	{ label: "Robotics & Automation", href: "#" },
];

export interface ILandingFooterOtherLabsProps extends ComponentProps<"div"> {
	topLabel?: string;
	labs?: { label: string; href: string }[];
	className?: string;
}

export function LandingFooterOtherLabs({
	topLabel = "Other research teams and initiative areas",
	labs = DEFAULT_LABS,
	className,
	...props
}: ILandingFooterOtherLabsProps) {
	return (
		<div
			data-slot="landing-footer-labs"
			className={cn(
				"flex flex-col justify-between gap-3 text-xs text-muted-foreground sm:flex-row sm:items-center sm:text-sm",
				className,
			)}
			{...props}
		>
			<span className="font-semibold text-foreground">{topLabel}</span>
			<div className="flex flex-wrap items-center gap-x-6 gap-y-2">
				{labs.map((lab) => (
					<a
						key={lab.label}
						href={lab.href}
						className="transition-colors hover:text-foreground focus:outline-hidden"
					>
						{lab.label}
					</a>
				))}
			</div>
		</div>
	);
}

export interface ILandingFooterBigTextProps extends ComponentProps<"div"> {
	brandText?: string;
	className?: string;
}

export function LandingFooterBigText({
	brandText = "D2AI Lab",
	className,
	...props
}: ILandingFooterBigTextProps) {
	return (
		<div
			data-slot="landing-footer-bigtext"
			className={cn(
				"py-8 text-center select-none sm:py-12 lg:py-16",
				className,
			)}
			{...props}
		>
			{/* Bold Massive Typography */}
			<span className="inline-block font-title text-6xl font-bold tracking-tighter text-foreground/90 transition-colors hover:text-foreground sm:text-7xl md:text-8xl lg:text-9xl">
				{brandText}
			</span>
		</div>
	);
}

export interface ILandingFooterBottomBarProps extends ComponentProps<"div"> {
	brandName?: string;
	className?: string;
}

export function LandingFooterBottomBar({
	brandName = "D2AI Lab",
	className,
	...props
}: ILandingFooterBottomBarProps) {
	const handleScrollToTop = () => {
		if (typeof window !== "undefined") {
			window.scrollTo({ top: 0, behavior: "smooth" });
		}
	};

	return (
		<div
			data-slot="landing-footer-bottom"
			className={cn(
				"flex flex-col justify-between gap-4 border-t border-border/70 pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:text-sm",
				className,
			)}
			{...props}
		>
			{/* Left: Brand + Slogan + Socials */}
			<div className="flex flex-wrap items-center gap-4 sm:gap-6">
				<div className="flex items-center gap-2">
					<span className="font-title font-bold text-foreground">
						{brandName}
					</span>
					<span>· Data to Intelligence, Ideas to Impact.</span>
				</div>

				{/* Social Media Icons */}
				<div className="flex items-center gap-3 border-l border-border/70 pl-4 sm:pl-6">
					<a
						href="https://x.com"
						target="_blank"
						rel="noreferrer"
						aria-label="X / Twitter"
						className="transition-colors hover:text-foreground focus:outline-hidden"
					>
						<IconBrandX className="size-4" />
					</a>
					<a
						href="https://linkedin.com"
						target="_blank"
						rel="noreferrer"
						aria-label="LinkedIn"
						className="transition-colors hover:text-foreground focus:outline-hidden"
					>
						<IconBrandLinkedin className="size-4" />
					</a>
					<a
						href="https://youtube.com"
						target="_blank"
						rel="noreferrer"
						aria-label="YouTube"
						className="transition-colors hover:text-foreground focus:outline-hidden"
					>
						<IconBrandYoutube className="size-4" />
					</a>
					<a
						href="https://github.com"
						target="_blank"
						rel="noreferrer"
						aria-label="GitHub"
						className="transition-colors hover:text-foreground focus:outline-hidden"
					>
						<IconBrandGithub className="size-4" />
					</a>
				</div>
			</div>

			{/* Right: Smooth Back To Top Button */}
			<div>
				<button
					type="button"
					onClick={handleScrollToTop}
					className="group inline-flex cursor-pointer items-center gap-1.5 font-medium text-foreground transition-colors hover:text-foreground/80 focus:outline-hidden"
				>
					<span>Back to top</span>
					<IconArrowUp className="size-4 transition-transform group-hover:-translate-y-0.5" />
				</button>
			</div>
		</div>
	);
}

export interface ILandingFooterPresetProps {
	brandName?: string;
	className?: string;
}

export function LandingFooterPreset({
	brandName = "D2AI Lab",
	className,
}: ILandingFooterPresetProps) {
	return (
		<LandingFooterRoot className={className}>
			<LandingFooterOtherLabs />
			<LandingFooterBigText brandText={brandName} />
			<LandingFooterBottomBar brandName={brandName} />
		</LandingFooterRoot>
	);
}

export const LandingFooter = Object.assign(LandingFooterPreset, {
	Root: LandingFooterRoot,
	OtherLabs: LandingFooterOtherLabs,
	BigText: LandingFooterBigText,
	BottomBar: LandingFooterBottomBar,
	Preset: LandingFooterPreset,
});
