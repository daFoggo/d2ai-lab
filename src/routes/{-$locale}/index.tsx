import type { Icon } from "@tabler/icons-react";
import {
	IconAntenna,
	IconArrowUpRight,
	IconBrain,
	IconLeaf,
	IconSchool,
	IconShieldCheck,
	IconSparkleHighlight,
	IconTableSpark,
} from "@tabler/icons-react";
import { useSuspenseQueries } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import type { TLandingDomainsData } from "@/features/landing";
import {
	LandingDomains,
	LandingHero,
	LandingHeroStats,
	LandingMission,
	LandingOpportunities,
	LandingPartners,
	LandingProjects,
	LandingPublications,
	LandingSeminar,
	landingDomainsQueryOptions,
	landingHeroStatsQueryOptions,
	landingMissionQueryOptions,
	landingOpportunitiesQueryOptions,
	landingPartnersQueryOptions,
	landingProjectsQueryOptions,
	landingPublicationsQueryOptions,
	landingUpcomingSeminarQueryOptions,
} from "@/features/landing";
import { DEFAULT_LOCALE, useI18n } from "@/lib/i18n";

/* Shared hover-arrow treatment for every landing CTA (matches the careers list "View role" affordance). */
const CTA_ARROW_CLASS =
	"size-4 transition-transform duration-300 group-hover/button:translate-x-0.5 group-hover/button:-translate-y-0.5";

/* Content data stays in the source language — only UI chrome is translated. */

/* Icons cho domains — mapping theo id vì API chỉ trả dữ liệu text, icon là presentation-layer concern. */
const DOMAIN_ICONS: Record<string, Icon> = {
	"ai-ml": IconBrain,
	"smart-education": IconSchool,
	"ambient-iot": IconAntenna,
	"responsible-ai": IconShieldCheck,
	"climate-ecology": IconLeaf,
};

