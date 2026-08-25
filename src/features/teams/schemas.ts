import { z } from "zod";

export const teamMemberSchema = z.object({
	id: z.string().min(1),
	name: z.string().min(1),
	role: z.string().min(1),
	area: z.string().min(1),
	initials: z.string().min(1),
	image: z.string().optional(),
});

export type TTeamMember = z.infer<typeof teamMemberSchema>;

export const teamSchema = z.object({
	id: z.string().min(1),
	name: z.string().min(1),
	tagline: z.string().min(1),
	description: z.string().min(1),
	members: z.array(teamMemberSchema).min(1),
});

export type TTeam = z.infer<typeof teamSchema>;
