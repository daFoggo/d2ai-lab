import { createServerFn } from "@tanstack/react-start";
import * as z from "zod";
import type { TSeminar, TSeminarDetail } from "./schemas";
import { getSeminarDetail, getSeminars, getUpcomingSeminar } from "./server";

const seminarIdValidator = z.string().min(1);

export const getSeminarsFn = createServerFn({
	method: "GET",
}).handler(async (): Promise<TSeminar[]> => getSeminars());

export const getSeminarDetailFn = createServerFn({
	method: "GET",
})
	.validator(seminarIdValidator)
	.handler(async ({ data }): Promise<TSeminarDetail> => getSeminarDetail(data));

export const getUpcomingSeminarFn = createServerFn({
	method: "GET",
}).handler(async (): Promise<TSeminar> => getUpcomingSeminar());
