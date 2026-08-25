import { z } from "zod";

export const seminarStatusSchema = z.enum(["UPCOMING", "PAST"]);

export type TSeminarStatus = z.infer<typeof seminarStatusSchema>;

export const seminarSchema = z.object({
	id: z.string().min(1),
	title: z.string().min(1),
	speaker: z.string().min(1),
	role: z.string().min(1),
	date: z.string().min(1),
	status: seminarStatusSchema,
	href: z.string().optional(),
});

export type TSeminar = z.infer<typeof seminarSchema>;
