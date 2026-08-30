import { queryOptions } from "@tanstack/react-query";
import { getCareerDetailFn, getCareersFn } from "./functions";

export const careerKeys = {
	all: ["careers"] as const,
	list: () => [...careerKeys.all, "list"] as const,
	detail: (id: string) => [...careerKeys.all, "detail", id] as const,
};

export const careersQueryOptions = () =>
	queryOptions({
		queryKey: careerKeys.list(),
		queryFn: () => getCareersFn(),
		staleTime: 1000 * 60 * 5,
	});

export const careerDetailQueryOptions = (id: string) =>
	queryOptions({
		queryKey: careerKeys.detail(id),
		queryFn: () => getCareerDetailFn({ data: id }),
		staleTime: 1000 * 60 * 5,
	});
