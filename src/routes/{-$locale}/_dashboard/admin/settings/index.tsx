import { createFileRoute } from "@tanstack/react-router";
import { ContentPlaceholder } from "../-components/content-placeholder";

const SettingsAdminPage = () => {
	return <ContentPlaceholder />;
};

export const Route = createFileRoute("/{-$locale}/_dashboard/admin/settings/")({
	component: SettingsAdminPage,
});
