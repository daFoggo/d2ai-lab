import { createServerFn } from "@tanstack/react-start";
import type { TResearchAreaPreview } from "./schemas";
import { getResearchAreaPreview } from "./server";

export const getResearchAreaPreviewFn = createServerFn({
	method: "GET",
}).handler(
	async (): Promise<TResearchAreaPreview[]> => getResearchAreaPreview(),
);
