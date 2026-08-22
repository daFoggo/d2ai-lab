import { describe, expect, it } from "vitest";
import { AuthUserSchema, LoginInputSchema, SignUpInputSchema } from "./schemas";

describe("Auth Schemas (Native Supabase Auth)", () => {
	it("should validate auth user schema", () => {
		const valid = AuthUserSchema.safeParse({
			id: "user-123",
			email: "user@example.com",
		});
		expect(valid.success).toBe(true);
	});

	it("should validate login schema", () => {
		const valid = LoginInputSchema.safeParse({
			email: "test@example.com",
			password: "password123",
		});
		expect(valid.success).toBe(true);

		const invalidEmail = LoginInputSchema.safeParse({
			email: "invalid-email",
			password: "password123",
		});
		expect(invalidEmail.success).toBe(false);

		const shortPassword = LoginInputSchema.safeParse({
			email: "test@example.com",
			password: "123",
		});
		expect(shortPassword.success).toBe(false);
	});

	it("should validate signup schema with matching passwords", () => {
		const valid = SignUpInputSchema.safeParse({
			email: "test@example.com",
			password: "password123",
			confirmPassword: "password123",
		});
		expect(valid.success).toBe(true);

		const mismatch = SignUpInputSchema.safeParse({
			email: "test@example.com",
			password: "password123",
			confirmPassword: "password456",
		});
		expect(mismatch.success).toBe(false);
		if (!mismatch.success) {
			expect(mismatch.error.issues[0]?.message).toBe("Passwords do not match");
		}
	});
});
