import { IconBrandX, IconShare2 } from "@tabler/icons-react";
import { Breadcrumb } from "@/components/common/breadcrumb";
import { ProseBody, ProseParagraph } from "@/components/common/prose-body";
import { StickyRightRail } from "@/components/common/sticky-right-rail";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { TPublicationDetail } from "../schemas";

export interface IPublicationDetailProps {
	publication: TPublicationDetail;
	locale: string;
	className?: string;
}

export const PublicationDetail = ({
	publication,
	locale,
	className,
}: IPublicationDetailProps) => {
	const breadcrumbItems = [
		{ label: "Home", to: "/{-$locale}", params: { locale } },
		{
			label: "Publications",
			to: "/{-$locale}/publications",
			params: { locale },
		},
		{ label: publication.title },
	];

	return (
		<section
			data-slot="publication-detail"
			className={cn("w-full pt-24 pb-16 sm:pt-28 sm:pb-20 lg:pt-32", className)}
		>
			<div className="w-full px-6 sm:px-10 md:px-14 lg:px-20 xl:px-24 2xl:px-32">
				{/* Breadcrumb */}
				<Breadcrumb items={breadcrumbItems} />

				<div className="mt-10 grid grid-cols-1 gap-12 lg:grid-cols-12">
					{/* Main column */}
					<div className="flex flex-col gap-8 lg:col-span-9">
						{/* Header */}
						<header
							data-slot="publication-detail-header"
							className="flex flex-col gap-4"
						>
							<div className="flex flex-wrap items-center gap-2">
								<span className="font-mono text-xs font-medium tracking-wider text-muted-foreground uppercase">
									{publication.venue}
								</span>
								<span className="font-mono text-xs text-muted-foreground/60 uppercase">
									{publication.year}
								</span>
							</div>
							<h1 className="font-title text-3xl font-normal tracking-tight text-foreground text-balance sm:text-4xl md:text-5xl">
								{publication.title}
							</h1>
							<p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
								{publication.authors.join(", ")}
							</p>
							{publication.tags && publication.tags.length > 0 && (
								<div className="flex flex-wrap gap-2">
									{publication.tags.map((tag) => (
										<Badge key={tag} variant="outline">
											{tag}
										</Badge>
									))}
								</div>
							)}
						</header>

						{/* Abstract band */}
						<div
							data-slot="publication-abstract"
							className="rounded-2xl border border-border bg-muted/40 p-5 sm:p-6"
						>
							<span className="font-mono text-xs font-semibold tracking-wider text-muted-foreground uppercase">
								Abstract
							</span>
							<p className="mt-2 max-w-3xl text-sm leading-relaxed text-foreground sm:text-base">
								{publication.abstract}
							</p>
						</div>

						{/* Prose highlights */}
						{publication.highlights && publication.highlights.length > 0 && (
							<ProseBody
								sections={[
									{
										eyebrow: "Highlights",
										content: (
											<div className="flex flex-col gap-4">
												{publication.highlights.map((item) => (
													<ProseParagraph key={item}>{item}</ProseParagraph>
												))}
											</div>
										),
									},
								]}
							/>
						)}
					</div>

					{/* Right rail */}
					<div className="lg:col-span-3">
						<StickyRightRail
							title="Quick links"
							className="sticky top-24"
							links={publication.links ?? []}
						>
							<div className="flex items-center gap-1.5 border-t border-border py-2.5 text-sm">
								<IconBrandX className="size-4 text-muted-foreground" />
								<span className="font-medium text-foreground">Share</span>
								<IconShare2 className="ml-auto size-4 text-muted-foreground" />
							</div>
						</StickyRightRail>
					</div>
				</div>
			</div>
		</section>
	);
};
