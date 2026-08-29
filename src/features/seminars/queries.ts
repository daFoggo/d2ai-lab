import { queryOptions } from "@tanstack/react-query";
import { getUpcomingSeminarFn } from "./functions";

export const seminarKeys = {
	all: ["seminars"] as const,
	upcoming: () => [...seminarKeys.all, "upcoming"] as const,
};

/* Spotlight cho home page — đọc bởi route home qua feature barrel. */
export const upcomingSeminarQueryOptions = () =>
	queryOptions({
		queryKey: seminarKeys.upcoming(),
		queryFn: () => getUpcomingSeminarFn(),
		staleTime: 1000 * 60 * 5,
	});
