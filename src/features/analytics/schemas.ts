import { z } from "zod";

/* Site-wide metric — aggregate counts của domain data (publications, projects,
 * research areas, seminars). Dùng cho home hero và sẽ được tái dùng bởi
 * admin dashboard/analytics API trong tương lai. Khi có backend thật, giá trị
 * này được tính từ data thật thay vì mock. */
export const analyticsStatSchema = z.object({
	value: z.string().min(1),
	label: z.string().min(1),
});

export type TAnalyticsStat = z.infer<typeof analyticsStatSchema>;
