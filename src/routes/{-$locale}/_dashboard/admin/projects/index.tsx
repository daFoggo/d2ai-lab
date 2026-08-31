import { createFileRoute } from "@tanstack/react-router";
import { ContentPlaceholder } from "../-components/content-placeholder";

const ProjectsAdminPage = () => {
	return <ContentPlaceholder />;
};

export const Route = createFileRoute("/{-$locale}/_dashboard/admin/projects/")({
	component: ProjectsAdminPage,
});
