import { useQuery } from "@tanstack/react-query";
import * as React from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getMeQueryOptions } from "../queries";
import { AuthDialog, type AuthDialogTab } from "./auth-dialog";

export interface AuthButtonProps {
	variant?: "default" | "outline" | "split";
	size?:
		| "default"
		| "xs"
		| "sm"
		| "lg"
		| "icon"
		| "icon-xs"
		| "icon-sm"
		| "icon-lg";
	className?: string;
	dashboardHref?: string;
}

export function AuthButton({
	variant = "default",
	size = "sm",
	className,
	dashboardHref = "/dashboard",
}: AuthButtonProps) {
	const { data: user, isLoading } = useQuery(getMeQueryOptions());

	const [dialogOpen, setDialogOpen] = React.useState(false);
	const [defaultTab, setDefaultTab] = React.useState<AuthDialogTab>("signin");

	const handleOpen = (tab: AuthDialogTab) => {
		setDefaultTab(tab);
		setDialogOpen(true);
	};

	if (isLoading) {
		return <div className="h-8 w-28 animate-pulse rounded-full bg-muted" />;
	}

	// 1. Authenticated State: Simple "Go to dashboard" button
	if (user) {
		return (
			<a
				href={dashboardHref}
				className={cn(
					buttonVariants({ variant: "default", size }),
					"cursor-pointer",
					className,
				)}
			>
				Go to dashboard
			</a>
		);
	}

	// 2. Unauthenticated State: Sign In / Sign Up Trigger Buttons
	return (
		<>
			{variant === "split" ? (
				<div className="flex items-center gap-2">
					<Button
						variant="outline"
						size={size}
						className={cn("cursor-pointer", className)}
						onClick={() => handleOpen("signin")}
					>
						Sign In
					</Button>
					<Button
						size={size}
						className={cn("cursor-pointer", className)}
						onClick={() => handleOpen("signup")}
					>
						Sign Up
					</Button>
				</div>
			) : (
				<Button
					variant={variant}
					size={size}
					className={cn("cursor-pointer", className)}
					onClick={() => handleOpen("signin")}
				>
					Sign In
				</Button>
			)}

			<AuthDialog
				open={dialogOpen}
				onOpenChange={setDialogOpen}
				defaultTab={defaultTab}
			/>
		</>
	);
}
