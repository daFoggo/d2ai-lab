import "@tanstack/react-start/server-only";

import type {
	TResearchArea,
	TResearchAreaPreview,
	TResearchDirection,
	TResearchGap,
} from "./schemas";

/*
 * Query contract: trả data hợp lệ hoặc throw, không bao giờ trả fallback che lỗi.
 */

/* Giả lập độ trễ mạng để demo loading state; bỏ khi có backend thật. */
const MOCK_LATENCY_MS = 120;

const delay = () =>
	new Promise((resolve) => setTimeout(resolve, MOCK_LATENCY_MS));

const RESEARCH_AREAS: TResearchArea[] = [
	{
		id: "ai-ml-foundations",
		title: "AI/ML Foundations",
		tag: "NEURAL ARCHITECTURES",
		description:
			"Core research on deep learning architectures, representation learning, training dynamics, and scaling laws that underpin every applied system we build.",
	},
	{
		id: "smart-education",
		title: "Smart Education",
		tag: "ADAPTIVE SYSTEMS",
		description:
			"Personalized learning platforms combining cognitive diagnostics with generative curriculum planning to empower students in real time.",
	},
	{
		id: "ambient-iot",
		title: "Ambient IoT",
		tag: "TELEMETRY & SENSORS",
		description:
			"Ambient intelligence, edge sensing, and low-power telemetry systems that turn physical environments into measurable, responsive spaces.",
	},
	{
		id: "public-governance",
		title: "Public Governance",
		tag: "DOCUMENT INTELLIGENCE",
		description:
			"Intelligent document triage and automated public administrative assistants that make government services faster and more transparent.",
	},
	{
		id: "customer-experience",
		title: "Customer Experience",
		tag: "CONVERSATIONAL AI",
		description:
			"Conversational AI and natural language systems that deliver helpful, trustworthy experiences across products and services.",
	},
	{
		id: "optimization",
		title: "Optimization",
		tag: "ALGORITHMIC FOUNDATIONS",
		description:
			"Algorithmic foundations for combinatorial optimization, search, and decision-making under uncertainty.",
	},
	{
		id: "responsible-ai",
		title: "Responsible AI",
		tag: "ETHICAL ML",
		description:
			"Fairness, transparency, accountability, and safety research that keeps human values at the center of every AI system.",
	},
	{
		id: "climate-ecology",
		title: "Climate & Ecology",
		tag: "SPATIAL SENSING",
		description:
			"Spatial sensing and machine learning applied to climate monitoring, ecological tracking, and environmental forecasting.",
	},
];

export async function getResearchAreas(): Promise<TResearchArea[]> {
	await delay();
	return RESEARCH_AREAS;
}

const RESEARCH_DIRECTIONS: TResearchDirection[] = [
	{
		id: "direction-1",
		index: "01",
		title: "From data to intelligence",
		description:
			"Push the boundaries of learning from ever-richer data — multimodal, temporal, and structured — so that models reason about the world, not just parrot patterns.",
		focus: ["Multimodal learning", "Foundation models", "Self-supervision"],
	},
	{
		id: "direction-2",
		index: "02",
		title: "From ideas to impact",
		description:
			"Close the gap between a published idea and a deployed solution by building evaluable, maintainable systems that survive contact with the real world.",
		focus: ["Applied AI", "Evaluation", "Productization"],
	},
	{
		id: "direction-3",
		index: "03",
		title: "Verifiable and trustworthy AI",
		description:
			"Make every model decision auditable and every claim evidence-backed, so AI can be a trusted partner in science, governance, and healthcare.",
		focus: ["Chain-of-evidence", "Responsible AI", "Explainability"],
	},
	{
		id: "direction-4",
		index: "04",
		title: "Ambient intelligence for society",
		description:
			"Embed intelligence into the physical world — classrooms, cities, clinics — through edge computing and privacy-preserving sensing that serves people directly.",
		focus: ["Ambient IoT", "Edge AI", "Smart environments"],
	},
];

export async function getResearchDirections(): Promise<TResearchDirection[]> {
	await delay();
	return RESEARCH_DIRECTIONS;
}

const RESEARCH_GAPS: TResearchGap[] = [
	{
		id: "gap-1",
		title: "Verifiable autonomous research via Chain-of-Evidence",
		description:
			"Autonomous agents hallucinate under pressure. We are building a framework where every scientific claim is traced back to auditable evidence, enabling trustworthy self-driving research pipelines.",
		status: "IN PROGRESS",
		area: "AI/ML FOUNDATIONS",
	},
	{
		id: "gap-2",
		title:
			"Empty shelves or lost keys? Recall as the bottleneck for parametric factuality",
		description:
			"Large models struggle to recall rare but critical facts. We investigate when parametric knowledge retrieval fails and how hybrid memory systems can close the gap.",
		status: "OPEN",
		area: "AI/ML FOUNDATIONS",
	},
	{
		id: "gap-3",
		title: "Expert-level audio-visual clinical consultations",
		description:
			"Advancing AMIE towards consultations that reason over both audio and visual clinical signals, moving from text-only dialogue to multimodal diagnostic support.",
		status: "IN PROGRESS",
		area: "RESPONSIBLE AI",
	},
	{
		id: "gap-4",
		title: "Real-time adaptive curriculum generation",
		description:
			"Cognitive diagnostics are static; curricula should be living. We are closing the loop between student state estimation and generative lesson planning in real time.",
		status: "OPEN",
		area: "SMART EDUCATION",
	},
	{
		id: "gap-5",
		title: "Privacy-preserving ambient sensing",
		description:
			"Ambient IoT produces rich telemetry but risks surveillance. We are designing on-device inference and differential privacy so intelligence never requires raw data offboarding.",
		status: "COLLABORATION",
		area: "AMBIENT IOT",
	},
	{
		id: "gap-6",
		title: "Ground-truth evaluation for public document intelligence",
		description:
			"Automated triage of civic documents needs rigorous benchmarks. We are building annotated corpora and human-in-the-loop evaluation for governance AI.",
		status: "OPEN",
		area: "PUBLIC GOVERNANCE",
	},
];

export async function getResearchGaps(): Promise<TResearchGap[]> {
	await delay();
	return RESEARCH_GAPS;
}

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
