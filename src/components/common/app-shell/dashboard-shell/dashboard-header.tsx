import {
	IconLayoutSidebarLeftCollapse,
	IconLayoutSidebarLeftExpand,
	IconMenu2,
} from "@tabler/icons-react";
import { Link, useLocation, useMatches } from "@tanstack/react-router";
import { Fragment } from "react";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import { DEFAULT_LOCALE, type MessageKey, useI18n } from "@/lib/i18n";
import { buildDashboardNav, getActiveNavItem } from "./dashboard-nav";

/* Trigger toggle sidebar — icon phản ánh trạng thái hiện tại:
 * expanded → collapse icon; collapsed → expand icon; mobile → hamburger. */
const DashboardSidebarTrigger = () => {
	const { state, toggleSidebar, isMobile } = useSidebar();
	const { t } = useI18n("dashboard");
	const Icon = isMobile
		? IconMenu2
		: state === "collapsed"
			? IconLayoutSidebarLeftExpand
			: IconLayoutSidebarLeftCollapse;

	return (
		<Button
			variant="ghost"
			size="icon"
			aria-label={t("toggleSidebar")}
			onClick={toggleSidebar}
		>
			<Icon className="size-4" />
		</Button>
	);
};

/* Sub-page (create/edit/detail) → label breadcrumb cuối. */
const SUB_TITLES: Record<string, MessageKey> = {
	"/{-$locale}/_dashboard/admin/seminars/new": "dashboard.seminars.createTitle",
	"/{-$locale}/_dashboard/admin/seminars/$id/edit":
		"dashboard.seminars.editTitle",
};

export const DashboardHeader = () => {
	const { t, locale } = useI18n();
	const pathname = useLocation({ select: (s) => s.pathname });
	const matches = useMatches();
	const params = { locale: locale === DEFAULT_LOCALE ? undefined : locale };
	const prefix = locale === DEFAULT_LOCALE ? "" : `/${locale}`;

	const activeItem = getActiveNavItem(
		buildDashboardNav(t),
		(to) => `${prefix}${to}`,
		pathname,
	);

	const deepestRouteId = matches[matches.length - 1]?.routeId ?? "";
	const subKey = SUB_TITLES[deepestRouteId];
	const subTitle = subKey ? t(subKey) : "";

	/* Breadcrumb: Dashboard / <Section> / <Sub>. Crumb cuối là title hiện tại. */
	const crumbs: { label: string; to?: string }[] = [
		{ label: t("dashboard.index.title"), to: "/{-$locale}/admin" },
	];
	if (activeItem && activeItem.to !== "/admin") {
		crumbs.push({ label: activeItem.title, to: `/{-$locale}${activeItem.to}` });
	}
	if (subTitle) {
		crumbs.push({ label: subTitle });
	}

	return (
		<header
			data-slot="dashboard-header"
			className="sticky top-0 z-30 flex h-14 shrink-0 items-center gap-2 border-b bg-background/80 px-4 backdrop-blur supports-backdrop-filter:backdrop-blur md:px-6"
		>
			{/* Toggle sidebar chỉ hiện trên mobile (desktop dùng Ctrl+B / resize handle). */}
			<div className="md:hidden">
				<DashboardSidebarTrigger />
			</div>
			<Breadcrumb>
				<BreadcrumbList>
					{crumbs.map((crumb, index) => {
						const isLast = index === crumbs.length - 1;
						return (
							<Fragment key={`${crumb.label}-${crumb.to ?? "leaf"}`}>
								{index > 0 && <BreadcrumbSeparator />}
								<BreadcrumbItem>
									{crumb.to && !isLast ? (
										<BreadcrumbLink
											render={<Link to={crumb.to} params={params} />}
										>
											{crumb.label}
										</BreadcrumbLink>
									) : (
										<BreadcrumbPage className="font-medium text-foreground">
											{crumb.label}
										</BreadcrumbPage>
									)}
								</BreadcrumbItem>
							</Fragment>
						);
					})}
				</BreadcrumbList>
			</Breadcrumb>
		</header>
	);
};
