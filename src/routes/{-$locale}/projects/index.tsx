import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { projectsQueryOptions } from "@/features/projects";
import { Projects } from "./-components/projects-grid";

const ProjectsPage = () => {
	const { data } = useSuspenseQuery(projectsQueryOptions());

	return (
		<Projects
			eyebrow="Projects"
			title="Applied platforms & initiatives"
			description="We turn research into working software. Explore the platforms, applications, and open tools built by the lab."
			featured={data.featured}
			projects={data.items}
		/>
	);
};

export const Route = createFileRoute("/{-$locale}/projects/")({
	loader: async ({ context }) => {
		await context.queryClient.query(projectsQueryOptions());
	},
	component: ProjectsPage,
});
