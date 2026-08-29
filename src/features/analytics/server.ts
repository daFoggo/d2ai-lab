import "@tanstack/react-start/server-only";

import type { TAnalyticsStat } from "./schemas";

/*
 * NOTE — stats là analytics data (aggregate counts), cross-cutting giữa home
 * page và admin dashboard tương lai → thuộc feature analytics, không phải
 * route-local.
 * Query contract: trả data hợp lệ hoặc throw, không bao giờ trả fallback che lỗi.
 */

/* Giả lập độ trễ mạng để demo loading state; bỏ khi có backend thật. */
const MOCK_LATENCY_MS = 120;

const delay = () =>
	new Promise((resolve) => setTimeout(resolve, MOCK_LATENCY_MS));

const SITE_STATS: TAnalyticsStat[] = [
	{ value: "8", label: "Research areas" },
	{ value: "7", label: "Publications" },
	{ value: "6", label: "Active projects" },
	{ value: "5", label: "Seminars & talks" },
];

export async function getSiteStats(): Promise<TAnalyticsStat[]> {
	await delay();
	return SITE_STATS;
}
