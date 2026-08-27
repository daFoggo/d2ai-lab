import {
	IconBrandLinkedin,
	IconBrandX,
	IconCalendarPlus,
	IconRobot,
	IconUsers,
} from "@tabler/icons-react";
import { useState } from "react";
import { toast } from "sonner";
import { Breadcrumb } from "@/components/common/breadcrumb";
import { StickyRightRail } from "@/components/common/sticky-right-rail";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { HERO_SCOPE_STYLE } from "@/lib/brand-scope";
import { cn } from "@/lib/utils";
import type {
	TSeminarDetail,
	TSeminarSpeaker,
	TSeminarStatus,
} from "../schemas";

const STATUS_VARIANT: Record<
	TSeminarStatus,
	"default" | "secondary" | "outline"
> = {
	UPCOMING: "default",
	PAST: "outline",
};

function SpeakerSocialIcon({ type }: { type: "x" | "linkedin" }) {
	const Icon = type === "linkedin" ? IconBrandLinkedin : IconBrandX;
	return <Icon className="size-4" />;
}

function SpeakerPortrait({ speaker }: { speaker: TSeminarSpeaker }) {
	const initials = speaker.name
		.split(/\s+/)
		.map((part) => part.charAt(0))
		.slice(0, 2)
		.join("")
		.toUpperCase();

	return (
		<div className="flex h-full w-full flex-col items-center justify-center gap-4 bg-background p-6 text-center">
			{speaker.photo ? (
				<img
					src={speaker.photo}
					alt={speaker.name}
					className="h-full w-full object-cover"
				/>
			) : (
				<>
					<IconRobot className="size-12 text-foreground/25" />
					<span className="font-title text-6xl font-normal tracking-tight text-foreground/15">
						{initials}
					</span>
					<span className="font-mono text-xs tracking-wider text-muted-foreground/50 uppercase">
						{speaker.name}
					</span>
				</>
			)}
		</div>
	);
}

export interface ISeminarSpeakersProps {
	title?: string;
	speakers: TSeminarSpeaker[];
	className?: string;
}

export function SeminarSpeakers({
	title = "Featured speakers",
	speakers,
	className,
}: ISeminarSpeakersProps) {
	const [activeId, setActiveId] = useState(speakers[0]?.id ?? "");
	const active =
		speakers.find((speaker) => speaker.id === activeId) ?? speakers[0];

	return (
		<div
			data-slot="seminar-speakers"
			className={cn("flex flex-col gap-6", className)}
		>
			<h2 className="font-title text-2xl font-normal tracking-tight text-foreground sm:text-3xl md:text-4xl">
				{title}
			</h2>

			{/* Base layout: list shares a fixed frame height; photo panel fills it */}
			<div
				style={HERO_SCOPE_STYLE}
				className="overflow-hidden rounded-3xl border border-border bg-background text-foreground lg:flex lg:h-135 lg:items-stretch"
			>
				{/* Left: speaker list */}
				<ul className="flex min-w-0 flex-col lg:flex-1">
					{speakers.map((speaker) => {
						const isActive = speaker.id === active.id;
						const socialLinks =
							speaker.socials?.filter((social) => social.href) ?? [];

						return (
							<li
								key={speaker.id}
								className={cn(
									"flex flex-1 items-center justify-between gap-4 border-b border-border px-6 py-5 transition-colors last:border-b-0 sm:px-8",
									isActive ? "bg-muted/40" : "bg-transparent",
								)}
							>
								<button
									type="button"
									onMouseEnter={() => setActiveId(speaker.id)}
									onFocus={() => setActiveId(speaker.id)}
									aria-pressed={isActive}
									className="flex min-w-0 flex-1 flex-col gap-1.5 text-left outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
								>
									<span
										className={cn(
											"truncate font-mono text-sm font-medium tracking-wide text-foreground uppercase transition-opacity sm:text-base",
											!isActive && "opacity-40",
										)}
									>
										{speaker.name}
									</span>
									<span className="font-mono text-xs uppercase leading-none text-muted-foreground sm:text-sm">
										{speaker.role}
									</span>
								</button>

								{socialLinks.length > 0 && (
									<span
										className={cn(
											"flex shrink-0 items-center gap-2 transition-opacity",
											isActive ? "opacity-100" : "opacity-30",
										)}
									>
										{socialLinks.map((social) => (
											<a
												key={social.type}
												href={social.href}
												target="_blank"
												rel="noreferrer"
												aria-label={social.label}
												className="text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 outline-none"
											>
												<SpeakerSocialIcon type={social.type} />
											</a>
										))}
									</span>
								)}
							</li>
						);
					})}
				</ul>

				{/* Right: fixed-width photo panel filling the frame */}
				<div className="relative h-80 w-full shrink-0 overflow-hidden bg-background sm:h-96 lg:h-full lg:w-80 xl:w-96">
					<SpeakerPortrait speaker={active} />
				</div>
			</div>
		</div>
	);
}

