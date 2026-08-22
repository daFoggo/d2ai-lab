import { Menu as MenuPrimitive } from "@base-ui/react/menu";
import { IconChevronDown } from "@tabler/icons-react";
import { cva } from "class-variance-authority";
import type * as React from "react";
import { cn } from "@/lib/utils";

const navigationMenuTriggerStyle = cva(
	"group inline-flex h-9 w-max items-center justify-center rounded-lg bg-transparent px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus:bg-muted focus:text-foreground focus:outline-hidden disabled:pointer-events-none disabled:opacity-50 select-none cursor-pointer data-state=open:bg-muted/80 data-state=open:text-foreground",
);

function NavigationMenu({
	className,
	children,
	...props
}: React.ComponentProps<"nav">) {
	return (
		<nav
			data-slot="navigation-menu"
			className={cn(
				"relative z-10 flex max-w-max flex-1 items-center justify-center",
				className,
			)}
			{...props}
		>
			{children}
		</nav>
	);
}

function NavigationMenuList({
	className,
	...props
}: React.ComponentProps<"ul">) {
	return (
		<ul
			data-slot="navigation-menu-list"
			className={cn(
				"group flex flex-1 list-none items-center justify-center gap-1",
				className,
			)}
			{...props}
		/>
	);
}

function NavigationMenuItem({
	className,
	...props
}: React.ComponentProps<"li">) {
	return (
		<li
			data-slot="navigation-menu-item"
			className={cn("relative", className)}
			{...props}
		/>
	);
}

const NavigationMenuRoot = MenuPrimitive.Root;

function NavigationMenuTrigger({
	className,
	children,
	...props
}: MenuPrimitive.Trigger.Props) {
	return (
		<MenuPrimitive.Trigger
			data-slot="navigation-menu-trigger"
			className={cn(
				navigationMenuTriggerStyle(),
				"group gap-1",
				className,
			)}
			{...props}
		>
			{children}
			<IconChevronDown
				className="size-3.5 text-muted-foreground transition-transform duration-200 group-data-state=open:rotate-180"
				aria-hidden="true"
			/>
		</MenuPrimitive.Trigger>
	);
}

function NavigationMenuContent({
	className,
	align = "start",
	sideOffset = 8,
	...props
}: MenuPrimitive.Popup.Props & {
	align?: "start" | "center" | "end";
	sideOffset?: number;
}) {
	return (
		<MenuPrimitive.Portal>
			<MenuPrimitive.Positioner align={align} sideOffset={sideOffset}>
				<MenuPrimitive.Popup
					data-slot="navigation-menu-content"
					className={cn(
						"z-50 w-auto min-w-[280px] max-w-[500px] overflow-hidden rounded-2xl border border-border bg-popover/95 p-3 text-popover-foreground shadow-2xl backdrop-blur-md transition-all duration-150 data-ending-style:scale-95 data-ending-style:opacity-0 data-starting-style:scale-95 data-starting-style:opacity-0 sm:min-w-[340px]",
						className,
					)}
					{...props}
				/>
			</MenuPrimitive.Positioner>
		</MenuPrimitive.Portal>
	);
}

function NavigationMenuLink({
	className,
	...props
}: React.ComponentProps<"a">) {
	return (
		<a
			data-slot="navigation-menu-link"
			className={cn(
				"block rounded-xl p-3 text-sm leading-none no-underline transition-colors outline-hidden select-none hover:bg-muted/80 focus:bg-muted/80",
				className,
			)}
			{...props}
		/>
	);
}

export {
	NavigationMenu,
	NavigationMenuList,
	NavigationMenuItem,
	NavigationMenuRoot,
	NavigationMenuTrigger,
	NavigationMenuContent,
	NavigationMenuLink,
	navigationMenuTriggerStyle,
};
