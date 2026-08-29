import { createFileRoute } from "@tanstack/react-router";
import type { TResearchGap } from "@/features/research";
import { ResearchGaps } from "./-components/research-gaps";

/* Fake data giả định — khi có backend sẽ thay bằng query thật. */
const GAPS: TResearchGap[] = [
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

const ResearchGapsPage = () => {
	return (
		<ResearchGaps
			eyebrow="Research gaps"
			title="Open challenges we are tackling"
			description="We focus on bottlenecks that block real-world impact — from factuality and verifiability to privacy and evaluation. Some are being actively solved; others are open for collaboration."
			gaps={GAPS}
		/>
	);
};

export const Route = createFileRoute("/{-$locale}/research/gaps")({
	component: ResearchGapsPage,
});
