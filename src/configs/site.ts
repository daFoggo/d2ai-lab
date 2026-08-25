/**
 * Basic website configuration including title, description, and default metadata.
 * Centralized for page titles and SEO support.
 */
export const SITE_CONFIG = {
	metadata: {
		title: "D2AI Lab",
		description:
			"D2AI Research Lab. Advancing Artificial Intelligence and Data Science to transform data into intelligent solutions.",
		keywords: [
			"D2AI",
			"D2AI Lab",
			"Data To Artificial Intelligence",
			"Artificial Intelligence",
			"Data Science",
			"Machine Learning",
			"Smart Data",
			"AI Research",
		],
	},
	app: {
		title: "D2AI Lab",
		slogan: "Data to Intelligence, Ideas to Impact",
		// Domain thật của site — cập nhật khi deploy production.
		url: "https://d2ai-lab.vercel.app",
		// Ảnh Open Graph 1200x630 (public/og-image.png).
		ogImage: "https://d2ai-lab.vercel.app/og-image.png",
	},
} as const;

export type TSiteConfig = typeof SITE_CONFIG;
