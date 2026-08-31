import { type ReactNode, useEffect, useLayoutEffect } from "react";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import type { AuthUser } from "@/features/auth";
import { useI18n } from "@/lib/i18n";
import {
	hydrateDashboardUIFromStorage,
	useDashboardUIStore,
} from "@/stores/dashboard-ui-store";
import { DashboardHeader } from "./dashboard-header";
import { DashboardSidebar } from "./dashboard-sidebar";

/* useLayoutEffect ở client, useEffect ở server (tránh warning SSR). */
const useIsomorphicLayoutEffect =
	typeof window === "undefined" ? useEffect : useLayoutEffect;

interface IDashboardLayoutProps {
	children: ReactNode;
	user?: AuthUser | null;
	isUserLoading?: boolean;
	onSignOut?: () => void | Promise<void>;
}

export const DashboardLayout = ({
	children,
	user,
	isUserLoading,
	onSignOut,
}: IDashboardLayoutProps) => {
	const { t } = useI18n();
	const collapsed = useDashboardUIStore((s) => s.sidebarCollapsed);
	const setCollapsed = useDashboardUIStore((s) => s.setSidebarCollapsed);

	/* Hydrate trạng thái sidebar từ localStorage TRƯỚC paint
	 * (useIsomorphicLayoutEffect) — đồng bộ lại var/class trên <html>. */
	useIsomorphicLayoutEffect(() => {
		hydrateDashboardUIFromStorage();
	}, []);

	return (
		<SidebarProvider
			open={!collapsed}
			onOpenChange={(open) => setCollapsed(!open)}
		>
			<a
				href="#dashboard-main"
				className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:rounded-md focus:bg-background focus:px-3 focus:py-2 focus:text-sm focus:ring-2 focus:ring-ring"
			>
				{t("dashboard.skipToContent")}
			</a>
			<DashboardSidebar
				user={user}
				isUserLoading={isUserLoading}
				onSignOut={onSignOut}
			/>
			<SidebarInset id="dashboard-main" className="min-h-svh">
				<DashboardHeader />
				<div className="flex-1 p-4 md:p-6">{children}</div>
			</SidebarInset>
		</SidebarProvider>
	);
};
