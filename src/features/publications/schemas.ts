import { z } from "zod";

export const publicationSchema = z.object({
	id: z.string().min(1),
	title: z.string().min(1),
	venue: z.string().min(1),
	year: z.number().int(),
	authors: z.array(z.string()).min(1),
	tags: z.array(z.string()).optional(),
	type: z.enum(["RESEARCH", "BLOG", "PAPER", "NEWS"]).default("RESEARCH"),
	href: z.string().optional(),
});

export type TPublication = z.infer<typeof publicationSchema>;

export const publicationDetailSchema = publicationSchema.extend({
	abstract: z.string().min(1),
	highlights: z.array(z.string()).optional(),
	links: z
		.array(
			z.object({
				label: z.string().min(1),
				href: z.string().min(1),
			}),
		)
		.optional(),
});

export type TPublicationDetail = z.infer<typeof publicationDetailSchema>;

/* Preview/teaser cho home page — compact version của TPublication. */
export const publicationPreviewSchema = z.object({
	id: z.string().min(1),
	title: z.string().min(1),
	category: z.string().min(1),
	date: z.string().min(1),
	thumbnail: z.string().optional(),
	to: z.string().optional(),
	type: z.enum(["BLOG", "RESEARCH", "PAPER", "NEWS"]).default("RESEARCH"),
});

export type TPublicationPreview = z.infer<typeof publicationPreviewSchema>;
