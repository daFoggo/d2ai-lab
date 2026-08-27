import { z } from "zod";

export const seminarStatusSchema = z.enum(["UPCOMING", "PAST"]);

export type TSeminarStatus = z.infer<typeof seminarStatusSchema>;

export const seminarSpeakerSchema = z.object({
	id: z.string().min(1),
	name: z.string().min(1),
	role: z.string().min(1),
	photo: z.string().optional(),
	socials: z
		.array(
			z.object({
				type: z.enum(["x", "linkedin"]),
				label: z.string().min(1),
				href: z.string().optional(),
			}),
		)
		.optional(),
});

export type TSeminarSpeaker = z.infer<typeof seminarSpeakerSchema>;

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

export const seminarDetailSchema = seminarSchema.extend({
	description: z.string().min(1),
	location: z.string().optional(),
	time: z.string().optional(),
	speakers: z.array(seminarSpeakerSchema).min(1),
	registrationUrl: z.string().optional(),
});

export type TSeminarDetail = z.infer<typeof seminarDetailSchema>;
