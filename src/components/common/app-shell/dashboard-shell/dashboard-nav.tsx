import type { Icon } from "@tabler/icons-react";
import {
	IconBriefcase,
	IconCalendarEvent,
	IconChevronRight,
	IconFileText,
	IconLayoutDashboard,
	IconRocket,
	IconSettings,
	IconUsers,
} from "@tabler/icons-react";
import { Link, useLocation } from "@tanstack/react-router";
import type { ComponentProps } from "react";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuBadge,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarMenuSubButton,
	SidebarMenuSubItem,
	useSidebar,
} from "@/components/ui/sidebar";
import { DEFAULT_LOCALE, type MessageKey, useI18n } from "@/lib/i18n";

type TLinkTo = ComponentProps<typeof Link>["to"];

/* Locale-prefixed route path cho Link (to) — config giữ URL gốc (không locale). */
const toRoute = (path: string) => `/{-$locale}${path}` as TLinkTo;

export interface DashboardNavItem {
	title: string;
	to: string;
	icon: Icon;
	/* Path prefix dùng để xác định active state — mặc định = to. */
	match?: string;
	badge?: string;
	children?: DashboardNavItem[];
}

export interface DashboardNavGroup {
	label: string;
	items: DashboardNavItem[];
}

interface INavContext {
	params: { locale: string | undefined };
	hrefOf: (to: string) => string;
	isActive: (to: string, match?: string) => boolean;
	isParentActive: (to: string, match?: string) => boolean;
}

const useNavContext = (): INavContext => {
	const { locale } = useI18n();
	const pathname = useLocation({ select: (s) => s.pathname });
	const prefix = locale === DEFAULT_LOCALE ? "" : `/${locale}`;
	const params = { locale: locale === DEFAULT_LOCALE ? undefined : locale };

	return {
		params,
		hrefOf: (to) => `${prefix}${to}`,
		isActive: (to, match) => pathname === `${prefix}${match ?? to}`,
		isParentActive: (to, match) => {
			const base = `${prefix}${match ?? to}`;
			return pathname === base || pathname.startsWith(`${base}/`);
		},
	};
};

const NavItemButton = ({ item }: { item: DashboardNavItem }) => {
	const { params, isActive } = useNavContext();
	const { isMobile, setOpenMobile } = useSidebar();
	const active = isActive(item.to, item.match);

	return (
		<SidebarMenuItem>
			<SidebarMenuButton asChild isActive={active} tooltip={item.title}>
				<Link
					to={toRoute(item.to)}
					params={params as never}
					onClick={() => {
						if (isMobile) setOpenMobile(false);
					}}
				>
					<item.icon className="size-4" />
					<span>{item.title}</span>
				</Link>
			</SidebarMenuButton>
			{item.badge ? <SidebarMenuBadge>{item.badge}</SidebarMenuBadge> : null}
		</SidebarMenuItem>
	);
};

const NavSubFlyout = ({ item }: { item: DashboardNavItem }) => {
	const { params, isParentActive } = useNavContext();
	const { isMobile, setOpenMobile } = useSidebar();

	return (
		<SidebarMenuItem>
			<DropdownMenu>
				<DropdownMenuTrigger
					render={
						<SidebarMenuButton
							tooltip={item.title}
							aria-label={item.title}
							isActive={isParentActive(item.to, item.match)}
						>
							<item.icon className="size-4" />
						</SidebarMenuButton>
					}
				></DropdownMenuTrigger>
				<DropdownMenuContent
					side="right"
					align="start"
					className="min-w-48 p-1.5"
				>
					<div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
						{item.title}
					</div>
					{item.children?.map((child) => (
						<DropdownMenuItem
							key={child.to}
							render={
								<Link
									to={toRoute(child.to)}
									params={params as never}
									onClick={() => {
										if (isMobile) setOpenMobile(false);
									}}
								/>
							}
						>
							<span>{child.title}</span>
						</DropdownMenuItem>
					))}
				</DropdownMenuContent>
			</DropdownMenu>
		</SidebarMenuItem>
	);
};

