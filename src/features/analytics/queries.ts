import { queryOptions } from "@tanstack/react-query";
import { getSiteStatsFn } from "./functions";

export const analyticsKeys = {
	all: ["analytics"] as const,
	siteStats: () => [...analyticsKeys.all, "site-stats"] as const,
};

/* Site-wide stats cho home hero (và admin dashboard tương lai). */
export const siteStatsQueryOptions = () =>
	queryOptions({
		queryKey: analyticsKeys.siteStats(),
		queryFn: () => getSiteStatsFn(),
		staleTime: 1000 * 60 * 5,
	});
