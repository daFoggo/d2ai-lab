import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, notFound } from "@tanstack/react-router";
import { careerDetailQueryOptions } from "@/features/careers";
import { useI18n } from "@/lib/i18n";
import { CareerDetail } from "./-components/career-detail";

const CareerDetailPage = () => {
	const { id } = Route.useParams();
	const { data: career } = useSuspenseQuery(careerDetailQueryOptions(id));
	const { locale } = useI18n();
	return <CareerDetail career={career} locale={locale} />;
};

export const Route = createFileRoute("/{-$locale}/_marketing/careers/$id")({
	loader: async ({ params, context }) => {
		try {
			return await context.queryClient.query(
				careerDetailQueryOptions(params.id),
			);
		} catch {
			throw notFound();
		}
	},
	head: ({ loaderData }) => ({
		meta: [
			{
				title: loaderData
					? `${loaderData.title} — Careers — D2AI Lab`
					: "Career Opportunity — D2AI Lab",
			},
			{
				name: "description",
				content: loaderData?.description ?? "Join our research lab team.",
			},
		],
	}),
	component: CareerDetailPage,
});
