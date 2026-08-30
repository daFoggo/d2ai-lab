import { queryOptions } from "@tanstack/react-query";
import {
	getResearchAreaPreviewFn,
	getResearchAreasFn,
	getResearchDirectionsFn,
	getResearchGapsFn,
} from "./functions";

export const researchKeys = {
	all: ["research"] as const,
	areas: () => [...researchKeys.all, "areas"] as const,
	directions: () => [...researchKeys.all, "directions"] as const,
	gaps: () => [...researchKeys.all, "gaps"] as const,
	areaPreview: () => [...researchKeys.all, "area-preview"] as const,
};

export const researchAreasQueryOptions = () =>
	queryOptions({
		queryKey: researchKeys.areas(),
		queryFn: () => getResearchAreasFn(),
		staleTime: 1000 * 60 * 5,
	});

export const researchDirectionsQueryOptions = () =>
	queryOptions({
		queryKey: researchKeys.directions(),
		queryFn: () => getResearchDirectionsFn(),
		staleTime: 1000 * 60 * 5,
	});

export const researchGapsQueryOptions = () =>
	queryOptions({
		queryKey: researchKeys.gaps(),
		queryFn: () => getResearchGapsFn(),
		staleTime: 1000 * 60 * 5,
	});

/* Preview cho home page — đọc bởi route home qua feature barrel. */
export const researchAreaPreviewQueryOptions = () =>
	queryOptions({
		queryKey: researchKeys.areaPreview(),
		queryFn: () => getResearchAreaPreviewFn(),
		staleTime: 1000 * 60 * 5,
	});
