import { createFileRoute } from "@tanstack/react-router";
import type { TSeminar } from "@/features/seminars";
import { Seminars } from "./-components/seminars-list";

/* Fake data giả định — khi có backend sẽ thay bằng query thật. */
const SEMINARS: TSeminar[] = [
	{
		id: "sem-1",
		title: "From Chain-of-Evidence to verifiable autonomous science",
		speaker: "Prof. Sarah Chen",
		role: "University of Toronto",
		date: "SEP 18",
		status: "UPCOMING",
	},
	{
		id: "sem-2",
		title: "Learning in the wild: robustness of foundation models",
		speaker: "Dr. Michael Ross",
		role: "Google DeepMind",
		date: "SEP 25",
		status: "UPCOMING",
	},
	{
		id: "sem-3",
		title: "Adaptive education at scale: diagnostics and generative curricula",
		speaker: "Prof. Nguyen Thi An",
		role: "D2AI Lab",
		date: "AUG 28",
		status: "PAST",
	},
	{
		id: "sem-4",
		title: "Privacy-preserving machine learning for ambient IoT",
		speaker: "Dr. Tran Minh Duc",
		role: "D2AI Lab",
		date: "AUG 14",
		status: "PAST",
	},
	{
		id: "sem-5",
		title:
			"Evaluating AI in public governance: benchmarks and human-in-the-loop",
		speaker: "Pham Thu Trang",
		role: "D2AI Lab",
		date: "JUL 30",
		status: "PAST",
	},
];

const SeminarsPage = () => {
	return (
		<Seminars
			eyebrow="Seminars"
			title="Seminars & academic exchange"
			description="Our regular seminar series brings together international scholars and lab members for technical knowledge exchange."
			seminars={SEMINARS}
		/>
	);
};

export const Route = createFileRoute("/{-$locale}/seminars/")({
	component: SeminarsPage,
});
