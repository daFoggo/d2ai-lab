import { createFileRoute } from "@tanstack/react-router";
import type { TTeam } from "@/features/teams";
import { Teams } from "./-components/teams-page";

/* Fake data giả định — khi có backend sẽ thay bằng query thật. */
const TEAMS: TTeam[] = [
	{
		id: "team-ai-ml",
		name: "AI/ML Foundations",
		tagline: "Fundamental and applied machine intelligence",
		description:
			"We study the theory and practice of learning from data — from neural architecture design to scaling and robustness — that underpins every applied system in the lab.",
		members: [
			{
				id: "m-1",
				name: "Huynh Phan Ly",
				role: "Director",
				area: "Responsible AI",
				initials: "HL",
			},
			{
				id: "m-2",
				name: "Le Quang Huy",
				role: "PhD Student",
				area: "AI/ML Foundations",
				initials: "LH",
			},
			{
				id: "m-3",
				name: "Bui Hoang Nam",
				role: "PhD Student",
				area: "Responsible AI",
				initials: "BN",
			},
		],
	},
	{
		id: "team-applied",
		name: "Applied AI & Impact",
		tagline: "Turning research into working products",
		description:
			"This team closes the gap between an idea and a deployed solution — building evaluable, maintainable systems across education, governance, and smart living.",
		members: [
			{
				id: "m-4",
				name: "Nguyen Thi An",
				role: "Associate Professor",
				area: "Smart Education",
				initials: "NA",
			},
			{
				id: "m-5",
				name: "Pham Thu Trang",
				role: "Researcher",
				area: "Public Governance",
				initials: "PT",
			},
			{
				id: "m-6",
				name: "Vo Duy Khoa",
				role: "Research Engineer",
				area: "Optimization",
				initials: "VK",
			},
		],
	},
	{
		id: "team-intelligent-systems",
		name: "Intelligent Systems & IoT",
		tagline: "Intelligence that lives in the physical world",
		description:
			"Embedding intelligence into classrooms, cities, and clinics through edge computing and privacy-preserving sensing that serves people directly.",
		members: [
			{
				id: "m-7",
				name: "Tran Minh Duc",
				role: "Researcher",
				area: "Ambient IoT",
				initials: "TD",
			},
			{
				id: "m-8",
				name: "Dang Mai Linh",
				role: "Research Assistant",
				area: "Climate & Ecology",
				initials: "DL",
			},
		],
	},
];

const TeamsPage = () => {
	return (
		<Teams
			eyebrow="Teams"
			title="The people behind the lab"
			description="Our researchers are embedded in teams across the lab — from fundamental machine learning to the intelligent systems that bring it to life."
			teams={TEAMS}
		/>
	);
};

export const Route = createFileRoute("/{-$locale}/teams/")({
	component: TeamsPage,
});
