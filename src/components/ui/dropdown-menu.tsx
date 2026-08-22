import { Menu as MenuPrimitive } from "@base-ui/react/menu";
import { IconCheck, IconChevronRight } from "@tabler/icons-react";
import type * as React from "react";
import { cn } from "@/lib/utils";

const DropdownMenu = MenuPrimitive.Root;
const DropdownMenuTrigger = MenuPrimitive.Trigger;
const DropdownMenuGroup = MenuPrimitive.Group;
const DropdownMenuPortal = MenuPrimitive.Portal;
const DropdownMenuSub = MenuPrimitive.SubmenuRoot;
const DropdownMenuRadioGroup = MenuPrimitive.RadioGroup;

function DropdownMenuSubTrigger({
	className,
	inset,
	children,
	...props
}: MenuPrimitive.SubmenuTrigger.Props & {
	inset?: boolean;
}) {
	return (
		<MenuPrimitive.SubmenuTrigger
			data-slot="dropdown-menu-sub-trigger"
			className={cn(
				"flex cursor-default items-center rounded-sm px-2 py-1.5 text-sm outline-hidden select-none focus:bg-accent data-state=open:bg-accent",
				inset && "pl-8",
				className,
			)}
			{...props}
		>
			{children}
			<IconChevronRight className="ml-auto size-4" />
		</MenuPrimitive.SubmenuTrigger>
	);
}

function DropdownMenuContent({
	className,
	align = "end",
	sideOffset = 4,
	...props
}: MenuPrimitive.Popup.Props & {
	align?: "start" | "center" | "end";
	sideOffset?: number;
}) {
	return (
		<MenuPrimitive.Portal>
			<MenuPrimitive.Positioner align={align} sideOffset={sideOffset}>
				<MenuPrimitive.Popup
					data-slot="dropdown-menu-content"
					className={cn(
						"z-50 min-w-[8rem] overflow-hidden rounded-xl border border-border bg-popover p-1 text-popover-foreground shadow-lg transition-all duration-150 data-ending-style:scale-95 data-ending-style:opacity-0 data-starting-style:scale-95 data-starting-style:opacity-0",
						className,
					)}
					{...props}
				/>
			</MenuPrimitive.Positioner>
		</MenuPrimitive.Portal>
	);
}

function DropdownMenuItem({
	className,
	inset,
	...props
}: MenuPrimitive.Item.Props & {
	inset?: boolean;
}) {
	return (
		<MenuPrimitive.Item
			data-slot="dropdown-menu-item"
			className={cn(
				"relative flex cursor-pointer items-center rounded-lg px-2.5 py-1.5 text-sm outline-hidden transition-colors select-none hover:bg-muted focus:bg-muted disabled:pointer-events-none disabled:opacity-50",
				inset && "pl-8",
				className,
			)}
			{...props}
		/>
	);
}

function DropdownMenuCheckboxItem({
	className,
	children,
	checked,
	...props
}: MenuPrimitive.CheckboxItem.Props) {
	return (
		<MenuPrimitive.CheckboxItem
			data-slot="dropdown-menu-checkbox-item"
			className={cn(
				"relative flex cursor-pointer items-center rounded-lg py-1.5 pr-2 pl-8 text-sm outline-hidden transition-colors select-none hover:bg-muted focus:bg-muted disabled:pointer-events-none disabled:opacity-50",
				className,
			)}
			checked={checked}
			{...props}
		>
			<span className="absolute left-2 flex size-3.5 items-center justify-center">
				<MenuPrimitive.CheckboxItemIndicator>
					<IconCheck className="size-4" />
				</MenuPrimitive.CheckboxItemIndicator>
			</span>
			{children}
		</MenuPrimitive.CheckboxItem>
	);
}

function DropdownMenuRadioItem({
	className,
	children,
	...props
}: MenuPrimitive.RadioItem.Props) {
	return (
		<MenuPrimitive.RadioItem
			data-slot="dropdown-menu-radio-item"
			className={cn(
				"relative flex cursor-pointer items-center rounded-lg py-1.5 pr-2 pl-8 text-sm outline-hidden transition-colors select-none hover:bg-muted focus:bg-muted disabled:pointer-events-none disabled:opacity-50",
				className,
			)}
			{...props}
		>
			<span className="absolute left-2 flex size-3.5 items-center justify-center">
				<MenuPrimitive.RadioItemIndicator>
					<IconCheck className="size-4" />
				</MenuPrimitive.RadioItemIndicator>
			</span>
			{children}
		</MenuPrimitive.RadioItem>
	);
}

function DropdownMenuSeparator({
	className,
	...props
}: MenuPrimitive.Separator.Props) {
	return (
		<MenuPrimitive.Separator
			data-slot="dropdown-menu-separator"
			className={cn("-mx-1 my-1 h-px bg-border", className)}
			{...props}
		/>
	);
}

function DropdownMenuShortcut({
	className,
	...props
}: React.HTMLAttributes<HTMLSpanElement>) {
	return (
		<span
			data-slot="dropdown-menu-shortcut"
			className={cn("ml-auto text-xs tracking-widest opacity-60", className)}
			{...props}
		/>
	);
}

export {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuCheckboxItem,
	DropdownMenuRadioItem,
	DropdownMenuSeparator,
	DropdownMenuShortcut,
	DropdownMenuGroup,
	DropdownMenuPortal,
	DropdownMenuSub,
	DropdownMenuSubTrigger,
	DropdownMenuRadioGroup,
};
