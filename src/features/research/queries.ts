import { queryOptions } from "@tanstack/react-query";
import { getResearchAreaPreviewFn } from "./functions";

export const researchKeys = {
	all: ["research"] as const,
	areaPreview: () => [...researchKeys.all, "area-preview"] as const,
};

/* Preview cho home page — đọc bởi route home qua feature barrel. */
export const researchAreaPreviewQueryOptions = () =>
	queryOptions({
		queryKey: researchKeys.areaPreview(),
		queryFn: () => getResearchAreaPreviewFn(),
		staleTime: 1000 * 60 * 5,
	});
