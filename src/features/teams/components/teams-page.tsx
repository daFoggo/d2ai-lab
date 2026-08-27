import { Fragment } from "react";
import { PageHeader } from "@/components/common/page-header";
import type { IInPageNavItem } from "@/components/common/sticky-in-page-nav";
import { StickyInPageNav } from "@/components/common/sticky-in-page-nav";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import type { TTeam, TTeamMember } from "../schemas";

export interface ITeamsProps {
	eyebrow?: string;
	title: string;
	description?: string;
	teams: TTeam[];
	className?: string;
}

const MemberCard = ({ member }: { member: TTeamMember }) => {
	return (
		<article
			data-slot="team-member-card"
			className="flex items-start gap-3 rounded-xl p-2.5 transition-colors hover:bg-muted/30"
		>
			<Avatar size="lg">
				{member.image && <AvatarImage src={member.image} alt={member.name} />}
				<AvatarFallback>{member.initials}</AvatarFallback>
			</Avatar>
			<div className="flex flex-col gap-0.5">
				<h4 className="text-sm font-medium tracking-tight text-foreground">
					{member.name}
				</h4>
				<span className="font-mono text-xs font-medium tracking-wider text-muted-foreground uppercase">
					{member.role}
				</span>
				<span className="mt-0.5 text-xs text-muted-foreground/80">
					{member.area}
				</span>
			</div>
		</article>
	);
};

const TeamSection = ({ team, index }: { team: TTeam; index: number }) => {
	return (
		<section
			id={team.id}
			data-slot="team-section"
			className="flex scroll-mt-28 flex-col gap-6 pt-8 sm:scroll-mt-32 sm:pt-10"
		>
			<div className="flex flex-col gap-2">
				<span className="font-mono text-xs font-semibold tracking-wider text-muted-foreground uppercase">
					TEAM {String(index + 1).padStart(2, "0")}
				</span>
				<h2 className="font-title text-2xl font-normal tracking-tight text-foreground sm:text-3xl">
					{team.name}
				</h2>
				<p className="text-xs font-medium text-foreground/70 sm:text-sm">
					{team.tagline}
				</p>
				<p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
					{team.description}
				</p>
			</div>

			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
				{team.members.map((member) => (
					<MemberCard key={member.id} member={member} />
				))}
			</div>
		</section>
	);
};

export const Teams = ({
	eyebrow = "Teams",
	title = "The people behind the lab",
	description,
	teams,
	className,
}: ITeamsProps) => {
	const navItems: IInPageNavItem[] = teams.map((team) => ({
		id: team.id,
		label: team.name,
	}));

	return (
		<section
			data-slot="teams"
			className={cn("w-full pt-24 pb-16 sm:pt-28 sm:pb-20 lg:pt-32", className)}
		>
			<div className="w-full px-6 sm:px-10 md:px-14 lg:px-20 xl:px-24 2xl:px-32">
				<PageHeader eyebrow={eyebrow} title={title} description={description} />

				<div className="mt-12 grid grid-cols-1 gap-10 sm:mt-16 lg:grid-cols-12 lg:gap-12">
					{/* Sticky in-page nav */}
					<div className="hidden lg:col-span-3 lg:block">
						<StickyInPageNav
							title="Lab teams"
							items={navItems}
							className="sticky top-24"
						/>
					</div>

					{/* Team sections */}
					<div className="flex flex-col gap-12 lg:col-span-9">
						{teams.map((team, index) => (
							<Fragment key={team.id}>
								{index > 0 && <Separator />}
								<TeamSection team={team} index={index} />
							</Fragment>
						))}
					</div>
				</div>
			</div>
		</section>
	);
};
