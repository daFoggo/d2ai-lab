import { createFileRoute } from "@tanstack/react-router";
import { ContentPlaceholder } from "../-components/content-placeholder";

const PublicationsAdminPage = () => {
	return <ContentPlaceholder />;
};

export const Route = createFileRoute(
	"/{-$locale}/_dashboard/admin/publications/",
)({
	component: PublicationsAdminPage,
});
