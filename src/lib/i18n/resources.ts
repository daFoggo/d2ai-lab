import type { Locale } from "./locales";
import enAuth from "./locales/en/auth.json";
import enCommon from "./locales/en/common.json";
import enError from "./locales/en/error.json";
import enHome from "./locales/en/home.json";
import enProjects from "./locales/en/projects.json";
import enPublications from "./locales/en/publications.json";
import enSeminars from "./locales/en/seminars.json";
import viAuth from "./locales/vi/auth.json";
import viCommon from "./locales/vi/common.json";
import viError from "./locales/vi/error.json";
import viHome from "./locales/vi/home.json";
import viProjects from "./locales/vi/projects.json";
import viPublications from "./locales/vi/publications.json";
import viSeminars from "./locales/vi/seminars.json";

const en = {
	common: enCommon,
	home: enHome,
	auth: enAuth,
	error: enError,
	seminars: enSeminars,
	publications: enPublications,
	projects: enProjects,
} as const;

export type Messages = typeof en;

const vi = {
	common: viCommon,
	home: viHome,
	auth: viAuth,
	error: viError,
	seminars: viSeminars,
	publications: viPublications,
	projects: viProjects,
} satisfies Messages;

export const messages: Record<Locale, Messages> = { en, vi };
