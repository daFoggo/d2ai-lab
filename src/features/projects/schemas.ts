import { z } from "zod";

export const projectSchema = z.object({
	id: z.string().min(1),
	title: z.string().min(1),
	category: z.string().min(1),
	description: z.string().min(1),
	href: z.string().optional(),
	thumbnail: z.string().optional(),
});

export type TProject = z.infer<typeof projectSchema>;
