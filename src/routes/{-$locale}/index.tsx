import { IconSparkleHighlight, IconTableSpark } from "@tabler/icons-react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
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
import { useI18n } from "@/lib/i18n";

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
		href: "#publications",
	},
	{
		id: "pub-2",
		title:
			"Advancing AMIE towards expert-level audio-visual clinical consultations",
		category: "CLINICAL AI",
		date: "AUGUST 11",
		type: "RESEARCH",
		href: "#publications",
	},
	{
		id: "pub-3",
		title:
			"Science One Framework: A verifiable autonomous research framework via Chain-of-Evidence",
		category: "CHAIN OF EVIDENCE",
		date: "JULY 30",
		type: "RESEARCH",
		href: "#publications",
	},
];

const PROJECT_HERO: TLandingProjectHero = {
	title: "Adaptive Learning Platform",
	category: "SMART EDUCATION APP",
	description:
		"A personalized learning web application combining cognitive diagnostics and generative curriculum planning to empower students in real-time.",
	ctaLabel: "Launch platform",
	href: "#projects",
};

const PROJECT_ITEMS: TLandingProjectItem[] = [
	{
		id: "app-1",
		title:
			"UrbanSense: Real-time environmental sensor dashboard and air quality forecasting system",
		category: "SMART LIVING APP",
		href: "#projects",
	},
	{
		id: "app-2",
		title:
			"CivicFlow: Intelligent document triage and automated public administrative assistant",
		category: "CIVIC TECH APP",
		href: "#projects",
	},
];

const FUTURE_ITEMS: TLandingFutureItem[] = [
	{
		id: "future-careers",
		title: "Career opportunities",
		description:
			"From Hanoi to global research networks, we're looking for talented scientists, engineers, interns, and students to join our core AI and intelligent computing labs.",
		linkLabel: "Learn more about careers",
		href: "#careers",
	},
	{
		id: "future-seminars",
		title: "Seminars & Academic exchange",
		description:
			"Join our regular scientific seminar series, guest lectures by international scholars, and technical knowledge exchange workshops.",
		linkLabel: "Explore seminars",
		href: "#seminars",
	},
];

function HomePage() {
	const { t } = useI18n();

	const heroData = {
		titleLine1: t("landing.hero.titleLine1"),
		titleLine2: t("landing.hero.titleLine2"),
		description: t("landing.hero.description"),
	};

	const domainsData: TLandingDomainsData = {
		title: t("landing.domains.title"),
		description:
			"Our vast breadth of work covers AI/ML foundations, responsible human-centric technology, science & societal impact, computing paradigms, and algorithms & optimization. Our research teams impact technology used by people all over the world.",
		ctaLabel: t("landing.domains.cta"),
	};

	const handleSeePublications = () => {
		toast.info(t("landing.toast.publications"), {
			description: t("landing.toast.publicationsDesc"),
		});
	};

	const handleSeeProjects = () => {
		toast.info(t("landing.toast.projects"), {
			description: t("landing.toast.projectsDesc"),
		});
	};

	const handleExploreDomains = () => {
		toast.info(t("landing.toast.domains"), {
			description: t("landing.toast.domainsDesc"),
		});
	};

	const handleExploreFeaturedApp = () => {
		toast.success(t("landing.toast.launch"), {
			description: t("landing.toast.launchDesc"),
		});
	};

	return (
		<>
			{/* 1. Full-Width Typography Hero */}
			<LandingHero.Root>
				<div className="flex flex-col gap-10 sm:gap-14 lg:gap-18">
					{/* Row 1: Line 1 + Large Pure IconTableSpark */}
					<div className="flex flex-wrap items-center gap-8 sm:gap-14 md:gap-20 lg:gap-28 xl:gap-36">
						<LandingHero.Title>{heroData.titleLine1}</LandingHero.Title>

						<div
							aria-hidden="true"
							className="hero-icon-spark pointer-events-none hidden items-center text-foreground/80 select-none md:flex"
						>
							<IconTableSpark
								strokeWidth={1.2}
								className="size-16 rotate-12 text-foreground/85 transition-transform duration-300 sm:size-20 md:size-24 lg:size-28 xl:size-32"
							/>
						</div>
					</div>

					{/* Row 2: Description on Left, Large Pure IconSparkleHighlight in Center, Line 2 on Right */}
					<LandingHero.Row className="gap-10 lg:gap-16 xl:gap-24">
						<div className="max-w-sm sm:max-w-md lg:pb-1.5">
							<LandingHero.Description>
								{heroData.description}
							</LandingHero.Description>
						</div>

						<div
							aria-hidden="true"
							className="hero-icon-highlight pointer-events-none hidden items-center self-center px-8 text-foreground/80 select-none lg:flex lg:px-14 xl:px-20"
						>
							<IconSparkleHighlight
								strokeWidth={1.2}
								className="size-14 -rotate-12 text-foreground/85 transition-transform duration-300 sm:size-18 md:size-22 lg:size-26 xl:size-30"
							/>
						</div>

						<div className="flex shrink-0 items-end">
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
				onSeePublications={handleSeePublications}
			/>

			{/* 5. Section 4: We Work Across Domains */}
			<LandingDomains
				title={domainsData.title}
				description={domainsData.description}
				ctaLabel={domainsData.ctaLabel}
				onCtaClick={handleExploreDomains}
			/>

			{/* 6. Section 5: Projects / Applied Apps */}
			<LandingProjects
				title={t("landing.projects.title")}
				hero={PROJECT_HERO}
				items={PROJECT_ITEMS}
				onSeeProjects={handleSeeProjects}
				onHeroCtaClick={handleExploreFeaturedApp}
			/>

			{/* 7. Section 6: Help Us Shape The Future */}
			<LandingFuture title={t("landing.future.title")} items={FUTURE_ITEMS} />
		</>
	);
}
