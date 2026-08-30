import "@tanstack/react-start/server-only";

import type {
	TProject,
	TProjectPreviewHero,
	TProjectPreviewItem,
} from "./schemas";

/*
 * Query contract: trả data hợp lệ hoặc throw, không bao giờ trả fallback che lỗi.
 */

/* Giả lập độ trễ mạng để demo loading state; bỏ khi có backend thật. */
const MOCK_LATENCY_MS = 120;

const delay = () =>
	new Promise((resolve) => setTimeout(resolve, MOCK_LATENCY_MS));

const FEATURED_PROJECT: TProject = {
	id: "app-featured",
	title: "Adaptive Learning Platform",
	category: "SMART EDUCATION APP",
	description:
		"A personalized learning web application combining cognitive diagnostics and generative curriculum planning to empower students in real time.",
	href: "#",
};

const PROJECTS: TProject[] = [
	{
		id: "app-1",
		title:
			"UrbanSense: Real-time environmental sensor dashboard and air quality forecasting system",
		category: "SMART LIVING APP",
		description:
			"Low-power sensors feed an edge dashboard that forecasts air quality for neighborhoods in real time.",
		href: "#",
	},
	{
		id: "app-2",
		title:
			"CivicFlow: Intelligent document triage and automated public administrative assistant",
		category: "CIVIC TECH APP",
		description:
			"Automated triage of civic documents with auditable decision records for public administration.",
		href: "#",
	},
	{
		id: "app-3",
		title: "CareMate: Conversational support for clinical consultations",
		category: "CLINICAL AI APP",
		description:
			"Audio-visual consultation assistant that supports clinicians with evidence-backed suggestions.",
		href: "#",
	},
	{
		id: "app-4",
		title: "GridSense: Optimization toolkit for logistics",
		category: "OPTIMIZATION APP",
		description:
			"Combinatorial optimization engine for routing and scheduling problems under uncertainty.",
		href: "#",
	},
	{
		id: "app-5",
		title: "EcoTrack: Spatial sensing for climate monitoring",
		category: "CLIMATE & ECOLOGY APP",
		description:
			"Spatial sensing and machine learning applied to ecological tracking and environmental forecasting.",
		href: "#",
	},
];

export async function getProjects(): Promise<{
	featured: TProject;
	items: TProject[];
}> {
	await delay();
	return { featured: FEATURED_PROJECT, items: PROJECTS };
}

const PROJECT_HERO: TProjectPreviewHero = {
	title: "Adaptive Learning Platform",
	category: "SMART EDUCATION APP",
	description:
		"A personalized learning web application combining cognitive diagnostics and generative curriculum planning to empower students in real-time.",
	ctaLabel: "View project",
	to: "/{-$locale}/projects",
};

const PREVIEW_PROJECTS: TProjectPreviewItem[] = [
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

export async function getProjectPreview(): Promise<{
	hero: TProjectPreviewHero;
	items: TProjectPreviewItem[];
}> {
	await delay();
	return { hero: PROJECT_HERO, items: PREVIEW_PROJECTS };
}
