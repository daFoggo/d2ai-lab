import { createServerFn } from "@tanstack/react-start";
import type { TTeam } from "./schemas";
import { getTeams } from "./server";

export const getTeamsFn = createServerFn({
	method: "GET",
}).handler(async (): Promise<TTeam[]> => getTeams());
