import { createFileRoute } from "@tanstack/react-router";
import type { TCareer } from "@/features/careers";
import { Careers } from "@/features/careers";

export const Route = createFileRoute("/{-$locale}/careers")({
	component: CareersPage,
});

/* Fake data giả định — khi có backend sẽ thay bằng query thật. */
const ROLES: TCareer[] = [
	{
		id: "role-1",
		title: "Research Scientist — Foundation Models",
		department: "AI/ML FOUNDATIONS",
		type: "FULL-TIME",
		description:
			"Drive research on multimodal learning and scaling laws, with a focus on publishable, reproducible science.",
	},
	{
		id: "role-2",
		title: "Machine Learning Engineer",
		department: "APPLIED AI",
		type: "FULL-TIME",
		description:
			"Productize lab research into working platforms, from adaptive learning to civic document intelligence.",
	},
	{
		id: "role-3",
		title: "PhD Student — Responsible AI",
		department: "RESPONSIBLE AI",
		type: "PH.D.",
		description:
			"Join our chain-of-evidence research on verifiable, auditable AI for high-stakes domains.",
	},
	{
		id: "role-4",
		title: "Research Intern — Ambient IoT",
		department: "AMBIENT IOT",
		type: "INTERNSHIP",
		description:
			"Work on privacy-preserving telemetry and on-device models with our engineering team.",
	},
	{
		id: "role-5",
		title: "Research Assistant — Smart Education",
		department: "SMART EDUCATION",
		type: "PART-TIME",
		description:
			"Support adaptive curriculum research with data annotation, evaluation, and experiment tooling.",
	},
];

function CareersPage() {
	return (
		<Careers
			eyebrow="Careers"
			title="Join the lab"
			description="From Hanoi to global research networks, we're looking for talented scientists, engineers, interns, and students to join our core AI and intelligent computing labs."
			roles={ROLES}
		/>
	);
}