export interface ISeminarDetailProps {
	seminar: TSeminarDetail;
	locale: string;
	className?: string;
}

export function SeminarDetail({
	seminar,
	locale,
	className,
}: ISeminarDetailProps) {
	const breadcrumbItems = [
		{ label: "Home", to: "/{-$locale}", params: { locale } },
		{ label: "Seminars", to: "/{-$locale}/seminars", params: { locale } },
		{ label: seminar.title },
	];

	const registerLabel = "Register to attend";

	const handleRegister = () => {
		if (seminar.registrationUrl) {
			window.open(seminar.registrationUrl, "_blank", "noreferrer");
			return;
		}
		toast.info("Registration", {
			description: `Registration for "${seminar.title}" is coming soon.`,
		});
	};

	const detailRows = [
		{ label: "Date", value: seminar.date },
		...(seminar.time ? [{ label: "Time", value: seminar.time }] : []),
		...(seminar.location
			? [{ label: "Location", value: seminar.location }]
			: []),
	];

	return (
		<section
			data-slot="seminar-detail"
			className={cn("w-full pt-24 pb-16 sm:pt-28 sm:pb-20 lg:pt-32", className)}
		>
			<div className="w-full px-6 sm:px-10 md:px-14 lg:px-20 xl:px-24 2xl:px-32">
				<Breadcrumb items={breadcrumbItems} />

				<div className="mt-10 grid grid-cols-1 gap-12 lg:grid-cols-12">
					{/* Main column */}
					<div className="flex flex-col gap-8 lg:col-span-9">
						<header
							data-slot="seminar-detail-header"
							className="flex flex-col gap-6"
						>
							{/* Title */}
							<h1 className="max-w-4xl font-title text-3xl font-normal tracking-tight text-foreground text-balance sm:text-4xl md:text-5xl">
								{seminar.title}
							</h1>

							{/* Speakers */}
							<div className="flex items-center gap-2 text-sm text-muted-foreground sm:text-base">
								<IconUsers className="size-4 text-muted-foreground" />
								<p className="text-muted-foreground">
									{seminar.speakers.map((speaker) => speaker.name).join(", ")}
									<span className="text-muted-foreground/70">
										{" · "}
										{seminar.speakers[0].role}
									</span>
								</p>
							</div>

							{/* Description */}
							<p className="max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
								{seminar.description}
							</p>

							{/* Actions */}
							<div className="flex flex-wrap items-center gap-3 pt-1">
								<Button onClick={handleRegister}>
									<IconCalendarPlus data-icon="inline-start" />
									{registerLabel}
								</Button>
							</div>
						</header>

						{/* Speakers (Vercel-style spotlight) */}
						<SeminarSpeakers
							title="Featured speakers"
							speakers={seminar.speakers}
							className="mt-6"
						/>
					</div>

					{/* Right rail: details */}
					<div className="lg:col-span-3">
						<StickyRightRail title="Details" className="sticky top-24">
							<div className="flex flex-col border-t border-border">
								{detailRows.map((row) => (
									<div
										key={row.label}
										className="flex items-center justify-between gap-4 border-b border-border py-2.5 text-sm last:border-b-0"
									>
										<span className="font-mono text-xs font-medium tracking-wider text-muted-foreground uppercase">
											{row.label}
										</span>
										<span className="text-right font-medium text-foreground">
											{row.value}
										</span>
									</div>
								))}
								<div className="flex items-center justify-between gap-4 border-b border-border py-2.5 text-sm">
									<span className="font-mono text-xs font-medium tracking-wider text-muted-foreground uppercase">
										Status
									</span>
									<Badge variant={STATUS_VARIANT[seminar.status]}>
										{seminar.status}
									</Badge>
								</div>
							</div>
						</StickyRightRail>
					</div>
				</div>
			</div>
		</section>
	);
}
