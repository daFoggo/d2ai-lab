import { z } from "zod";

/**
 * Schema for authenticated user details from Supabase Auth
 */
export const AuthUserSchema = z.object({
	id: z.string(),
	email: z.string().email(),
	createdAt: z.string().optional(),
});
export type AuthUser = z.infer<typeof AuthUserSchema>;

/**
 * Schema for Sign In form input validation
 */
export const LoginInputSchema = z.object({
	email: z
		.string()
		.min(1, "Email is required")
		.email("Please enter a valid email address"),
	password: z.string().min(6, "Password must be at least 6 characters"),
});
export type LoginInput = z.infer<typeof LoginInputSchema>;

/**
 * Schema for Sign Up form input validation with password confirmation
 */
export const SignUpInputSchema = z
	.object({
		email: z
			.string()
			.min(1, "Email is required")
			.email("Please enter a valid email address"),
		password: z.string().min(6, "Password must be at least 6 characters"),
		confirmPassword: z.string().min(1, "Please confirm your password"),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords do not match",
		path: ["confirmPassword"],
	});
export type SignUpInput = z.infer<typeof SignUpInputSchema>;
