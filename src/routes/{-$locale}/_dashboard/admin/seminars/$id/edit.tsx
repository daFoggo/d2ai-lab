import { createFileRoute } from "@tanstack/react-router";
import { seminarDetailQueryOptions } from "@/features/seminars";
import { SeminarFormPage } from "../-components/seminar-form-page";

const EditSeminarRoute = () => {
	const { id } = Route.useParams();
	return <SeminarFormPage seminarId={id} />;
};

export const Route = createFileRoute(
	"/{-$locale}/_dashboard/admin/seminars/$id/edit",
)({
	head: () => ({
		meta: [
			{ title: "Edit Seminar — Admin — D2AI Lab" },
			{
				name: "description",
				content: "Edit seminar details in D2AI Lab.",
			},
		],
	}),
	loader: async ({ context, params }) => {
		/* Critical — prefetch detail để form edit không bị flash loading. */
		await context.queryClient.query(seminarDetailQueryOptions(params.id));
	},
	component: EditSeminarRoute,
});
