import { createFileRoute, notFound } from "@tanstack/react-router";
import { publicationDetailQueryOptions } from "@/features/publications";
import { useI18n } from "@/lib/i18n";
import { PublicationDetail } from "./-components/publication-detail";

const PublicationDetailPage = () => {
	const publication = Route.useLoaderData();
	const { locale } = useI18n();
	return <PublicationDetail publication={publication} locale={locale} />;
};

export const Route = createFileRoute("/{-$locale}/_marketing/publications/$id")(
	{
		component: PublicationDetailPage,
		loader: async ({ params, context }) => {
			try {
				return await context.queryClient.query(
					publicationDetailQueryOptions(params.id),
				);
			} catch {
				throw notFound();
			}
		},
	},
);
