import { IconCalendarPlus } from "@tabler/icons-react";
import { Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { ProseBody, ProseParagraph } from "@/components/common/prose-body";
import { StickyRightRail } from "@/components/common/sticky-right-rail";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { TCareerDetail } from "../schemas";

export interface ICareerDetailProps {
	career: TCareerDetail;
	locale: string;
	className?: string;
}

const DetailList = ({ items }: { items: string[] }) => {
	return (
		<div className="flex flex-col gap-4">
			{items.map((item) => (
				<ProseParagraph key={item}>{item}</ProseParagraph>
			))}
		</div>
	);
};

export const CareerDetail = ({
	career,
	locale,
	className,
}: ICareerDetailProps) => {
	const handleApply = () => {
		if (career.applyUrl) {
			window.open(career.applyUrl, "_blank", "noreferrer");
			return;
		}
		toast.info("Application", {
			description: `Applications for "${career.title}" are handled through our careers portal.`,
		});
	};

	const detailRows = [
		{ label: "Department", value: career.department },
		{ label: "Type", value: career.type },
		...(career.location ? [{ label: "Location", value: career.location }] : []),
	];

	return (
		<section
			className={cn("w-full pt-24 pb-16 sm:pt-28 sm:pb-20 lg:pt-32", className)}
		>
			<div className="w-full px-6 sm:px-10 md:px-14 lg:px-20 xl:px-24 2xl:px-32">
				<Breadcrumb>
					<BreadcrumbList>
						<BreadcrumbItem>
							<BreadcrumbLink
								render={<Link to="/{-$locale}" params={{ locale }} />}
							>
								Home
							</BreadcrumbLink>
						</BreadcrumbItem>
						<BreadcrumbSeparator />
						<BreadcrumbItem>
							<BreadcrumbLink
								render={<Link to="/{-$locale}/careers" params={{ locale }} />}
							>
								Careers
							</BreadcrumbLink>
						</BreadcrumbItem>
						<BreadcrumbSeparator />
						<BreadcrumbItem>
							<BreadcrumbPage>{career.title}</BreadcrumbPage>
						</BreadcrumbItem>
					</BreadcrumbList>
				</Breadcrumb>

				<div className="mt-10 grid grid-cols-1 gap-12 lg:grid-cols-12">
					{/* Main column */}
					<div className="flex flex-col gap-8 lg:col-span-9">
						{/* Header */}
						<header className="flex flex-col gap-4">
							<span className="font-mono text-xs font-medium tracking-wider text-muted-foreground uppercase">
								{career.department}
							</span>

							<h1 className="max-w-4xl font-title text-3xl font-normal tracking-tight text-foreground text-balance sm:text-4xl md:text-5xl">
								{career.title}
							</h1>

							<p className="max-w-3xl text-sm leading-relaxed text-muted-foreground sm:text-base">
								{career.description}
							</p>

							{/* Apply */}
							<div className="pt-1">
								<Button onClick={handleApply}>
									<IconCalendarPlus data-icon="inline-start" />
									Apply for this role
								</Button>
							</div>
						</header>

						{/* Responsibilities */}
						<ProseBody
							sections={[
								{
									eyebrow: "What you'll do",
									content: <DetailList items={career.responsibilities} />,
								},
								{
									eyebrow: "What we're looking for",
									content: <DetailList items={career.qualifications} />,
								},
								...(career.benefits && career.benefits.length > 0
									? [
											{
												eyebrow: "Why join us",
												content: <DetailList items={career.benefits} />,
											},
										]
									: []),
							]}
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
							</div>
						</StickyRightRail>
					</div>
				</div>
			</div>
		</section>
	);
};
