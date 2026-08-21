import { describe, expect, it } from "vitest";
import { AppRoleSchema, LoginInputSchema, SignUpInputSchema } from "./schemas";

describe("Auth Schemas", () => {
	it("should validate app roles correctly", () => {
		expect(AppRoleSchema.safeParse("user").success).toBe(true);
		expect(AppRoleSchema.safeParse("researcher").success).toBe(true);
		expect(AppRoleSchema.safeParse("admin").success).toBe(false);
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

	it("should validate signup schema with default and custom role", () => {
		const defaultRole = SignUpInputSchema.parse({
			email: "test@example.com",
			password: "password123",
		});
		expect(defaultRole.role).toBe("user");

		const researcherRole = SignUpInputSchema.parse({
			email: "researcher@example.com",
			password: "password123",
			role: "researcher",
		});
		expect(researcherRole.role).toBe("researcher");
	});
});
