import { IconPlus } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Empty,
	EmptyContent,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "@/components/ui/empty";
import { Skeleton } from "@/components/ui/skeleton";
import {
	adminSeminarsQueryOptions,
	type TSeminarAdminItem,
} from "@/features/seminars";
import { getErrorMessage } from "@/lib/error";
import { DEFAULT_LOCALE, useI18n } from "@/lib/i18n";
import { DeleteSeminarDialog } from "./-components/delete-seminar-dialog";
import { SeminarsTable } from "./-components/seminars-table";

const AdminSeminarsPage = () => {
	const { t, locale } = useI18n();
	const navigate = useNavigate();
	const listParams = {
		locale: locale === DEFAULT_LOCALE ? undefined : locale,
	};
	const [deleteTarget, setDeleteTarget] = useState<TSeminarAdminItem | null>(
		null,
	);

	const { data, isPending, isError, error } = useQuery(
		adminSeminarsQueryOptions(),
	);

	const openEdit = (seminar: TSeminarAdminItem) => {
		void navigate({
			to: "/{-$locale}/admin/seminars/$id/edit",
			params: { id: seminar.id, ...listParams },
		});
	};

	return (
		<div className="flex flex-col gap-6">
			<div className="flex items-center justify-end">
				<Button
					size="sm"
					render={
						<Link to="/{-$locale}/admin/seminars/new" params={listParams} />
					}
					nativeButton={false}
				>
					<IconPlus className="size-4" />
					{t("dashboard.seminars.new")}
				</Button>
			</div>

			{isPending ? (
				<div className="flex flex-col gap-3">
					<Skeleton className="h-9 w-full" />
					<Skeleton className="h-9 w-full" />
					<Skeleton className="h-9 w-full" />
					<Skeleton className="h-9 w-full" />
				</div>
			) : isError ? (
				<div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive">
					{getErrorMessage(error, t("dashboard.seminars.loadFailed"))}
				</div>
			) : (data?.length ?? 0) === 0 ? (
				<Empty className="rounded-xl border border-border py-12">
					<EmptyHeader>
						<EmptyMedia variant="icon">
							<IconPlus className="size-4" />
						</EmptyMedia>
						<EmptyContent>
							<EmptyTitle>{t("dashboard.seminars.emptyTitle")}</EmptyTitle>
							<EmptyDescription>
								{t("dashboard.seminars.emptyDescription")}
							</EmptyDescription>
						</EmptyContent>
					</EmptyHeader>
				</Empty>
			) : (
				<SeminarsTable
					seminars={data ?? []}
					onEdit={openEdit}
					onDelete={setDeleteTarget}
				/>
			)}

			<DeleteSeminarDialog
				open={Boolean(deleteTarget)}
				onOpenChange={(open) => {
					if (!open) setDeleteTarget(null);
				}}
				seminar={deleteTarget}
			/>
		</div>
	);
};

export const Route = createFileRoute("/{-$locale}/_dashboard/admin/seminars/")({
	component: AdminSeminarsPage,
});
