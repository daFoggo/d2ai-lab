import {
	IconChevronDown,
	IconSearch,
	IconSearchOff,
} from "@tabler/icons-react";
import { useState } from "react";
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
import { cn } from "@/lib/utils";
import type { TResearchGap, TResearchGapStatus } from "../schemas";

/* Fake data giả định — khi có backend sẽ thay bằng query thật. */
const FAKE_GAPS: TResearchGap[] = [
	{
		id: "gap-1",
		title: "Verifiable autonomous research via Chain-of-Evidence",
		description:
			"Autonomous agents hallucinate under pressure. We are building a framework where every scientific claim is traced back to auditable evidence, enabling trustworthy self-driving research pipelines.",
		status: "IN PROGRESS",
		area: "AI/ML FOUNDATIONS",
	},
	{
		id: "gap-2",
		title:
			"Empty shelves or lost keys? Recall as the bottleneck for parametric factuality",
		description:
			"Large models struggle to recall rare but critical facts. We investigate when parametric knowledge retrieval fails and how hybrid memory systems can close the gap.",
		status: "OPEN",
		area: "AI/ML FOUNDATIONS",
	},
	{
		id: "gap-3",
		title: "Expert-level audio-visual clinical consultations",
		description:
			"Advancing AMIE towards consultations that reason over both audio and visual clinical signals, moving from text-only dialogue to multimodal diagnostic support.",
		status: "IN PROGRESS",
		area: "RESPONSIBLE AI",
	},
	{
		id: "gap-4",
		title: "Real-time adaptive curriculum generation",
		description:
			"Cognitive diagnostics are static; curricula should be living. We are closing the loop between student state estimation and generative lesson planning in real time.",
		status: "OPEN",
		area: "SMART EDUCATION",
	},
	{
		id: "gap-5",
		title: "Privacy-preserving ambient sensing",
		description:
			"Ambient IoT produces rich telemetry but risks surveillance. We are designing on-device inference and differential privacy so intelligence never requires raw data offboarding.",
		status: "COLLABORATION",
		area: "AMBIENT IOT",
	},
	{
		id: "gap-6",
		title: "Ground-truth evaluation for public document intelligence",
		description:
			"Automated triage of civic documents needs rigorous benchmarks. We are building annotated corpora and human-in-the-loop evaluation for governance AI.",
		status: "OPEN",
		area: "PUBLIC GOVERNANCE",
	},
];

const STATUS_OPTIONS: TResearchGapStatus[] = [
	"OPEN",
	"IN PROGRESS",
	"COLLABORATION",
];

export interface IResearchGapsProps {
	eyebrow?: string;
	title: string;
	description?: string;
	gaps?: TResearchGap[];
	className?: string;
}

function GapRow({ gap }: { gap: TResearchGap }) {
	return (
		<li
			data-slot="research-gap-row"
			className="flex flex-col gap-3 border-t border-border py-6 sm:py-7"
		>
			<div className="flex flex-wrap items-center gap-3">
				<Badge variant="outline">{gap.status}</Badge>
				<span className="font-mono text-xs font-medium tracking-wider text-muted-foreground uppercase">
					{gap.area}
				</span>
			</div>

			<h3 className="font-title text-lg font-normal tracking-tight text-foreground sm:text-xl">
				{gap.title}
			</h3>
			<p className="max-w-3xl text-sm leading-relaxed text-muted-foreground">
				{gap.description}
			</p>
		</li>
	);
}

