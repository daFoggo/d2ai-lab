import { createFileRoute } from "@tanstack/react-router";
import type { TResearchArea } from "@/features/research";
import { ResearchAreas } from "@/features/research";

/* Content data stays in the source language — only UI chrome is translated. */

const AREAS: TResearchArea[] = [
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

const ResearchAreasPage = () => {
	return (
		<ResearchAreas
			eyebrow="Research areas"
			title="Areas of scientific focus"
			description="Our research spans core machine learning foundations and high-impact applied domains. Each area combines fundamental science with real-world deployment."
			areas={AREAS}
		/>
	);
};

export const Route = createFileRoute("/{-$locale}/research/areas")({
	component: ResearchAreasPage,
});
