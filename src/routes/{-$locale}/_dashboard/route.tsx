import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/common/app-shell";
import { getMeQueryOptions, useLogoutMutation } from "@/features/auth";

const DashboardRoute = () => {
	const navigate = useNavigate();
	const { data: user, isLoading } = useQuery(getMeQueryOptions());
	const logout = useLogoutMutation();

	const handleSignOut = async () => {
		try {
			await logout.mutateAsync();
			await navigate({ to: "/{-$locale}" });
		} catch {
			/* Sign-out thất bại — giữ nguyên, user tự xử lý tiếp. */
		}
	};

	return (
		<DashboardLayout
			user={user}
			isUserLoading={isLoading}
			onSignOut={handleSignOut}
		>
			<Outlet />
		</DashboardLayout>
	);
};

export const Route = createFileRoute("/{-$locale}/_dashboard")({
	component: DashboardRoute,
});
