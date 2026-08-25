import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useI18n } from "@/lib/i18n";
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
	size = "default",
	className,
	dashboardHref = "/dashboard",
}: AuthButtonProps) {
	const { data: user, isLoading } = useQuery(getMeQueryOptions());
	const { t } = useI18n("auth");

	const [dialogOpen, setDialogOpen] = React.useState(false);
	const [defaultTab, setDefaultTab] = React.useState<AuthDialogTab>("signin");

	const handleOpen = (tab: AuthDialogTab) => {
		setDefaultTab(tab);
		setDialogOpen(true);
	};

	if (isLoading) {
		return <Skeleton className="h-8 w-28" />;
	}

	// 1. Authenticated State: Simple "Go to dashboard" button
	if (user) {
		return (
			<Button
				render={<Link to={dashboardHref} />}
				nativeButton={false}
				variant="default"
				size={size}
				className={className}
			>
				{t("goToDashboard")}
			</Button>
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
						className={className}
						onClick={() => handleOpen("signin")}
					>
						{t("signIn")}
					</Button>
					<Button
						size={size}
						className={className}
						onClick={() => handleOpen("signup")}
					>
						{t("signUp")}
					</Button>
				</div>
			) : (
				<Button
					variant={variant}
					size={size}
					className={className}
					onClick={() => handleOpen("signin")}
				>
					{t("signIn")}
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
