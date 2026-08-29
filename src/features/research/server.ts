import "@tanstack/react-start/server-only";

import type { TResearchAreaPreview } from "./schemas";

/*
 * Query contract: trả data hợp lệ hoặc throw, không bao giờ trả fallback che lỗi.
 */

/* Giả lập độ trễ mạng để demo loading state; bỏ khi có backend thật. */
const MOCK_LATENCY_MS = 120;

const delay = () =>
	new Promise((resolve) => setTimeout(resolve, MOCK_LATENCY_MS));

const AREA_PREVIEW: TResearchAreaPreview[] = [
	{ id: "ai-ml", tag: "NEURAL ARCHITECTURES", title: "AI/ML Foundations" },
	{ id: "smart-education", tag: "ADAPTIVE SYSTEMS", title: "Smart Education" },
	{ id: "ambient-iot", tag: "TELEMETRY & SENSORS", title: "Ambient IoT" },
	{ id: "responsible-ai", tag: "ETHICAL ML", title: "Responsible AI" },
	{ id: "climate-ecology", tag: "SPATIAL SENSING", title: "Climate & Ecology" },
];

export async function getResearchAreaPreview(): Promise<
	TResearchAreaPreview[]
> {
	await delay();
	return AREA_PREVIEW;
}
