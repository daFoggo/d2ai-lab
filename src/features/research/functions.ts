import { createServerFn } from "@tanstack/react-start";
import type {
	TResearchArea,
	TResearchAreaPreview,
	TResearchDirection,
	TResearchGap,
} from "./schemas";
import {
	getResearchAreaPreview,
	getResearchAreas,
	getResearchDirections,
	getResearchGaps,
} from "./server";

export const getResearchAreasFn = createServerFn({
	method: "GET",
}).handler(async (): Promise<TResearchArea[]> => getResearchAreas());

export const getResearchDirectionsFn = createServerFn({
	method: "GET",
}).handler(async (): Promise<TResearchDirection[]> => getResearchDirections());

export const getResearchGapsFn = createServerFn({
	method: "GET",
}).handler(async (): Promise<TResearchGap[]> => getResearchGaps());

export const getResearchAreaPreviewFn = createServerFn({
	method: "GET",
}).handler(
	async (): Promise<TResearchAreaPreview[]> => getResearchAreaPreview(),
);
