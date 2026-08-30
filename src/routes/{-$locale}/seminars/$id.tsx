import { createFileRoute, notFound } from "@tanstack/react-router";
import { seminarDetailQueryOptions } from "@/features/seminars";
import { useI18n } from "@/lib/i18n";
import { SeminarDetail } from "./-components/seminar-detail";

const SeminarDetailPage = () => {
	const seminar = Route.useLoaderData();
	const { locale } = useI18n();
	return <SeminarDetail seminar={seminar} locale={locale} />;
};

export const Route = createFileRoute("/{-$locale}/seminars/$id")({
	component: SeminarDetailPage,
	loader: async ({ params, context }) => {
		try {
			return await context.queryClient.query(
				seminarDetailQueryOptions(params.id),
			);
		} catch {
			throw notFound();
		}
	},
});
