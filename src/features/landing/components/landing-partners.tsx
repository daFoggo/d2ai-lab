import { cn } from "@/lib/utils";

export interface ILandingPartner {
	id: string;
	name: string;
}

export interface ILandingPartnersProps {
	title?: string;
	description?: string;
	partners?: ILandingPartner[];
	className?: string;
}

/* Wordmark placeholders — thay bằng logo thật khi có brand assets. */
const PARTNERS: ILandingPartner[] = [
	{ id: "ptit", name: "PTIT" },
	{ id: "cnu", name: "CNU" },
	{ id: "uga", name: "UGA" },
];

export const LandingPartners = ({
	title = "Research partners",
	description = "We collaborate with world-class research labs and industry leaders to advance AI science and its real-world impact. Our partners appear on our publication covers and support our research portal.",
	partners = PARTNERS,
	className,
}: ILandingPartnersProps) => {
	return (
		<section
			data-slot="landing-partners"
			className={cn(
				"w-full overflow-hidden py-14 sm:py-20 lg:py-24",
				className,
			)}
		>
			<div className="w-full px-6 sm:px-10 md:px-14 lg:px-20 xl:px-24 2xl:px-32">
				<div className="flex flex-col gap-6">
					<div className="flex flex-col gap-2">
						<h2 className="font-title text-2xl font-normal tracking-tight text-foreground sm:text-3xl md:text-4xl">
							{title}
						</h2>
						{description && (
							<p className="max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
								{description}
							</p>
						)}
					</div>

					{/* Logo strip: dashed primary borders all around */}
					<div className="flex overflow-x-auto border border-dashed border-primary divide-x divide-dashed divide-primary">
						{partners.map((partner) => (
							<div
								key={partner.id}
								className="flex min-w-44 flex-1 items-center justify-center px-6 py-9"
							>
								<span className="text-lg font-semibold tracking-tight whitespace-nowrap text-primary select-none sm:text-xl">
									{partner.name}
								</span>
							</div>
						))}
					</div>
				</div>
			</div>
		</section>
	);
};
