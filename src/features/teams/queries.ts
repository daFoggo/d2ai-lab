import { queryOptions } from "@tanstack/react-query";
import { getTeamsFn } from "./functions";

export const teamKeys = {
	all: ["teams"] as const,
	list: () => [...teamKeys.all, "list"] as const,
};

export const teamsQueryOptions = () =>
	queryOptions({
		queryKey: teamKeys.list(),
		queryFn: () => getTeamsFn(),
		staleTime: 1000 * 60 * 5,
	});
