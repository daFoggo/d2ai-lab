/**
 * Cấu hình thông tin cơ bản của website như title, description và default metadata.
 * Được sử dụng tập trung cho việc hiển thị page title và hỗ trợ SEO.
 */
export const SITE_CONFIG = {
	metadata: {
		title: "startcn-base",
		description:
			"Production-ready web application starter built with TanStack Start, React 19, shadcn/ui, Tailwind CSS v4, and Supabase.",
		keywords: ["startcn-base", "tanstack start", "react", "shadcn", "supabase"],
	},
	app: {
		title: "startcn-base",
		slogan: "A production-ready TanStack Start starter.",
	},
} as const;

export type TSiteConfig = typeof SITE_CONFIG;
