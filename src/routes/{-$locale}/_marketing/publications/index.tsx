import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { publicationsQueryOptions } from "@/features/publications";
import { Publications } from "./-components/publications-grid";

const PublicationsPage = () => {
	const { data: publications } = useSuspenseQuery(publicationsQueryOptions());

	return (
		<Publications
			eyebrow="Publications"
			title="The latest research from the lab"
			description="Peer-reviewed papers, preprints, and write-ups that capture the ideas behind our research areas and directions."
			publications={publications}
		/>
	);
};

export const Route = createFileRoute("/{-$locale}/_marketing/publications/")({
	loader: async ({ context }) => {
		await context.queryClient.query(publicationsQueryOptions());
	},
	component: PublicationsPage,
});
