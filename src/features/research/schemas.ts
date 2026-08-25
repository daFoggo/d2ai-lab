import { z } from "zod";

export const researchAreaSchema = z.object({
	id: z.string().min(1),
	title: z.string().min(1),
	tag: z.string().min(1),
	description: z.string().min(1),
});

export type TResearchArea = z.infer<typeof researchAreaSchema>;

export const researchGapStatusSchema = z.enum([
	"OPEN",
	"IN PROGRESS",
	"COLLABORATION",
]);

export type TResearchGapStatus = z.infer<typeof researchGapStatusSchema>;

export const researchGapSchema = z.object({
	id: z.string().min(1),
	title: z.string().min(1),
	description: z.string().min(1),
	status: researchGapStatusSchema,
	area: z.string().min(1),
});

export type TResearchGap = z.infer<typeof researchGapSchema>;

export const researchDirectionSchema = z.object({
	id: z.string().min(1),
	index: z.string().min(1),
	title: z.string().min(1),
	description: z.string().min(1),
	focus: z.array(z.string()).min(1),
});

export type TResearchDirection = z.infer<typeof researchDirectionSchema>;
