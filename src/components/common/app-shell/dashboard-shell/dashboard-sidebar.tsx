import { IconLogin, IconLogout } from "@tabler/icons-react";
import { Link } from "@tanstack/react-router";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from "@/components/ui/sidebar";
import { SITE_CONFIG } from "@/configs/site";
import type { AuthUser } from "@/features/auth";
import { DEFAULT_LOCALE, useI18n } from "@/lib/i18n";
import { useDashboardUIStore } from "@/stores/dashboard-ui-store";
import { buildDashboardNav, DashboardNav } from "./dashboard-nav";
import { DashboardResizeHandle } from "./dashboard-resize-handle";

interface IDashboardSidebarProps {
	user?: AuthUser | null;
	isUserLoading?: boolean;
	onSignOut?: () => void | Promise<void>;
}

const SidebarUser = ({
	user,
	isUserLoading,
	onSignOut,
}: IDashboardSidebarProps) => {
	const { t, locale } = useI18n();
	const params = { locale: locale === DEFAULT_LOCALE ? undefined : locale };

	if (isUserLoading) {
		return null;
	}

	if (!user) {
		return (
			<SidebarMenu>
				<SidebarMenuItem>
					<SidebarMenuButton asChild tooltip={t("dashboard.signIn")}>
						<Link to="/{-$locale}" params={params}>
							<IconLogin className="size-4" />
							<span>{t("dashboard.signIn")}</span>
						</Link>
					</SidebarMenuButton>
				</SidebarMenuItem>
			</SidebarMenu>
		);
	}

	const name = user.email.split("@")[0];
	const initial = (user.email[0] ?? "?").toUpperCase();

	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<DropdownMenu>
					<DropdownMenuTrigger
						render={
							<SidebarMenuButton size="lg" tooltip={user.email}>
								<Avatar size="sm">
									<AvatarFallback>{initial}</AvatarFallback>
								</Avatar>
								<span className="min-w-0 flex-1 text-left">
									<span className="block truncate text-sm font-medium">
										{name}
									</span>
									<span className="block truncate text-xs text-sidebar-foreground/60">
										{user.email}
									</span>
								</span>
							</SidebarMenuButton>
						}
					></DropdownMenuTrigger>
					<DropdownMenuContent
						side="right"
						align="start"
						className="min-w-48 p-1.5"
					>
						<div className="border-b px-2 py-1.5">
							<p className="truncate text-xs font-medium">{user.email}</p>
						</div>
						<DropdownMenuItem onClick={onSignOut} className="mt-1">
							<IconLogout className="size-4" />
							<span>{t("dashboard.signOut")}</span>
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</SidebarMenuItem>
		</SidebarMenu>
	);
};

export const DashboardSidebar = ({
	user,
	isUserLoading,
	onSignOut,
}: IDashboardSidebarProps) => {
	const { t, locale } = useI18n();
	const { isMobile, setOpenMobile } = useSidebar();
	const params = { locale: locale === DEFAULT_LOCALE ? undefined : locale };
	const groups = buildDashboardNav(t);
	const isResizing = useDashboardUIStore((s) => s.isResizing);

	return (
		<Sidebar collapsible="icon" side="left" data-resizing={isResizing}>
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton
							size="lg"
							asChild
							tooltip={t("dashboard.backToSite")}
						>
							<Link
								to="/{-$locale}"
								params={params}
								onClick={() => {
									if (isMobile) setOpenMobile(false);
								}}
							>
								<span className="sidebar-brand-full font-title text-lg font-semibold tracking-tight text-foreground sm:text-xl">
									{SITE_CONFIG.app.title}
								</span>
								<span className="sidebar-brand-initial font-title text-lg font-semibold tracking-tight text-foreground">
									{SITE_CONFIG.app.title.charAt(0)}
								</span>
							</Link>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>

			<SidebarContent>
				<DashboardNav groups={groups} />
			</SidebarContent>

			<SidebarFooter>
				<SidebarUser
					user={user}
					isUserLoading={isUserLoading}
					onSignOut={onSignOut}
				/>
			</SidebarFooter>

			<DashboardResizeHandle />
		</Sidebar>
	);
};
