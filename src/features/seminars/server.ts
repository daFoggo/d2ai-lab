import "@tanstack/react-start/server-only";

import type { TSeminar } from "./schemas";

/*
 * Query contract: trả data hợp lệ hoặc throw, không bao giờ trả fallback che lỗi.
 */

/* Giả lập độ trễ mạng để demo loading state; bỏ khi có backend thật. */
const MOCK_LATENCY_MS = 120;

const delay = () =>
	new Promise((resolve) => setTimeout(resolve, MOCK_LATENCY_MS));

const UPCOMING_SEMINAR: TSeminar = {
	id: "sem-1",
	title: "From Chain-of-Evidence to verifiable autonomous science",
	speaker: "Prof. Sarah Chen",
	role: "University of Toronto",
	date: "SEP 18",
	status: "UPCOMING",
};

export async function getUpcomingSeminar(): Promise<TSeminar> {
	await delay();
	return UPCOMING_SEMINAR;
}
