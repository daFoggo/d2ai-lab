import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { careersQueryOptions } from "@/features/careers";
import { Careers } from "./-components/careers-list";

const CareersPage = () => {
	const { data: roles } = useSuspenseQuery(careersQueryOptions());

	return (
		<Careers
			eyebrow="Careers"
			title="Join the lab"
			description="From Hanoi to global research networks, we're looking for talented scientists, engineers, interns, and students to join our core AI and intelligent computing labs."
			roles={roles}
		/>
	);
};

export const Route = createFileRoute("/{-$locale}/_marketing/careers/")({
	loader: async ({ context }) => {
		await context.queryClient.query(careersQueryOptions());
	},
	component: CareersPage,
});
