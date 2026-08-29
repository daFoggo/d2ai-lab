import { createServerFn } from "@tanstack/react-start";
import type { TProjectPreviewHero, TProjectPreviewItem } from "./schemas";
import { getProjectPreview } from "./server";

export const getProjectPreviewFn = createServerFn({
	method: "GET",
}).handler(
	async (): Promise<{
		hero: TProjectPreviewHero;
		items: TProjectPreviewItem[];
	}> => getProjectPreview(),
);
