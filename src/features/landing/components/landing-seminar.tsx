import { IconArrowUpRight } from "@tabler/icons-react";
import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import type { TSeminar, TSeminarStatus } from "@/features/seminars";
import { DEFAULT_LOCALE, useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export interface ILandingSeminarProps {
	title: string;
	description?: string;
	seminar: TSeminar;
	viewDetailsLabel: string;
	cta?: ReactNode;
	className?: string;
}

const STATUS_VARIANT: Record<TSeminarStatus, "default" | "outline"> = {
	UPCOMING: "default",
	PAST: "outline",
};

export const LandingSeminar = ({
	title,
	description,
	seminar,
	viewDetailsLabel,
	cta,
	className,
}: ILandingSeminarProps) => {
	const { locale } = useI18n();
	const localeParams = {
		locale: locale === DEFAULT_LOCALE ? undefined : locale,
	};
	const [month, day] = seminar.date.split(" ");

	return (
		<section
			data-slot="landing-seminar"
			className={cn(
				"w-full overflow-hidden py-12 sm:py-16 lg:py-20",
				className,
			)}
		>
			<div className="w-full px-6 sm:px-10 md:px-14 lg:px-20 xl:px-24 2xl:px-32">
				{/* Header: title + description left, CTA right */}
				<div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
					<div className="flex max-w-2xl flex-col gap-2">
						<h2 className="font-title text-2xl font-normal tracking-tight text-foreground sm:text-3xl md:text-4xl">
							{title}
						</h2>
						{description && (
							<p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
								{description}
							</p>
						)}
					</div>
					{cta && <div className="shrink-0">{cta}</div>}
				</div>

				{/* Spotlight: a single ticket-stub card — date block + event details, split by a dashed rule */}
				<div
					data-slot="landing-seminar-card"
					className="mt-6 flex flex-col overflow-hidden bg-primary text-primary-foreground sm:mt-8 sm:flex-row"
				>
					<div className="flex shrink-0 flex-row items-center gap-4 border-b-2 border-dashed border-primary-foreground/25 p-6 sm:w-52 sm:flex-col sm:items-start sm:justify-center sm:border-r-2 sm:border-b-0 sm:p-8">
						<Badge
							variant={STATUS_VARIANT[seminar.status]}
							className={
								seminar.status === "UPCOMING"
									? "bg-primary-foreground text-primary"
									: "border-primary-foreground/30 text-primary-foreground"
							}
						>
							{seminar.status}
						</Badge>
						<div className="flex items-baseline gap-2 sm:mt-4 sm:flex-col sm:items-start sm:gap-0">
							<span className="font-mono text-xs font-medium tracking-wider text-primary-foreground/80 uppercase">
								{month}
							</span>
							<span className="font-mono text-5xl leading-none font-semibold text-primary-foreground sm:text-6xl">
								{day}
							</span>
						</div>
					</div>

					<div className="flex flex-1 flex-col justify-center gap-3 p-6 sm:p-8">
						<h3 className="font-title text-xl font-normal tracking-tight text-primary-foreground sm:text-2xl md:text-3xl">
							{seminar.title}
						</h3>
						<p className="text-sm text-primary-foreground/80 sm:text-base">
							<span className="font-medium text-primary-foreground">
								{seminar.speaker}
							</span>
							{" · "}
							{seminar.role}
						</p>
						<Link
							to="/{-$locale}/seminars/$id"
							params={{ ...localeParams, id: seminar.id }}
							className="group mt-1 inline-flex w-fit items-center gap-1.5 text-sm font-medium text-primary-foreground transition-colors hover:text-primary-foreground/80 focus:outline-hidden"
						>
							{viewDetailsLabel}
							<IconArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
						</Link>
					</div>
				</div>
			</div>
		</section>
	);
};
