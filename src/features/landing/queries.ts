import { queryOptions } from "@tanstack/react-query";
import {
	getLandingDomainsFn,
	getLandingHeroStatsFn,
	getLandingMissionFn,
	getLandingOpportunitiesFn,
	getLandingPartnersFn,
	getLandingProjectsFn,
	getLandingPublicationsFn,
	getLandingUpcomingSeminarFn,
} from "./functions";

export const landingKeys = {
	all: ["landing"] as const,
	heroStats: () => [...landingKeys.all, "hero-stats"] as const,
	upcomingSeminar: () => [...landingKeys.all, "upcoming-seminar"] as const,
	mission: () => [...landingKeys.all, "mission"] as const,
	domains: () => [...landingKeys.all, "domains"] as const,
	publications: () => [...landingKeys.all, "publications"] as const,
	projects: () => [...landingKeys.all, "projects"] as const,
	partners: () => [...landingKeys.all, "partners"] as const,
	opportunities: () => [...landingKeys.all, "opportunities"] as const,
};

/*
 * NOTE — granular query: mỗi section 1 query riêng để cache/invalidation độc lập.
 * Khi có backend thật, seminar/publications/projects sẽ dùng queryOptions
 * từ feature sở hữu tương ứng.
 */

export const landingHeroStatsQueryOptions = () =>
	queryOptions({
		queryKey: landingKeys.heroStats(),
		queryFn: () => getLandingHeroStatsFn(),
		staleTime: 1000 * 60 * 5,
	});

export const landingUpcomingSeminarQueryOptions = () =>
	queryOptions({
		queryKey: landingKeys.upcomingSeminar(),
		queryFn: () => getLandingUpcomingSeminarFn(),
		staleTime: 1000 * 60 * 5,
	});

export const landingMissionQueryOptions = () =>
	queryOptions({
		queryKey: landingKeys.mission(),
		queryFn: () => getLandingMissionFn(),
		staleTime: 1000 * 60 * 5,
	});

export const landingDomainsQueryOptions = () =>
	queryOptions({
		queryKey: landingKeys.domains(),
		queryFn: () => getLandingDomainsFn(),
		staleTime: 1000 * 60 * 5,
	});

export const landingPublicationsQueryOptions = () =>
	queryOptions({
		queryKey: landingKeys.publications(),
		queryFn: () => getLandingPublicationsFn(),
		staleTime: 1000 * 60 * 5,
	});

export const landingProjectsQueryOptions = () =>
	queryOptions({
		queryKey: landingKeys.projects(),
		queryFn: () => getLandingProjectsFn(),
		staleTime: 1000 * 60 * 5,
	});

export const landingPartnersQueryOptions = () =>
	queryOptions({
		queryKey: landingKeys.partners(),
		queryFn: () => getLandingPartnersFn(),
		staleTime: 1000 * 60 * 5,
	});

export const landingOpportunitiesQueryOptions = () =>
	queryOptions({
		queryKey: landingKeys.opportunities(),
		queryFn: () => getLandingOpportunitiesFn(),
		staleTime: 1000 * 60 * 5,
	});
