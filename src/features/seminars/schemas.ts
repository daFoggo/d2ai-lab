import { z } from "zod";

export const seminarStatusSchema = z.enum(["UPCOMING", "PAST"]);

export type TSeminarStatus = z.infer<typeof seminarStatusSchema>;

export const seminarSpeakerSchema = z.object({
	id: z.string().min(1),
	name: z.string().min(1),
	role: z.string().min(1),
	photo: z.string().optional(),
	/* List URLs — UI detect platform (X/LinkedIn) từ định dạng đường dẫn. */
	socials: z.array(z.string()).optional(),
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
	/* Timestamp gốc (ISO) cho admin form — `date`/`time` public chỉ là display. */
	dateIso: z.string().optional(),
	startsAtIso: z.string().optional(),
});

export type TSeminarDetail = z.infer<typeof seminarDetailSchema>;

/* Admin list item — speaker = speaker đầu tiên (denormalized) + số lượng. */
export const seminarAdminItemSchema = seminarSchema.extend({
	speakerCount: z.number().int().min(0),
	startsAtIso: z.string().optional(),
	location: z.string().optional(),
});

export type TSeminarAdminItem = z.infer<typeof seminarAdminItemSchema>;

/* ── Form / CRUD schemas (dashboard admin) ─────────────────────────────── */

export const seminarSpeakerFormSchema = z.object({
	id: z.string().optional(),
	/* key client-side (React list key) — không gửi lên DB. */
	key: z.string().optional(),
	name: z.string().min(1, "Name is required").max(200),
	role: z.string().min(1, "Role is required").max(300),
	photoUrl: z.string().max(500).optional(),
	/* Mỗi URL 1 dòng (textarea). UI detect platform từ đường dẫn. */
	socials: z.string().max(2000).optional(),
});

export type TSeminarSpeakerForm = z.infer<typeof seminarSpeakerFormSchema>;

export const seminarUpsertInputSchema = z.object({
	title: z.string().min(1, "Title is required").max(300),
	description: z.string().min(1, "Description is required").max(10000),
	/* ISO datetime (timestamptz). Form ghép date + time trước khi submit.
	   Status KHÔNG chỉnh tay — tính từ starts_at. */
	startsAt: z.string().min(1, "Date & time is required"),
	location: z.string().max(300).optional(),
	registrationUrl: z.string().max(500).optional(),
	speakers: z.array(seminarSpeakerFormSchema).max(20).optional(),
});

export type TSeminarUpsertInput = z.infer<typeof seminarUpsertInputSchema>;
