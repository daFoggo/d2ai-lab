import {
	IconBrandLinkedin,
	IconBrandX,
	IconCalendarPlus,
	IconLink,
	IconRobot,
	IconUsers,
} from "@tabler/icons-react";
import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { StickyRightRail } from "@/components/common/sticky-right-rail";
import { Badge } from "@/components/ui/badge";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import type {
	TSeminarDetail,
	TSeminarSpeaker,
	TSeminarStatus,
} from "@/features/seminars";
import { DEFAULT_LOCALE } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const STATUS_VARIANT: Record<
	TSeminarStatus,
	"default" | "secondary" | "outline"
> = {
	UPCOMING: "default",
	PAST: "outline",
};

/* Detect platform từ định dạng URL — socials lưu dạng text (mỗi URL 1 dòng). */
const detectPlatform = (href: string): "x" | "linkedin" | "link" => {
	if (href.includes("linkedin.com")) return "linkedin";
	if (href.includes("x.com") || href.includes("twitter.com")) return "x";
	return "link";
};

const SpeakerSocialIcon = ({ href }: { href: string }) => {
	const platform = detectPlatform(href);
	const Icon =
		platform === "linkedin"
			? IconBrandLinkedin
			: platform === "x"
				? IconBrandX
				: IconLink;
	return <Icon className="size-4" />;
};

const SpeakerPortrait = ({ speaker }: { speaker?: TSeminarSpeaker }) => {
	if (!speaker) {
		return (
			<div className="flex h-full w-full flex-col items-center justify-center gap-4 bg-primary p-6 text-center text-primary-foreground">
				<IconRobot className="size-12 text-primary-foreground/25" />
				<span className="font-mono text-xs tracking-wider text-primary-foreground/50 uppercase">
					To be announced
				</span>
			</div>
		);
	}

	const initials = speaker.name
		.split(/\s+/)
		.map((part) => part.charAt(0))
		.slice(0, 2)
		.join("")
		.toUpperCase();

	return (
		<div className="flex h-full w-full flex-col items-center justify-center gap-4 bg-primary p-6 text-center text-primary-foreground">
			{speaker.photo ? (
				<img
					src={speaker.photo}
					alt={speaker.name}
					className="h-full w-full object-cover"
				/>
			) : (
				<>
					<IconRobot className="size-12 text-primary-foreground/25" />
					<span className="font-title text-6xl font-normal tracking-tight text-primary-foreground/15">
						{initials}
					</span>
					<span className="font-mono text-xs tracking-wider text-primary-foreground/50 uppercase">
						{speaker.name}
					</span>
				</>
			)}
		</div>
	);
};

export interface ISeminarSpeakersProps {
	title?: string;
	speakers: TSeminarSpeaker[];
	className?: string;
}

