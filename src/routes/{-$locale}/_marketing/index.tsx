import type { Icon } from "@tabler/icons-react";
import {
	IconAntenna,
	IconArrowUpRight,
	IconBrain,
	IconLeaf,
	IconSchool,
	IconShieldCheck,
} from "@tabler/icons-react";
import { useSuspenseQueries } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { siteStatsQueryOptions } from "@/features/analytics";
import {
	ProjectsPreview,
	projectPreviewQueryOptions,
} from "@/features/projects";
import {
	PublicationsPreview,
	publicationPreviewQueryOptions,
} from "@/features/publications";
import {
	ResearchAreasPreview,
	researchAreaPreviewQueryOptions,
} from "@/features/research";
import {
	SeminarSpotlight,
	upcomingSeminarQueryOptions,
} from "@/features/seminars";
import { DEFAULT_LOCALE, useI18n } from "@/lib/i18n";
import {
	HomeHero,
	HomeHeroStats,
	HomeMission,
	HomeOpportunities,
	HomePartners,
} from "./-components";

/* Shared hover-arrow treatment for every home CTA (matches the careers list "View role" affordance). */
const CTA_ARROW_CLASS =
	"size-4 transition-transform duration-300 group-hover/button:translate-x-0.5 group-hover/button:-translate-y-0.5";

/* Content data stays in the source language — only UI chrome is translated. */

/* Icons cho domains mosaic — mapping theo id vì API chỉ trả dữ liệu text, icon là presentation-layer concern. */
const DOMAIN_ICONS: Record<string, Icon> = {
	"ai-ml": IconBrain,
	"smart-education": IconSchool,
	"ambient-iot": IconAntenna,
	"responsible-ai": IconShieldCheck,
	"climate-ecology": IconLeaf,
};

/* Static page content — hardcoded như HTML thật, không qua API/query. */
const MISSION = {
	title: "Amplifying human ingenuity",
	description:
		"We advance scientific progress through AI research, collaborating with universities, NGOs, and partners worldwide.",
};

const PARTNERS = [
	{ id: "ptit", name: "PTIT" },
	{ id: "cnu", name: "CNU" },
	{ id: "uga", name: "UGA" },
];

const OPPORTUNITIES = [
	{
		id: "future-careers",
		title: "Career opportunities",
		description:
			"We're looking for scientists, engineers, interns, and students to join our core AI and intelligent computing labs.",
		linkLabel: "Learn more about careers",
		to: "/{-$locale}/careers",
	},
	{
		id: "future-seminars",
		title: "Seminars & Academic exchange",
		description:
			"Join our seminar series, guest lectures, and technical knowledge exchange workshops.",
		linkLabel: "View all seminars",
		to: "/{-$locale}/seminars",
	},
];

