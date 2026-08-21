import { z } from "zod";

/**
 * Định nghĩa các vai trò hợp lệ trong hệ thống
 */
export const AppRoleSchema = z.enum(["user", "researcher"]);
export type AppRole = z.infer<typeof AppRoleSchema>;

/**
 * Schema thông tin User sau khi xác thực và giải mã Role
 */
export const AuthUserSchema = z.object({
	id: z.string(),
	email: z.string().email(),
	role: AppRoleSchema,
	createdAt: z.string().optional(),
});
export type AuthUser = z.infer<typeof AuthUserSchema>;

/**
 * Schema input cho form đăng nhập
 */
export const LoginInputSchema = z.object({
	email: z
		.string()
		.min(1, "Email không được để trống")
		.email("Email không hợp lệ"),
	password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
});
export type LoginInput = z.infer<typeof LoginInputSchema>;

/**
 * Schema input cho form đăng ký
 */
export const SignUpInputSchema = z.object({
	email: z
		.string()
		.min(1, "Email không được để trống")
		.email("Email không hợp lệ"),
	password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
	role: AppRoleSchema.default("user"),
});
export type SignUpInput = z.infer<typeof SignUpInputSchema>;
