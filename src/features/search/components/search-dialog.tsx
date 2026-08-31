"use client";

import { IconSearch } from "@tabler/icons-react";
import { useRouter } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export interface SearchItem {
	label: string;
	hint?: string;
	to: string;
	params?: Record<string, string | undefined>;
}

export const SearchDialog = ({
	open,
	onOpenChange,
	items,
}: {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	items: SearchItem[];
}) => {
	const router = useRouter();
	const inputRef = useRef<HTMLInputElement>(null);
	const [query, setQuery] = useState("");
	const [activeIndex, setActiveIndex] = useState(0);

	const results = useMemo(() => {
		const q = query.trim().toLowerCase();
		if (!q) return items;
		return items.filter((item) => item.label.toLowerCase().includes(q));
	}, [items, query]);

	const selectItem = (item: SearchItem) => {
		onOpenChange(false);
		setQuery("");
		router.navigate({
			to: item.to,
			params: item.params,
		} as Parameters<typeof router.navigate>[0]);
	};

	/* Cmd/Ctrl + K mở/đóng search dialog. */
	useEffect(() => {
		const onKeyDown = (event: KeyboardEvent) => {
			if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
				event.preventDefault();
				onOpenChange(!open);
			}
		};
		window.addEventListener("keydown", onKeyDown);
		return () => window.removeEventListener("keydown", onKeyDown);
	}, [open, onOpenChange]);

	/* Reset + focus input khi mở dialog. */
	useEffect(() => {
		if (!open) return;
		setQuery("");
		setActiveIndex(0);
		requestAnimationFrame(() => inputRef.current?.focus());
	}, [open]);

	const onInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
		if (event.key === "ArrowDown") {
			event.preventDefault();
			setActiveIndex((index) => (index + 1) % Math.max(results.length, 1));
		} else if (event.key === "ArrowUp") {
			event.preventDefault();
			setActiveIndex(
				(index) => (index - 1 + results.length) % Math.max(results.length, 1),
			);
		} else if (event.key === "Enter") {
			event.preventDefault();
			const item = results[activeIndex];
			if (item) selectItem(item);
		} else if (event.key === "Escape") {
			onOpenChange(false);
		}
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent
				className="top-[15%] w-full max-w-lg translate-y-0 p-0"
				showCloseButton={false}
			>
				<DialogTitle className="sr-only">Search</DialogTitle>
				<DialogDescription className="sr-only">
					Search pages across the site
				</DialogDescription>

				<div className="flex items-center gap-2 border-b px-3">
					<IconSearch className="size-4 shrink-0 text-muted-foreground" />
					<input
						ref={inputRef}
						value={query}
						onChange={(event) => {
							setQuery(event.target.value);
							setActiveIndex(0);
						}}
						onKeyDown={onInputKeyDown}
						placeholder="Search..."
						className="h-11 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
					/>
				</div>

				<div className="flex max-h-72 flex-col overflow-y-auto p-1">
					{results.length === 0 ? (
						<p className="px-3 py-6 text-center text-sm text-muted-foreground">
							No results
						</p>
					) : (
						results.map((item, index) => (
							<button
								key={`${item.to}-${item.label}`}
								type="button"
								onClick={() => selectItem(item)}
								onMouseEnter={() => setActiveIndex(index)}
								className={cn(
									"flex items-center justify-between gap-2 rounded-md px-3 py-2 text-left text-sm outline-none",
									index === activeIndex && "bg-accent text-accent-foreground",
								)}
							>
								<span>{item.label}</span>
								{item.hint ? (
									<span className="text-xs text-muted-foreground">
										{item.hint}
									</span>
								) : null}
							</button>
						))
					)}
				</div>
			</DialogContent>
		</Dialog>
	);
};
