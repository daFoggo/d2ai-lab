import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { researchAreasQueryOptions } from "@/features/research";
import { ResearchAreas } from "./-components/research-areas";

const ResearchAreasPage = () => {
	const { data: areas } = useSuspenseQuery(researchAreasQueryOptions());

	return (
		<ResearchAreas
			eyebrow="Research areas"
			title="Areas of scientific focus"
			description="Our research spans core machine learning foundations and high-impact applied domains. Each area combines fundamental science with real-world deployment."
			areas={areas}
		/>
	);
};

export const Route = createFileRoute("/{-$locale}/_marketing/research/areas")({
	head: () => ({
		meta: [
			{ title: "Research Areas — D2AI Lab" },
			{
				name: "description",
				content:
					"Discover our core areas of scientific research spanning neural architectures, smart education, ambient IoT, and responsible AI.",
			},
		],
	}),
	loader: async ({ context }) => {
		await context.queryClient.query(researchAreasQueryOptions());
	},
	component: ResearchAreasPage,
});
