import { create } from "zustand";

/* Sidebar dashboard UI state — global client state, không mirror server data. */

export const SIDEBAR_DEFAULT_WIDTH = 256;
export const SIDEBAR_MIN_WIDTH = 240;
export const SIDEBAR_MAX_WIDTH = 400;
export const SIDEBAR_ICON_WIDTH = 48;
export const SIDEBAR_COLLAPSE_THRESHOLD = 180;

const STORAGE_KEY = "d2ai-dash-sidebar";

interface DashboardUIState {
	sidebarWidth: number;
	sidebarCollapsed: boolean;
	sidebarMobileOpen: boolean;
	isResizing: boolean;
	setSidebarWidth: (width: number) => void;
	setSidebarCollapsed: (collapsed: boolean) => void;
	toggleSidebar: () => void;
	setSidebarMobileOpen: (open: boolean) => void;
	setIsResizing: (resizing: boolean) => void;
}

/* Zero-FOUC: giữ trạng thái trên <html> đồng bộ với store (var + class),
 * để inline script trong <head> đã áp trước paint không bị lệch sau khi hydrate. */
const syncHtmlState = (width: number, collapsed: boolean) => {
	if (typeof window === "undefined") return;
	const root = document.documentElement;
	root.style.setProperty(
		"--sidebar-width",
		collapsed ? `${SIDEBAR_ICON_WIDTH}px` : `${width}px`,
	);
	root.classList.toggle("sidebar-collapsed", collapsed);
};

const persist = (width: number, collapsed: boolean) => {
	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify({ width, collapsed }));
	} catch {
		/* localStorage có thể không khả dụng (private mode) — bỏ qua. */
	}
	syncHtmlState(width, collapsed);
};

export const useDashboardUIStore = create<DashboardUIState>()((set, get) => ({
	sidebarWidth: SIDEBAR_DEFAULT_WIDTH,
	sidebarCollapsed: false,
	sidebarMobileOpen: false,
	isResizing: false,

	setSidebarWidth: (width) => {
		set({ sidebarWidth: width });
		persist(width, get().sidebarCollapsed);
	},
	setSidebarCollapsed: (collapsed) => {
		set({ sidebarCollapsed: collapsed });
		persist(get().sidebarWidth, collapsed);
	},
	toggleSidebar: () => {
		const { sidebarWidth, sidebarCollapsed } = get();
		const next = !sidebarCollapsed;
		set({ sidebarCollapsed: next });
		persist(sidebarWidth, next);
	},
	setSidebarMobileOpen: (open) => set({ sidebarMobileOpen: open }),
	setIsResizing: (resizing) => set({ isResizing: resizing }),
}));

/**
 * Đọc trạng thái sidebar đã lưu từ localStorage.
 * Chạy trên client sau khi mount (useIsomorphicLayoutEffect — trước paint).
 */
export function hydrateDashboardUIFromStorage() {
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		if (!raw) return;
		const parsed = JSON.parse(raw) as {
			width?: number;
			collapsed?: boolean;
		};
		let width = SIDEBAR_DEFAULT_WIDTH;
		let collapsed = false;
		if (typeof parsed.width === "number") {
			width = Math.max(
				SIDEBAR_MIN_WIDTH,
				Math.min(parsed.width, SIDEBAR_MAX_WIDTH),
			);
		}
		if (typeof parsed.collapsed === "boolean") {
			collapsed = parsed.collapsed;
		}
		useDashboardUIStore.setState({
			sidebarWidth: width,
			sidebarCollapsed: collapsed,
		});
		syncHtmlState(width, collapsed);
	} catch {
		/* JSON hỏng hoặc không đọc được — giữ mặc định. */
	}
}
