import { IconPlus } from "@tabler/icons-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface ICornerFrameProps {
	children: ReactNode;
	className?: string;
}

/**
 * Trang trí góc kiểu Vercel: dấu "+" ở 4 góc nằm ngay trên mép khối.
 * Dùng để tạo điểm nhấn cho một card/ảnh nổi bật mà không thêm nền hay viền riêng.
 */
export const CornerFrame = ({ children, className }: ICornerFrameProps) => {
	return (
		<div data-slot="corner-frame" className={cn("relative", className)}>
			<CornerPlus className="top-0 left-0 -translate-y-1/2 -translate-x-1/2" />
			<CornerPlus className="top-0 right-0 -translate-y-1/2 translate-x-1/2" />
			<CornerPlus className="bottom-0 left-0 translate-y-1/2 -translate-x-1/2" />
			<CornerPlus className="bottom-0 right-0 translate-y-1/2 translate-x-1/2" />
			{children}
		</div>
	);
};

const CornerPlus = ({ className }: { className?: string }) => {
	return (
		<span
			aria-hidden="true"
			className={cn(
				"absolute z-10 flex size-4 items-center justify-center bg-background/90 text-muted-foreground/80",
				className,
			)}
		>
			<IconPlus className="size-3" />
		</span>
	);
};
