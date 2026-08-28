import "@tanstack/react-start/server-only";

import type { TSeminar } from "@/features/seminars";
import type {
	TLandingDomainItem,
	TLandingHeroStat,
	TLandingOpportunityItem,
	TLandingPartner,
	TLandingProjectHero,
	TLandingProjectItem,
	TLandingPublicationItem,
} from "./schemas";

/*
 * NOTE — TẠM THỜI gom toàn bộ mock data ở đây cho dễ xử lí.
 * Khi có backend thật, mỗi phần phải được fetch từ feature SỞ HỮU:
 *   - upcomingSeminar  → features/seminars
 *   - publications     → features/publications
 *   - projects         → features/projects
 *   - phần còn lại thuộc landing
 * Query contract: trả data hợp lệ hoặc throw, không bao giờ trả fallback che lỗi.
 */

/* Giả lập độ trễ mạng để demo loading state; bỏ khi có backend thật. */
const MOCK_LATENCY_MS = 120;

const delay = () =>
	new Promise((resolve) => setTimeout(resolve, MOCK_LATENCY_MS));

const HERO_STATS: TLandingHeroStat[] = [
	{ value: "8", label: "Research areas" },
	{ value: "7", label: "Publications" },
	{ value: "6", label: "Active projects" },
	{ value: "5", label: "Seminars & talks" },
];

const UPCOMING_SEMINAR: TSeminar = {
	id: "sem-1",
	title: "From Chain-of-Evidence to verifiable autonomous science",
	speaker: "Prof. Sarah Chen",
	role: "University of Toronto",
	date: "SEP 18",
	status: "UPCOMING",
};

const MISSION = {
	title: "Amplifying human ingenuity",
	description:
		"We advance scientific progress through AI research, collaborating with universities, NGOs, and partners worldwide.",
};

const DOMAINS: TLandingDomainItem[] = [
	{ id: "ai-ml", tag: "NEURAL ARCHITECTURES", title: "AI/ML Foundations" },
	{
		id: "smart-education",
		tag: "ADAPTIVE SYSTEMS",
		title: "Smart Education",
	},
	{ id: "ambient-iot", tag: "TELEMETRY & SENSORS", title: "Ambient IoT" },
	{ id: "responsible-ai", tag: "ETHICAL ML", title: "Responsible AI" },
	{
		id: "climate-ecology",
		tag: "SPATIAL SENSING",
		title: "Climate & Ecology",
	},
];

const PUBLICATIONS: TLandingPublicationItem[] = [
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
	ctaLabel: "View project",
	to: "/{-$locale}/projects",
};

const PROJECTS: TLandingProjectItem[] = [
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

const PARTNERS: TLandingPartner[] = [
	{ id: "ptit", name: "PTIT" },
	{ id: "cnu", name: "CNU" },
	{ id: "uga", name: "UGA" },
];

const OPPORTUNITIES: TLandingOpportunityItem[] = [
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

export async function getLandingHeroStats(): Promise<TLandingHeroStat[]> {
	await delay();
	return HERO_STATS;
}

export async function getLandingUpcomingSeminar(): Promise<TSeminar> {
	await delay();
	return UPCOMING_SEMINAR;
}

export async function getLandingMission(): Promise<{
	title: string;
	description: string;
}> {
	await delay();
	return MISSION;
}

export async function getLandingDomains(): Promise<TLandingDomainItem[]> {
	await delay();
	return DOMAINS;
}

export async function getLandingPublications(): Promise<
	TLandingPublicationItem[]
> {
	await delay();
	return PUBLICATIONS;
}

export async function getLandingProjects(): Promise<{
	hero: TLandingProjectHero;
	items: TLandingProjectItem[];
}> {
	await delay();
	return { hero: PROJECT_HERO, items: PROJECTS };
}

export async function getLandingPartners(): Promise<TLandingPartner[]> {
	await delay();
	return PARTNERS;
}

export async function getLandingOpportunities(): Promise<
	TLandingOpportunityItem[]
> {
	await delay();
	return OPPORTUNITIES;
}