const HomePage = () => {
	const { t, locale } = useI18n();
	const localeParams = {
		locale: locale === DEFAULT_LOCALE ? undefined : locale,
	};

	/* Granular: 8 queries riêng, fetch song song (chống waterfall). Loader đã warm cache nên không refetch. */
	const [
		heroStatsQuery,
		upcomingSeminarQuery,
		missionQuery,
		domainsQuery,
		publicationsQuery,
		projectsQuery,
		partnersQuery,
		opportunitiesQuery,
	] = useSuspenseQueries({
		queries: [
			landingHeroStatsQueryOptions(),
			landingUpcomingSeminarQueryOptions(),
			landingMissionQueryOptions(),
			landingDomainsQueryOptions(),
			landingPublicationsQueryOptions(),
			landingProjectsQueryOptions(),
			landingPartnersQueryOptions(),
			landingOpportunitiesQueryOptions(),
		],
	});

	const heroData = {
		titleLine1: t("landing.hero.titleLine1"),
		titleLine2: t("landing.hero.titleLine2"),
		description: t("landing.hero.description"),
	};

	const domainsData: TLandingDomainsData = {
		title: t("landing.domains.title"),
		description:
			"Our research spans AI/ML foundations, responsible human-centric technology, science, and societal impact.",
	};

	return (
		<>
			{/* 1. Full-Width Typography Hero */}
			<LandingHero.Root>
				<div className="flex flex-col gap-6 sm:gap-10 lg:gap-14 xl:gap-18">
					{/* Row 1: Line 1 + Pure IconTableSpark */}
					<div className="flex items-center gap-3 sm:gap-6 md:gap-8 lg:gap-10">
						<LandingHero.Title>{heroData.titleLine1}</LandingHero.Title>

						<div
							aria-hidden="true"
							className="hero-icon-spark pointer-events-none flex shrink-0 items-center text-primary-foreground/80 select-none"
						>
							<IconTableSpark
								strokeWidth={1.2}
								className="size-8 rotate-12 text-primary-foreground/85 transition-transform duration-300 sm:size-12 md:size-16 lg:size-20 xl:size-24 2xl:size-28"
							/>
						</div>
					</div>

					{/* Row 2: Description + Actions on Left (or below on mobile), Pure IconSparkleHighlight in Center, Line 2 on Right */}
					<LandingHero.Row className="gap-6 sm:gap-8 lg:gap-8 xl:gap-14 2xl:gap-18">
						<div className="order-2 flex w-full max-w-sm flex-col gap-4 sm:max-w-md lg:order-1 lg:max-w-xs xl:max-w-sm 2xl:max-w-md lg:shrink-0 lg:pb-1.5">
							<LandingHero.Description>
								{heroData.description}
							</LandingHero.Description>
						</div>

						<div
							aria-hidden="true"
							className="hero-icon-highlight pointer-events-none hidden items-center self-center text-primary-foreground/80 select-none lg:order-2 lg:flex lg:shrink-0"
						>
							<IconSparkleHighlight
								strokeWidth={1.2}
								className="size-14 -rotate-12 text-primary-foreground/85 transition-transform duration-300 lg:size-16 xl:size-20 2xl:size-24"
							/>
						</div>

						<div className="order-1 flex items-end lg:order-3 lg:shrink-0">
							<LandingHero.Title>{heroData.titleLine2}</LandingHero.Title>
						</div>
					</LandingHero.Row>
				</div>

				{/* Stats band — tách riêng để widget tự xử lí fetching data, hero giữ thuần UI */}
				<LandingHeroStats stats={heroStatsQuery.data} />
			</LandingHero.Root>

			{/* 2. Upcoming seminar spotlight — first section under the hero */}
			<LandingSeminar
				title={t("landing.seminar.title")}
				description={t("landing.seminar.description")}
				seminar={upcomingSeminarQuery.data}
				viewDetailsLabel={t("landing.seminar.viewDetails")}
				cta={
					<Button
						render={<Link to="/{-$locale}/seminars" params={localeParams} />}
						nativeButton={false}
					>
						{t("landing.seminar.cta")}
						<IconArrowUpRight
							data-icon="inline-end"
							className={CTA_ARROW_CLASS}
						/>
					</Button>
				}
			/>

			{/* 3. Section 1: Amplifying Human Ingenuity */}
			<LandingMission
				title={missionQuery.data.title}
				description={missionQuery.data.description}
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
						{t("landing.mission.cta")}
						<IconArrowUpRight
							data-icon="inline-end"
							className={CTA_ARROW_CLASS}
						/>
					</Button>
				}
			/>

			{/* 4. Section 2: We Work Across Domains */}
			<LandingDomains
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
						{t("landing.domains.cta")}
						<IconArrowUpRight
							data-icon="inline-end"
							className={CTA_ARROW_CLASS}
						/>
					</Button>
				}
			/>

			{/* 5. Section 3: Research We're Working On (Publications) */}
			<LandingPublications
				title={t("landing.publications.title")}
				items={publicationsQuery.data}
				action={
					<Button
						render={
							<Link to="/{-$locale}/publications" params={localeParams} />
						}
						nativeButton={false}
					>
						{t("landing.publications.seeMore")}
						<IconArrowUpRight
							data-icon="inline-end"
							className={CTA_ARROW_CLASS}
						/>
					</Button>
				}
			/>

			{/* 6. Section 5: Projects / Applied Apps */}
			<LandingProjects
				title={t("landing.projects.title")}
				hero={projectsQuery.data.hero}
				items={projectsQuery.data.items}
				seeMore={
					<Button
						render={<Link to="/{-$locale}/projects" params={localeParams} />}
						nativeButton={false}
					>
						{t("landing.projects.seeMore")}
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

			{/* 7. Research partners */}
			<LandingPartners
				title="Research partners"
				description="We collaborate with world-class labs and industry leaders to advance AI science."
				partners={partnersQuery.data}
			/>

			{/* 8. Section 6: Help Us Shape The Future */}
			<LandingOpportunities
				title={t("landing.opportunities.title")}
				items={opportunitiesQuery.data}
			/>
		</>
	);
};

export const Route = createFileRoute("/{-$locale}/")({
	loader: async ({ context }) => {
		/* Critical — await song song để HTML server render đầy đủ (SEO). */
		await Promise.all([
			context.queryClient.query(landingHeroStatsQueryOptions()),
			context.queryClient.query(landingUpcomingSeminarQueryOptions()),
			context.queryClient.query(landingMissionQueryOptions()),
			context.queryClient.query(landingDomainsQueryOptions()),
			context.queryClient.query(landingPublicationsQueryOptions()),
			context.queryClient.query(landingProjectsQueryOptions()),
			context.queryClient.query(landingPartnersQueryOptions()),
			context.queryClient.query(landingOpportunitiesQueryOptions()),
		]);
	},
	component: HomePage,
});
