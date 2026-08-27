import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

export interface ILandingQuoteProps {
	quote?: string;
	authorName?: string;
	authorRole?: string;
	authorAvatar?: string;
	bgImageSrc?: string;
	className?: string;
}

export const LandingQuote = ({
	quote = "The magic cycle of research is accelerating. Research breakthroughs are leading to greater impact on products, science, and society—with greater opportunities for AI to amplify human ingenuity and capacity.",
	authorName = "Huynh Phan Ly",
	authorRole = "Director, D2AI Lab & Faculty of Information Technology",
	authorAvatar,
	bgImageSrc = "https://storage.googleapis.com/gweb-research2023-media/images/scroller-bg-2.width-1920.png",
	className,
}: ILandingQuoteProps) => {
	const wordTokens = quote.split(" ").map((text, i) => ({
		id: `q-word-${i}`,
		text,
	}));

	return (
		<section
			data-slot="landing-quote"
			className={cn(
				"w-full overflow-hidden py-12 sm:py-16 lg:py-20",
				className,
			)}
		>
			<div className="w-full px-6 sm:px-10 md:px-14 lg:px-20 xl:px-24 2xl:px-32">
				<div
					data-slot="landing-quote-card"
					className="relative flex min-h-120 w-full flex-col justify-between overflow-hidden rounded-3xl bg-primary p-8 text-primary-foreground shadow-sm sm:min-h-135 sm:p-12 md:p-16 lg:min-h-150 lg:p-20"
				>
					{/* High-Resolution Dynamic Background Image */}
					<picture className="absolute inset-0 h-full w-full">
						<source media="(min-width: 768px)" srcSet={bgImageSrc} />
						<img
							src={bgImageSrc}
							alt="Research Background"
							className="h-full w-full object-cover"
						/>
					</picture>

					{/* Contrast Overlays */}
					<div className="pointer-events-none absolute inset-0 bg-primary/45 backdrop-blur-xs" />
					<div className="pointer-events-none absolute inset-0 bg-linear-to-t from-primary/80 via-primary/20 to-primary/60" />

					{/* Quotation Content */}
					<div className="relative z-10 max-w-4xl">
						<blockquote className="font-title text-xl leading-snug font-normal tracking-tight text-primary-foreground sm:text-2xl md:text-3xl lg:text-4xl">
							<span className="mr-1 inline-block">“</span>
							{wordTokens.map((token) => (
								<span key={token.id} className="mr-1 inline-block">
									{token.text}
								</span>
							))}
							<span className="inline-block">”</span>
						</blockquote>
					</div>

					{/* Author Row with shadcn Avatar */}
					<div
						data-slot="landing-quote-author"
						className="relative z-10 mt-8 flex items-center gap-3.5 sm:mt-12"
					>
						<Avatar className="size-11 sm:size-13">
							{authorAvatar && (
								<AvatarImage src={authorAvatar} alt={authorName} />
							)}
							<AvatarFallback>{authorName.charAt(0)}</AvatarFallback>
						</Avatar>

						<div className="flex flex-col">
							<span className="text-sm font-semibold text-primary-foreground drop-shadow-sm sm:text-base">
								{authorName}
							</span>
							<span className="text-xs text-primary-foreground/80 drop-shadow-sm sm:text-sm">
								{authorRole}
							</span>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};
