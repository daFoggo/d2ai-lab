import { IconPlayerPause, IconPlayerPlay } from "@tabler/icons-react";
import { type ComponentProps, type ReactNode, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface ILandingDomainsRootProps extends ComponentProps<"section"> {
	children: ReactNode;
	className?: string;
}

export function LandingDomainsRoot({
	children,
	className,
	...props
}: ILandingDomainsRootProps) {
	return (
		<section
			data-slot="landing-domains"
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

export interface ILandingDomainsBannerProps extends ComponentProps<"div"> {
	title?: string;
	description?: string;
	ctaLabel?: string;
	onCtaClick?: () => void;
	className?: string;
}

const MOSAIC_TILES = [
	{ label: "AI/ML Foundations", tag: "NEURAL ARCHITECTURES" },
	{ label: "Smart Education", tag: "ADAPTIVE SYSTEMS" },
	{ label: "Ambient IoT", tag: "TELEMETRY & SENSORS" },
	{ label: "Public Governance", tag: "DOCUMENT INTELLIGENCE" },
	{ label: "Customer Experience", tag: "CONVERSATIONAL AI" },
	{ label: "Optimization", tag: "ALGORITHMIC FOUNDATIONS" },
	{ label: "Responsible AI", tag: "ETHICAL ML" },
	{ label: "Climate & Ecology", tag: "SPATIAL SENSING" },
];

export function LandingDomainsBanner({
	title = "We work across domains",
	description = "Our vast breadth of work covers AI/ML foundations, responsible human-centric technology, science & societal impact, computing paradigms, and algorithms & optimization. Our research teams impact technology used by people all over the world.",
	ctaLabel = "Explore research areas",
	onCtaClick,
	className,
	...props
}: ILandingDomainsBannerProps) {
	const [isPaused, setIsPaused] = useState(false);

	return (
		<div
			data-slot="landing-domains-banner"
			className={cn(
				"relative flex min-h-115 w-full flex-col justify-between overflow-hidden rounded-3xl bg-zinc-950 p-8 shadow-xs sm:min-h-125 sm:p-12 md:p-16 lg:min-h-[540px] lg:p-20",
				className,
			)}
			{...props}
		>
			{/* Background Abstract Mosaic Pattern */}
			<div
				aria-hidden="true"
				className="pointer-events-none absolute inset-0 grid grid-cols-2 gap-4 p-4 opacity-25 sm:grid-cols-3 md:grid-cols-4 lg:gap-6 lg:p-6"
			>
				{MOSAIC_TILES.map((tile) => (
					<div
						key={tile.label}
						className="flex flex-col justify-end rounded-2xl border border-zinc-800/80 bg-linear-to-br from-zinc-900/60 to-zinc-950/90 p-4 transition-colors"
					>
						<span className="font-mono text-[9px] tracking-wider text-zinc-500 uppercase">
							{tile.tag}
						</span>
						<span className="mt-1 font-title text-xs font-medium text-zinc-400">
							{tile.label}
						</span>
					</div>
				))}
			</div>

			{/* Center Pause/Play Control as in Google Research */}
			<div className="absolute top-6 right-6 z-20 sm:top-8 sm:right-8">
				<button
					type="button"
					onClick={() => setIsPaused((prev) => !prev)}
					aria-label={
						isPaused ? "Play ambient animation" : "Pause ambient animation"
					}
					className="flex size-7 cursor-pointer items-center justify-center rounded-full bg-zinc-900/80 text-zinc-300 backdrop-blur-md transition-colors hover:bg-zinc-800 hover:text-white focus-visible:ring-2 focus-visible:ring-ring"
				>
					{isPaused ? (
						<IconPlayerPlay className="size-3" />
					) : (
						<IconPlayerPause className="size-3" />
					)}
				</button>
			</div>

			{/* Foreground Content Card */}
			<div
				data-slot="landing-domains-content"
				className="relative z-10 my-auto flex max-w-2xl flex-col"
			>
				<h2 className="font-title text-3xl font-normal tracking-tight text-white sm:text-4xl md:text-5xl lg:text-6xl">
					{title}
				</h2>
				<p className="mt-4 text-sm leading-relaxed text-zinc-300 sm:mt-6 sm:text-base md:text-lg">
					{description}
				</p>

				{ctaLabel && (
					<div className="mt-6 sm:mt-8">
						<Button
							type="button"
							onClick={onCtaClick}
							variant="secondary"
							size="sm"
							className="cursor-pointer rounded-full bg-white px-5 text-xs font-medium text-zinc-950 transition-transform hover:scale-105 hover:bg-zinc-100 sm:text-sm"
						>
							{ctaLabel}
						</Button>
					</div>
				)}
			</div>
		</div>
	);
}

export interface ILandingDomainsPresetProps {
	title?: string;
	description?: string;
	ctaLabel?: string;
	onCtaClick?: () => void;
	className?: string;
}

export function LandingDomainsPreset({
	title = "We work across domains",
	description = "Our vast breadth of work covers AI/ML foundations, responsible human-centric technology, science & societal impact, computing paradigms, and algorithms & optimization. Our research teams impact technology used by people all over the world.",
	ctaLabel = "Explore research areas",
	onCtaClick,
	className,
}: ILandingDomainsPresetProps) {
	return (
		<LandingDomainsRoot className={className}>
			<LandingDomainsBanner
				title={title}
				description={description}
				ctaLabel={ctaLabel}
				onCtaClick={onCtaClick}
			/>
		</LandingDomainsRoot>
	);
}

export const LandingDomains = Object.assign(LandingDomainsPreset, {
	Root: LandingDomainsRoot,
	Banner: LandingDomainsBanner,
	Preset: LandingDomainsPreset,
});
