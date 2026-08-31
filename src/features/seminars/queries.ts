import {
	queryOptions,
	useMutation,
	useQueryClient,
} from "@tanstack/react-query";
import { supabase } from "@/utils/supabase";
import {
	getAdminSeminarsFn,
	getSeminarDetailFn,
	getSeminarsFn,
	getUpcomingSeminarFn,
} from "./functions";
import type { TSeminarSpeakerForm, TSeminarUpsertInput } from "./schemas";

export const seminarKeys = {
	all: ["seminars"] as const,
	list: (page: number, pageSize: number) =>
		[...seminarKeys.all, "list", { page, pageSize }] as const,
	detail: (id: string) => [...seminarKeys.all, "detail", id] as const,
	upcoming: () => [...seminarKeys.all, "upcoming"] as const,
	adminList: (page: number, pageSize: number) =>
		[...seminarKeys.all, "admin-list", { page, pageSize }] as const,
};

export const seminarsQueryOptions = (page: number, pageSize: number) =>
	queryOptions({
		queryKey: seminarKeys.list(page, pageSize),
		queryFn: () => getSeminarsFn({ data: { page, pageSize } }),
		staleTime: 1000 * 60 * 5,
	});

export const seminarDetailQueryOptions = (id: string) =>
	queryOptions({
		queryKey: seminarKeys.detail(id),
		queryFn: () => getSeminarDetailFn({ data: id }),
		staleTime: 1000 * 60 * 5,
	});

/* Spotlight cho home page — đọc bởi route home qua feature barrel. */
export const upcomingSeminarQueryOptions = () =>
	queryOptions({
		queryKey: seminarKeys.upcoming(),
		queryFn: () => getUpcomingSeminarFn(),
		staleTime: 1000 * 60 * 5,
	});

/* Admin list (dashboard) — server-side pagination. */
export const adminSeminarsQueryOptions = (page: number, pageSize: number) =>
	queryOptions({
		queryKey: seminarKeys.adminList(page, pageSize),
		queryFn: () => getAdminSeminarsFn({ data: { page, pageSize } }),
		staleTime: 1000 * 60 * 5,
	});

/* ── CRUD mutations (client-side supabase — RLS 'researcher' là boundary) ── */

const toSeminarRow = (input: TSeminarUpsertInput) => ({
	title: input.title,
	description: input.description,
	starts_at: input.startsAt,
	location: input.location?.trim() || null,
	registration_url: input.registrationUrl?.trim() || null,
});

/* Slug id từ title (URL đẹp, nhất quán với content khác). */
const slugify = (title: string): string =>
	title
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-+|-+$/g, "")
		.slice(0, 80) || `sem-${Date.now()}`;

const insertSpeakers = async (
	seminarId: string,
	speakers: TSeminarSpeakerForm[],
) => {
	if (!speakers.length) return;

	const { error } = await supabase.from("seminar_speakers").insert(
		speakers.map((speaker, index) => ({
			seminar_id: seminarId,
			name: speaker.name?.trim() || null,
			role: speaker.role?.trim() || null,
			photo_url: speaker.photoUrl?.trim() || null,
			socials: speaker.socials?.trim() || null,
			sort_order: index,
		})),
	);
	if (error) throw error;
};

export const useCreateSeminarMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (input: TSeminarUpsertInput) => {
			const { data: seminar, error } = await supabase
				.from("seminars")
				.insert({ id: slugify(input.title), ...toSeminarRow(input) })
				.select("id")
				.single();
			if (error) throw error;

			await insertSpeakers(seminar.id, input.speakers ?? []);
			return seminar.id;
		},
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: seminarKeys.all });
		},
	});
};

export const useUpdateSeminarMutation = (seminarId: string) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (input: TSeminarUpsertInput) => {
			const { error } = await supabase
				.from("seminars")
				.update(toSeminarRow(input))
				.eq("id", seminarId);
			if (error) throw error;

			/* Replace speakers: delete cũ (cascade socials) rồi insert lại. */
			const { error: deleteError } = await supabase
				.from("seminar_speakers")
				.delete()
				.eq("seminar_id", seminarId);
			if (deleteError) throw deleteError;

			await insertSpeakers(seminarId, input.speakers ?? []);
		},
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: seminarKeys.all });
		},
	});
};

export const useDeleteSeminarMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (seminarId: string) => {
			const { error } = await supabase
				.from("seminars")
				.delete()
				.eq("id", seminarId);
			if (error) throw error;
		},
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: seminarKeys.all });
		},
	});
};
