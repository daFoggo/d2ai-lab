import { createFileRoute } from "@tanstack/react-router";
import { ContentPlaceholder } from "../-components/content-placeholder";

const TeamsAdminPage = () => {
	return <ContentPlaceholder />;
};

export const Route = createFileRoute("/{-$locale}/_dashboard/admin/teams/")({
	component: TeamsAdminPage,
});
