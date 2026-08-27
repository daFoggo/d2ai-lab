import { IconArrowUpRight } from "@tabler/icons-react";
import { PageHeader } from "@/components/common/page-header";
import { cn } from "@/lib/utils";
import type { TResearchArea } from "../schemas";

export interface IResearchAreasProps {
	eyebrow?: string;
	title: string;
	description?: string;
	areas: TResearchArea[];
	className?: string;
}

const AreaCard = ({
	area,
	className,
}: {
	area: TResearchArea;
	className?: string;
}) => {
	return (
		<article
			data-slot="research-area-card"
			className={cn(
				"group flex flex-col gap-3 rounded-2xl border border-border bg-card p-5 transition-colors hover:border-border/60 hover:bg-muted/30 sm:p-6",
				className,
			)}
		>
			<span className="font-mono text-xs font-medium tracking-wider text-muted-foreground uppercase">
				{area.tag}
			</span>
			<h3 className="font-title text-xl font-normal tracking-tight text-foreground sm:text-2xl">
				{area.title}
			</h3>
			<p className="text-xs leading-relaxed text-muted-foreground sm:text-sm">
				{area.description}
			</p>
			<div className="mt-auto flex items-center gap-1.5 pt-2 font-medium text-foreground">
				<span className="text-xs transition-colors group-hover:text-foreground/80 sm:text-sm">
					Learn more
				</span>
				<IconArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
			</div>
		</article>
	);
};

export const ResearchAreas = ({
	eyebrow = "Research areas",
	title = "Areas of scientific focus",
	description,
	areas,
	className,
}: IResearchAreasProps) => {
	return (
		<section
			data-slot="research-areas"
			className={cn("w-full pt-24 pb-16 sm:pt-28 sm:pb-20 lg:pt-32", className)}
		>
			<div className="w-full px-6 sm:px-10 md:px-14 lg:px-20 xl:px-24 2xl:px-32">
				<PageHeader eyebrow={eyebrow} title={title} description={description} />

				<div className="mt-12 grid grid-cols-1 gap-4 sm:mt-16 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
					{areas.map((area) => (
						<AreaCard key={area.id} area={area} />
					))}
				</div>
			</div>
		</section>
	);
};
