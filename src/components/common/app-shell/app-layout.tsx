import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface IAppLayoutProps extends ComponentProps<"div"> {
	children: ReactNode;
	className?: string;
}

export const AppLayout = ({
	children,
	className,
	...props
}: IAppLayoutProps) => {
	return (
		<div
			className={cn(
				"relative flex min-h-screen w-full flex-col bg-background text-foreground antialiased selection:bg-foreground selection:text-background",
				className,
			)}
			{...props}
		>
			{children}
		</div>
	);
};
