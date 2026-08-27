import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { toast } from "sonner";
import { AuthButton } from "@/features/auth";
import type { TLandingNavItem } from "@/features/landing";
import {
	LandingFooter,
	LandingLayout,
	LandingNavbar,
} from "@/features/landing";
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

	const navItems: TLandingNavItem[] = [
		{
			label: t("landing.nav.research"),
			items: [
				{
					title: t("landing.nav.researchAreas"),
					to: "/{-$locale}/research/areas",
					description: t("landing.nav.researchAreasDesc"),
				},
				{
					title: t("landing.nav.researchDirections"),
					to: "/{-$locale}/research/directions",
					description: t("landing.nav.researchDirectionsDesc"),
				},
				{
					title: t("landing.nav.researchGaps"),
					to: "/{-$locale}/research/gaps",
					description: t("landing.nav.researchGapsDesc"),
				},
			],
		},
		{ label: t("landing.nav.people"), to: "/{-$locale}/teams" },
		{ label: t("landing.nav.publications"), to: "/{-$locale}/publications" },
		{ label: t("landing.nav.projects"), to: "/{-$locale}/projects" },
		{ label: t("landing.nav.seminars"), to: "/{-$locale}/seminars" },
		{ label: t("landing.nav.careers"), to: "/{-$locale}/careers" },
	];

	const handleSearch = () => {
		toast.info(t("landing.toast.search"), {
			description: t("landing.toast.searchDesc"),
		});
	};

	return (
		<LandingLayout>
			<LandingNavbar.Root>
				<div className="flex items-center gap-6 lg:gap-10">
					<LandingNavbar.Brand name="D2AI Lab" hasDropdown={false} />
					<LandingNavbar.Nav items={navItems} />
				</div>
				<LandingNavbar.Actions onSearchClick={handleSearch} items={navItems}>
					<AuthButton />
				</LandingNavbar.Actions>
			</LandingNavbar.Root>

			<main className="flex flex-col pb-20">
				<Outlet />
			</main>

			<LandingFooter brandName="D2AI Lab" labs={FOOTER_LABS} />
		</LandingLayout>
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
