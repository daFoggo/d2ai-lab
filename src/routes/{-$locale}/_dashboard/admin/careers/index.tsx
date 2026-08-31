import { createFileRoute } from "@tanstack/react-router";
import { ContentPlaceholder } from "../-components/content-placeholder";

const CareersAdminPage = () => {
	return <ContentPlaceholder />;
};

export const Route = createFileRoute("/{-$locale}/_dashboard/admin/careers/")({
	component: CareersAdminPage,
});
