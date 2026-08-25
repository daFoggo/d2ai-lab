import { AspectRatio } from "@/components/ui/aspect-ratio";
import { cn } from "@/lib/utils";
import { HERO_SCOPE_STYLE } from "../constants";

export interface ILandingFilmProps {
	title?: string;
	description?: string;
	brandText?: string;
	thumbnailSrc?: string;
	className?: string;
}

export function LandingFilm({
	title = "Amplifying human ingenuity",
	description = "As we realize new possibilities with AI, we maintain a human-centered approach. We advance scientific progress by publishing impactful research each year and collaborating with universities, NGOs, partners, and communities worldwide.",
	brandText = "D2AI Lab",
	thumbnailSrc,
	className,
}: ILandingFilmProps) {
	return (
		<section
			data-slot="landing-film"
			className={cn(
				"w-full overflow-hidden py-14 sm:py-20 lg:py-24",
				className,
			)}
		>
			<div className="w-full px-6 sm:px-10 md:px-14 lg:px-20 xl:px-24 2xl:px-32">
				<div className="grid grid-cols-1 items-center gap-8 sm:gap-12 lg:grid-cols-2 lg:gap-16">
					<div
						data-slot="landing-film-content"
						className="flex flex-col justify-center"
					>
						<h2 className="font-title text-2xl leading-tight font-normal tracking-tight text-foreground sm:text-3xl md:text-4xl">
							{title}
						</h2>
						<p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:mt-5 sm:text-base md:max-w-xl">
							{description}
						</p>
					</div>

					<div
						data-slot="landing-film-video"
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
								<div
									style={HERO_SCOPE_STYLE}
									className="flex h-full w-full items-center justify-center bg-background p-8"
								>
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
}
