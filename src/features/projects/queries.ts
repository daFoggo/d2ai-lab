import { queryOptions } from "@tanstack/react-query";
import { getProjectPreviewFn, getProjectsFn } from "./functions";

export const projectKeys = {
	all: ["projects"] as const,
	list: () => [...projectKeys.all, "list"] as const,
	preview: () => [...projectKeys.all, "preview"] as const,
};

export const projectsQueryOptions = () =>
	queryOptions({
		queryKey: projectKeys.list(),
		queryFn: () => getProjectsFn(),
		staleTime: 1000 * 60 * 5,
	});

/* Preview cho home page — đọc bởi route home qua feature barrel. */
export const projectPreviewQueryOptions = () =>
	queryOptions({
		queryKey: projectKeys.preview(),
		queryFn: () => getProjectPreviewFn(),
		staleTime: 1000 * 60 * 5,
	});
