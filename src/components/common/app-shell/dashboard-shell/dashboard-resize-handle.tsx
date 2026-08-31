import { useEffect, useRef } from "react";
import {
	SIDEBAR_COLLAPSE_THRESHOLD,
	SIDEBAR_MAX_WIDTH,
	SIDEBAR_MIN_WIDTH,
	useDashboardUIStore,
} from "@/stores/dashboard-ui-store";

/*
 * Resize handle (Vercel-style): kéo thay đổi chiều rộng sidebar.
 * - Kéo trái dưới ngưỡng COLLAPSE_THRESHOLD → snap collapse về icon rail.
 * - Kéo phải từ trạng thái collapsed → expand về MIN_WIDTH rồi tiếp tục.
 * - Click (không kéo) → toggle collapsed. Phím mũi tên → resize từng bước.
 */
export const DashboardResizeHandle = () => {
	const width = useDashboardUIStore((s) => s.sidebarWidth);
	const collapsed = useDashboardUIStore((s) => s.sidebarCollapsed);
	const setWidth = useDashboardUIStore((s) => s.setSidebarWidth);
	const setCollapsed = useDashboardUIStore((s) => s.setSidebarCollapsed);
	const setIsResizing = useDashboardUIStore((s) => s.setIsResizing);

	/* Chặn onClick toggle khi vừa thực hiện drag. */
	const didDragRef = useRef(false);

	useEffect(() => {
		return () => {
			document.body.classList.remove("select-none");
		};
	}, []);

	const onPointerDown = (event: React.PointerEvent<HTMLButtonElement>) => {
		if (event.button !== 0) return;
		event.preventDefault();

		didDragRef.current = false;

		const { sidebarWidth, sidebarCollapsed } = useDashboardUIStore.getState();

		/* Bắt đầu kéo từ trạng thái collapsed → expand về min trước. */
		const startWidth = sidebarCollapsed ? SIDEBAR_MIN_WIDTH : sidebarWidth;
		const startX = event.clientX;

		if (sidebarCollapsed) {
			setCollapsed(false);
			setWidth(SIDEBAR_MIN_WIDTH);
		}

		setIsResizing(true);
		document.body.classList.add("select-none");

		const onMove = (moveEvent: PointerEvent) => {
			if (Math.abs(moveEvent.clientX - startX) > 4) {
				didDragRef.current = true;
			}
			const next = startWidth + (moveEvent.clientX - startX);
			if (next < SIDEBAR_COLLAPSE_THRESHOLD) {
				setCollapsed(true);
			} else {
				setCollapsed(false);
				setWidth(
					Math.max(SIDEBAR_MIN_WIDTH, Math.min(next, SIDEBAR_MAX_WIDTH)),
				);
			}
		};

		const onUp = () => {
			setIsResizing(false);
			document.body.classList.remove("select-none");
			window.removeEventListener("pointermove", onMove);
			window.removeEventListener("pointerup", onUp);
		};

		window.addEventListener("pointermove", onMove);
		window.addEventListener("pointerup", onUp);
	};

	const onKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
		if (event.key === "ArrowLeft") {
			event.preventDefault();
			setCollapsed(false);
			setWidth(Math.max(SIDEBAR_MIN_WIDTH, width - 16));
		} else if (event.key === "ArrowRight") {
			event.preventDefault();
			setCollapsed(false);
			setWidth(Math.min(SIDEBAR_MAX_WIDTH, width + 16));
		}
	};

	return (
		<button
			type="button"
			data-sidebar="resize-handle"
			aria-label="Resize sidebar"
			onClick={() => {
				if (didDragRef.current) return;
				setCollapsed(!collapsed);
			}}
			onPointerDown={onPointerDown}
			onKeyDown={onKeyDown}
			className="absolute inset-y-0 right-0 z-30 w-2 translate-x-1/2 cursor-col-resize touch-none outline-none select-none"
		/>
	);
};
