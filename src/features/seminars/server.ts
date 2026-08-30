import "@tanstack/react-start/server-only";

import type { TSeminar, TSeminarDetail } from "./schemas";

/*
 * Query contract: trả data hợp lệ hoặc throw, không bao giờ trả fallback che lỗi.
 */

/* Giả lập độ trễ mạng để demo loading state; bỏ khi có backend thật. */
const MOCK_LATENCY_MS = 120;

const delay = () =>
	new Promise((resolve) => setTimeout(resolve, MOCK_LATENCY_MS));

const SEMINARS: TSeminarDetail[] = [
	{
		id: "sem-1",
		title: "From Chain-of-Evidence to verifiable autonomous science",
		speaker: "Prof. Sarah Chen",
		role: "University of Toronto",
		date: "SEP 18",
		status: "UPCOMING",
		time: "14:00 - 15:30",
		location: "Main Auditorium & Online",
		description:
			"Autonomous research agents risk hallucinating evidence and producing unverifiable claims. This seminar walks through the Chain-of-Evidence framework that traces every scientific claim back to an auditable source, and how it can be used to build trustworthy self-driving research pipelines.",
		speakers: [
			{
				id: "sp-1",
				name: "Ms. Sarah Chen",
				role: "Professor, University of Toronto",
				photo: "/demo-seminar/dat.jpg",
				socials: [
					{ type: "x", label: "X profile", href: "https://x.com" },
					{
						type: "linkedin",
						label: "LinkedIn profile",
						href: "https://linkedin.com",
					},
				],
			},
			{
				id: "sp-2",
				name: "Mr. James Wright",
				role: "Postdoc Researcher, D2AI Lab",
				photo: "/demo-seminar/quang.jpg",
				socials: [{ type: "x", label: "X profile", href: "https://x.com" }],
			},
			{
				id: "sp-3",
				name: "Dr. Elisa Moreau",
				role: "Associate Professor, Sorbonne",
				socials: [
					{
						type: "linkedin",
						label: "LinkedIn profile",
						href: "https://linkedin.com",
					},
				],
			},
			{
				id: "sp-4",
				name: "Prof. Nguyen Minh Khoa",
				role: "Head of AI, D2AI Lab",
				socials: [{ type: "x", label: "X profile", href: "https://x.com" }],
			},
			{
				id: "sp-5",
				name: "Dr. Aman Sethi",
				role: "Senior Researcher, Google DeepMind",
				socials: [
					{ type: "x", label: "X profile", href: "https://x.com" },
					{
						type: "linkedin",
						label: "LinkedIn profile",
						href: "https://linkedin.com",
					},
				],
			},
		],
		registrationUrl: "https://forms.gle/example",
	},
	{
		id: "sem-2",
		title: "Learning in the wild: robustness of foundation models",
		speaker: "Dr. Michael Ross",
		role: "Google DeepMind",
		date: "SEP 25",
		status: "UPCOMING",
		time: "16:00 - 17:30",
		location: "Room B204",
		description:
			"Foundation models are deployed in shifting, uncontrolled environments. We examine fragility under distribution shift, the sources of spurious correlations, and practical robustness techniques that keep models reliable when the data changes under our feet.",
		speakers: [
			{
				id: "sp-3",
				name: "Mr. Michael Ross",
				role: "Research Scientist, Google DeepMind",
				socials: [
					{ type: "x", label: "X profile", href: "https://x.com" },
					{
						type: "linkedin",
						label: "LinkedIn profile",
						href: "https://linkedin.com",
					},
				],
			},
		],
		registrationUrl: "https://forms.gle/example",
	},
	{
		id: "sem-3",
		title: "Adaptive education at scale: diagnostics and generative curricula",
		speaker: "Prof. Nguyen Thi An",
		role: "D2AI Lab",
		date: "AUG 28",
		status: "PAST",
		time: "09:00 - 10:30",
		location: "Main Auditorium",
		description:
			"Cognitive diagnostics are typically static. We close the loop between student state estimation and generative lesson planning, producing curricula that adapt to learners in real time, and share lessons from deploying at scale.",
		speakers: [
			{
				id: "sp-4",
				name: "Prof. Nguyen Thi An",
				role: "Professor, D2AI Lab",
				socials: [{ type: "x", label: "X profile", href: "https://x.com" }],
			},
		],
	},
	{
		id: "sem-4",
		title: "Privacy-preserving machine learning for ambient IoT",
		speaker: "Dr. Tran Minh Duc",
		role: "D2AI Lab",
		date: "AUG 14",
		status: "PAST",
		time: "14:00 - 15:30",
		location: "Room C101",
		description:
			"Ambient IoT produces rich telemetry but risks surveillance. We design on-device inference and differential privacy so intelligence is derived without raw data offboarding.",
		speakers: [
			{
				id: "sp-5",
				name: "Dr. Tran Minh Duc",
				role: "Research Fellow, D2AI Lab",
				socials: [
					{
						type: "linkedin",
						label: "LinkedIn profile",
						href: "https://linkedin.com",
					},
				],
			},
		],
	},
	{
		id: "sem-5",
		title:
			"Evaluating AI in public governance: benchmarks and human-in-the-loop",
		speaker: "Pham Thu Trang",
		role: "D2AI Lab",
		date: "JUL 30",
		status: "PAST",
		time: "10:00 - 11:30",
		location: "Main Auditorium",
		description:
			"Automated triage of civic documents needs rigorous benchmarks. We build annotated corpora and human-in-the-loop evaluation for governance AI.",
		speakers: [
			{
				id: "sp-6",
				name: "Pham Thu Trang",
				role: "Senior Researcher, D2AI Lab",
				socials: [{ type: "x", label: "X profile", href: "https://x.com" }],
			},
		],
	},
];

/* List page chỉ cần subset — map từ full detail để tránh duplicate data. */
const toSeminar = ({
	id,
	title,
	speaker,
	role,
	date,
	status,
	href,
}: TSeminarDetail): TSeminar => ({
	id,
	title,
	speaker,
	role,
	date,
	status,
	href,
});

export async function getSeminars(): Promise<TSeminar[]> {
	await delay();
	return SEMINARS.map(toSeminar);
}

export async function getSeminarDetail(id: string): Promise<TSeminarDetail> {
	await delay();
	const seminar = SEMINARS.find((item) => item.id === id);
	if (!seminar) {
		throw new Error(`Seminar not found: ${id}`);
	}
	return seminar;
}

const UPCOMING_SEMINAR: TSeminar = {
	id: "sem-1",
	title: "From Chain-of-Evidence to verifiable autonomous science",
	speaker: "Prof. Sarah Chen",
	role: "University of Toronto",
	date: "SEP 18",
	status: "UPCOMING",
};

export async function getUpcomingSeminar(): Promise<TSeminar> {
	await delay();
	return UPCOMING_SEMINAR;
}
