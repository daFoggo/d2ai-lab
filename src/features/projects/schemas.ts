import { z } from "zod";

export const projectSchema = z.object({
	id: z.string().min(1),
	title: z.string().min(1),
	category: z.string().min(1),
	description: z.string().min(1),
	href: z.string().optional(),
	thumbnail: z.string().optional(),
});

export type TProject = z.infer<typeof projectSchema>;

/* Preview/teaser cho home page — hero + compact items. */
export const projectPreviewHeroSchema = z.object({
	title: z.string().min(1),
	description: z.string().min(1),
	category: z.string().optional(),
	ctaLabel: z.string().default("Explore project"),
	to: z.string().optional(),
	thumbnail: z.string().optional(),
});

export type TProjectPreviewHero = z.infer<typeof projectPreviewHeroSchema>;

export const projectPreviewItemSchema = z.object({
	id: z.string().min(1),
	title: z.string().min(1),
	category: z.string().min(1),
	thumbnail: z.string().optional(),
	to: z.string().optional(),
});

export type TProjectPreviewItem = z.infer<typeof projectPreviewItemSchema>;