export const SeminarSpeakers = ({
	title = "Featured speakers",
	speakers,
	className,
}: ISeminarSpeakersProps) => {
	const [activeId, setActiveId] = useState(speakers[0]?.id ?? "");
	if (speakers.length === 0) return null;

	const active =
		speakers.find((speaker) => speaker.id === activeId) ?? speakers[0];

	return (
		<div className={cn("flex flex-col gap-6", className)}>
			<h2 className="font-title text-2xl font-normal tracking-tight text-foreground sm:text-3xl md:text-4xl">
				{title}
			</h2>

			{/* Base layout: list shares a fixed frame height; photo panel fills it */}
			<div className="overflow-hidden rounded-3xl border border-primary-foreground/20 bg-primary text-primary-foreground lg:flex lg:h-135 lg:items-stretch">
				{/* Left: speaker list */}
				<ul className="flex min-w-0 flex-col lg:flex-1">
					{speakers.map((speaker) => {
						const isActive = speaker.id === active.id;
						const socialLinks = speaker.socials ?? [];

						return (
							<li
								key={speaker.id}
								className={cn(
									"flex flex-1 items-center justify-between gap-4 border-b border-primary-foreground/20 px-6 py-5 transition-colors last:border-b-0 sm:px-8",
									isActive ? "bg-primary-foreground/10" : "bg-transparent",
								)}
							>
								<button
									type="button"
									onMouseEnter={() => setActiveId(speaker.id)}
									onFocus={() => setActiveId(speaker.id)}
									aria-pressed={isActive}
									className="flex min-w-0 flex-1 flex-col gap-1.5 text-left outline-none focus-visible:ring-3 focus-visible:ring-primary-foreground/50"
								>
									<span
										className={cn(
											"truncate font-mono text-sm font-medium tracking-wider text-primary-foreground uppercase transition-opacity sm:text-base",
											!isActive && "opacity-40",
										)}
									>
										{speaker.name}
									</span>
									<span className="font-mono text-xs font-medium tracking-wider uppercase leading-none text-primary-foreground/80 sm:text-sm">
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
										{socialLinks.map((href) => (
											<a
												key={href}
												href={href}
												target="_blank"
												rel="noreferrer"
												aria-label={href}
												className="text-primary-foreground/80 transition-colors hover:text-primary-foreground focus-visible:ring-3 focus-visible:ring-primary-foreground/50 outline-none"
											>
												<SpeakerSocialIcon href={href} />
											</a>
										))}
									</span>
								)}
							</li>
						);
					})}
				</ul>

				{/* Right: fixed-width photo panel filling the frame */}
				<div className="relative h-80 w-full shrink-0 overflow-hidden bg-primary sm:h-96 lg:h-full lg:w-80 xl:w-96">
					<SpeakerPortrait speaker={active} />
				</div>
			</div>
		</div>
	);
};

export interface ISeminarDetailProps {
	seminar: TSeminarDetail;
	locale: string;
	className?: string;
}

export const SeminarDetail = ({
	seminar,
	locale,
	className,
}: ISeminarDetailProps) => {
	const registerLabel = "Register to attend";
	const localeParams = {
		locale: locale === DEFAULT_LOCALE ? undefined : locale,
	};

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

	const speakersLabel =
		seminar.speakers.length > 0
			? seminar.speakers.map((s) => s.name).join(", ")
			: "To be announced";
	const speakerFirstRole = seminar.speakers[0]?.role;

	return (
		<section
			className={cn("w-full pt-24 pb-16 sm:pt-28 sm:pb-20 lg:pt-32", className)}
		>
			<div className="w-full px-6 sm:px-10 md:px-14 lg:px-20 xl:px-24 2xl:px-32">
				<Breadcrumb>
					<BreadcrumbList>
						<BreadcrumbItem>
							<BreadcrumbLink
								render={<Link to="/{-$locale}" params={localeParams} />}
							>
								Home
							</BreadcrumbLink>
						</BreadcrumbItem>
						<BreadcrumbSeparator />
						<BreadcrumbItem>
							<BreadcrumbLink
								render={
									<Link to="/{-$locale}/seminars" params={localeParams} />
								}
							>
								Seminars
							</BreadcrumbLink>
						</BreadcrumbItem>
						<BreadcrumbSeparator />
						<BreadcrumbItem>
							<BreadcrumbPage>{seminar.title}</BreadcrumbPage>
						</BreadcrumbItem>
					</BreadcrumbList>
				</Breadcrumb>

				<div className="mt-10 grid grid-cols-1 gap-12 lg:grid-cols-12">
					{/* Main column */}
					<div className="flex flex-col gap-8 lg:col-span-9">
						<header className="flex flex-col gap-6">
							{/* Title */}
							<h1 className="max-w-4xl font-title text-3xl font-normal tracking-tight text-foreground text-balance sm:text-4xl md:text-5xl">
								{seminar.title}
							</h1>

							{/* Speakers */}
							<div className="flex items-center gap-2 text-sm text-muted-foreground sm:text-base">
								<IconUsers className="size-4 text-muted-foreground" />
								<p className="text-muted-foreground">
									{speakersLabel}
									{speakerFirstRole && (
										<span className="text-muted-foreground/70">
											{" · "}
											{speakerFirstRole}
										</span>
									)}
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
						{seminar.speakers.length > 0 && (
							<SeminarSpeakers
								title="Featured speakers"
								speakers={seminar.speakers}
								className="mt-6"
							/>
						)}
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
};
