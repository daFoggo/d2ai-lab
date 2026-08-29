import { createFileRoute } from "@tanstack/react-router";
import type { TProject } from "@/features/projects";
import { Projects } from "./-components/projects-grid";

/* Fake data giả định — khi có backend sẽ thay bằng query thật. */
const FEATURED: TProject = {
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

const ProjectsPage = () => {
	return (
		<Projects
			eyebrow="Projects"
			title="Applied platforms & initiatives"
			description="We turn research into working software. Explore the platforms, applications, and open tools built by the lab."
			featured={FEATURED}
			projects={PROJECTS}
		/>
	);
};

export const Route = createFileRoute("/{-$locale}/projects/")({
	component: ProjectsPage,
});
