import "@tanstack/react-start/server-only";

import { supabase } from "@/utils/supabase";
import type {
	TResearchArea,
	TResearchAreaPreview,
	TResearchDirection,
	TResearchGap,
	TResearchGapStatus,
} from "./schemas";

/*
 * Query contract: trả data hợp lệ hoặc throw, không bao giờ trả fallback che lỗi.
 */

interface AreaRow {
	id: string;
	title: string;
	tag: string;
	description: string;
}

interface DirectionRow {
	id: string;
	index: string;
	title: string;
	description: string;
	focus: string[];
}

interface GapRow {
	id: string;
	title: string;
	description: string;
	status: string;
	area: string;
}

export async function getResearchAreas(): Promise<TResearchArea[]> {
	const { data, error } = await supabase
		.from("research_areas")
		.select("*")
		.order("sort_order");

	if (error) throw error;
	return (data ?? []).map((row) => {
		const area = row as AreaRow;
		return {
			id: area.id,
			title: area.title,
			tag: area.tag,
			description: area.description,
		};
	});
}

export async function getResearchDirections(): Promise<TResearchDirection[]> {
	const { data, error } = await supabase
		.from("research_directions")
		.select("*")
		.order("sort_order");

	if (error) throw error;
	return (data ?? []).map((row) => {
		const direction = row as DirectionRow;
		return {
			id: direction.id,
			index: direction.index,
			title: direction.title,
			description: direction.description,
			focus: direction.focus,
		};
	});
}

export async function getResearchGaps(): Promise<TResearchGap[]> {
	const { data, error } = await supabase
		.from("research_gaps")
		.select("*")
		.order("sort_order");

	if (error) throw error;
	return (data ?? []).map((row) => {
		const gap = row as GapRow;
		return {
			id: gap.id,
			title: gap.title,
			description: gap.description,
			status: gap.status as TResearchGapStatus,
			area: gap.area,
		};
	});
}

/* Preview/teaser cho home page — mosaic chỉ cần id/tag/title. */
export async function getResearchAreaPreview(): Promise<
	TResearchAreaPreview[]
> {
	const { data, error } = await supabase
		.from("research_areas")
		.select("id, title, tag")
		.order("sort_order")
		.limit(5);

	if (error) throw error;
	return (data ?? []).map((row) => ({
		id: row.id,
		tag: row.tag,
		title: row.title,
	}));
}
