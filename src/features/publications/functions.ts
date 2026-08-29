import { createServerFn } from "@tanstack/react-start";
import type { TPublicationPreview } from "./schemas";
import { getPublicationPreview } from "./server";

export const getPublicationPreviewFn = createServerFn({
	method: "GET",
}).handler(async (): Promise<TPublicationPreview[]> => getPublicationPreview());
