import { IconSparkleHighlight, IconTableSpark } from "@tabler/icons-react";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { AuthButton } from "@/features/auth";
import type {
	TLandingDomainsData,
	TLandingFutureItem,
	TLandingLatestItem,
	TLandingNavItem,
	TLandingProjectHero,
	TLandingProjectItem,
} from "@/features/landing";
import {
	LandingDomains,
	LandingFilm,
	LandingFooter,
	LandingFuture,
	LandingHero,
	LandingLatest,
	LandingLayout,
	LandingNavbar,
	LandingProjects,
	LandingQuote,
} from "@/features/landing";

export const Route = createFileRoute("/")({
	component: HomePage,
});

const LANDING_NAV_ITEMS: TLandingNavItem[] = [
	{
		label: "Research",
		items: [
			{
				title: "Research Areas",
				href: "#research-areas",
				description: "Primary scientific domains and core scopes.",
			},
			{
				title: "Research Gaps",
				href: "#research-gaps",
				description: "Addressing open challenges and critical bottlenecks.",
			},
			{
				title: "Research Directions",
				href: "#research-directions",
				description: "Long-term vision and strategic innovation.",
			},
		],
	},
	{ label: "People", href: "#people" },
	{ label: "Publications", href: "#publications" },
	{ label: "Projects", href: "#projects" },
	{ label: "Seminars", href: "#seminars" },
	{ label: "Careers", href: "#careers" },
];

const LANDING_HERO_DATA = {
	titleLine1: "Data to Intelligence,",
	titleLine2: "Ideas to Impact.",
	description:
		"Our mission is to advance AI and data science, driving real-world breakthroughs that benefit society.",
};

/* Section 1: Film Data */
const LANDING_FILM_DATA = {
	title: "Amplifying human ingenuity",
	description:
		"As we realize new possibilities with AI, we maintain a human-centered approach. We advance scientific progress by publishing impactful research each year and collaborating with universities, NGOs, partners, and communities worldwide. Our goal is to build a world where AI is more than a tool: it's an essential partner for researchers, scientists, clinicians, teachers, users, and businesses.",
	brandText: "D2AI Lab",
};

/* Section 2: Quote Data */
const LANDING_QUOTE_DATA = {
	quote:
		"The magic cycle of research is accelerating. Research breakthroughs are leading to greater impact on products, science, and society—with greater opportunities for AI to amplify human ingenuity and capacity.",
	authorName: "Huynh Phan Ly",
	authorRole: "Director, D2AI Lab & Faculty of Information Technology",
};

