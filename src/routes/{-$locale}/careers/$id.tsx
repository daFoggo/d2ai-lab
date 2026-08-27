import { createFileRoute, notFound } from "@tanstack/react-router";
import type { TCareerDetail } from "@/features/careers";
import { CareerDetail } from "@/features/careers";
import { useI18n } from "@/lib/i18n";

/* Fake data giả định — khi có backend sẽ thay bằng query thật. */
const ROLES: TCareerDetail[] = [
	{
		id: "role-1",
		title: "Research Scientist — Foundation Models",
		department: "AI/ML FOUNDATIONS",
		type: "FULL-TIME",
		location: "Hanoi / Remote",
		description:
			"Drive research on multimodal learning and scaling laws, with a focus on publishable, reproducible science that moves both the field and our applied systems forward.",
		responsibilities: [
			"Design and run experiments on multimodal learning, representation learning, and scaling behavior.",
			"Author high-quality publications for top-tier ML venues and our internal research blog.",
			"Collaborate with engineers to prototype and validate research ideas in real products.",
			"Mentor interns and PhD students while contributing to the lab's research roadmap.",
		],
		qualifications: [
			"PhD (or equivalent research experience) in machine learning, computer science, or a related field.",
			"Strong track record of published research in deep learning or foundation models.",
			"Proficiency in Python and modern deep learning frameworks.",
			"Excellent scientific writing and communication skills.",
		],
		benefits: [
			"Competitive compensation and research travel budget.",
			"Access to lab-scale compute and global academic collaborators.",
			"Flexible working arrangements and a research-first culture.",
		],
		applyUrl: "https://d2ailab.dev/careers",
	},
	{
		id: "role-2",
		title: "Machine Learning Engineer",
		department: "APPLIED AI",
		type: "FULL-TIME",
		location: "Hanoi",
		description:
			"Productize lab research into working platforms, from adaptive learning to civic document intelligence.",
		responsibilities: [
			"Build and scale ML pipelines that turn research prototypes into production systems.",
			"Own the end-to-end lifecycle of models: training, evaluation, deployment, and monitoring.",
			"Work closely with researchers to translate findings into robust, maintainable features.",
			"Champion engineering best practices across the codebase.",
		],
		qualifications: [
			"Strong software engineering skills in Python and TypeScript.",
			"Experience with ML frameworks and production ML infrastructure.",
			"Familiarity with modern web application stacks and API design.",
			"Comfortable working autonomously in a fast-moving research environment.",
		],
		benefits: [
			"Work on research with real-world impact across education and governance.",
			"Collaborative engineering team with direct access to researchers.",
			"Learning budget and conference opportunities.",
		],
		applyUrl: "https://d2ailab.dev/careers",
	},
	{
		id: "role-3",
		title: "PhD Student — Responsible AI",
		department: "RESPONSIBLE AI",
		type: "PH.D.",
		location: "Hanoi",
		description:
			"Join our chain-of-evidence research on verifiable, auditable AI for high-stakes domains.",
		responsibilities: [
			"Conduct original research on verifiability, evidence tracing, and trustworthy AI.",
			"Develop frameworks that make autonomous systems auditable and reliable.",
			"Publish findings and collaborate with international academic partners.",
		],
		qualifications: [
			"Strong background in machine learning, mathematics, or a related discipline.",
			"Excellent academic record and research curiosity.",
			"Proficiency in Python and experimental research workflows.",
		],
		benefits: [
			"Full PhD funding with dedicated supervision.",
			"International research network and collaboration opportunities.",
			"Compute, resources, and publication support.",
		],
		applyUrl: "https://d2ailab.dev/careers",
	},
	{
		id: "role-4",
		title: "Research Intern — Ambient IoT",
		department: "AMBIENT IOT",
		type: "INTERNSHIP",
		location: "Hanoi",
		description:
			"Work on privacy-preserving telemetry and on-device models with our engineering team.",
		responsibilities: [
			"Prototype on-device inference for low-power ambient sensors.",
			"Contribute to privacy-preserving data collection and evaluation pipelines.",
			"Collaborate with researchers to validate approaches on real deployments.",
		],
		qualifications: [
			"Currently pursuing a degree in computer science, EE, or a related field.",
			"Experience with Python and embedded or edge computing is a plus.",
			"Strong problem-solving and communication skills.",
		],
		benefits: [
			"Hands-on research experience with real deployments.",
			"Mentorship from senior researchers and engineers.",
			"Potential for full-time offers after graduation.",
		],
		applyUrl: "https://d2ailab.dev/careers",
	},
	{
		id: "role-5",
		title: "Research Assistant — Smart Education",
		department: "SMART EDUCATION",
		type: "PART-TIME",
		location: "Hanoi / Remote",
		description:
			"Support adaptive curriculum research with data annotation, evaluation, and experiment tooling.",
		responsibilities: [
			"Assist with data annotation, curation, and quality control.",
			"Help design and run experiments for adaptive curriculum systems.",
			"Maintain experiment logs and evaluation dashboards.",
		],
		qualifications: [
			"Undergraduate or graduate student in a quantitative discipline.",
			"Attention to detail and strong organizational skills.",
			"Familiarity with Python and data tooling is a plus.",
		],
		benefits: [
			"Flexible part-time schedule around coursework.",
			"Direct mentorship and exposure to active research projects.",
			"Pathway toward a full-time research role.",
		],
		applyUrl: "https://d2ailab.dev/careers",
	},
];

const CareerDetailPage = () => {
	const career = Route.useLoaderData();
	const { locale } = useI18n();
	return <CareerDetail career={career} locale={locale} />;
};

export const Route = createFileRoute("/{-$locale}/careers/$id")({
	component: CareerDetailPage,
	loader: ({ params }) => {
		const career = ROLES.find((item) => item.id === params.id);
		if (!career) {
			throw notFound();
		}
		return career;
	},
});
