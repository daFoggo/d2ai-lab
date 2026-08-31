import "@tanstack/react-start/server-only";

import { notFound } from "@tanstack/react-router";
import { supabase } from "@/utils/supabase";
import type { TCareer, TCareerDetail } from "./schemas";

/*
 * Query contract: trả data hợp lệ hoặc throw, không bao giờ trả fallback che lỗi.
 */

interface CareerRow {
	id: string;
	title: string;
	department: string;
	type: string;
	location: string | null;
	description: string;
	responsibilities: string[];
	qualifications: string[];
	benefits: string[];
	apply_url: string | null;
}

const toCareer = (row: CareerRow): TCareer => ({
	id: row.id,
	title: row.title,
	department: row.department,
	type: row.type,
	description: row.description,
	href: row.apply_url ?? undefined,
});

export async function getCareers(): Promise<TCareer[]> {
	const { data, error } = await supabase
		.from("careers")
		.select("*")
		.order("sort_order");

	if (error) throw error;
	return (data ?? []).map((row) => toCareer(row as CareerRow));
}

export async function getCareerDetail(id: string): Promise<TCareerDetail> {
	const { data, error } = await supabase
		.from("careers")
		.select("*")
		.eq("id", id)
		.single();

	if (error) {
		if (error.code === "PGRST116") {
			throw notFound();
		}
		throw error;
	}

	const row = data as CareerRow;
	return {
		...toCareer(row),
		location: row.location ?? undefined,
		responsibilities: row.responsibilities,
		qualifications: row.qualifications,
		benefits: row.benefits,
		applyUrl: row.apply_url ?? undefined,
	};
}
