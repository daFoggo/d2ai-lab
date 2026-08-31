import { createFileRoute } from "@tanstack/react-router";
import { SeminarFormPage } from "./-components/seminar-form-page";

export const Route = createFileRoute(
	"/{-$locale}/_dashboard/admin/seminars/new",
)({
	head: () => ({
		meta: [
			{ title: "New Seminar — Admin — D2AI Lab" },
			{
				name: "description",
				content: "Create a new seminar in D2AI Lab.",
			},
		],
	}),
	component: () => <SeminarFormPage />,
});
