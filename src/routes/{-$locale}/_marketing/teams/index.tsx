import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { teamsQueryOptions } from "@/features/teams";
import { Teams } from "./-components/teams-page";

const TeamsPage = () => {
	const { data: teams } = useSuspenseQuery(teamsQueryOptions());

	return (
		<Teams
			eyebrow="Teams"
			title="The people behind the lab"
			description="Our researchers are embedded in teams across the lab — from fundamental machine learning to the intelligent systems that bring it to life."
			teams={teams}
		/>
	);
};

export const Route = createFileRoute("/{-$locale}/_marketing/teams/")({
	loader: async ({ context }) => {
		await context.queryClient.query(teamsQueryOptions());
	},
	component: TeamsPage,
});
