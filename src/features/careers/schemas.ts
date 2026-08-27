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

export const careerDetailSchema = careerSchema.extend({
	location: z.string().optional(),
	responsibilities: z.array(z.string()).min(1),
	qualifications: z.array(z.string()).min(1),
	benefits: z.array(z.string()).optional(),
	applyUrl: z.string().optional(),
});

export type TCareerDetail = z.infer<typeof careerDetailSchema>;
