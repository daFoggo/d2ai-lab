import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, notFound } from "@tanstack/react-router";
import { publicationDetailQueryOptions } from "@/features/publications";
import { useI18n } from "@/lib/i18n";
import { PublicationDetail } from "./-components/publication-detail";

const PublicationDetailPage = () => {
	const { id } = Route.useParams();
	const { data: publication } = useSuspenseQuery(
		publicationDetailQueryOptions(id),
	);
	const { locale } = useI18n();
	return <PublicationDetail publication={publication} locale={locale} />;
};

export const Route = createFileRoute("/{-$locale}/_marketing/publications/$id")(
	{
		loader: async ({ params, context }) => {
			try {
				return await context.queryClient.query(
					publicationDetailQueryOptions(params.id),
				);
			} catch {
				throw notFound();
			}
		},
		head: ({ loaderData }) => ({
			meta: [
				{
					title: loaderData
						? `${loaderData.title} — Publications — D2AI Lab`
						: "Publication — D2AI Lab",
				},
				{
					name: "description",
					content:
						loaderData?.abstract ??
						"Read research paper and publication from D2AI Lab.",
				},
			],
		}),
		component: PublicationDetailPage,
	},
);
