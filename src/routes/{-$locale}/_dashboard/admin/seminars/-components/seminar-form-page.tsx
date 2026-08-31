"use client";

import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import {
	seminarDetailQueryOptions,
	type TSeminarUpsertInput,
	useCreateSeminarMutation,
	useUpdateSeminarMutation,
} from "@/features/seminars";
import { getErrorMessage } from "@/lib/error";
import { DEFAULT_LOCALE, useI18n } from "@/lib/i18n";
import {
	emptySeminarFormValues,
	SeminarForm,
	seminarDetailToFormValues,
} from "./seminar-form";

interface ISeminarFormPageProps {
	/* Có seminarId = edit; undefined = create. */
	seminarId?: string;
}

export const SeminarFormPage = ({ seminarId }: ISeminarFormPageProps) => {
	const { t, locale } = useI18n("dashboard");
	const isEdit = Boolean(seminarId);
	const navigate = useNavigate();
	const listParams = {
		locale: locale === DEFAULT_LOCALE ? undefined : locale,
	};

	const detailQuery = useQuery({
		...seminarDetailQueryOptions(seminarId ?? ""),
		enabled: isEdit,
	});

	const createMutation = useCreateSeminarMutation();
	const updateMutation = useUpdateSeminarMutation(seminarId ?? "");
	const isSubmitting = createMutation.isPending || updateMutation.isPending;

	const handleSubmit = async (values: TSeminarUpsertInput) => {
		try {
			if (isEdit) {
				await updateMutation.mutateAsync(values);
				toast.success(t("seminars.updated"));
			} else {
				await createMutation.mutateAsync(values);
				toast.success(t("seminars.created"));
			}
			await navigate({
				to: "/{-$locale}/admin/seminars",
				params: listParams,
			});
		} catch (error) {
			toast.error(getErrorMessage(error, t("seminars.saveFailed")));
		}
	};

	return (
		<div className="mx-auto flex w-full max-w-5xl flex-col">
			{isEdit && detailQuery.isPending ? (
				<div className="flex flex-col gap-3">
					<Skeleton className="h-8 w-full" />
					<Skeleton className="h-24 w-full" />
					<div className="grid gap-3 sm:grid-cols-2">
						<Skeleton className="h-8 w-full" />
						<Skeleton className="h-8 w-full" />
					</div>
				</div>
			) : isEdit && detailQuery.isError ? (
				<div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive">
					{getErrorMessage(detailQuery.error, t("seminars.loadFailed"))}
				</div>
			) : (
				<SeminarForm
					key={isEdit ? seminarId : "create"}
					initial={
						isEdit && detailQuery.data
							? seminarDetailToFormValues(detailQuery.data)
							: emptySeminarFormValues()
					}
					isSubmitting={isSubmitting}
					submitLabel={
						isEdit ? t("seminars.saveSubmit") : t("seminars.createSubmit")
					}
					onCancel={() =>
						void navigate({
							to: "/{-$locale}/admin/seminars",
							params: listParams,
						})
					}
					onSubmit={handleSubmit}
				/>
			)}
		</div>
	);
};
