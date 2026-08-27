import { cn } from "@/lib/utils";

export interface ILandingHeroStat {
	value: string;
	label: string;
}

export interface ILandingHeroStatsProps {
	stats: ILandingHeroStat[];
	className?: string;
}

export const LandingHeroStats = ({
	stats,
	className,
}: ILandingHeroStatsProps) => {
	return (
		<div
			data-slot="landing-hero-stats"
			className={cn("mt-14 sm:mt-18", className)}
		>
			<div className="grid grid-cols-2 overflow-hidden border border-dashed border-primary-foreground/20 sm:grid-cols-4">
				{stats.map((stat) => (
					<div
						key={stat.label}
						className="flex flex-col items-start justify-center gap-1.5 border-r border-b border-dashed border-primary-foreground/20 px-5 py-8 max-sm:[&:nth-child(2n)]:border-r-0 max-sm:[&:nth-last-child(-n+2)]:border-b-0 sm:[&:nth-child(4n)]:border-r-0 sm:[&:nth-child(n)]:border-b-0"
					>
						<span className="font-mono text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl">
							{stat.value}
						</span>
						<span className="font-mono text-xs font-medium tracking-wider text-primary-foreground/80 uppercase">
							{stat.label}
						</span>
					</div>
				))}
			</div>
		</div>
	);
};
