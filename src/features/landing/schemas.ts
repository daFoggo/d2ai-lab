import { z } from "zod";

export const landingNavSubItemSchema = z.object({
	title: z.string().min(1),
	href: z.string().optional(),
	to: z.string().optional(),
	description: z.string().optional(),
	isExternal: z.boolean().optional(),
});

export type TLandingNavSubItem = z.infer<typeof landingNavSubItemSchema>;

export const landingNavItemSchema = z.object({
	label: z.string().min(1),
	href: z.string().optional(),
	to: z.string().optional(),
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

/* Section 1: Mission Data Schema */
export const landingMissionDataSchema = z.object({
	title: z.string().min(1),
	description: z.string().min(1),
	videoThumbnail: z.string().optional(),
	videoBadgeText: z.string().optional(),
});

export type TLandingMissionData = z.infer<typeof landingMissionDataSchema>;

/* Section 3: Publications Item Schema */
export const landingPublicationItemSchema = z.object({
	id: z.string().min(1),
	title: z.string().min(1),
	category: z.string().min(1),
	date: z.string().min(1),
	thumbnail: z.string().optional(),
	to: z.string().optional(),
	type: z.enum(["BLOG", "RESEARCH", "PAPER", "NEWS"]).default("RESEARCH"),
});

export type TLandingPublicationItem = z.infer<
	typeof landingPublicationItemSchema
>;

/* Section 4: Projects Showcase Schemas */
export const landingProjectHeroSchema = z.object({
	title: z.string().min(1),
	description: z.string().min(1),
	category: z.string().optional(),
	ctaLabel: z.string().default("Explore project"),
	to: z.string().optional(),
	thumbnail: z.string().optional(),
});

export type TLandingProjectHero = z.infer<typeof landingProjectHeroSchema>;

export const landingProjectItemSchema = z.object({
	id: z.string().min(1),
	title: z.string().min(1),
	category: z.string().min(1),
	thumbnail: z.string().optional(),
	to: z.string().optional(),
});

export type TLandingProjectItem = z.infer<typeof landingProjectItemSchema>;

/* Section 5: Domains Mosaic Schema */
export const landingDomainsDataSchema = z.object({
	title: z.string().min(1),
	description: z.string().min(1),
});

export type TLandingDomainsData = z.infer<typeof landingDomainsDataSchema>;

/* Section 5.5: Research Partners Schema */
export const landingPartnerSchema = z.object({
	id: z.string().min(1),
	name: z.string().min(1),
});

export type TLandingPartner = z.infer<typeof landingPartnerSchema>;

/* Section 6: Opportunities Schema */
export const landingOpportunityItemSchema = z.object({
	id: z.string().min(1),
	title: z.string().min(1),
	description: z.string().min(1),
	linkLabel: z.string().min(1),
	to: z.string().optional(),
	thumbnail: z.string().optional(),
});

export type TLandingOpportunityItem = z.infer<
	typeof landingOpportunityItemSchema
>;
