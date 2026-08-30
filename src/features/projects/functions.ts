import { createServerFn } from "@tanstack/react-start";
import type {
	TProject,
	TProjectPreviewHero,
	TProjectPreviewItem,
} from "./schemas";
import { getProjectPreview, getProjects } from "./server";

export const getProjectsFn = createServerFn({
	method: "GET",
}).handler(
	async (): Promise<{
		featured: TProject;
		items: TProject[];
	}> => getProjects(),
);

export const getProjectPreviewFn = createServerFn({
	method: "GET",
}).handler(
	async (): Promise<{
		hero: TProjectPreviewHero;
		items: TProjectPreviewItem[];
	}> => getProjectPreview(),
);
