import {
	columnFilteringFeature,
	createFilteredRowModel,
	createPaginatedRowModel,
	createSortedRowModel,
	createTableHook,
	filterFns,
	globalFilteringFeature,
	rowPaginationFeature,
	rowSortingFeature,
	sortFns,
	tableFeatures,
} from "@tanstack/react-table";

/* Table defaults chung toàn app (docs/12_tanstack_table.md) — client-side row
 * models: sorting + filtering + pagination. Dùng cho list admin vừa phải. */
const features = tableFeatures({
	rowSortingFeature,
	rowPaginationFeature,
	columnFilteringFeature,
	globalFilteringFeature,
	sortedRowModel: createSortedRowModel(),
	filteredRowModel: createFilteredRowModel(),
	paginatedRowModel: createPaginatedRowModel(),
	sortFns,
	filterFns,
});

const { useAppTable, createAppColumnHelper } = createTableHook({
	features,
	debugTable: false,
	enableSortingRemoval: false,
});

export { createAppColumnHelper, useAppTable };
