import { IconArrowUpRight } from "@tabler/icons-react";
import { PageHeader } from "@/components/common/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { TCareer } from "../schemas";

export interface ICareersProps {
	eyebrow?: string;
	title: string;
	description?: string;
	roles: TCareer[];
	className?: string;
}

function CareerRow({ role }: { role: TCareer }) {
	return (
		<li
			data-slot="career-row"
			className="flex flex-col gap-3 border-t border-border py-6 sm:py-7"
		>
			<div className="flex flex-wrap items-center gap-3">
				<span className="font-mono text-xs font-medium tracking-wider text-muted-foreground uppercase">
					{role.department}
				</span>
				<Badge variant="secondary">{role.type}</Badge>
			</div>

			<div className="flex flex-col gap-2">
				<h3 className="font-title text-lg font-normal tracking-tight text-foreground sm:text-xl">
					{role.title}
				</h3>
				<p className="max-w-3xl text-sm leading-relaxed text-muted-foreground">
					{role.description}
				</p>
			</div>

			<div className="mt-1">
				<Button variant="outline" size="sm">
					Apply
					<IconArrowUpRight data-icon="inline-end" />
				</Button>
			</div>
		</li>
	);
}

export function Careers({
	eyebrow = "Careers",
	title = "Join the lab",
	description,
	roles,
	className,
}: ICareersProps) {
	return (
		<section
			data-slot="careers"
			className={cn("w-full pt-24 pb-16 sm:pt-28 sm:pb-20 lg:pt-32", className)}
		>
			<div className="w-full px-6 sm:px-10 md:px-14 lg:px-20 xl:px-24 2xl:px-32">
				<PageHeader eyebrow={eyebrow} title={title} description={description} />

				<ul className="mt-8 border-b border-border sm:mt-10">
					{roles.map((role) => (
						<CareerRow key={role.id} role={role} />
					))}
				</ul>
			</div>
		</section>
	);
}
