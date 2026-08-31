"use client";

import { IconExternalLink, IconPencil, IconTrash } from "@tabler/icons-react";
import { Link } from "@tanstack/react-router";
import { flexRender } from "@tanstack/react-table";
import { useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { TSeminarAdminItem, TSeminarStatus } from "@/features/seminars";
import { createAppServerColumnHelper, useAppServerTable } from "@/hooks/table";
import { DEFAULT_LOCALE, useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const columnHelper = createAppServerColumnHelper<TSeminarAdminItem>();

interface ISeminarsTableProps {
	seminars: TSeminarAdminItem[];
	total: number;
	page: number;
	pageSize: number;
	onPageChange: (page: number) => void;
	onEdit: (seminar: TSeminarAdminItem) => void;
	onDelete: (seminar: TSeminarAdminItem) => void;
}

const STATUS_VARIANT: Record<TSeminarStatus, "default" | "outline"> = {
	UPCOMING: "default",
	PAST: "outline",
};

export const SeminarsTable = ({
	seminars,
	total,
	page,
	pageSize,
	onPageChange,
	onEdit,
	onDelete,
}: ISeminarsTableProps) => {
	const { t } = useI18n("dashboard");
	const { locale } = useI18n();
	const localeParam = useMemo(
		() => ({ locale: locale === DEFAULT_LOCALE ? undefined : locale }),
		[locale],
	);

	const columns = useMemo(
		() =>
			columnHelper.columns([
				columnHelper.accessor("title", {
					header: t("seminars.columns.title"),
					cell: (info) => (
						<span className="line-clamp-1 font-medium text-foreground">
							{info.getValue() as string}
						</span>
					),
				}),
				columnHelper.accessor("startsAtIso", {
					id: "date",
					header: t("seminars.columns.date"),
					cell: (info) => (
						<span className="whitespace-nowrap text-muted-foreground">
							{info.row.original.date}
						</span>
					),
				}),
				columnHelper.accessor("status", {
					header: t("seminars.columns.status"),
					cell: (info) => (
						<Badge variant={STATUS_VARIANT[info.getValue() as TSeminarStatus]}>
							{info.getValue() as string}
						</Badge>
					),
				}),
				columnHelper.accessor("speaker", {
					id: "speakers",
					header: t("seminars.columns.speakers"),
					cell: (info) => {
						const speaker = info.getValue() as string;
						const count = info.row.original.speakerCount;
						return (
							<span className="inline-flex items-center gap-1.5">
								<span className="line-clamp-1 text-muted-foreground">
									{speaker}
								</span>
								{count > 1 && (
									<Badge variant="outline" className="shrink-0 font-normal">
										{count}
									</Badge>
								)}
							</span>
						);
					},
				}),
				columnHelper.accessor("location", {
					header: t("seminars.columns.location"),
					cell: (info) => (
						<span className="line-clamp-1 text-muted-foreground">
							{(info.getValue() as string | null | undefined) ?? "—"}
						</span>
					),
				}),
				columnHelper.display({
					id: "view",
					header: t("seminars.columns.view"),
					cell: ({ row }) => (
						<Button
							variant="ghost"
							size="icon-sm"
							render={
								<Link
									to="/{-$locale}/seminars/$id"
									params={{ id: row.original.id, ...localeParam }}
								/>
							}
							nativeButton={false}
							aria-label={`View ${row.original.title}`}
							className="text-muted-foreground hover:text-foreground"
						>
							<IconExternalLink className="size-4" />
						</Button>
					),
				}),
				columnHelper.display({
					id: "actions",
					header: t("seminars.columns.actions"),
					cell: ({ row }) => (
						<div className="flex items-center justify-end gap-1">
							<Button
								variant="ghost"
								size="icon-sm"
								onClick={() => onEdit(row.original)}
								aria-label={`Edit ${row.original.title}`}
								className="text-muted-foreground hover:text-foreground"
							>
								<IconPencil className="size-4" />
							</Button>
							<Button
								variant="ghost"
								size="icon-sm"
								onClick={() => onDelete(row.original)}
								aria-label={`Delete ${row.original.title}`}
								className="text-muted-foreground hover:text-destructive"
							>
								<IconTrash className="size-4" />
							</Button>
						</div>
					),
				}),
			]),
		[t, localeParam, onEdit, onDelete],
	);

	const pageIndex = page - 1;
	const totalPages = Math.max(1, Math.ceil(total / pageSize));

	const table = useAppServerTable({
		columns,
		data: seminars,
		rowCount: total,
		manualPagination: true,
		state: {
			pagination: { pageIndex, pageSize },
		},
		onPaginationChange: (updater) => {
			const next =
				typeof updater === "function"
					? updater({ pageIndex, pageSize })
					: updater;
			onPageChange(next.pageIndex + 1);
		},
	});

	const pageStart = total === 0 ? 0 : pageIndex * pageSize + 1;
	const pageEnd = Math.min(pageStart + seminars.length - 1, total);

	return (
		<div className="flex flex-col overflow-hidden rounded-xl border border-border bg-card">
			<div className="overflow-x-auto">
				<table className="w-full min-w-[760px] border-collapse text-sm">
					<thead>
						{table.getHeaderGroups().map((headerGroup) => (
							<tr key={headerGroup.id} className="border-b bg-muted/40">
								{headerGroup.headers.map((header) => (
									<th
										key={header.id}
										className={cn(
											"px-4 py-3 text-left text-sm font-medium text-muted-foreground",
											header.column.id === "actions" && "text-right",
										)}
									>
										{header.isPlaceholder
											? null
											: flexRender(
													header.column.columnDef.header,
													header.getContext(),
												)}
									</th>
								))}
							</tr>
						))}
					</thead>
					<tbody>
						{table.getRowModel().rows.map((row) => (
							<tr
								key={row.id}
								className="border-b border-border last:border-0 transition-colors hover:bg-muted/30"
							>
								{row.getAllCells().map((cell) => (
									<td key={cell.id} className="px-4 py-3.5 align-middle">
										{flexRender(cell.column.columnDef.cell, cell.getContext())}
									</td>
								))}
							</tr>
						))}
					</tbody>
				</table>
			</div>

			<div className="flex items-center justify-between gap-4 border-t bg-muted/20 px-4 py-3">
				<p className="text-sm text-muted-foreground">
					{total === 0 ? "0" : `${pageStart}–${pageEnd}`} / {total}
				</p>
				<div className="flex items-center gap-2">
					<Button
						variant="outline"
						size="sm"
						disabled={page <= 1}
						onClick={() => onPageChange(page - 1)}
					>
						{t("seminars.prevPage")}
					</Button>
					<Button
						variant="outline"
						size="sm"
						disabled={page >= totalPages}
						onClick={() => onPageChange(page + 1)}
					>
						{t("seminars.nextPage")}
					</Button>
				</div>
			</div>
		</div>
	);
};
