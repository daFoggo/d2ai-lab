import { createServerFn } from "@tanstack/react-start";
import * as z from "zod";
import type { TCareer, TCareerDetail } from "./schemas";
import { getCareerDetail, getCareers } from "./server";

const careerIdValidator = z.string().min(1);

export const getCareersFn = createServerFn({
	method: "GET",
}).handler(async (): Promise<TCareer[]> => getCareers());

export const getCareerDetailFn = createServerFn({
	method: "GET",
})
	.validator(careerIdValidator)
	.handler(async ({ data }): Promise<TCareerDetail> => getCareerDetail(data));
