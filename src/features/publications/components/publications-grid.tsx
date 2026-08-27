import { IconChevronDown, IconSearch } from "@tabler/icons-react";
import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { CornerFrame } from "@/components/common/corner-frame";
import { PageHeader } from "@/components/common/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupButton,
	InputGroupInput,
} from "@/components/ui/input-group";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import type { TPublication } from "../schemas";

export interface IPublicationsProps {
	eyebrow?: string;
	title: string;
	description?: string;
	publications: TPublication[];
	className?: string;
}

const PublicationCard = ({
	publication,
	featured = false,
}: {
	publication: TPublication;
	featured?: boolean;
}) => {
	const { locale } = useI18n();

	return (
		<article
			data-slot="publication-card"
			className={cn(
				"group flex flex-col gap-3 rounded-2xl border border-border bg-card p-5 transition-colors hover:border-border/60 hover:bg-muted/30 sm:p-6",
				featured && "lg:p-8",
			)}
		>
			<div className="flex flex-wrap items-center gap-2">
				<span className="font-mono text-xs font-medium tracking-wider text-muted-foreground uppercase">
					{publication.venue}
				</span>
				<span className="font-mono text-xs text-muted-foreground/60 uppercase">
					{publication.year}
				</span>
			</div>

			<h3
				className={cn(
					"font-title font-normal tracking-tight text-foreground",
					featured ? "text-xl sm:text-2xl lg:text-3xl" : "text-lg sm:text-xl",
				)}
			>
				<Link
					to="/{-$locale}/publications/$id"
					params={{ locale, id: publication.id }}
					className="transition-colors group-hover:text-foreground/80 focus:outline-hidden"
				>
					{publication.title}
				</Link>
			</h3>

			<p className="text-xs leading-relaxed text-muted-foreground sm:text-sm">
				{publication.authors.join(", ")}
			</p>

			{publication.tags && publication.tags.length > 0 && (
				<div className="mt-auto flex flex-wrap gap-2 pt-1">
					{publication.tags.map((tag) => (
						<Badge key={tag} variant="outline">
							{tag}
						</Badge>
					))}
				</div>
			)}
		</article>
	);
};

export const Publications = ({
	eyebrow = "Publications",
	title = "The latest research from the lab",
	description,
	publications,
	className,
}: IPublicationsProps) => {
	const [q, setQ] = useState("");
	const [year, setYear] = useState<number | undefined>();

	const years = [...new Set(publications.map((p) => p.year))].sort(
		(a, b) => b - a,
	);

	const filtered = publications.filter((p) => {
		if (year && p.year !== year) return false;
		if (q.trim()) {
			const needle = q.trim().toLowerCase();
			const haystack =
				`${p.title} ${p.authors.join(" ")} ${p.venue}`.toLowerCase();
			if (!haystack.includes(needle)) return false;
		}
		return true;
	});

	const hasFilters = Boolean(year || q.trim());

	const clearFilters = () => {
		setQ("");
		setYear(undefined);
	};

	const featured = filtered.at(0);
	const rest = filtered.slice(1);

	return (
		<section
			data-slot="publications"
			className={cn("w-full pt-24 pb-16 sm:pt-28 sm:pb-20 lg:pt-32", className)}
		>
			<div className="w-full px-6 sm:px-10 md:px-14 lg:px-20 xl:px-24 2xl:px-32">
				<PageHeader eyebrow={eyebrow} title={title} description={description} />

				{/* Filter bar */}
				<div className="mt-8 flex flex-col gap-3 sm:mt-10 lg:flex-row lg:items-center lg:justify-between">
					<InputGroup className="w-full lg:max-w-sm">
						<InputGroupInput
							placeholder="Search publications…"
							aria-label="Search publications"
							value={q}
							onChange={(e) => setQ(e.target.value)}
						/>
						<InputGroupAddon align="inline-end">
							<InputGroupButton size="icon-sm" aria-label="Search">
								<IconSearch />
							</InputGroupButton>
						</InputGroupAddon>
					</InputGroup>

					<div className="flex flex-wrap items-center gap-2">
						<DropdownMenu>
							<DropdownMenuTrigger render={<Button variant="outline" />}>
								Year
								{year && (
									<span className="font-semibold text-foreground">{year}</span>
								)}
								<IconChevronDown
									data-icon="inline-end"
									className="size-3.5 text-muted-foreground"
								/>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end" className="w-36">
								<DropdownMenuItem
									className={cn(!year && "bg-accent text-accent-foreground")}
									onClick={() => setYear(undefined)}
								>
									All years
								</DropdownMenuItem>
								{years.map((option) => (
									<DropdownMenuItem
										key={option}
										className={cn(
											year === option && "bg-accent text-accent-foreground",
										)}
										onClick={() => setYear(option)}
									>
										{option}
									</DropdownMenuItem>
								))}
							</DropdownMenuContent>
						</DropdownMenu>

						{hasFilters && (
							<Button variant="link" size="sm" onClick={clearFilters}>
								Clear filters
							</Button>
						)}
					</div>
				</div>

				{/* Featured + grid */}
				{featured && (
					<div className="mt-8 sm:mt-10">
						<CornerFrame>
							<PublicationCard publication={featured} featured />
						</CornerFrame>
					</div>
				)}

				{rest.length > 0 && (
					<div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
						{rest.map((publication) => (
							<PublicationCard key={publication.id} publication={publication} />
						))}
					</div>
				)}

				{!featured && (
					<div className="mt-8 flex flex-col items-center gap-2 py-16 text-center">
						<p className="text-lg font-medium">
							No publications match your filters
						</p>
						<p className="text-sm text-muted-foreground">
							Try a different search term or clear the active filters.
						</p>
						{hasFilters && (
							<Button variant="outline" className="mt-2" onClick={clearFilters}>
								Clear filters
							</Button>
						)}
					</div>
				)}
			</div>
		</section>
	);
};
