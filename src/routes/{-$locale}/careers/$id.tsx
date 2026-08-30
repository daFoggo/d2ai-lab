import { createFileRoute, notFound } from "@tanstack/react-router";
import { careerDetailQueryOptions } from "@/features/careers";
import { useI18n } from "@/lib/i18n";
import { CareerDetail } from "./-components/career-detail";

const CareerDetailPage = () => {
	const career = Route.useLoaderData();
	const { locale } = useI18n();
	return <CareerDetail career={career} locale={locale} />;
};

export const Route = createFileRoute("/{-$locale}/careers/$id")({
	component: CareerDetailPage,
	loader: async ({ params, context }) => {
		try {
			return await context.queryClient.query(
				careerDetailQueryOptions(params.id),
			);
		} catch {
			throw notFound();
		}
	},
});
