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
	head: () => ({
		meta: [
			{
				charSet: "utf-8",
			},
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1",
			},
			{
				title: SITE_CONFIG.metadata.title,
			},
		],
		links: [
			{
				rel: "stylesheet",
				href: appCss,
			},
		],
	}),
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
