import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import * as z from "zod";
import { seminarsQueryOptions } from "@/features/seminars";
import { Seminars } from "./-components/seminars-list";
import { SeminarsPagination } from "./-components/seminars-pagination";

const PAGE_SIZE = 10;

const searchSchema = z.object({
	page: z.coerce.number().int().min(1).default(1),
});

const SeminarsPage = () => {
	const { page } = Route.useSearch();
	const navigate = Route.useNavigate();
	const { data } = useSuspenseQuery(seminarsQueryOptions(page, PAGE_SIZE));
	const totalPages = Math.max(1, Math.ceil(data.total / PAGE_SIZE));

	return (
		<Seminars
			eyebrow="Seminars"
			title="Seminars & academic exchange"
			description="Talks, guest lectures, and technical knowledge exchange hosted by the lab."
			seminars={data.items}
			footer={
				<SeminarsPagination
					page={page}
					totalPages={totalPages}
					onPageChange={(next) => void navigate({ search: { page: next } })}
				/>
			}
		/>
	);
};

export const Route = createFileRoute("/{-$locale}/_marketing/seminars/")({
	validateSearch: searchSchema,
	loader: async ({ context, location }) => {
		const page = (location.search as { page?: number }).page ?? 1;
		await context.queryClient.query(seminarsQueryOptions(page, PAGE_SIZE));
	},
	component: SeminarsPage,
});
