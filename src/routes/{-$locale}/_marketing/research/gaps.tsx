import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { researchGapsQueryOptions } from "@/features/research";
import { ResearchGaps } from "./-components/research-gaps";

const ResearchGapsPage = () => {
	const { data: gaps } = useSuspenseQuery(researchGapsQueryOptions());

	return (
		<ResearchGaps
			eyebrow="Research gaps"
			title="Open challenges we are tackling"
			description="We focus on bottlenecks that block real-world impact — from factuality and verifiability to privacy and evaluation. Some are being actively solved; others are open for collaboration."
			gaps={gaps}
		/>
	);
};

export const Route = createFileRoute("/{-$locale}/_marketing/research/gaps")({
	loader: async ({ context }) => {
		await context.queryClient.query(researchGapsQueryOptions());
	},
	component: ResearchGapsPage,
});
