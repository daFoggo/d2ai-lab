import { createFileRoute } from "@tanstack/react-router";
import { SeminarFormPage } from "./-components/seminar-form-page";

export const Route = createFileRoute(
	"/{-$locale}/_dashboard/admin/seminars/new",
)({
	component: () => <SeminarFormPage />,
});
