/** biome-ignore-all lint/security/noDangerouslySetInnerHtml: <idk> */

import { TanStackDevtools } from "@tanstack/react-devtools";
import {
	createRootRouteWithContext,
	HeadContent,
	Scripts,
	useRouterState,
} from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { ErrorFallback, NotFound } from "@/components/common/error-pages";
import { QueryProvider } from "@/components/common/query-provider";
import { ThemeProvider } from "@/components/common/theme-provider";
import { ToasterProvider } from "@/components/common/toaster-provider";
import { SITE_CONFIG } from "@/configs/site";
import { getLocaleFromPathname, I18nProvider } from "@/lib/i18n";
import { getThemeServerFn } from "@/lib/theme";
import type { IRouterContext } from "@/router";
import appCss from "../styles.css?url";

export const Route = createRootRouteWithContext<IRouterContext>()({
	head: () => {
		const title = SITE_CONFIG.metadata.title;
		const description = SITE_CONFIG.metadata.description;
		const url = SITE_CONFIG.app.url;
		const ogImage = SITE_CONFIG.app.ogImage;

		return {
			meta: [
				{ charSet: "utf-8" },
				{
					name: "viewport",
					content: "width=device-width, initial-scale=1",
				},
				{ title },
				{ name: "description", content: description },
				{ name: "keywords", content: SITE_CONFIG.metadata.keywords.join(", ") },
				// Open Graph
				{ property: "og:site_name", content: SITE_CONFIG.app.title },
				{ property: "og:title", content: title },
				{ property: "og:description", content: description },
				{ property: "og:type", content: "website" },
				{ property: "og:url", content: url },
				{ property: "og:image", content: ogImage },
				// Twitter Card
				{ name: "twitter:card", content: "summary_large_image" },
				{ name: "twitter:title", content: title },
				{ name: "twitter:description", content: description },
				{ name: "twitter:image", content: ogImage },
			],
			links: [
				{ rel: "stylesheet", href: appCss },
				{ rel: "canonical", href: url },
				{ rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
				{ rel: "icon", href: "/favicon.ico", sizes: "32x32" },
				{ rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
				{ rel: "manifest", href: "/manifest.json" },
				// Hreflang
				{ rel: "alternate", hrefLang: "en", href: url },
				{ rel: "alternate", hrefLang: "vi", href: `${url}/vi` },
				{ rel: "alternate", hrefLang: "x-default", href: url },
			],
			scripts: [
				{
					type: "application/ld+json",
					children: JSON.stringify({
						"@context": "https://schema.org",
						"@type": "Organization",
						name: SITE_CONFIG.app.title,
						slogan: SITE_CONFIG.app.slogan,
						url,
						logo: `${url}/logo512.png`,
						description,
						knowsAbout: SITE_CONFIG.metadata.keywords,
					}),
				},
			],
		};
	},
	loader: () => getThemeServerFn(),
	shellComponent: RootDocument,
	notFoundComponent: NotFound,
	errorComponent: ErrorFallback,
});

function RootDocument({ children }: { children: React.ReactNode }) {
	const theme = Route.useLoaderData();
	const { queryClient } = Route.useRouteContext();
	const locale = useRouterState({
		select: (s) => getLocaleFromPathname(s.location.pathname),
	});

	return (
		<html lang={locale} className={theme} suppressHydrationWarning>
			<head>
				<HeadContent />
			</head>
			<body suppressHydrationWarning>
				<QueryProvider client={queryClient}>
					<ThemeProvider theme={theme}>
						<I18nProvider>
							{children}
							<ToasterProvider />
						</I18nProvider>
					</ThemeProvider>
				</QueryProvider>
				<TanStackDevtools
					config={{
						position: "bottom-right",
					}}
					plugins={[
						{
							name: "Tanstack Router",
							render: <TanStackRouterDevtoolsPanel />,
						},
					]}
				/>
				<Scripts />
			</body>
		</html>
	);
}