const HomePage = () => {
	const { t, locale } = useI18n();
	const localeParams = {
		locale: locale === DEFAULT_LOCALE ? undefined : locale,
	};

	/* Granular: mỗi section dynamic 1 query riêng, fetch song song (chống waterfall). Loader đã warm cache nên không refetch. */
	const [
		heroStatsQuery,
		upcomingSeminarQuery,
		domainsQuery,
		publicationsQuery,
		projectsQuery,
	] = useSuspenseQueries({
		queries: [
			siteStatsQueryOptions(),
			upcomingSeminarQueryOptions(),
			researchAreaPreviewQueryOptions(),
			publicationPreviewQueryOptions(),
			projectPreviewQueryOptions(),
		],
	});

	const heroData = {
		titleLine1: t("home.hero.titleLine1"),
		titleLine2: t("home.hero.titleLine2"),
		description: t("home.hero.description"),
	};

	const domainsData = {
		title: t("home.domains.title"),
		description:
			"Our research spans AI/ML foundations, responsible human-centric technology, science, and societal impact.",
	};

	return (
		<>
			{/* 1. Full-Width Typography Hero */}
			<HomeHero.Root>
				<div className="flex flex-col gap-6 sm:gap-10 lg:gap-14 xl:gap-18">
					{/* Row 1: Line 1 + Pure IconTableSpark */}
					<div className="flex items-center gap-3 sm:gap-6 md:gap-8 lg:gap-10">
						<HomeHero.Title>{heroData.titleLine1}</HomeHero.Title>
						{/* 
						<div
							aria-hidden="true"
							className="hero-icon-spark pointer-events-none flex shrink-0 items-center text-primary-foreground/80 select-none"
						>
							<IconTableSpark
								strokeWidth={1.2}
								className="size-8 rotate-12 text-primary-foreground/85 transition-transform duration-300 sm:size-12 md:size-16 lg:size-20 xl:size-24 2xl:size-28"
							/>
						</div> */}
					</div>

					{/* Row 2: Description + Actions on Left (or below on mobile), Pure IconSparkleHighlight in Center, Line 2 on Right */}
					<HomeHero.Row className="gap-6 sm:gap-8 lg:gap-8 xl:gap-14 2xl:gap-18">
						<div className="order-2 flex w-full max-w-sm flex-col gap-4 sm:max-w-md lg:order-1 lg:max-w-xs xl:max-w-sm 2xl:max-w-md lg:shrink-0 lg:pb-1.5">
							<HomeHero.Description>
								{heroData.description}
							</HomeHero.Description>
						</div>

						{/* <div
							aria-hidden="true"
							className="hero-icon-highlight pointer-events-none hidden items-center self-center text-primary-foreground/80 select-none lg:order-2 lg:flex lg:shrink-0"
						>
							<IconSparkleHighlight
								strokeWidth={1.2}
								className="size-14 -rotate-12 text-primary-foreground/85 transition-transform duration-300 lg:size-16 xl:size-20 2xl:size-24"
							/>
						</div> */}

						<div className="order-1 flex items-end lg:order-3 lg:shrink-0">
							<HomeHero.Title>{heroData.titleLine2}</HomeHero.Title>
						</div>
					</HomeHero.Row>
				</div>

				{/* Stats band — dynamic aggregate counts, fetch qua query */}
				<HomeHeroStats stats={heroStatsQuery.data} />
			</HomeHero.Root>

			{/* 2. Upcoming seminar spotlight — first section under the hero */}
			{upcomingSeminarQuery.data && (
				<SeminarSpotlight
					title={t("seminars.spotlight.title")}
					description={t("seminars.spotlight.description")}
					seminar={upcomingSeminarQuery.data}
					viewDetailsLabel={t("seminars.spotlight.viewDetails")}
					cta={
						<Button
							render={<Link to="/{-$locale}/seminars" params={localeParams} />}
							nativeButton={false}
						>
							{t("seminars.spotlight.cta")}
							<IconArrowUpRight
								data-icon="inline-end"
								className={CTA_ARROW_CLASS}
							/>
						</Button>
					}
				/>
			)}

			{/* 3. Section 1: Amplifying Human Ingenuity — static content */}
			<HomeMission
				title={MISSION.title}
				description={MISSION.description}
				brandText="D2AI Lab"
				cta={
					<Button
						render={
							<Link
								to="/{-$locale}/research/directions"
								params={localeParams}
							/>
						}
						nativeButton={false}
					>
						{t("home.mission.cta")}
						<IconArrowUpRight
							data-icon="inline-end"
							className={CTA_ARROW_CLASS}
						/>
					</Button>
				}
			/>

			{/* 4. Section 2: We Work Across Domains */}
			<ResearchAreasPreview
				title={domainsData.title}
				description={domainsData.description}
				domains={domainsQuery.data.map((domain) => ({
					...domain,
					icon: DOMAIN_ICONS[domain.id],
				}))}
				cta={
					<Button
						render={
							<Link to="/{-$locale}/research/areas" params={localeParams} />
						}
						nativeButton={false}
					>
						{t("home.domains.cta")}
						<IconArrowUpRight
							data-icon="inline-end"
							className={CTA_ARROW_CLASS}
						/>
					</Button>
				}
			/>

			{/* 5. Section 3: Research We're Working On (Publications) */}
			<PublicationsPreview
				title={t("publications.preview.title")}
				items={publicationsQuery.data}
				action={
					<Button
						render={
							<Link to="/{-$locale}/publications" params={localeParams} />
						}
						nativeButton={false}
					>
						{t("publications.preview.seeMore")}
						<IconArrowUpRight
							data-icon="inline-end"
							className={CTA_ARROW_CLASS}
						/>
					</Button>
				}
			/>

			{/* 6. Section 5: Projects / Applied Apps */}
			<ProjectsPreview
				title={t("projects.preview.title")}
				hero={projectsQuery.data.hero}
				items={projectsQuery.data.items}
				seeMore={
					<Button
						render={<Link to="/{-$locale}/projects" params={localeParams} />}
						nativeButton={false}
					>
						{t("projects.preview.seeMore")}
						<IconArrowUpRight
							data-icon="inline-end"
							className={CTA_ARROW_CLASS}
						/>
					</Button>
				}
				heroCta={
					<Button
						render={<Link to="/{-$locale}/projects" params={localeParams} />}
						nativeButton={false}
					>
						{projectsQuery.data.hero.ctaLabel}
						<IconArrowUpRight
							data-icon="inline-end"
							className={CTA_ARROW_CLASS}
						/>
					</Button>
				}
			/>

			{/* 7. Research partners — static content */}
			<HomePartners
				title="Research partners"
				description="We collaborate with world-class labs and industry leaders to advance AI science."
				partners={PARTNERS}
			/>

			{/* 8. Section 6: Help Us Shape The Future — static content */}
			<HomeOpportunities
				title={t("home.opportunities.title")}
				items={OPPORTUNITIES}
			/>
		</>
	);
};

export const Route = createFileRoute("/{-$locale}/_marketing/")({
	head: () => ({
		meta: [
			{ title: "D2AI Lab — AI Research & Scientific Intelligence" },
			{
				name: "description",
				content:
					"Advancing scientific progress through foundational and applied AI research.",
			},
		],
	}),
	loader: async ({ context }) => {
		/* Critical — await song song để HTML server render đầy đủ (SEO). */
		await Promise.all([
			context.queryClient.query(siteStatsQueryOptions()),
			context.queryClient.query(upcomingSeminarQueryOptions()),
			context.queryClient.query(researchAreaPreviewQueryOptions()),
			context.queryClient.query(publicationPreviewQueryOptions()),
			context.queryClient.query(projectPreviewQueryOptions()),
		]);
	},
	component: HomePage,
});
