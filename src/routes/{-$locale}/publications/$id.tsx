import { createFileRoute, notFound } from "@tanstack/react-router";
import type { TPublicationDetail } from "@/features/publications";
import { PublicationDetail } from "@/features/publications";
import { useI18n } from "@/lib/i18n";

/* Fake data giả định — khi có backend sẽ thay bằng query thật. */
const PUBLICATIONS: TPublicationDetail[] = [
	{
		id: "pub-1",
		title:
			"Empty shelves or lost keys? Recall is the bottleneck for parametric factuality",
		venue: "arXiv",
		year: 2026,
		authors: ["Huynh Phan Ly", "Le Quang Huy", "Bui Hoang Nam"],
		tags: ["PARAMETRIC FACTUALITY", "MEMORY"],
		type: "RESEARCH",
		abstract:
			"Large language models often fail to recall rare but critical facts, a bottleneck that limits their reliability in high-stakes settings. We study when parametric knowledge retrieval breaks down and show that hybrid memory systems — combining parametric recall with non-parametric retrieval — can substantially close the gap.",
		highlights: [
			"We identify the recall bottleneck as a core failure mode of parametric factuality.",
			"Hybrid memory systems close the gap between parametric and non-parametric knowledge.",
			"We release evaluation harnesses that probe recall under distribution shift.",
		],
		links: [
			{ label: "Paper", href: "https://arxiv.org" },
			{ label: "Code", href: "https://github.com" },
		],
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
		abstract:
			"We extend AMIE to consultations that reason over both audio and visual clinical signals, moving from text-only dialogue toward multimodal diagnostic support in real clinical settings.",
		links: [{ label: "Paper", href: "https://arxiv.org" }],
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
		abstract:
			"Autonomous research agents risk hallucinating evidence. We introduce a Chain-of-Evidence framework that traces every scientific claim back to an auditable source, enabling trustworthy self-driving research pipelines.",
		links: [
			{ label: "Paper", href: "https://ijcai.org" },
			{ label: "Code", href: "https://github.com" },
		],
	},
	{
		id: "pub-4",
		title: "Adaptive curriculum generation from cognitive diagnostics",
		venue: "AAAI",
		year: 2025,
		authors: ["Nguyen Thi An", "Dang Mai Linh"],
		tags: ["SMART EDUCATION", "GENERATIVE"],
		type: "RESEARCH",
		abstract:
			"Cognitive diagnostics are typically static. We close the loop between student state estimation and generative lesson planning, producing curricula that adapt to learners in real time.",
		links: [{ label: "Paper", href: "https://aaai.org" }],
	},
	{
		id: "pub-5",
		title: "Privacy-preserving telemetry for ambient sensing",
		venue: "MobiCom",
		year: 2025,
		authors: ["Tran Minh Duc", "Vo Duy Khoa"],
		tags: ["AMBIENT IOT", "PRIVACY"],
		type: "RESEARCH",
		abstract:
			"Ambient IoT produces rich telemetry but risks surveillance. We design on-device inference and differential privacy so intelligence is derived without raw data offboarding.",
		links: [{ label: "Paper", href: "https://sigcomm.org" }],
	},
	{
		id: "pub-6",
		title: "Evaluating document intelligence for civic administration",
		venue: "FAccT",
		year: 2024,
		authors: ["Pham Thu Trang", "Huynh Phan Ly"],
		tags: ["PUBLIC GOVERNANCE", "EVALUATION"],
		type: "RESEARCH",
		abstract:
			"Automated triage of civic documents needs rigorous benchmarks. We build annotated corpora and human-in-the-loop evaluation for governance AI.",
		links: [{ label: "Paper", href: "https://facctconference.org" }],
	},
	{
		id: "pub-7",
		title: "A survey of optimization under uncertainty in practice",
		venue: "Lab Blog",
		year: 2024,
		authors: ["Vo Duy Khoa"],
		tags: ["OPTIMIZATION", "SURVEY"],
		type: "BLOG",
		abstract:
			"A practical survey of optimization and decision-making under uncertainty, connecting algorithmic foundations to deployed systems.",
		links: [{ label: "Read article", href: "https://d2ailab.dev" }],
	},
];

const PublicationDetailPage = () => {
	const publication = Route.useLoaderData();
	const { locale } = useI18n();
	return <PublicationDetail publication={publication} locale={locale} />;
};

export const Route = createFileRoute("/{-$locale}/publications/$id")({
	component: PublicationDetailPage,
	loader: ({ params }) => {
		const publication = PUBLICATIONS.find((p) => p.id === params.id);
		if (!publication) {
			throw notFound();
		}
		return publication;
	},
});