/* Section 3: Read The Latest Data (Publications Only) */
const LANDING_LATEST_ITEMS: TLandingLatestItem[] = [
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

/* Section 4: Domains Data (Positioned between Publications and Projects) */
const LANDING_DOMAINS_DATA: TLandingDomainsData = {
	title: "We work across domains",
	description:
		"Our vast breadth of work covers AI/ML foundations, responsible human-centric technology, science & societal impact, computing paradigms, and algorithms & optimization. Our research teams impact technology used by people all over the world.",
	ctaLabel: "Explore research areas",
};

/* Section 5: Projects / Applied Apps Data (Spotlight App + 2 Applied Sub-projects) */
const LANDING_PROJECT_HERO: TLandingProjectHero = {
	title: "Adaptive Learning Platform",
	category: "SMART EDUCATION APP",
	description:
		"A personalized learning web application combining cognitive diagnostics and generative curriculum planning to empower students in real-time.",
	ctaLabel: "Launch platform",
	href: "#projects",
};

const LANDING_PROJECT_ITEMS: TLandingProjectItem[] = [
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

/* Section 6: Future Opportunities Data (Left: Careers, Right: Seminars) */
const LANDING_FUTURE_ITEMS: TLandingFutureItem[] = [
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
	const [currentLang, setCurrentLang] = useState<string>("EN");

	const handleSearch = () => {
		toast.info("Search Publications & Research", {
			description:
				"Access papers, open-source repositories, and lab project archives.",
		});
	};

	const handleSelectLanguage = (langCode: string) => {
		setCurrentLang(langCode);
		toast(`Language selected: ${langCode === "EN" ? "English" : "Tiếng Việt"}`);
	};

	const handleSeePublications = () => {
		toast.info("Navigating to Publications Archive", {
			description: "View all peer-reviewed research papers and preprints.",
		});
	};

	const handleSeeProjects = () => {
		toast.info("Navigating to Applications Directory", {
			description: "Browse deployed software platforms and lab applications.",
		});
	};

	const handleExploreDomains = () => {
		toast.info("Exploring Research Domains", {
			description: "Browsing all active D2AI scientific tracks and domains.",
		});
	};

	const handleExploreFeaturedApp = () => {
		toast.success("Adaptive Learning Platform", {
			description: "Launching live deployed application sandbox.",
		});
	};

	return (
		<LandingLayout>
			{/* Header with NavigationMenu composition */}
			<LandingNavbar.Root>
				<div className="flex items-center gap-6 lg:gap-10">
					<LandingNavbar.Brand name="D2AI Lab" hasDropdown={false} />
					<LandingNavbar.Nav items={LANDING_NAV_ITEMS} />
				</div>
				<LandingNavbar.Actions
					searchLabel="Search"
					onSearchClick={handleSearch}
					currentLang={currentLang}
					onSelectLanguage={handleSelectLanguage}
					items={LANDING_NAV_ITEMS}
				>
					<AuthButton />
				</LandingNavbar.Actions>
			</LandingNavbar.Root>

			{/* Main Content Sections */}
			<main className="flex flex-col pb-20">
				{/* 1. Full-Width Typography Hero */}
				<LandingHero.Root>
					<div className="flex flex-col gap-10 sm:gap-14 lg:gap-18">
						{/* Row 1: Line 1 + Large Pure IconTableSpark */}
						<div className="flex flex-wrap items-center gap-8 sm:gap-14 md:gap-20 lg:gap-28 xl:gap-36">
							<LandingHero.Title>
								{LANDING_HERO_DATA.titleLine1}
							</LandingHero.Title>

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
									{LANDING_HERO_DATA.description}
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
								<LandingHero.Title>
									{LANDING_HERO_DATA.titleLine2}
								</LandingHero.Title>
							</div>
						</LandingHero.Row>
					</div>
				</LandingHero.Root>

				{/* 2. Section 1: Amplifying Human Ingenuity & Film */}
				<LandingFilm
					title={LANDING_FILM_DATA.title}
					description={LANDING_FILM_DATA.description}
					brandText={LANDING_FILM_DATA.brandText}
				/>

				{/* 3. Section 2: Quote / Leader Statement Banner with GSAP Scroll Trigger */}
				<LandingQuote
					quote={LANDING_QUOTE_DATA.quote}
					authorName={LANDING_QUOTE_DATA.authorName}
					authorRole={LANDING_QUOTE_DATA.authorRole}
				/>

				{/* 4. Section 3: Read the Latest (Publications) */}
				<LandingLatest
					title="Read the latest"
					items={LANDING_LATEST_ITEMS}
					onSeePublications={handleSeePublications}
				/>

				{/* 5. Section 4: We Work Across Domains (Positioned between Publications and Projects) */}
				<LandingDomains
					title={LANDING_DOMAINS_DATA.title}
					description={LANDING_DOMAINS_DATA.description}
					ctaLabel={LANDING_DOMAINS_DATA.ctaLabel}
					onCtaClick={handleExploreDomains}
				/>

				{/* 6. Section 5: Projects / Applied Apps (Header Left/Right + Spotlight App + 2 Sub-Apps) */}
				<LandingProjects
					title="Applied platforms & initiatives"
					hero={LANDING_PROJECT_HERO}
					items={LANDING_PROJECT_ITEMS}
					onSeeProjects={handleSeeProjects}
					onHeroCtaClick={handleExploreFeaturedApp}
				/>

				{/* 7. Section 6: Help Us Shape The Future (Left: Careers, Right: Seminars) */}
				<LandingFuture
					title="Help us shape the future"
					items={LANDING_FUTURE_ITEMS}
				/>
			</main>

			{/* Footer: Google Research initiatives + Google Labs Big Typography */}
			<LandingFooter brandName="D2AI Lab" />
		</LandingLayout>
	);
}
