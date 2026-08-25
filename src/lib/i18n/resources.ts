import type { Locale } from "./locales";
import enAuth from "./locales/en/auth.json";
import enCommon from "./locales/en/common.json";
import enError from "./locales/en/error.json";
import enLanding from "./locales/en/landing.json";
import viAuth from "./locales/vi/auth.json";
import viCommon from "./locales/vi/common.json";
import viError from "./locales/vi/error.json";
import viLanding from "./locales/vi/landing.json";

const en = {
	common: enCommon,
	landing: enLanding,
	auth: enAuth,
	error: enError,
} as const;

export type Messages = typeof en;

const vi = {
	common: viCommon,
	landing: viLanding,
	auth: viAuth,
	error: viError,
} satisfies Messages;

export const messages: Record<Locale, Messages> = { en, vi };
