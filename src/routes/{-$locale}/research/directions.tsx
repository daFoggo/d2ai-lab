import { createFileRoute } from "@tanstack/react-router";
import type { TResearchDirection } from "@/features/research";
import { ResearchDirections } from "./-components/research-directions";

/* Content data stays in the source language — only UI chrome is translated. */

const DIRECTIONS: TResearchDirection[] = [
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

const ResearchDirectionsPage = () => {
	return (
		<ResearchDirections
			eyebrow="Research directions"
			title="Long-term vision and strategy"
			description="Four strategic directions define where the lab is heading over the next five years. They are intentionally ambitious — each one connects foundational science to a measurable societal outcome."
			directions={DIRECTIONS}
		/>
	);
};

export const Route = createFileRoute("/{-$locale}/research/directions")({
	component: ResearchDirectionsPage,
});
