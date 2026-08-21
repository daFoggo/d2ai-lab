import { z } from "zod";

/**
 * Quản lý và validate các environment variables phía Client-side.
 * Đảm bảo các biến như Supabase URL và Key luôn hợp lệ khi ứng dụng khởi chạy.
 */
const clientEnvSchema = z.object({
	VITE_SUPABASE_URL: z.string().url(),
	VITE_SUPABASE_KEY: z.string().min(1),
});

export const clientEnv = clientEnvSchema.parse(import.meta.env);
