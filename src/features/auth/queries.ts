import {
	queryOptions,
	useMutation,
	useQueryClient,
} from "@tanstack/react-query";
import { supabase } from "@/utils/supabase";
import type { AuthUser, LoginInput, SignUpInput } from "./schemas";

export const authKeys = {
	all: ["auth"] as const,
	me: () => [...authKeys.all, "me"] as const,
};

/**
 * Query options lấy thông tin người dùng hiện tại từ Supabase Session gốc
 */
export const getMeQueryOptions = () =>
	queryOptions({
		queryKey: authKeys.me(),
		queryFn: async (): Promise<AuthUser | null> => {
			const {
				data: { session },
				error,
			} = await supabase.auth.getSession();

			if (error) throw error;
			if (!session?.user) return null;

			return {
				id: session.user.id,
				email: session.user.email ?? "",
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
		onSuccess: async (data) => {
			if (data.user) {
				queryClient.setQueryData(authKeys.me(), {
					id: data.user.id,
					email: data.user.email ?? "",
					createdAt: data.user.created_at,
				});
			}
			await queryClient.invalidateQueries({ queryKey: authKeys.me() });
		},
	});
}

/**
 * Mutation Hook xử lý đăng ký tài khoản
 */
export function useSignUpMutation() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (input: SignUpInput) => {
			const { data, error } = await supabase.auth.signUp({
				email: input.email,
				password: input.password,
			});
			if (error) throw error;
			return data;
		},
		onSuccess: async (data) => {
			if (data.user && data.session) {
				queryClient.setQueryData(authKeys.me(), {
					id: data.user.id,
					email: data.user.email ?? "",
					createdAt: data.user.created_at,
				});
			}
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
			queryClient.setQueryData(authKeys.me(), null);
			queryClient.clear();
			await queryClient.invalidateQueries({ queryKey: authKeys.me() });
		},
	});
}