const NavItemGroup = ({ item }: { item: DashboardNavItem }) => {
	const { params, isActive, isParentActive } = useNavContext();
	const { isMobile, setOpenMobile } = useSidebar();
	const parentActive = isParentActive(item.to, item.match);

	return (
		<Collapsible defaultOpen={parentActive} className="group/collapsible">
			<SidebarMenuItem>
				<CollapsibleTrigger
					render={
						<SidebarMenuButton isActive={parentActive}>
							<item.icon className="size-4" />
							<span>{item.title}</span>
							<IconChevronRight className="ml-auto size-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
						</SidebarMenuButton>
					}
				></CollapsibleTrigger>
				<CollapsibleContent>
					<SidebarMenuSub>
						{item.children?.map((child) => (
							<SidebarMenuSubItem key={child.to}>
								<SidebarMenuSubButton
									asChild
									isActive={isActive(child.to, child.match)}
								>
									<Link
										to={toRoute(child.to)}
										params={params as never}
										onClick={() => {
											if (isMobile) setOpenMobile(false);
										}}
									>
										<span>{child.title}</span>
									</Link>
								</SidebarMenuSubButton>
							</SidebarMenuSubItem>
						))}
					</SidebarMenuSub>
				</CollapsibleContent>
			</SidebarMenuItem>
		</Collapsible>
	);
};

const NavGroupItems = ({ items }: { items: DashboardNavItem[] }) => {
	const { state } = useSidebar();

	return (
		<SidebarMenu>
			{items.map((item) =>
				item.children?.length ? (
					state === "collapsed" ? (
						<NavSubFlyout key={item.to} item={item} />
					) : (
						<NavItemGroup key={item.to} item={item} />
					)
				) : (
					<NavItemButton key={item.to} item={item} />
				),
			)}
		</SidebarMenu>
	);
};

export const DashboardNav = ({ groups }: { groups: DashboardNavGroup[] }) => (
	<>
		{groups.map((group) => (
			<SidebarGroup key={group.label}>
				<SidebarGroupLabel>{group.label}</SidebarGroupLabel>
				<SidebarGroupContent>
					<NavGroupItems items={group.items} />
				</SidebarGroupContent>
			</SidebarGroup>
		))}
	</>
);

/* Config nav — composition pattern, data-driven. Locale-aware qua useI18n. */
export const buildDashboardNav = (
	t: (key: MessageKey) => string,
): DashboardNavGroup[] => [
	{
		label: t("dashboard.nav.overview"),
		items: [
			{
				title: t("dashboard.nav.dashboard"),
				to: "/admin",
				match: "/admin",
				icon: IconLayoutDashboard,
			},
		],
	},
	{
		label: t("dashboard.nav.content"),
		items: [
			{
				title: t("dashboard.nav.publications"),
				to: "/admin/publications",
				icon: IconFileText,
			},
			{
				title: t("dashboard.nav.seminars"),
				to: "/admin/seminars",
				icon: IconCalendarEvent,
			},
			{
				title: t("dashboard.nav.careers"),
				to: "/admin/careers",
				icon: IconBriefcase,
			},
			{
				title: t("dashboard.nav.teams"),
				to: "/admin/teams",
				icon: IconUsers,
			},
			{
				title: t("dashboard.nav.projects"),
				to: "/admin/projects",
				icon: IconRocket,
			},
		],
	},
	{
		label: t("dashboard.nav.settings"),
		items: [
			{
				title: t("dashboard.nav.settings"),
				to: "/admin/settings",
				icon: IconSettings,
			},
		],
	},
];

/* Item nav đang active (title + to) — dùng cho breadcrumb header.
 * Chọn MATCH SÂU NHẤT theo prefix (VD /admin/seminars/new → Seminars). */
export const getActiveNavItem = (
	groups: DashboardNavGroup[],
	hrefOf: (to: string) => string,
	pathname: string,
): { title: string; to: string } | null => {
	let best: { title: string; to: string } | null = null;

	const consider = (title: string, to: string) => {
		const base = hrefOf(to);
		if (pathname === base || pathname.startsWith(`${base}/`)) {
			if (!best || base.length > hrefOf(best.to).length) {
				best = { title, to };
			}
		}
	};

	for (const group of groups) {
		for (const item of group.items) {
			consider(item.title, item.match ?? item.to);
			if (item.children?.length) {
				for (const child of item.children) {
					consider(child.title, child.match ?? child.to);
				}
			}
		}
	}
	return best;
};
