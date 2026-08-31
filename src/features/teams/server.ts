import "@tanstack/react-start/server-only";

import { supabase } from "@/utils/supabase";
import type { TTeam } from "./schemas";

/*
 * Query contract: trả data hợp lệ hoặc throw, không bao giờ trả fallback che lỗi.
 */

interface MemberRow {
	id: string;
	name: string;
	role: string;
	area: string;
	initials: string;
	image: string | null;
	sort_order: number;
}

interface TeamRow {
	id: string;
	name: string;
	tagline: string;
	description: string;
	team_members: MemberRow[];
}

export async function getTeams(): Promise<TTeam[]> {
	const { data, error } = await supabase
		.from("teams")
		.select("*, team_members(*)")
		.order("sort_order")
		.order("sort_order", { foreignTable: "team_members", ascending: true });

	if (error) throw error;
	return (data ?? []).map((row) => {
		const team = row as TeamRow;
		return {
			id: team.id,
			name: team.name,
			tagline: team.tagline,
			description: team.description,
			members: (team.team_members ?? []).map((member) => ({
				id: member.id,
				name: member.name,
				role: member.role,
				area: member.area,
				initials: member.initials,
				image: member.image ?? undefined,
			})),
		};
	});
}
