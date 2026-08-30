import { queryOptions } from "@tanstack/react-query";
import {
	getSeminarDetailFn,
	getSeminarsFn,
	getUpcomingSeminarFn,
} from "./functions";

export const seminarKeys = {
	all: ["seminars"] as const,
	list: () => [...seminarKeys.all, "list"] as const,
	detail: (id: string) => [...seminarKeys.all, "detail", id] as const,
	upcoming: () => [...seminarKeys.all, "upcoming"] as const,
};

export const seminarsQueryOptions = () =>
	queryOptions({
		queryKey: seminarKeys.list(),
		queryFn: () => getSeminarsFn(),
		staleTime: 1000 * 60 * 5,
	});

export const seminarDetailQueryOptions = (id: string) =>
	queryOptions({
		queryKey: seminarKeys.detail(id),
		queryFn: () => getSeminarDetailFn({ data: id }),
		staleTime: 1000 * 60 * 5,
	});

/* Spotlight cho home page — đọc bởi route home qua feature barrel. */
export const upcomingSeminarQueryOptions = () =>
	queryOptions({
		queryKey: seminarKeys.upcoming(),
		queryFn: () => getUpcomingSeminarFn(),
		staleTime: 1000 * 60 * 5,
	});
