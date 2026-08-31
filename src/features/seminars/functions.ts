import { createServerFn } from "@tanstack/react-start";
import * as z from "zod";
import type {
	TPaginatedAdminSeminars,
	TPaginatedSeminars,
	TSeminar,
	TSeminarDetail,
} from "./schemas";
import {
	getAdminSeminars,
	getSeminarDetail,
	getSeminars,
	getUpcomingSeminar,
} from "./server";

const seminarIdValidator = z.string().min(1);

const pageValidator = z.object({
	page: z.coerce.number().int().min(1).default(1),
	pageSize: z.coerce.number().int().min(1).max(50).default(10),
});

export const getSeminarsFn = createServerFn({
	method: "GET",
})
	.validator(pageValidator)
	.handler(
		async ({ data }): Promise<TPaginatedSeminars> =>
			getSeminars(data.page, data.pageSize),
	);

export const getSeminarDetailFn = createServerFn({
	method: "GET",
})
	.validator(seminarIdValidator)
	.handler(async ({ data }): Promise<TSeminarDetail> => getSeminarDetail(data));

export const getUpcomingSeminarFn = createServerFn({
	method: "GET",
}).handler(async (): Promise<TSeminar | null> => getUpcomingSeminar());

export const getAdminSeminarsFn = createServerFn({
	method: "GET",
})
	.validator(pageValidator)
	.handler(
		async ({ data }): Promise<TPaginatedAdminSeminars> =>
			getAdminSeminars(data.page, data.pageSize),
	);
