import { useRouterState } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { createContext, useContext, useMemo } from "react";
import { getLocaleFromPathname, type Locale } from "./locales";
import { type Messages, messages } from "./resources";

type Join<K extends string, P extends string> = P extends "" ? K : `${K}.${P}`;

type Paths<T> = T extends object
	? {
			[K in keyof T]-?: K extends string ? K | Join<K, Paths<T[K]>> : never;
		}[keyof T]
	: "";

export type Namespace = keyof Messages;

export type MessageKey = Paths<Messages>;

export type MessageKeyOf<N extends Namespace> = Paths<Messages[N]>;

function resolve(table: unknown, key: string): string {
	const value = key
		.split(".")
		.reduce<unknown>(
			(acc, part) => (acc as Record<string, unknown>)?.[part],
			table,
		);
	return typeof value === "string" ? value : key;
}

export function createT<NS extends Namespace | undefined>(
	locale: Locale,
	namespace?: NS,
): (key: NS extends Namespace ? MessageKeyOf<NS> : MessageKey) => string {
	const table = namespace ? messages[locale][namespace] : messages[locale];
	return (key: string): string => resolve(table, key);
}

interface II18nContext {
	locale: Locale;
	pathname: string;
	t: (key: MessageKey) => string;
}

const I18nContext = createContext<II18nContext | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	const locale = useMemo(() => getLocaleFromPathname(pathname), [pathname]);
	const t = useMemo(() => createT(locale), [locale]);

	return (
		<I18nContext.Provider value={{ locale, pathname, t }}>
			{children}
		</I18nContext.Provider>
	);
}

export function useI18n(): II18nContext;
export function useI18n<N extends Namespace>(
	namespace: N,
): { locale: Locale; pathname: string; t: (key: MessageKeyOf<N>) => string };
export function useI18n<N extends Namespace>(namespace?: N) {
	const ctx = useContext(I18nContext);
	if (!ctx) {
		throw new Error("useI18n must be used within <I18nProvider>");
	}
	if (namespace) {
		return {
			locale: ctx.locale,
			pathname: ctx.pathname,
			t: createT(ctx.locale, namespace),
		};
	}
	return ctx;
}
