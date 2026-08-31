"use client";

import {
	IconArrowsSort,
	IconChevronDown,
	IconChevronUp,
	IconPencil,
	IconTrash,
} from "@tabler/icons-react";
import { flexRender } from "@tanstack/react-table";
import { useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { TSeminarAdminItem, TSeminarStatus } from "@/features/seminars";
import { createAppColumnHelper, useAppTable } from "@/hooks/table";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const columnHelper = createAppColumnHelper<TSeminarAdminItem>();

interface ISeminarsTableProps {
	seminars: TSeminarAdminItem[];
	onEdit: (seminar: TSeminarAdminItem) => void;
	onDelete: (seminar: TSeminarAdminItem) => void;
}

const STATUS_VARIANT: Record<TSeminarStatus, "default" | "outline"> = {
	UPCOMING: "default",
	PAST: "outline",
};

const SortIcon = ({ direction }: { direction: false | "asc" | "desc" }) => {
	if (direction === "asc") return <IconChevronUp className="size-3" />;
	if (direction === "desc") return <IconChevronDown className="size-3" />;
	return <IconArrowsSort className="size-3 opacity-50" />;
};

export const SeminarsTable = ({
	seminars,
	onEdit,
	onDelete,
}: ISeminarsTableProps) => {
	const { t } = useI18n("dashboard");

	const columns = useMemo(
		() =>
			columnHelper.columns([
				columnHelper.accessor("title", {
					header: t("seminars.columns.title"),
					cell: (info) => (
						<span className="line-clamp-1 font-medium">
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
					header: t("seminars.columns.speaker"),
					cell: (info) => (
						<span className="line-clamp-1 text-muted-foreground">
							{info.getValue() as string}
						</span>
					),
				}),
				columnHelper.accessor("location", {
					header: t("seminars.columns.location"),
					cell: (info) => (
						<span className="line-clamp-1 text-muted-foreground">
							{(info.getValue() as string | null | undefined) ?? "—"}
						</span>
					),
				}),
				columnHelper.accessor("speakerCount", {
					header: t("seminars.columns.speakers"),
					cell: (info) => (
						<span className="tabular-nums text-muted-foreground">
							{String(info.getValue())}
						</span>
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
							>
								<IconPencil className="size-4" />
							</Button>
							<Button
								variant="ghost"
								size="icon-sm"
								onClick={() => onDelete(row.original)}
								aria-label={`Delete ${row.original.title}`}
							>
								<IconTrash className="size-4 text-destructive" />
							</Button>
						</div>
					),
				}),
			]),
		[t, onEdit, onDelete],
	);

	const table = useAppTable({
		columns,
		data: seminars,
		initialState: {
			sorting: [{ id: "date", desc: true }],
			pagination: { pageIndex: 0, pageSize: 10 },
		},
	});

	return (
		<div className="flex flex-col gap-3">
			<div className="overflow-x-auto rounded-xl border border-border">
				<table className="w-full min-w-[720px] border-collapse text-sm">
					<thead>
						{table.getHeaderGroups().map((headerGroup) => (
							<tr key={headerGroup.id} className="border-b bg-muted/50">
								{headerGroup.headers.map((header) => {
									const sort = header.column.getCanSort()
										? header.column.getIsSorted()
										: false;
									return (
										<th
											key={header.id}
											className={cn(
												"px-3 py-2 text-left text-xs font-medium text-muted-foreground",
												header.column.id === "actions" && "text-right",
											)}
										>
											{header.column.getCanSort() ? (
												<button
													type="button"
													onClick={header.column.getToggleSortingHandler()}
													className="inline-flex items-center gap-1 hover:text-foreground"
												>
													{header.isPlaceholder
														? null
														: flexRender(
																header.column.columnDef.header,
																header.getContext(),
															)}
													<SortIcon direction={sort} />
												</button>
											) : header.isPlaceholder ? null : (
												flexRender(
													header.column.columnDef.header,
													header.getContext(),
												)
											)}
										</th>
									);
								})}
							</tr>
						))}
					</thead>
					<tbody>
						{table.getRowModel().rows.map((row) => (
							<tr
								key={row.id}
								className="border-b border-border last:border-0 hover:bg-muted/30"
							>
								{row.getAllCells().map((cell) => (
									<td key={cell.id} className="px-3 py-2.5 align-middle">
										{flexRender(cell.column.columnDef.cell, cell.getContext())}
									</td>
								))}
							</tr>
						))}
					</tbody>
				</table>
			</div>

			<div className="flex items-center justify-between text-xs text-muted-foreground">
				<span>
					{table.getRowModel().rows.length} / {table.getRowCount()} rows
				</span>
				<div className="flex items-center gap-2">
					<Button
						variant="outline"
						size="xs"
						onClick={() => table.previousPage()}
						disabled={!table.getCanPreviousPage()}
					>
						Previous
					</Button>
					<Button
						variant="outline"
						size="xs"
						onClick={() => table.nextPage()}
						disabled={!table.getCanNextPage()}
					>
						Next
					</Button>
				</div>
			</div>
		</div>
	);
};
