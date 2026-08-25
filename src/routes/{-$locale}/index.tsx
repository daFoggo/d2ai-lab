import {
	IconArrowUpRight,
	IconSparkleHighlight,
	IconTableSpark,
} from "@tabler/icons-react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import type {
	TLandingDomainsData,
	TLandingFutureItem,
	TLandingLatestItem,
	TLandingProjectHero,
	TLandingProjectItem,
} from "@/features/landing";
import {
	LandingDomains,
	LandingFilm,
	LandingFuture,
	LandingHero,
	LandingLatest,
	LandingProjects,
	LandingQuote,
} from "@/features/landing";
import { DEFAULT_LOCALE, useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/{-$locale}/")({
	component: HomePage,
});

/* Content data stays in the source language — only UI chrome is translated. */

const FILM_DATA = {
	title: "Amplifying human ingenuity",
	description:
		"As we realize new possibilities with AI, we maintain a human-centered approach. We advance scientific progress by publishing impactful research each year and collaborating with universities, NGOs, partners, and communities worldwide. Our goal is to build a world where AI is more than a tool: it's an essential partner for researchers, scientists, clinicians, teachers, users, and businesses.",
	brandText: "D2AI Lab",
};

const QUOTE_DATA = {
	quote:
		"The magic cycle of research is accelerating. Research breakthroughs are leading to greater impact on products, science, and society—with greater opportunities for AI to amplify human ingenuity and capacity.",
	authorName: "Huynh Phan Ly",
	authorRole: "Director, D2AI Lab & Faculty of Information Technology",
};

const LATEST_ITEMS: TLandingLatestItem[] = [
	{
		id: "pub-1",
		title:
			"Empty shelves or lost keys? Recall is the bottleneck for parametric factuality",
		category: "PARAMETRIC FACTUALITY",
		date: "AUGUST 12",
		type: "RESEARCH",
		to: "/{-$locale}/publications/pub-1",
	},
	{
		id: "pub-2",
		title:
			"Advancing AMIE towards expert-level audio-visual clinical consultations",
		category: "CLINICAL AI",
		date: "AUGUST 11",
		type: "RESEARCH",
		to: "/{-$locale}/publications/pub-2",
	},
	{
		id: "pub-3",
		title:
			"Science One Framework: A verifiable autonomous research framework via Chain-of-Evidence",
		category: "CHAIN OF EVIDENCE",
		date: "JULY 30",
		type: "RESEARCH",
		to: "/{-$locale}/publications/pub-3",
	},
];

const PROJECT_HERO: TLandingProjectHero = {
	title: "Adaptive Learning Platform",
	category: "SMART EDUCATION APP",
	description:
		"A personalized learning web application combining cognitive diagnostics and generative curriculum planning to empower students in real-time.",
	ctaLabel: "Launch platform",
	to: "/{-$locale}/projects",
};

const PROJECT_ITEMS: TLandingProjectItem[] = [
	{
		id: "app-1",
		title:
			"UrbanSense: Real-time environmental sensor dashboard and air quality forecasting system",
		category: "SMART LIVING APP",
		to: "/{-$locale}/projects",
	},
	{
		id: "app-2",
		title:
			"CivicFlow: Intelligent document triage and automated public administrative assistant",
		category: "CIVIC TECH APP",
		to: "/{-$locale}/projects",
	},
];

const FUTURE_ITEMS: TLandingFutureItem[] = [
	{
		id: "future-careers",
		title: "Career opportunities",
		description:
			"From Hanoi to global research networks, we're looking for talented scientists, engineers, interns, and students to join our core AI and intelligent computing labs.",
		linkLabel: "Learn more about careers",
		to: "/{-$locale}/careers",
	},
	{
		id: "future-seminars",
		title: "Seminars & Academic exchange",
		description:
			"Join our regular scientific seminar series, guest lectures by international scholars, and technical knowledge exchange workshops.",
		linkLabel: "Explore seminars",
		to: "/{-$locale}/seminars",
	},
];

