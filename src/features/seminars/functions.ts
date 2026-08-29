import { createServerFn } from "@tanstack/react-start";
import type { TSeminar } from "./schemas";
import { getUpcomingSeminar } from "./server";

export const getUpcomingSeminarFn = createServerFn({
	method: "GET",
}).handler(async (): Promise<TSeminar> => getUpcomingSeminar());
