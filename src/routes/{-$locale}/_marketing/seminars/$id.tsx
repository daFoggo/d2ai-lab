import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, notFound } from "@tanstack/react-router";
import { seminarDetailQueryOptions } from "@/features/seminars";
import { useI18n } from "@/lib/i18n";
import { SeminarDetail } from "./-components/seminar-detail";

const SeminarDetailPage = () => {
	const { id } = Route.useParams();
	const { data: seminar } = useSuspenseQuery(seminarDetailQueryOptions(id));
	const { locale } = useI18n();
	return <SeminarDetail seminar={seminar} locale={locale} />;
};

export const Route = createFileRoute("/{-$locale}/_marketing/seminars/$id")({
	loader: async ({ params, context }) => {
		try {
			return await context.queryClient.query(
				seminarDetailQueryOptions(params.id),
			);
		} catch {
			throw notFound();
		}
	},
	head: ({ loaderData }) => ({
		meta: [
			{
				title: loaderData
					? `${loaderData.title} — Seminars — D2AI Lab`
					: "Seminar — D2AI Lab",
			},
			{
				name: "description",
				content:
					loaderData?.description ??
					"Academic seminar and knowledge exchange at D2AI Lab.",
			},
		],
	}),
	component: SeminarDetailPage,
});
