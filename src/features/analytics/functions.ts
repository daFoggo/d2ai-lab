import { createServerFn } from "@tanstack/react-start";
import type { TAnalyticsStat } from "./schemas";
import { getSiteStats } from "./server";

export const getSiteStatsFn = createServerFn({
	method: "GET",
}).handler(async (): Promise<TAnalyticsStat[]> => getSiteStats());
