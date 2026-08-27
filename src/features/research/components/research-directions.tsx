import { PageHeader } from "@/components/common/page-header";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { TResearchDirection } from "../schemas";

export interface IResearchDirectionsProps {
	eyebrow?: string;
	title: string;
	description?: string;
	directions: TResearchDirection[];
	className?: string;
}

const DirectionSection = ({
	direction,
	className,
}: {
	direction: TResearchDirection;
	className?: string;
}) => {
	return (
		<article
			data-slot="research-direction-section"
			className={cn(
				"grid grid-cols-1 gap-4 border-t border-border py-8 sm:grid-cols-12 sm:gap-8 sm:py-10",
				className,
			)}
		>
			<span className="font-mono text-sm text-muted-foreground sm:col-span-2 sm:pt-1.5">
				{direction.index}
			</span>

			<div className="flex flex-col gap-3 sm:col-span-10">
				<h3 className="font-title text-2xl font-normal tracking-tight text-foreground sm:text-3xl">
					{direction.title}
				</h3>
				<p className="max-w-3xl text-sm leading-relaxed text-muted-foreground sm:text-base">
					{direction.description}
				</p>

				<div className="mt-2 flex flex-wrap gap-2">
					{direction.focus.map((item) => (
						<Badge key={item} variant="outline">
							{item}
						</Badge>
					))}
				</div>
			</div>
		</article>
	);
};

export const ResearchDirections = ({
	eyebrow = "Research directions",
	title = "Long-term vision and strategy",
	description,
	directions,
	className,
}: IResearchDirectionsProps) => {
	return (
		<section
			data-slot="research-directions"
			className={cn("w-full pt-24 pb-16 sm:pt-28 sm:pb-20 lg:pt-32", className)}
		>
			<div className="w-full px-6 sm:px-10 md:px-14 lg:px-20 xl:px-24 2xl:px-32">
				<PageHeader eyebrow={eyebrow} title={title} description={description} />

				<div className="mt-8 sm:mt-10">
					{directions.map((direction) => (
						<DirectionSection key={direction.id} direction={direction} />
					))}
				</div>
			</div>
		</section>
	);
};
