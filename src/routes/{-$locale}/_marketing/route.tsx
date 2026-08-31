import { createFileRoute, Outlet } from "@tanstack/react-router";
import { useState } from "react";
import type { IAppNavItem } from "@/components/common/app-shell";
import { AppFooter, AppLayout, AppNavbar } from "@/components/common/app-shell";
import { AuthButton } from "@/features/auth";
import { SearchDialog, type SearchItem } from "@/features/search";
import { DEFAULT_LOCALE, useI18n } from "@/lib/i18n";

/* Other research teams and initiative areas — placeholder links, thay bằng link thật khi có backend. */
const FOOTER_LABS = [
	{ label: "Data Science Hub", href: "#" },
	{ label: "AI & Multimedia Lab", href: "#" },
	{ label: "IoT & Ambient Computing", href: "#" },
	{ label: "Cyber Security & Networks", href: "#" },
	{ label: "Robotics & Automation", href: "#" },
];

const MarketingLayout = () => {
	const { t, locale } = useI18n();
	const [searchOpen, setSearchOpen] = useState(false);
	const localeParams = {
		locale: locale === DEFAULT_LOCALE ? undefined : locale,
	};

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

	/* Quick-nav destinations cho SearchDialog (Cmd+K). */
	const searchItems: SearchItem[] = [
		{
			label: t("common.nav.researchAreas"),
			to: "/{-$locale}/research/areas",
			params: localeParams,
		},
		{
			label: t("common.nav.researchDirections"),
			to: "/{-$locale}/research/directions",
			params: localeParams,
		},
		{
			label: t("common.nav.researchGaps"),
			to: "/{-$locale}/research/gaps",
			params: localeParams,
		},
		{
			label: t("common.nav.people"),
			to: "/{-$locale}/teams",
			params: localeParams,
		},
		{
			label: t("common.nav.publications"),
			to: "/{-$locale}/publications",
			params: localeParams,
		},
		{
			label: t("common.nav.projects"),
			to: "/{-$locale}/projects",
			params: localeParams,
		},
		{
			label: t("common.nav.seminars"),
			to: "/{-$locale}/seminars",
			params: localeParams,
		},
		{
			label: t("common.nav.careers"),
			to: "/{-$locale}/careers",
			params: localeParams,
		},
	];

	return (
		<AppLayout>
			<AppNavbar.Root>
				<div className="flex items-center gap-6 lg:gap-10">
					<AppNavbar.Brand name="D2AI Lab" hasDropdown={false} />
					<AppNavbar.Nav items={navItems} />
				</div>
				<AppNavbar.Actions
					onSearchClick={() => setSearchOpen(true)}
					items={navItems}
				>
					<AuthButton />
				</AppNavbar.Actions>
			</AppNavbar.Root>

			<main className="flex flex-col pb-20">
				<Outlet />
			</main>

			<AppFooter brandName="D2AI Lab" labs={FOOTER_LABS} />

			<SearchDialog
				open={searchOpen}
				onOpenChange={setSearchOpen}
				items={searchItems}
			/>
		</AppLayout>
	);
};

export const Route = createFileRoute("/{-$locale}/_marketing")({
	component: MarketingLayout,
});
