import { queryOptions } from "@tanstack/react-query";
import { getProjectPreviewFn } from "./functions";

export const projectKeys = {
	all: ["projects"] as const,
	preview: () => [...projectKeys.all, "preview"] as const,
};

/* Preview cho home page — đọc bởi route home qua feature barrel. */
export const projectPreviewQueryOptions = () =>
	queryOptions({
		queryKey: projectKeys.preview(),
		queryFn: () => getProjectPreviewFn(),
		staleTime: 1000 * 60 * 5,
	});
