import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { DEFAULT_LOCALE, isLocale } from "@/lib/i18n";

/*
 * Locale layout — chỉ chịu trách nhiệm i18n + locale guard.
 * Chrome (marketing shell / dashboard shell) nằm ở pathless layout con:
 *   _marketing/route.tsx — AppLayout + AppNavbar + AppFooter
 *   _dashboard/route.tsx — DashboardLayout + Sidebar + Topbar
 */
const LocaleLayout = () => {
	return <Outlet />;
};

export const Route = createFileRoute("/{-$locale}")({
	beforeLoad: ({ params }) => {
		if (params.locale && !isLocale(params.locale)) {
			throw redirect({ to: "/{-$locale}", params: { locale: undefined } });
		}
		return { locale: params.locale ?? DEFAULT_LOCALE };
	},
	component: LocaleLayout,
});
