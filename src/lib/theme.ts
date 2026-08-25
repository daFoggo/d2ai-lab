import { createServerFn } from "@tanstack/react-start";
import { setCookie } from "@tanstack/react-start/server";
import * as z from "zod";

const postThemeValidator = z.union([
	z.literal("light"),
	z.literal("dark"),
	z.literal("system"),
]);

export const storageKey = "_preferred-theme";

export type TTheme = z.infer<typeof postThemeValidator>;

export const resolveTheme = (
	theme: TTheme,
	prefersDark = false,
): "light" | "dark" =>
	theme === "system" ? (prefersDark ? "dark" : "light") : theme;

/**
 * Project hiện tại chỉ dùng light theme, không cho chọn theme.
 * Luôn trả về "light" bất kể cookie đã lưu trước đó.
 */
export const getThemeServerFn = createServerFn().handler(async () => {
	return "light" as const;
});

/**
 * Cập nhật tùy chọn giao diện mới vào cookie phía server.
 * Hàm này yêu cầu đầu vào phải là "light" hoặc "dark" thông qua kiểm tra của zod.
 */
export const setThemeServerFn = createServerFn({ method: "POST" })
	.validator(postThemeValidator)
	.handler(async ({ data }) => setCookie(storageKey, data));