export function ResearchGaps({
	eyebrow = "Research gaps",
	title = "Open challenges we are tackling",
	description,
	gaps = FAKE_GAPS,
	className,
}: IResearchGapsProps) {
	const [q, setQ] = useState("");
	const [status, setStatus] = useState<TResearchGapStatus | undefined>();
	const [area, setArea] = useState<string | undefined>();

	const areas = [...new Set(gaps.map((g) => g.area))].sort();

	const filtered = gaps.filter((gap) => {
		if (status && gap.status !== status) return false;
		if (area && gap.area !== area) return false;
		if (q.trim()) {
			const needle = q.trim().toLowerCase();
			const haystack = `${gap.title} ${gap.description}`.toLowerCase();
			if (!haystack.includes(needle)) return false;
		}
		return true;
	});

	const hasFilters = Boolean(status || area || q.trim());

	const clearFilters = () => {
		setQ("");
		setStatus(undefined);
		setArea(undefined);
	};

	return (
		<section
			data-slot="research-gaps"
			className={cn("w-full pt-24 pb-16 sm:pt-28 sm:pb-20 lg:pt-32", className)}
		>
			<div className="w-full px-6 sm:px-10 md:px-14 lg:px-20 xl:px-24 2xl:px-32">
				<PageHeader eyebrow={eyebrow} title={title} description={description} />

				{/* Toolbar: search + filters */}
				<div className="mt-8 flex flex-col gap-3 sm:mt-10 lg:flex-row lg:items-center lg:justify-between">
					<InputGroup className="w-full lg:max-w-sm">
						<InputGroupInput
							placeholder="Search gaps…"
							aria-label="Search gaps"
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
								Status
								{status && (
									<span className="font-semibold text-foreground">
										{status}
									</span>
								)}
								<IconChevronDown
									data-icon="inline-end"
									className="size-3.5 text-muted-foreground"
								/>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end" className="w-44">
								<DropdownMenuItem
									className={cn(!status && "bg-accent text-accent-foreground")}
									onClick={() => setStatus(undefined)}
								>
									All statuses
								</DropdownMenuItem>
								{STATUS_OPTIONS.map((option) => (
									<DropdownMenuItem
										key={option}
										className={cn(
											status === option && "bg-accent text-accent-foreground",
										)}
										onClick={() => setStatus(option)}
									>
										{option}
									</DropdownMenuItem>
								))}
							</DropdownMenuContent>
						</DropdownMenu>

						<DropdownMenu>
							<DropdownMenuTrigger render={<Button variant="outline" />}>
								Area
								{area && (
									<span className="font-semibold text-foreground">{area}</span>
								)}
								<IconChevronDown
									data-icon="inline-end"
									className="size-3.5 text-muted-foreground"
								/>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end" className="w-56">
								<DropdownMenuItem
									className={cn(!area && "bg-accent text-accent-foreground")}
									onClick={() => setArea(undefined)}
								>
									All areas
								</DropdownMenuItem>
								{areas.map((option) => (
									<DropdownMenuItem
										key={option}
										className={cn(
											area === option && "bg-accent text-accent-foreground",
										)}
										onClick={() => setArea(option)}
									>
										{option}
									</DropdownMenuItem>
								))}
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
				</div>

				{/* Result count */}
				<div className="mt-5 flex items-center justify-between text-xs text-muted-foreground sm:text-sm">
					<span className="font-mono tracking-wider uppercase">
						{filtered.length} of {gaps.length} gap{gaps.length === 1 ? "" : "s"}
					</span>
					{hasFilters && (
						<Button variant="link" size="sm" onClick={clearFilters}>
							Clear filters
						</Button>
					)}
				</div>

				{/* List or empty state */}
				{filtered.length === 0 ? (
					<div className="flex flex-col items-center gap-2 py-16 text-center">
						<IconSearchOff className="size-12 text-muted-foreground/50" />
						<p className="text-lg font-medium">No gaps match your filters</p>
						<p className="text-sm text-muted-foreground">
							Try a different search term or clear the active filters.
						</p>
						<Button variant="outline" className="mt-2" onClick={clearFilters}>
							Clear filters
						</Button>
					</div>
				) : (
					<ul className="mt-4 border-b border-border">
						{filtered.map((gap) => (
							<GapRow key={gap.id} gap={gap} />
						))}
					</ul>
				)}
			</div>
		</section>
	);
}
