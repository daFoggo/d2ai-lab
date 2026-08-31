import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { researchDirectionsQueryOptions } from "@/features/research";
import { ResearchDirections } from "./-components/research-directions";

const ResearchDirectionsPage = () => {
	const { data: directions } = useSuspenseQuery(
		researchDirectionsQueryOptions(),
	);

	return (
		<ResearchDirections
			eyebrow="Research directions"
			title="Long-term vision and strategy"
			description="Four strategic directions define where the lab is heading over the next five years. They are intentionally ambitious — each one connects foundational science to a measurable societal outcome."
			directions={directions}
		/>
	);
};

export const Route = createFileRoute(
	"/{-$locale}/_marketing/research/directions",
)({
	head: () => ({
		meta: [
			{ title: "Research Directions — D2AI Lab" },
			{
				name: "description",
				content:
					"Long-term vision and strategic directions connecting foundational AI science to measurable societal impact.",
			},
		],
	}),
	loader: async ({ context }) => {
		await context.queryClient.query(researchDirectionsQueryOptions());
	},
	component: ResearchDirectionsPage,
});
