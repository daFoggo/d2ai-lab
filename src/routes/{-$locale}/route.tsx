import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { toast } from "sonner";
import type { IAppNavItem } from "@/components/common/app-shell";
import { AppFooter, AppLayout, AppNavbar } from "@/components/common/app-shell";
import { AuthButton } from "@/features/auth";
import { DEFAULT_LOCALE, isLocale, useI18n } from "@/lib/i18n";

/* Other research teams and initiative areas — placeholder links, thay bằng link thật khi có backend. */
const FOOTER_LABS = [
	{ label: "Data Science Hub", href: "#" },
	{ label: "AI & Multimedia Lab", href: "#" },
	{ label: "IoT & Ambient Computing", href: "#" },
	{ label: "Cyber Security & Networks", href: "#" },
	{ label: "Robotics & Automation", href: "#" },
];

const LocaleLayout = () => {
	const { t } = useI18n();

	const navItems: IAppNavItem[] = [
		{
			label: t("common.nav.research"),
			items: [
				{
					title: t("common.nav.researchAreas"),
					to: "/{-$locale}/research/areas",
					description: t("common.nav.researchAreasDesc"),
				},
				{
					title: t("common.nav.researchDirections"),
					to: "/{-$locale}/research/directions",
					description: t("common.nav.researchDirectionsDesc"),
				},
				{
					title: t("common.nav.researchGaps"),
					to: "/{-$locale}/research/gaps",
					description: t("common.nav.researchGapsDesc"),
				},
			],
		},
		{ label: t("common.nav.people"), to: "/{-$locale}/teams" },
		{ label: t("common.nav.publications"), to: "/{-$locale}/publications" },
		{ label: t("common.nav.projects"), to: "/{-$locale}/projects" },
		{ label: t("common.nav.seminars"), to: "/{-$locale}/seminars" },
		{ label: t("common.nav.careers"), to: "/{-$locale}/careers" },
	];

	const handleSearch = () => {
		toast.info(t("common.toast.search"), {
			description: t("common.toast.searchDesc"),
		});
	};

	return (
		<AppLayout>
			<AppNavbar.Root>
				<div className="flex items-center gap-6 lg:gap-10">
					<AppNavbar.Brand name="D2AI Lab" hasDropdown={false} />
					<AppNavbar.Nav items={navItems} />
				</div>
				<AppNavbar.Actions onSearchClick={handleSearch} items={navItems}>
					<AuthButton />
				</AppNavbar.Actions>
			</AppNavbar.Root>

			<main className="flex flex-col pb-20">
				<Outlet />
			</main>

			<AppFooter brandName="D2AI Lab" labs={FOOTER_LABS} />
		</AppLayout>
	);
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
