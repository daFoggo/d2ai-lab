import { queryOptions } from "@tanstack/react-query";
import {
	getPublicationDetailFn,
	getPublicationPreviewFn,
	getPublicationsFn,
} from "./functions";

export const publicationKeys = {
	all: ["publications"] as const,
	list: () => [...publicationKeys.all, "list"] as const,
	detail: (id: string) => [...publicationKeys.all, "detail", id] as const,
	preview: () => [...publicationKeys.all, "preview"] as const,
};

export const publicationsQueryOptions = () =>
	queryOptions({
		queryKey: publicationKeys.list(),
		queryFn: () => getPublicationsFn(),
		staleTime: 1000 * 60 * 5,
	});

export const publicationDetailQueryOptions = (id: string) =>
	queryOptions({
		queryKey: publicationKeys.detail(id),
		queryFn: () => getPublicationDetailFn({ data: id }),
		staleTime: 1000 * 60 * 5,
	});

/* Preview cho home page — đọc bởi route home qua feature barrel. */
export const publicationPreviewQueryOptions = () =>
	queryOptions({
		queryKey: publicationKeys.preview(),
		queryFn: () => getPublicationPreviewFn(),
		staleTime: 1000 * 60 * 5,
	});
