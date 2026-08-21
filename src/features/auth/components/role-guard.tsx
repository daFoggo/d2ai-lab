import { useQuery } from "@tanstack/react-query";
import type * as React from "react";
import { getMeQueryOptions } from "../queries";
import type { AppRole } from "../schemas";

export interface RoleGuardProps {
	allowedRoles: AppRole[];
	children: React.ReactNode;
	fallback?: React.ReactNode;
}

/**
 * Component bảo vệ giao diện hoặc nút bấm dựa trên Role hiện tại của người dùng
 */
export function RoleGuard({
	allowedRoles,
	children,
	fallback = null,
}: RoleGuardProps) {
	const { data: user, isLoading } = useQuery(getMeQueryOptions());

	if (isLoading) {
		return null;
	}

	if (!user || !allowedRoles.includes(user.role)) {
		return <>{fallback}</>;
	}

	return <>{children}</>;
}
