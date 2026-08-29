import "@tanstack/react-start/server-only";

import type { TProjectPreviewHero, TProjectPreviewItem } from "./schemas";

/*
 * Query contract: trả data hợp lệ hoặc throw, không bao giờ trả fallback che lỗi.
 */

/* Giả lập độ trễ mạng để demo loading state; bỏ khi có backend thật. */
const MOCK_LATENCY_MS = 120;

const delay = () =>
	new Promise((resolve) => setTimeout(resolve, MOCK_LATENCY_MS));

const PROJECT_HERO: TProjectPreviewHero = {
	title: "Adaptive Learning Platform",
	category: "SMART EDUCATION APP",
	description:
		"A personalized learning web application combining cognitive diagnostics and generative curriculum planning to empower students in real-time.",
	ctaLabel: "View project",
	to: "/{-$locale}/projects",
};

const PROJECTS: TProjectPreviewItem[] = [
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
	return { hero: PROJECT_HERO, items: PROJECTS };
}
