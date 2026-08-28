import { createServerFn } from "@tanstack/react-start";
import type { TSeminar } from "@/features/seminars";
import type {
	TLandingDomainItem,
	TLandingHeroStat,
	TLandingOpportunityItem,
	TLandingPartner,
	TLandingProjectHero,
	TLandingProjectItem,
	TLandingPublicationItem,
} from "./schemas";
import {
	getLandingDomains,
	getLandingHeroStats,
	getLandingMission,
	getLandingOpportunities,
	getLandingPartners,
	getLandingProjects,
	getLandingPublications,
	getLandingUpcomingSeminar,
} from "./server";

/*
 * NOTE — mỗi server function tương ứng với một resource riêng (feature ownership):
 * seminar/publications/projects sẽ chuyển sang feature sở hữu khi có backend thật.
 */

export const getLandingHeroStatsFn = createServerFn({
	method: "GET",
}).handler(async (): Promise<TLandingHeroStat[]> => getLandingHeroStats());

export const getLandingUpcomingSeminarFn = createServerFn({
	method: "GET",
}).handler(async (): Promise<TSeminar> => getLandingUpcomingSeminar());

export const getLandingMissionFn = createServerFn({
	method: "GET",
}).handler(
	async (): Promise<{ title: string; description: string }> =>
		getLandingMission(),
);

export const getLandingDomainsFn = createServerFn({
	method: "GET",
}).handler(async (): Promise<TLandingDomainItem[]> => getLandingDomains());

export const getLandingPublicationsFn = createServerFn({
	method: "GET",
}).handler(
	async (): Promise<TLandingPublicationItem[]> => getLandingPublications(),
);

export const getLandingProjectsFn = createServerFn({
	method: "GET",
}).handler(
	async (): Promise<{
		hero: TLandingProjectHero;
		items: TLandingProjectItem[];
	}> => getLandingProjects(),
);

export const getLandingPartnersFn = createServerFn({
	method: "GET",
}).handler(async (): Promise<TLandingPartner[]> => getLandingPartners());

export const getLandingOpportunitiesFn = createServerFn({
	method: "GET",
}).handler(
	async (): Promise<TLandingOpportunityItem[]> => getLandingOpportunities(),
);
