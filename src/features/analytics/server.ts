import "@tanstack/react-start/server-only";

import { supabase } from "@/utils/supabase";
import type { TAnalyticsStat } from "./schemas";

/*
 * Query contract: trả data hợp lệ hoặc throw, không bao giờ trả fallback che lỗi.
 * Stats là aggregate counts tính từ DB thật (không còn mock).
 */

const countRows = async (table: string): Promise<number> => {
	const { count, error } = await supabase
		.from(table)
		.select("*", { count: "exact", head: true });
	if (error) throw error;
	return count ?? 0;
};

export async function getSiteStats(): Promise<TAnalyticsStat[]> {
	const [areas, publications, projects, seminars] = await Promise.all([
		countRows("research_areas"),
		countRows("publications"),
		countRows("projects"),
		countRows("seminars"),
	]);

	return [
		{ value: String(areas), label: "Research areas" },
		{ value: String(publications), label: "Publications" },
		{ value: String(projects), label: "Active projects" },
		{ value: String(seminars), label: "Seminars & talks" },
	];
}
