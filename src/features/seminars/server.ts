import "@tanstack/react-start/server-only";

import { notFound } from "@tanstack/react-router";
import { supabase } from "@/utils/supabase";
import type { TSeminar, TSeminarAdminItem, TSeminarDetail } from "./schemas";

/*
 * Query contract: trả data hợp lệ hoặc throw, không bao giờ trả fallback che lỗi.
 * Reads dùng supabase client (RLS cho phép public SELECT); writes nằm ở
 * queries.ts (client-side, RLS 'researcher' là security boundary).
 * DB lưu starts_at/ends_at (timestamptz); `date`/`time` public là display.
 */

const formatDate = (iso: string): string =>
	new Date(iso)
		.toLocaleDateString("en-US", { month: "short", day: "2-digit" })
		.toUpperCase();

const formatTime = (iso: string): string =>
	new Date(iso).toLocaleTimeString(undefined, {
		hour: "2-digit",
		minute: "2-digit",
		hour12: false,
	});

const dateIsoOf = (iso: string): string => {
	const date = new Date(iso);
	const y = date.getFullYear();
	const m = String(date.getMonth() + 1).padStart(2, "0");
	const d = String(date.getDate()).padStart(2, "0");
	return `${y}-${m}-${d}`;
};

/* Status KHÔNG lưu DB — derive từ starts_at. */
const deriveStatus = (startsAt: string): "UPCOMING" | "PAST" =>
	new Date(startsAt).getTime() <= Date.now() ? "PAST" : "UPCOMING";

interface SeminarRow {
	id: string;
	title: string;
	starts_at: string;
	seminar_speakers?: { name: string; role: string }[];
}

const toSeminar = ({
	id,
	title,
	starts_at,
	seminar_speakers,
}: SeminarRow): TSeminar => {
	const first = seminar_speakers?.[0];
	return {
		id,
		title,
		speaker: first?.name ?? "TBA",
		role: first?.role ?? "TBA",
		date: formatDate(starts_at),
		status: deriveStatus(starts_at),
	};
};

export async function getSeminars(): Promise<TSeminar[]> {
	const { data, error } = await supabase
		.from("seminars")
		.select("id, title, starts_at, seminar_speakers(name, role)")
		.order("starts_at", { ascending: false })
		.order("sort_order", { foreignTable: "seminar_speakers", ascending: true });

	if (error) throw error;
	return (data ?? []).map((row) => toSeminar(row as SeminarRow));
}

export async function getUpcomingSeminar(): Promise<TSeminar> {
	const { data, error } = await supabase
		.from("seminars")
		.select("id, title, starts_at, seminar_speakers(name, role)")
		.gt("starts_at", new Date().toISOString())
		.order("starts_at", { ascending: true })
		.limit(1)
		.order("sort_order", { foreignTable: "seminar_speakers", ascending: true });

	if (error) throw error;
	const row = (data ?? [])[0];
	if (!row) {
		throw new Error("No upcoming seminar");
	}
	return toSeminar(row as SeminarRow);
}

interface SpeakerRow {
	id: string;
	name: string;
	role: string;
	photo_url: string | null;
	sort_order: number;
	/* Mỗi URL 1 dòng (text) — UI detect platform. */
	socials: string | null;
}

interface SeminarDetailRow {
	id: string;
	title: string;
	starts_at: string;
	description: string;
	location: string | null;
	registration_url: string | null;
	seminar_speakers?: SpeakerRow[];
}

export async function getSeminarDetail(id: string): Promise<TSeminarDetail> {
	const { data, error } = await supabase
		.from("seminars")
		.select("*, seminar_speakers(*)")
		.eq("id", id)
		.single();

	if (error) {
		if (error.code === "PGRST116") {
			throw notFound();
		}
		throw error;
	}

	const seminar = data as SeminarDetailRow;

	const speakers = (seminar.seminar_speakers ?? [])
		.sort((a, b) => a.sort_order - b.sort_order)
		.map((speaker) => ({
			id: speaker.id,
			name: speaker.name,
			role: speaker.role,
			photo: speaker.photo_url ?? undefined,
			socials: (speaker.socials ?? "")
				.split("\n")
				.map((line) => line.trim())
				.filter(Boolean),
		}));

	const base = toSeminar({
		id: seminar.id,
		title: seminar.title,
		starts_at: seminar.starts_at,
		seminar_speakers: seminar.seminar_speakers?.map((s) => ({
			name: s.name,
			role: s.role,
		})),
	});

	return {
		...base,
		description: seminar.description,
		location: seminar.location ?? undefined,
		time: formatTime(seminar.starts_at),
		speakers,
		registrationUrl: seminar.registration_url ?? undefined,
		dateIso: dateIsoOf(seminar.starts_at),
		startsAtIso: seminar.starts_at,
	};
}

/* Admin list — kèm số lượng speaker + startsAtIso (sort/table). */
export async function getAdminSeminars(): Promise<TSeminarAdminItem[]> {
	const { data, error } = await supabase
		.from("seminars")
		.select("id, title, starts_at, location, seminar_speakers(name, role)")
		.order("starts_at", { ascending: false })
		.order("sort_order", { foreignTable: "seminar_speakers", ascending: true });

	if (error) throw error;
	return (data ?? []).map((row) => {
		const rowData = row as SeminarRow & { location: string | null };
		const speakers = rowData.seminar_speakers ?? [];
		return {
			...toSeminar(rowData),
			speakerCount: speakers.length,
			startsAtIso: rowData.starts_at,
			location: rowData.location ?? undefined,
		};
	});
}
