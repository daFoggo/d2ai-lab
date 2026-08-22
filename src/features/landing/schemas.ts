import { z } from "zod";

export const landingNavSubItemSchema = z.object({
	title: z.string().min(1),
	href: z.string().min(1),
	description: z.string().optional(),
	isExternal: z.boolean().optional(),
});

export type TLandingNavSubItem = z.infer<typeof landingNavSubItemSchema>;

export const landingNavItemSchema = z.object({
	label: z.string().min(1),
	href: z.string().optional(),
	isExternal: z.boolean().optional(),
	isActive: z.boolean().optional(),
	items: z.array(landingNavSubItemSchema).optional(),
});

export type TLandingNavItem = z.infer<typeof landingNavItemSchema>;

export const landingBrandSchema = z.object({
	name: z.string().min(1),
	tagline: z.string().optional(),
	options: z.array(z.string()).optional(),
});

export type TLandingBrand = z.infer<typeof landingBrandSchema>;

export const landingHeroDataSchema = z.object({
	titleLine1: z.string().min(1),
	titleLine2: z.string().min(1),
	description: z.string().min(1),
});

export type TLandingHeroData = z.infer<typeof landingHeroDataSchema>;

/* Section 1: Film Data Schema */
export const landingFilmDataSchema = z.object({
	title: z.string().min(1),
	description: z.string().min(1),
	videoThumbnail: z.string().optional(),
	videoBadgeText: z.string().optional(),
});

export type TLandingFilmData = z.infer<typeof landingFilmDataSchema>;

/* Section 2: Quote Data Schema */
export const landingQuoteDataSchema = z.object({
	quote: z.string().min(1),
	authorName: z.string().min(1),
	authorRole: z.string().min(1),
	authorAvatar: z.string().optional(),
});

export type TLandingQuoteData = z.infer<typeof landingQuoteDataSchema>;

/* Section 3: Read The Latest Item Schema */
export const landingLatestItemSchema = z.object({
	id: z.string().min(1),
	title: z.string().min(1),
	category: z.string().min(1),
	date: z.string().min(1),
	thumbnail: z.string().optional(),
	href: z.string().optional(),
	type: z.enum(["BLOG", "RESEARCH", "PAPER", "NEWS"]).default("RESEARCH"),
});

export type TLandingLatestItem = z.infer<typeof landingLatestItemSchema>;

/* Section 4: Projects Showcase Schemas */
export const landingProjectHeroSchema = z.object({
	title: z.string().min(1),
	description: z.string().min(1),
	category: z.string().optional(),
	ctaLabel: z.string().default("Explore project"),
	href: z.string().optional(),
	thumbnail: z.string().optional(),
});

export type TLandingProjectHero = z.infer<typeof landingProjectHeroSchema>;

export const landingProjectItemSchema = z.object({
	id: z.string().min(1),
	title: z.string().min(1),
	category: z.string().min(1),
	thumbnail: z.string().optional(),
	href: z.string().optional(),
});

export type TLandingProjectItem = z.infer<typeof landingProjectItemSchema>;

/* Section 5: Domains Mosaic Schema */
export const landingDomainsDataSchema = z.object({
	title: z.string().min(1),
	description: z.string().min(1),
	ctaLabel: z.string().default("Explore research areas"),
});

export type TLandingDomainsData = z.infer<typeof landingDomainsDataSchema>;

/* Section 6: Future Opportunities Schema */
export const landingFutureItemSchema = z.object({
	id: z.string().min(1),
	title: z.string().min(1),
	description: z.string().min(1),
	linkLabel: z.string().min(1),
	href: z.string().optional(),
	thumbnail: z.string().optional(),
});

export type TLandingFutureItem = z.infer<typeof landingFutureItemSchema>;
