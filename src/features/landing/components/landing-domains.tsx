import { IconPlayerPause, IconPlayerPlay } from "@tabler/icons-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { HERO_SCOPE_STYLE } from "../constants";

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

export interface ILandingDomainsProps {
	title?: string;
	description?: string;
	ctaLabel?: string;
	onCtaClick?: () => void;
	className?: string;
}

export function LandingDomains({
	title = "We work across domains",
	description = "Our vast breadth of work covers AI/ML foundations, responsible human-centric technology, science & societal impact, computing paradigms, and algorithms & optimization. Our research teams impact technology used by people all over the world.",
	ctaLabel = "Explore research areas",
	onCtaClick,
	className,
}: ILandingDomainsProps) {
	const { t } = useI18n();
	const [isPaused, setIsPaused] = useState(false);

	return (
		<section
			data-slot="landing-domains"
			className={cn(
				"w-full overflow-hidden py-10 sm:py-16 lg:py-20",
				className,
			)}
		>
			<div className="w-full px-6 sm:px-10 md:px-14 lg:px-20 xl:px-24 2xl:px-32">
				<div
					data-slot="landing-domains-banner"
					style={HERO_SCOPE_STYLE}
					className="relative flex min-h-115 w-full flex-col justify-between overflow-hidden rounded-3xl bg-background p-8 shadow-xs sm:min-h-125 sm:p-12 md:p-16 lg:min-h-135 lg:p-20"
				>
					{/* Background Abstract Mosaic Pattern */}
					<div
						aria-hidden="true"
						className="pointer-events-none absolute inset-0 grid grid-cols-2 gap-4 p-4 opacity-25 sm:grid-cols-3 md:grid-cols-4 lg:gap-6 lg:p-6"
					>
						{MOSAIC_TILES.map((tile) => (
							<div
								key={tile.label}
								className="flex flex-col justify-end rounded-2xl border border-border bg-linear-to-br from-accent/60 to-background/90 p-4 transition-colors"
							>
								<span className="font-mono text-xs tracking-wider text-muted-foreground/50 uppercase">
									{tile.tag}
								</span>
								<span className="mt-1 font-title text-xs font-medium text-foreground/70">
									{tile.label}
								</span>
							</div>
						))}
					</div>

					{/* Center Pause/Play Control as in Google Research */}
					<div className="absolute top-6 right-6 z-20 sm:top-8 sm:right-8">
						<Button
							variant="ghost"
							size="icon-sm"
							type="button"
							onClick={() => setIsPaused((prev) => !prev)}
							aria-label={
								isPaused
									? t("landing.domains.ariaPlay")
									: t("landing.domains.ariaPause")
							}
							className="rounded-full bg-background/80 text-foreground/80 backdrop-blur-md hover:bg-accent hover:text-foreground"
						>
							{isPaused ? (
								<IconPlayerPlay className="size-3" />
							) : (
								<IconPlayerPause className="size-3" />
							)}
						</Button>
					</div>

					{/* Foreground Content Card */}
					<div
						data-slot="landing-domains-content"
						className="relative z-10 my-auto flex max-w-2xl flex-col"
					>
						<h2 className="font-title text-3xl font-normal tracking-tight text-foreground sm:text-4xl md:text-5xl lg:text-6xl">
							{title}
						</h2>
						<p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:mt-6 sm:text-base md:text-lg">
							{description}
						</p>

						{ctaLabel && (
							<div className="mt-6 sm:mt-8">
								<Button onClick={onCtaClick}>{ctaLabel}</Button>
							</div>
						)}
					</div>
				</div>
			</div>
		</section>
	);
}
