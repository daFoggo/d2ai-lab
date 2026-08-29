import { createFileRoute } from "@tanstack/react-router";
import type { TPublication } from "@/features/publications";
import { Publications } from "./-components/publications-grid";

/* Fake data giả định — khi có backend sẽ thay bằng query thật. */
const PUBLICATIONS: TPublication[] = [
	{
		id: "pub-1",
		title:
			"Empty shelves or lost keys? Recall is the bottleneck for parametric factuality",
		venue: "arXiv",
		year: 2026,
		authors: ["Huynh Phan Ly", "Le Quang Huy", "Bui Hoang Nam"],
		tags: ["PARAMETRIC FACTUALITY", "MEMORY"],
		type: "RESEARCH",
	},
	{
		id: "pub-2",
		title:
			"Advancing AMIE towards expert-level audio-visual clinical consultations",
		venue: "arXiv",
		year: 2026,
		authors: ["Huynh Phan Ly", "Pham Thu Trang"],
		tags: ["CLINICAL AI", "MULTIMODAL"],
		type: "RESEARCH",
	},
	{
		id: "pub-3",
		title:
			"Science One Framework: A verifiable autonomous research framework via Chain-of-Evidence",
		venue: "IJCAI",
		year: 2025,
		authors: ["Bui Hoang Nam", "Huynh Phan Ly"],
		tags: ["CHAIN OF EVIDENCE", "AUTONOMOUS AGENTS"],
		type: "RESEARCH",
	},
	{
		id: "pub-4",
		title: "Adaptive curriculum generation from cognitive diagnostics",
		venue: "AAAI",
		year: 2025,
		authors: ["Nguyen Thi An", "Dang Mai Linh"],
		tags: ["SMART EDUCATION", "GENERATIVE"],
		type: "RESEARCH",
	},
	{
		id: "pub-5",
		title: "Privacy-preserving telemetry for ambient sensing",
		venue: "MobiCom",
		year: 2025,
		authors: ["Tran Minh Duc", "Vo Duy Khoa"],
		tags: ["AMBIENT IOT", "PRIVACY"],
		type: "RESEARCH",
	},
	{
		id: "pub-6",
		title: "Evaluating document intelligence for civic administration",
		venue: "FAccT",
		year: 2024,
		authors: ["Pham Thu Trang", "Huynh Phan Ly"],
		tags: ["PUBLIC GOVERNANCE", "EVALUATION"],
		type: "RESEARCH",
	},
	{
		id: "pub-7",
		title: "A survey of optimization under uncertainty in practice",
		venue: "Lab Blog",
		year: 2024,
		authors: ["Vo Duy Khoa"],
		tags: ["OPTIMIZATION", "SURVEY"],
		type: "BLOG",
	},
];

const PublicationsPage = () => {
	return (
		<Publications
			eyebrow="Publications"
			title="The latest research from the lab"
			description="Peer-reviewed papers, preprints, and write-ups that capture the ideas behind our research areas and directions."
			publications={PUBLICATIONS}
		/>
	);
};

export const Route = createFileRoute("/{-$locale}/publications/")({
	component: PublicationsPage,
});
