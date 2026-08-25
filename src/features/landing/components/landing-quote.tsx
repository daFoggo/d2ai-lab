import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { HERO_SCOPE_STYLE } from "../constants";

if (typeof window !== "undefined") {
	gsap.registerPlugin(ScrollTrigger);
}

export interface ILandingQuoteProps {
	quote?: string;
	authorName?: string;
	authorRole?: string;
	authorAvatar?: string;
	bgImageSrc?: string;
	className?: string;
}

export function LandingQuote({
	quote = "The magic cycle of research is accelerating. Research breakthroughs are leading to greater impact on products, science, and society—with greater opportunities for AI to amplify human ingenuity and capacity.",
	authorName = "Huynh Phan Ly",
	authorRole = "Director, D2AI Lab & Faculty of Information Technology",
	authorAvatar,
	bgImageSrc = "https://storage.googleapis.com/gweb-research2023-media/images/scroller-bg-2.width-1920.png",
	className,
}: ILandingQuoteProps) {
	const cardRef = useRef<HTMLDivElement>(null);
	const quoteRef = useRef<HTMLQuoteElement>(null);

	const wordTokens = quote.split(" ").map((text, i) => ({
		id: `q-word-${i}`,
		text,
	}));

	useGSAP(
		() => {
			if (!cardRef.current || !quoteRef.current) return;
			if (typeof window === "undefined") return;

			const wordElements = quoteRef.current.querySelectorAll(".quote-word");

			// Faster & more responsive scroll scrub: finishes completely while card is in main view
			gsap.fromTo(
				wordElements,
				{
					color: "rgba(255, 255, 255, 0.25)",
					opacity: 0.25,
				},
				{
					color: "rgba(255, 255, 255, 1)",
					opacity: 1,
					stagger: 0.04,
					ease: "none",
					scrollTrigger: {
						trigger: cardRef.current,
						start: "top 75%",
						end: "center 45%",
						scrub: 0.4,
					},
				},
			);
		},
		{ scope: cardRef },
	);

	return (
		<section
			data-slot="landing-quote"
			className={cn("w-full overflow-hidden py-8 sm:py-12 lg:py-16", className)}
		>
			<div className="w-full px-6 sm:px-10 md:px-14 lg:px-20 xl:px-24 2xl:px-32">
				<div
					ref={cardRef}
					data-slot="landing-quote-card"
					style={HERO_SCOPE_STYLE}
					className="relative flex min-h-120 w-full flex-col justify-between overflow-hidden rounded-3xl p-8 shadow-sm sm:min-h-135 sm:p-12 md:p-16 lg:min-h-150 lg:p-20"
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
					<div className="pointer-events-none absolute inset-0 bg-background/45 backdrop-blur-xs" />
					<div className="pointer-events-none absolute inset-0 bg-linear-to-t from-background/80 via-background/20 to-background/60" />

					{/* Quotation Content with Interactive Scroll Scrubbing */}
					<div className="relative z-10 max-w-4xl">
						<blockquote
							ref={quoteRef}
							className="font-title text-xl leading-snug font-normal tracking-tight text-foreground/30 sm:text-2xl md:text-3xl lg:text-4xl"
						>
							<span className="quote-word mr-1 inline-block">“</span>
							{wordTokens.map((token) => (
								<span key={token.id} className="quote-word mr-1 inline-block">
									{token.text}
								</span>
							))}
							<span className="quote-word inline-block">”</span>
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
							<span className="text-sm font-semibold text-foreground drop-shadow-sm sm:text-base">
								{authorName}
							</span>
							<span className="text-xs text-muted-foreground drop-shadow-sm sm:text-sm">
								{authorRole}
							</span>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
