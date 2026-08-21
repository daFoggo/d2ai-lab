import {
	queryOptions,
	useMutation,
	useQueryClient,
} from "@tanstack/react-query";
import { supabase } from "@/utils/supabase";
import type { AppRole, AuthUser, LoginInput, SignUpInput } from "./schemas";

export const authKeys = {
	all: ["auth"] as const,
	me: () => [...authKeys.all, "me"] as const,
};

/**
 * Giải mã an toàn claims từ JWT access token của Supabase
 */
function extractRoleFromJwt(accessToken: string): AppRole | null {
	try {
		const base64Url = accessToken.split(".")[1];
		if (!base64Url) return null;
		const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
		const jsonPayload = decodeURIComponent(
			atob(base64)
				.split("")
				.map((c) => `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`)
				.join(""),
		);
		const payload = JSON.parse(jsonPayload);
		if (payload.user_role === "researcher" || payload.user_role === "user") {
			return payload.user_role;
		}
		if (
			payload.app_metadata?.role === "researcher" ||
			payload.app_metadata?.role === "user"
		) {
			return payload.app_metadata.role;
		}
		return null;
	} catch {
		return null;
	}
}

/**
 * Query options lấy thông tin người dùng hiện tại và role
 */
export const getMeQueryOptions = () =>
	queryOptions({
		queryKey: authKeys.me(),
		queryFn: async (): Promise<AuthUser | null> => {
			const {
				data: { session },
				error: sessionError,
			} = await supabase.auth.getSession();

			if (sessionError) throw sessionError;
			if (!session?.user) return null;

			let role: AppRole | null = null;

			// 1. Ưu tiên kiểm tra trực tiếp từ bảng public.user_roles (nguồn chân lý của DB)
			try {
				const { data: roleData } = await supabase
					.from("user_roles")
					.select("role")
					.eq("user_id", session.user.id)
					.maybeSingle();

				if (roleData?.role === "researcher" || roleData?.role === "user") {
					role = roleData.role;
				}
			} catch (e) {
				console.warn("Could not query user_roles table:", e);
			}

			// 2. Nếu chưa lấy được từ bảng, giải mã từ JWT Claim
			if (!role) {
				role = extractRoleFromJwt(session.access_token);
			}

			// 3. Fallback: Lấy từ user_metadata lúc đăng ký
			if (!role) {
				if (session.user.user_metadata?.desired_role === "researcher") {
					role = "researcher";
				} else {
					role = "user";
				}
			}

			return {
				id: session.user.id,
				email: session.user.email ?? "",
				role: role ?? "user",
				createdAt: session.user.created_at,
			};
		},
		staleTime: 1000 * 60 * 5, // 5 minutes
	});

/**
 * Mutation Hook xử lý đăng nhập
 */
export function useLoginMutation() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (input: LoginInput) => {
			const { data, error } = await supabase.auth.signInWithPassword({
				email: input.email,
				password: input.password,
			});
			if (error) throw error;
			return data;
		},
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: authKeys.me() });
		},
	});
}

/**
 * Mutation Hook xử lý đăng ký tài khoản (kèm lựa chọn Role)
 */
export function useSignUpMutation() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (input: SignUpInput) => {
			const { data, error } = await supabase.auth.signUp({
				email: input.email,
				password: input.password,
				options: {
					data: {
						desired_role: input.role,
					},
				},
			});
			if (error) throw error;

			// Nếu đã có session ngay sau khi sign up, chủ động refresh session và ghi nhận role
			if (data.user && data.session) {
				try {
					await supabase
						.from("user_roles")
						.upsert({ user_id: data.user.id, role: input.role });
					await supabase.auth.refreshSession();
				} catch {
					// Bỏ qua nếu trigger DB đã xử lý
				}
			}

			return data;
		},
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: authKeys.me() });
		},
	});
}

/**
 * Mutation Hook xử lý đăng xuất
 */
export function useLogoutMutation() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async () => {
			const { error } = await supabase.auth.signOut();
			if (error) throw error;
		},
		onSuccess: async () => {
			// Xóa sạch query cache khi người dùng đăng xuất theo quy tắc handbook
			queryClient.clear();
		},
	});
}

/**
 * Mutation Hook chuyển đổi Role nhanh (tiện cho việc test và demo phân quyền)
 */
export function useSwitchRoleMutation() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({
			userId,
			newRole,
		}: {
			userId: string;
			newRole: AppRole;
		}) => {
			// 1. Gọi RPC function switch_user_role
			const { error: rpcError } = await supabase.rpc("switch_user_role", {
				new_role: newRole,
			});

			if (rpcError) {
				// Fallback: update trực tiếp bảng user_roles
				const { error: updateError } = await supabase
					.from("user_roles")
					.upsert({ user_id: userId, role: newRole });

				if (updateError) throw updateError;
			}

			// 2. Refresh session để GoTrue chạy lại Custom Access Token Hook và cấp JWT mới
			const { error: refreshError } = await supabase.auth.refreshSession();
			if (refreshError) {
				console.warn("Refresh session warning:", refreshError);
			}

			return newRole;
		},
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: authKeys.me() });
		},
	});
}
