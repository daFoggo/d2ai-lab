import { z } from "zod";

export const careerSchema = z.object({
	id: z.string().min(1),
	title: z.string().min(1),
	department: z.string().min(1),
	type: z.string().min(1),
	description: z.string().min(1),
	href: z.string().optional(),
});

export type TCareer = z.infer<typeof careerSchema>;