function HomePage() {
	const { t, locale } = useI18n();
	const localeParams = {
		locale: locale === DEFAULT_LOCALE ? undefined : locale,
	};

	const heroData = {
		titleLine1: t("landing.hero.titleLine1"),
		titleLine2: t("landing.hero.titleLine2"),
		description: t("landing.hero.description"),
	};

	const domainsData: TLandingDomainsData = {
		title: t("landing.domains.title"),
		description:
			"Our vast breadth of work covers AI/ML foundations, responsible human-centric technology, science & societal impact, computing paradigms, and algorithms & optimization. Our research teams impact technology used by people all over the world.",
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
							className="hero-icon-spark pointer-events-none flex shrink-0 items-center text-foreground/80 select-none"
						>
							<IconTableSpark
								strokeWidth={1.2}
								className="size-8 rotate-12 text-foreground/85 transition-transform duration-300 sm:size-12 md:size-16 lg:size-20 xl:size-24 2xl:size-28"
							/>
						</div>
					</div>

					{/* Row 2: Description + Actions on Left (or below on mobile), Pure IconSparkleHighlight in Center, Line 2 on Right */}
					<LandingHero.Row className="gap-6 sm:gap-8 lg:gap-8 xl:gap-14 2xl:gap-18">
						<div className="order-2 flex w-full max-w-sm flex-col gap-4 sm:max-w-md lg:order-1 lg:max-w-xs xl:max-w-sm 2xl:max-w-md lg:shrink-0 lg:pb-1.5">
							<LandingHero.Description>
								{heroData.description}
							</LandingHero.Description>

							<LandingHero.Actions>
								<Button
									render={
										<Link
											to="/{-$locale}/research/areas"
											params={localeParams}
										/>
									}
									className="bg-foreground text-background hover:bg-foreground/90 font-medium"
								>
									{t("landing.hero.exploreResearch")}
									<IconArrowUpRight data-icon="inline-end" className="size-4" />
								</Button>
								<Button
									variant="outline"
									render={
										<Link to="/{-$locale}/projects" params={localeParams} />
									}
									className="border-foreground/20 text-foreground hover:bg-foreground/10 hover:text-foreground font-medium"
								>
									{t("landing.hero.exploreProjects")}
								</Button>
							</LandingHero.Actions>
						</div>

						<div
							aria-hidden="true"
							className="hero-icon-highlight pointer-events-none hidden items-center self-center text-foreground/80 select-none lg:order-2 lg:flex lg:shrink-0"
						>
							<IconSparkleHighlight
								strokeWidth={1.2}
								className="size-14 -rotate-12 text-foreground/85 transition-transform duration-300 lg:size-16 xl:size-20 2xl:size-24"
							/>
						</div>

						<div className="order-1 flex items-end lg:order-3 lg:shrink-0">
							<LandingHero.Title>{heroData.titleLine2}</LandingHero.Title>
						</div>
					</LandingHero.Row>
				</div>
			</LandingHero.Root>

			{/* 2. Section 1: Amplifying Human Ingenuity & Film */}
			<LandingFilm
				title={FILM_DATA.title}
				description={FILM_DATA.description}
				brandText={FILM_DATA.brandText}
			/>

			{/* 3. Section 2: Quote / Leader Statement Banner with GSAP Scroll Trigger */}
			<LandingQuote
				quote={QUOTE_DATA.quote}
				authorName={QUOTE_DATA.authorName}
				authorRole={QUOTE_DATA.authorRole}
			/>

			{/* 4. Section 3: Read the Latest (Publications) */}
			<LandingLatest
				title={t("landing.latest.title")}
				items={LATEST_ITEMS}
				action={
					<Button
						render={
							<Link to="/{-$locale}/publications" params={localeParams} />
						}
					>
						{t("landing.latest.seeMore")}
					</Button>
				}
			/>

			{/* 5. Section 4: We Work Across Domains */}
			<LandingDomains
				title={domainsData.title}
				description={domainsData.description}
				cta={
					<Button
						render={
							<Link to="/{-$locale}/research/areas" params={localeParams} />
						}
					>
						{t("landing.domains.cta")}
					</Button>
				}
			/>

			{/* 6. Section 5: Projects / Applied Apps */}
			<LandingProjects
				title={t("landing.projects.title")}
				hero={PROJECT_HERO}
				items={PROJECT_ITEMS}
				seeMore={
					<Button
						render={<Link to="/{-$locale}/projects" params={localeParams} />}
					>
						{t("landing.projects.seeMore")}
					</Button>
				}
				heroCta={
					<Button
						render={<Link to="/{-$locale}/projects" params={localeParams} />}
					>
						{PROJECT_HERO.ctaLabel}
					</Button>
				}
			/>

			{/* 7. Section 6: Help Us Shape The Future */}
			<LandingFuture title={t("landing.future.title")} items={FUTURE_ITEMS} />
		</>
	);
}
