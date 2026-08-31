import { IconArrowUpRight } from "@tabler/icons-react";
import { PageHeader } from "@/components/common/page-header";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import type { TProject } from "@/features/projects";
import { cn } from "@/lib/utils";

export interface IProjectsProps {
	eyebrow?: string;
	title: string;
	description?: string;
	featured?: TProject;
	projects: TProject[];
	className?: string;
}

const FeaturedProject = ({ project }: { project: TProject }) => {
	return (
		<div className="mt-8 grid grid-cols-1 items-center gap-6 sm:mt-10 sm:gap-8 md:grid-cols-12 lg:gap-12">
			<div className="corner-frame md:col-span-5">
				<div className="w-full overflow-hidden rounded-2xl shadow-xs sm:rounded-3xl">
					<AspectRatio ratio={16 / 10}>
						{project.thumbnail ? (
							<img
								src={project.thumbnail}
								alt={project.title}
								loading="eager"
								decoding="async"
								className="h-full w-full object-cover"
							/>
						) : (
							<div className="flex h-full w-full items-center justify-center bg-muted p-5">
								<span className="font-mono text-xs tracking-wider text-muted-foreground/60 uppercase">
									{project.category}
								</span>
							</div>
						)}
					</AspectRatio>
				</div>
			</div>

			<div className="flex flex-col justify-center md:col-span-7 md:pl-2">
				<span className="font-mono text-xs font-medium tracking-wider text-muted-foreground uppercase">
					{project.category}
				</span>
				<h3 className="mt-1.5 font-title text-2xl font-normal tracking-tight text-foreground sm:text-3xl">
					{project.title}
				</h3>
				<p className="mt-2 text-sm leading-relaxed text-muted-foreground">
					{project.description}
				</p>
				<div className="mt-4 sm:mt-6">
					<Button
						render={
							// biome-ignore lint/a11y/useAnchorContent: Base UI Button passes text content to render prop slot
							<a
								href={project.href || "#"}
								target={project.href?.startsWith("http") ? "_blank" : undefined}
								rel={
									project.href?.startsWith("http") ? "noreferrer" : undefined
								}
							/>
						}
						nativeButton={false}
					>
						Explore project
						<IconArrowUpRight data-icon="inline-end" />
					</Button>
				</div>
			</div>
		</div>
	);
};

const ProjectItem = ({ project }: { project: TProject }) => {
	return (
		<article className="group flex flex-col gap-3 rounded-2xl border border-border bg-card p-5 transition-colors hover:border-border/60 hover:bg-muted/30 sm:p-6">
			<span className="font-mono text-xs font-medium tracking-wider text-muted-foreground uppercase">
				{project.category}
			</span>
			<h3 className="font-title text-lg font-normal tracking-tight text-foreground sm:text-xl">
				{project.title}
			</h3>
			<p className="text-xs leading-relaxed text-muted-foreground sm:text-sm">
				{project.description}
			</p>
			<div className="mt-auto pt-2">
				{/* biome-ignore lint/a11y/noAmbiguousAnchorText: Context is provided by the surrounding article card */}
				<a
					href={project.href || "#"}
					target={project.href?.startsWith("http") ? "_blank" : undefined}
					rel={project.href?.startsWith("http") ? "noreferrer" : undefined}
					className="inline-flex items-center gap-1.5 text-xs font-medium text-primary transition-colors hover:text-primary/80 sm:text-sm"
				>
					<span>Learn more</span>
					<IconArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
				</a>
			</div>
		</article>
	);
};

export const Projects = ({
	eyebrow = "Projects",
	title = "Applied platforms & initiatives",
	description,
	featured,
	projects,
	className,
}: IProjectsProps) => {
	return (
		<section
			className={cn("w-full pt-24 pb-16 sm:pt-28 sm:pb-20 lg:pt-32", className)}
		>
			<div className="w-full px-6 sm:px-10 md:px-14 lg:px-20 xl:px-24 2xl:px-32">
				<PageHeader eyebrow={eyebrow} title={title} description={description} />

				{featured && <FeaturedProject project={featured} />}

				<div className="mt-6 grid grid-cols-1 gap-4 sm:mt-8 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
					{projects.map((project) => (
						<ProjectItem key={project.id} project={project} />
					))}
				</div>
			</div>
		</section>
	);
};
