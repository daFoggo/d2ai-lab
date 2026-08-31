import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { seminarsQueryOptions } from "@/features/seminars";
import { Seminars } from "./-components/seminars-list";

const SeminarsPage = () => {
	const { data: seminars } = useSuspenseQuery(seminarsQueryOptions());

	return (
		<Seminars
			eyebrow="Seminars"
			title="Seminars & academic exchange"
			description="Our regular seminar series brings together international scholars and lab members for technical knowledge exchange."
			seminars={seminars}
		/>
	);
};

export const Route = createFileRoute("/{-$locale}/_marketing/seminars/")({
	loader: async ({ context }) => {
		await context.queryClient.query(seminarsQueryOptions());
	},
	component: SeminarsPage,
});
