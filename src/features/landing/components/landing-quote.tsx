import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { type ComponentProps, type ReactNode, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

if (typeof window !== "undefined") {
	gsap.registerPlugin(ScrollTrigger);
}

export interface ILandingQuoteRootProps extends ComponentProps<"section"> {
	children: ReactNode;
	className?: string;
}

export function LandingQuoteRoot({
	children,
	className,
	...props
}: ILandingQuoteRootProps) {
	return (
		<section
			data-slot="landing-quote"
			className={cn("w-full overflow-hidden py-8 sm:py-12 lg:py-16", className)}
			{...props}
		>
			<div className="w-full px-6 sm:px-10 md:px-14 lg:px-20 xl:px-24 2xl:px-32">
				{children}
			</div>
		</section>
	);
}

export interface ILandingQuoteCardProps extends ComponentProps<"div"> {
	quote: string;
	authorName: string;
	authorRole: string;
	authorAvatar?: string;
	bgImageSrc?: string;
	className?: string;
}

export function LandingQuoteCard({
	quote,
	authorName,
	authorRole,
	authorAvatar,
	bgImageSrc = "https://storage.googleapis.com/gweb-research2023-media/images/scroller-bg-2.width-1920.png",
	className,
	...props
}: ILandingQuoteCardProps) {
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

			// Kinetic scroll-triggered text lighting: words light up once and stay bright permanently
			const wordElements = quoteRef.current.querySelectorAll(".quote-word");

			gsap.to(wordElements, {
				scrollTrigger: {
					trigger: cardRef.current,
					start: "top 70%",
					toggleActions: "play none none none",
					once: true,
				},
				color: "#ffffff",
				opacity: 1,
				stagger: 0.03,
				duration: 0.75,
				ease: "power2.out",
			});
		},
		{ scope: cardRef },
	);

	return (
		<div
			ref={cardRef}
			data-slot="landing-quote-card"
			className={cn(
				"relative flex min-h-[480px] w-full flex-col justify-between overflow-hidden rounded-3xl p-8 shadow-sm sm:min-h-[540px] sm:p-12 md:p-16 lg:min-h-[600px] lg:p-20",
				className,
			)}
			{...props}
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
			<div className="pointer-events-none absolute inset-0 bg-black/45 backdrop-blur-[1px]" />
			<div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-black/60" />

			{/* Quotation Content with Interactive Scroll Scrubbing */}
			<div className="relative z-10 max-w-4xl">
				<blockquote
					ref={quoteRef}
					className="font-title text-xl leading-snug font-normal tracking-tight text-white/30 sm:text-2xl md:text-3xl lg:text-4xl"
				>
					<span className="quote-word mr-[0.25em] inline-block">“</span>
					{wordTokens.map((token) => (
						<span
							key={token.id}
							className="quote-word mr-[0.25em] inline-block"
						>
							{token.text}
						</span>
					))}
					<span className="quote-word inline-block">”</span>
				</blockquote>
			</div>

			{/* Author Row with shadcn Avatar */}
			<div className="relative z-10 mt-8 flex items-center gap-3.5 sm:mt-12">
				<Avatar className="size-11 sm:size-13">
					{authorAvatar && <AvatarImage src={authorAvatar} alt={authorName} />}
					<AvatarFallback>{authorName.charAt(0)}</AvatarFallback>
				</Avatar>

				<div className="flex flex-col">
					<span className="text-sm font-semibold text-white drop-shadow-sm sm:text-base">
						{authorName}
					</span>
					<span className="text-xs text-zinc-300 drop-shadow-sm sm:text-sm">
						{authorRole}
					</span>
				</div>
			</div>
		</div>
	);
}

export interface ILandingQuotePresetProps {
	quote?: string;
	authorName?: string;
	authorRole?: string;
	authorAvatar?: string;
	bgImageSrc?: string;
	className?: string;
}

export function LandingQuotePreset({
	quote = "The magic cycle of research is accelerating. Research breakthroughs are leading to greater impact on products, science, and society—with greater opportunities for AI to amplify human ingenuity and capacity.",
	authorName = "Huynh Phan Ly",
	authorRole = "Director, D2AI Lab & Faculty of Information Technology",
	authorAvatar,
	bgImageSrc = "https://storage.googleapis.com/gweb-research2023-media/images/scroller-bg-2.width-1920.png",
	className,
}: ILandingQuotePresetProps) {
	return (
		<LandingQuoteRoot className={className}>
			<LandingQuoteCard
				quote={quote}
				authorName={authorName}
				authorRole={authorRole}
				authorAvatar={authorAvatar}
				bgImageSrc={bgImageSrc}
			/>
		</LandingQuoteRoot>
	);
}

export const LandingQuote = Object.assign(LandingQuotePreset, {
	Root: LandingQuoteRoot,
	Card: LandingQuoteCard,
	Preset: LandingQuotePreset,
});
