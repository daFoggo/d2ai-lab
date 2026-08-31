import "@tanstack/react-start/server-only";

import { notFound } from "@tanstack/react-router";
import { supabase } from "@/utils/supabase";
import type {
	TPublication,
	TPublicationDetail,
	TPublicationPreview,
} from "./schemas";

/*
 * Query contract: trả data hợp lệ hoặc throw, không bao giờ trả fallback che lỗi.
 */

interface PublicationRow {
	id: string;
	title: string;
	venue: string;
	year: number;
	authors: string[];
	tags: string[];
	type: string;
	href: string | null;
	abstract: string;
	highlights: string[];
	links: { label: string; href: string }[];
}

const toPublication = (row: PublicationRow): TPublication => ({
	id: row.id,
	title: row.title,
	venue: row.venue,
	year: row.year,
	authors: row.authors,
	tags: row.tags,
	type: row.type as TPublication["type"],
	href: row.href ?? undefined,
});

export async function getPublications(): Promise<TPublication[]> {
	const { data, error } = await supabase
		.from("publications")
		.select("*")
		.order("year", { ascending: false })
		.order("sort_order");

	if (error) throw error;
	return (data ?? []).map((row) => toPublication(row as PublicationRow));
}

export async function getPublicationDetail(
	id: string,
): Promise<TPublicationDetail> {
	const { data, error } = await supabase
		.from("publications")
		.select("*")
		.eq("id", id)
		.single();

	if (error) {
		if (error.code === "PGRST116") {
			throw notFound();
		}
		throw error;
	}

	const row = data as PublicationRow;
	return {
		...toPublication(row),
		abstract: row.abstract,
		highlights: row.highlights,
		links: row.links,
	};
}

/* Preview/teaser cho home page — 3 bài mới nhất. */
export async function getPublicationPreview(): Promise<TPublicationPreview[]> {
	const { data, error } = await supabase
		.from("publications")
		.select("id, title, tags, year, type")
		.order("year", { ascending: false })
		.order("sort_order")
		.limit(3);

	if (error) throw error;
	return (data ?? []).map((row) => ({
		id: row.id,
		title: row.title,
		category: row.tags?.[0] ?? row.type,
		date: String(row.year),
		to: `/{-$locale}/publications/${row.id}`,
		type: row.type as TPublicationPreview["type"],
	}));
}
