import { queryOptions } from "@tanstack/react-query";
import { getPublicationPreviewFn } from "./functions";

export const publicationKeys = {
	all: ["publications"] as const,
	preview: () => [...publicationKeys.all, "preview"] as const,
};

/* Preview cho home page — đọc bởi route home qua feature barrel. */
export const publicationPreviewQueryOptions = () =>
	queryOptions({
		queryKey: publicationKeys.preview(),
		queryFn: () => getPublicationPreviewFn(),
		staleTime: 1000 * 60 * 5,
	});
