import type { ReactNode } from "react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { cn } from "@/lib/utils";

export interface ILandingMissionProps {
	title?: string;
	description?: string;
	brandText?: string;
	thumbnailSrc?: string;
	cta?: ReactNode;
	className?: string;
}

export const LandingMission = ({
	title,
	description,
	brandText,
	thumbnailSrc,
	cta,
	className,
}: ILandingMissionProps) => {
	return (
		<section
			data-slot="landing-mission"
			className={cn(
				"w-full overflow-hidden py-14 sm:py-20 lg:py-24",
				className,
			)}
		>
			<div className="w-full px-6 sm:px-10 md:px-14 lg:px-20 xl:px-24 2xl:px-32">
				<div className="grid grid-cols-1 items-center gap-8 sm:gap-12 lg:grid-cols-2 lg:gap-16">
					<div
						data-slot="landing-mission-content"
						className="flex flex-col justify-center"
					>
						<h2 className="font-title text-2xl leading-tight font-normal tracking-tight text-foreground sm:text-3xl md:text-4xl">
							{title}
						</h2>
						<p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:mt-5 sm:text-base md:max-w-xl">
							{description}
						</p>
						{cta && <div className="mt-5 sm:mt-6">{cta}</div>}
					</div>

					<div
						data-slot="landing-mission-video"
						className="w-full overflow-hidden rounded-2xl shadow-xs sm:rounded-3xl"
					>
						<AspectRatio ratio={16 / 9}>
							{thumbnailSrc ? (
								<img
									src={thumbnailSrc}
									alt={brandText}
									className="h-full w-full object-cover"
								/>
							) : (
								<div className="flex h-full w-full items-center justify-center bg-muted/50 p-8">
									<span className="font-title text-2xl font-normal text-muted-foreground select-none sm:text-3xl md:text-4xl">
										{brandText}
									</span>
								</div>
							)}
						</AspectRatio>
					</div>
				</div>
			</div>
		</section>
	);
};
