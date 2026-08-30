import { createServerFn } from "@tanstack/react-start";
import * as z from "zod";
import type {
	TPublication,
	TPublicationDetail,
	TPublicationPreview,
} from "./schemas";
import {
	getPublicationDetail,
	getPublicationPreview,
	getPublications,
} from "./server";

const publicationIdValidator = z.string().min(1);

export const getPublicationsFn = createServerFn({
	method: "GET",
}).handler(async (): Promise<TPublication[]> => getPublications());

export const getPublicationDetailFn = createServerFn({
	method: "GET",
})
	.validator(publicationIdValidator)
	.handler(
		async ({ data }): Promise<TPublicationDetail> => getPublicationDetail(data),
	);

export const getPublicationPreviewFn = createServerFn({
	method: "GET",
}).handler(async (): Promise<TPublicationPreview[]> => getPublicationPreview());
