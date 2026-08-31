import "@tanstack/react-start/server-only";

import { supabase } from "@/utils/supabase";
import type {
	TProject,
	TProjectPreviewHero,
	TProjectPreviewItem,
} from "./schemas";

/*
 * Query contract: trả data hợp lệ hoặc throw, không bao giờ trả fallback che lỗi.
 */

interface ProjectRow {
	id: string;
	title: string;
	category: string;
	description: string;
	href: string | null;
	thumbnail: string | null;
	is_featured: boolean;
}

const toProject = (row: ProjectRow): TProject => ({
	id: row.id,
	title: row.title,
	category: row.category,
	description: row.description,
	href: row.href ?? undefined,
	thumbnail: row.thumbnail ?? undefined,
});

export async function getProjects(): Promise<{
	featured: TProject;
	items: TProject[];
}> {
	const { data, error } = await supabase
		.from("projects")
		.select("*")
		.order("sort_order");

	if (error) throw error;
	const rows = (data ?? []) as ProjectRow[];
	const featured = rows.find((row) => row.is_featured) ?? rows[0];
	if (!featured) {
		throw new Error("No projects");
	}
	const items = rows.filter((row) => row.id !== featured.id);
	return { featured: toProject(featured), items: items.map(toProject) };
}

export async function getProjectPreview(): Promise<{
	hero: TProjectPreviewHero;
	items: TProjectPreviewItem[];
}> {
	const { data, error } = await supabase
		.from("projects")
		.select("*")
		.order("sort_order");

	if (error) throw error;
	const rows = (data ?? []) as ProjectRow[];
	const featured = rows.find((row) => row.is_featured) ?? rows[0];
	if (!featured) {
		throw new Error("No projects");
	}
	const items = rows.filter((row) => row.id !== featured.id).slice(0, 2);

	return {
		hero: {
			title: featured.title,
			category: featured.category,
			description: featured.description,
			ctaLabel: "View project",
			to: "/{-$locale}/projects",
			thumbnail: featured.thumbnail ?? undefined,
		},
		items: items.map((row) => ({
			id: row.id,
			title: row.title,
			category: row.category,
			thumbnail: row.thumbnail ?? undefined,
			to: "/{-$locale}/projects",
		})),
	};
}
