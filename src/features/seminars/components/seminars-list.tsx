import { Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/common/page-header";
import { Badge } from "@/components/ui/badge";
import { DEFAULT_LOCALE, useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import type { TSeminar, TSeminarStatus } from "../schemas";

export interface ISeminarsProps {
	eyebrow?: string;
	title: string;
	description?: string;
	seminars: TSeminar[];
	className?: string;
}

const STATUS_VARIANT: Record<
	TSeminarStatus,
	"default" | "secondary" | "outline"
> = {
	UPCOMING: "default",
	PAST: "outline",
};

function SeminarRow({ seminar }: { seminar: TSeminar }) {
	const { locale } = useI18n();
	const localeParams = {
		locale: locale === DEFAULT_LOCALE ? undefined : locale,
	};

	return (
		<li data-slot="seminar-row" className="border-t border-border">
			<Link
				to="/{-$locale}/seminars/$id"
				params={{ ...localeParams, id: seminar.id }}
				className="group flex flex-col gap-3 py-6 transition-colors hover:bg-muted/40 focus:outline-hidden sm:py-7 lg:grid lg:grid-cols-12 lg:gap-8 lg:px-3 lg:-mx-3"
			>
				<div className="flex flex-wrap items-center gap-3 lg:col-span-3">
					<span className="font-mono text-sm text-muted-foreground uppercase">
						{seminar.date}
					</span>
					<Badge variant={STATUS_VARIANT[seminar.status]}>
						{seminar.status}
					</Badge>
				</div>

				<div className="flex flex-col gap-1.5 lg:col-span-9">
					<h3 className="font-title text-lg font-normal tracking-tight text-foreground transition-colors group-hover:text-foreground/80 sm:text-xl">
						{seminar.title}
					</h3>
					<p className="text-sm text-muted-foreground">
						<span className="font-medium text-foreground">
							{seminar.speaker}
						</span>
						{" · "}
						{seminar.role}
					</p>
				</div>
			</Link>
		</li>
	);
}

export function Seminars({
	eyebrow = "Seminars",
	title = "Seminars & academic exchange",
	description,
	seminars,
	className,
}: ISeminarsProps) {
	return (
		<section
			data-slot="seminars"
			className={cn("w-full pt-24 pb-16 sm:pt-28 sm:pb-20 lg:pt-32", className)}
		>
			<div className="w-full px-6 sm:px-10 md:px-14 lg:px-20 xl:px-24 2xl:px-32">
				<PageHeader eyebrow={eyebrow} title={title} description={description} />

				<ul className="mt-8 border-b border-border sm:mt-10">
					{seminars.map((seminar) => (
						<SeminarRow key={seminar.id} seminar={seminar} />
					))}
				</ul>
			</div>
		</section>
	);
}
