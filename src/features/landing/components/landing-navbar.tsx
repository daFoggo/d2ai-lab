import {
	IconCheck,
	IconChevronDown,
	IconLanguage,
	IconMenu2,
	IconSearch,
	IconX,
} from "@tabler/icons-react";
import {
	type ComponentProps,
	type ReactNode,
	useEffect,
	useRef,
	useState,
} from "react";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	NavigationMenuRoot,
	NavigationMenuTrigger,
	navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import type { TLandingNavItem } from "../schemas";

export interface ILandingNavbarRootProps extends ComponentProps<"header"> {
	children: ReactNode;
	className?: string;
}

export function LandingNavbarRoot({
	children,
	className,
	...props
}: ILandingNavbarRootProps) {
	const [isVisible, setIsVisible] = useState(true);
	const [isScrolled, setIsScrolled] = useState(false);
	const lastScrollYRef = useRef(0);

	useEffect(() => {
		const handleScroll = () => {
			const currentScrollY = window.scrollY;
			const delta = currentScrollY - lastScrollYRef.current;

			// Check if scrolled past threshold for background color
			setIsScrolled(currentScrollY > 20);

			// Scroll down -> hide header; Scroll up -> show header
			if (currentScrollY <= 30) {
				setIsVisible(true);
			} else if (delta > 8 && currentScrollY > 80) {
				setIsVisible(false);
			} else if (delta < -8) {
				setIsVisible(true);
			}

			lastScrollYRef.current = currentScrollY;
		};

		window.addEventListener("scroll", handleScroll, { passive: true });
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	return (
		<header
			data-slot="landing-navbar"
			className={cn(
				"fixed top-0 right-0 left-0 z-50 w-full transition-all duration-300 ease-in-out",
				isVisible
					? "translate-y-0 opacity-100"
					: "pointer-events-none -translate-y-full opacity-0",
				isScrolled ? "bg-background" : "bg-transparent",
				className,
			)}
			{...props}
		>
			<div className="flex h-16 w-full items-center justify-between gap-4 px-6 sm:h-18 sm:px-10 md:px-14 lg:px-20 xl:px-24 2xl:px-32">
				{children}
			</div>
		</header>
	);
}

export interface ILandingNavbarBrandProps {
	name: string;
	tagline?: string;
	logo?: ReactNode;
	hasDropdown?: boolean;
	onDropdownClick?: () => void;
	className?: string;
}

export function LandingNavbarBrand({
	name,
	tagline,
	logo,
	hasDropdown = false,
	onDropdownClick,
	className,
}: ILandingNavbarBrandProps) {
	if (hasDropdown && onDropdownClick) {
		return (
			<button
				type="button"
				data-slot="landing-navbar-brand"
				className={cn(
					"group flex shrink-0 cursor-pointer items-center gap-2 select-none focus:outline-hidden",
					className,
				)}
				onClick={onDropdownClick}
				aria-haspopup="menu"
			>
				{logo}
				<div className="flex items-center gap-2">
					<span className="font-title text-lg font-semibold tracking-tight text-foreground sm:text-xl">
						{name}
					</span>
					{tagline && (
						<span className="hidden text-xs font-normal text-muted-foreground sm:inline">
							{tagline}
						</span>
					)}
					<div className="rounded-full p-0.5 transition-colors hover:bg-muted">
						<IconChevronDown className="size-4 text-muted-foreground transition-transform duration-200 group-hover:text-foreground" />
					</div>
				</div>
			</button>
		);
	}

	return (
		<div
			data-slot="landing-navbar-brand"
			className={cn(
				"group flex shrink-0 cursor-default items-center gap-2 select-none",
				className,
			)}
		>
			{logo}
			<div className="flex items-center gap-2">
				<span className="font-title text-lg font-semibold tracking-tight text-foreground sm:text-xl">
					{name}
				</span>
				{tagline && (
					<span className="hidden text-xs font-normal text-muted-foreground sm:inline">
						{tagline}
					</span>
				)}
			</div>
		</div>
	);
}

export interface ILandingNavbarNavProps extends ComponentProps<"div"> {
	children?: ReactNode;
	items?: TLandingNavItem[];
	onItemClick?: (item: TLandingNavItem) => void;
	className?: string;
}

export function LandingNavbarNav({
	children,
	items,
	onItemClick,
	className,
	...props
}: ILandingNavbarNavProps) {
	return (
		<div
			data-slot="landing-navbar-nav"
			className={cn("hidden items-center md:flex", className)}
			{...props}
		>
			{children || (
				<NavigationMenu>
					<NavigationMenuList className="gap-1 lg:gap-2">
						{items?.map((item) => {
							if (item.items && item.items.length > 0) {
								return (
									<NavigationMenuItem key={item.label}>
										<NavigationMenuRoot>
											<NavigationMenuTrigger>
												{item.label}
											</NavigationMenuTrigger>
											<NavigationMenuContent
												align="start"
												className="w-80 p-2 sm:w-96"
											>
												<div className="flex flex-col gap-1">
													{item.items.map((subItem) => (
														<NavigationMenuLink
															key={subItem.href}
															href={subItem.href}
															onClick={() => onItemClick?.(item)}
															className="group/subitem flex flex-col gap-1 rounded-xl p-3 transition-colors hover:bg-muted"
														>
															<div className="text-sm font-medium text-foreground">
																{subItem.title}
															</div>
															{subItem.description && (
																<p className="text-xs leading-relaxed text-muted-foreground">
																	{subItem.description}
																</p>
															)}
														</NavigationMenuLink>
													))}
												</div>
											</NavigationMenuContent>
										</NavigationMenuRoot>
									</NavigationMenuItem>
								);
							}

							return (
								<NavigationMenuItem key={item.href || item.label}>
									<NavigationMenuLink
										href={item.href ?? "#"}
										className={cn(
											navigationMenuTriggerStyle(),
											item.isActive
												? "font-semibold text-foreground"
												: "text-muted-foreground",
										)}
										onClick={() => onItemClick?.(item)}
									>
										{item.label}
									</NavigationMenuLink>
								</NavigationMenuItem>
							);
						})}
					</NavigationMenuList>
				</NavigationMenu>
			)}
		</div>
	);
}

export interface ILanguageOption {
	code: string;
	label: string;
}

export interface ILandingNavbarLanguageSwitcherProps {
	currentLang?: string;
	languages?: ILanguageOption[];
	onSelectLanguage?: (langCode: string) => void;
	className?: string;
}

const DEFAULT_LANGUAGES: ILanguageOption[] = [
	{ code: "EN", label: "English" },
	{ code: "VI", label: "Tiếng Việt" },
];

export function LandingNavbarLanguageSwitcher({
	currentLang = "EN",
	languages = DEFAULT_LANGUAGES,
	onSelectLanguage,
	className,
}: ILandingNavbarLanguageSwitcherProps) {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger
				data-slot="landing-language-switcher-trigger"
				className={cn(
					"inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-border/80 bg-background/50 px-3 py-1.5 text-xs font-medium text-foreground transition-all duration-200 outline-none select-none hover:border-foreground/30 hover:bg-muted/60 focus-visible:ring-2 focus-visible:ring-ring sm:text-sm",
					className,
				)}
				aria-label={`Selected language: ${currentLang}. Click to change language`}
			>
				<IconLanguage className="size-4 text-muted-foreground" />
				<span className="text-xs font-semibold tracking-wider uppercase">
					{currentLang}
				</span>
				<IconChevronDown className="size-3.5 text-muted-foreground" />
			</DropdownMenuTrigger>

			<DropdownMenuContent align="end" className="w-36">
				{languages.map((lang) => {
					const isSelected =
						lang.code.toUpperCase() === currentLang.toUpperCase();
					return (
						<DropdownMenuItem
							key={lang.code}
							onClick={() => onSelectLanguage?.(lang.code)}
							className="flex items-center justify-between"
						>
							<span
								className={cn(isSelected && "font-semibold text-foreground")}
							>
								{lang.label}
							</span>
							{isSelected && <IconCheck className="size-4 text-foreground" />}
						</DropdownMenuItem>
					);
				})}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

export interface ILandingNavbarActionsProps extends ComponentProps<"div"> {
	children?: ReactNode;
	searchLabel?: string;
	onSearchClick?: () => void;
	currentLang?: string;
	languages?: ILanguageOption[];
	onSelectLanguage?: (langCode: string) => void;
	loginLabel?: string;
	onLoginClick?: () => void;
	items?: TLandingNavItem[];
	onItemClick?: (item: TLandingNavItem) => void;
	className?: string;
}

export function LandingNavbarActions({
	children,
	searchLabel = "Search",
	onSearchClick,
	currentLang = "EN",
	languages = DEFAULT_LANGUAGES,
	onSelectLanguage,
	loginLabel = "Sign in",
	onLoginClick,
	items,
	onItemClick,
	className,
	...props
}: ILandingNavbarActionsProps) {
	const [mobileOpen, setMobileOpen] = useState(false);

	return (
		<div
			data-slot="landing-navbar-actions"
			className={cn("flex shrink-0 items-center gap-2 sm:gap-2.5", className)}
			{...props}
		>
			{/* 1. Search Pill Button */}
			{onSearchClick && (
				<button
					type="button"
					onClick={onSearchClick}
					data-slot="landing-search-trigger"
					className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-border/80 bg-background/50 px-3.5 py-1.5 text-sm font-medium text-foreground transition-all duration-200 outline-none hover:border-foreground/30 hover:bg-muted/60 focus-visible:ring-2 focus-visible:ring-ring sm:px-4"
					aria-label={searchLabel}
				>
					<IconSearch className="size-4 text-muted-foreground" />
					<span className="text-sm font-normal text-muted-foreground">
						{searchLabel}
					</span>
				</button>
			)}

			{/* 2. Dropdown Language Switcher */}
			{onSelectLanguage && (
				<LandingNavbarLanguageSwitcher
					currentLang={currentLang}
					languages={languages}
					onSelectLanguage={onSelectLanguage}
				/>
			)}

			{/* 3. Sign In / Login Button */}
			{onLoginClick && (
				<Button
					type="button"
					onClick={onLoginClick}
					size="sm"
					variant="default"
					className="rounded-full px-4 text-xs font-medium sm:text-sm"
				>
					{loginLabel}
				</Button>
			)}

			{children}

			{/* Mobile Drawer Trigger */}
			{items && items.length > 0 && (
				<div className="md:hidden">
					<Button
						variant="ghost"
						size="icon-sm"
						type="button"
						aria-label={mobileOpen ? "Close menu" : "Open menu"}
						aria-expanded={mobileOpen}
						onClick={() => setMobileOpen((prev) => !prev)}
					>
						{mobileOpen ? (
							<IconX className="size-5" />
						) : (
							<IconMenu2 className="size-5" />
						)}
					</Button>

					{mobileOpen && (
						<div
							data-slot="landing-mobile-drawer"
							className="absolute top-full left-0 z-50 flex max-h-[85vh] w-full animate-in flex-col gap-3 overflow-y-auto border-b border-border bg-background p-4 shadow-lg fade-in slide-in-from-top-2"
						>
							{items.map((item) => {
								if (item.items && item.items.length > 0) {
									return (
										<div
											key={item.label}
											className="flex flex-col gap-1 border-b border-border/50 pb-2"
										>
											<span className="px-3 py-1 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
												{item.label}
											</span>
											{item.items.map((subItem) => (
												<a
													key={subItem.href}
													href={subItem.href}
													onClick={() => {
														onItemClick?.(item);
														setMobileOpen(false);
													}}
													className="rounded-lg px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
												>
													<div className="font-medium">{subItem.title}</div>
													{subItem.description && (
														<p className="text-xs text-muted-foreground">
															{subItem.description}
														</p>
													)}
												</a>
											))}
										</div>
									);
								}

								return (
									<a
										key={item.href || item.label}
										href={item.href ?? "#"}
										onClick={() => {
											onItemClick?.(item);
											setMobileOpen(false);
										}}
										className={cn(
											"rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-muted",
											item.isActive
												? "bg-muted font-semibold text-foreground"
												: "text-muted-foreground",
										)}
									>
										{item.label}
									</a>
								);
							})}

							{onSelectLanguage && (
								<div className="flex items-center justify-between border-t border-border pt-3">
									<span className="text-sm font-medium text-muted-foreground">
										Language
									</span>
									<div className="flex items-center gap-1">
										{languages.map((lang) => (
											<button
												key={lang.code}
												type="button"
												onClick={() => {
													onSelectLanguage?.(lang.code);
													setMobileOpen(false);
												}}
												className={cn(
													"rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
													lang.code.toUpperCase() === currentLang.toUpperCase()
														? "bg-foreground font-semibold text-background"
														: "bg-muted text-muted-foreground hover:text-foreground",
												)}
											>
												{lang.code}
											</button>
										))}
									</div>
								</div>
							)}

							{onLoginClick && (
								<Button
									type="button"
									onClick={() => {
										onLoginClick?.();
										setMobileOpen(false);
									}}
									size="sm"
									className="mt-2 w-full"
								>
									{loginLabel}
								</Button>
							)}
						</div>
					)}
				</div>
			)}
		</div>
	);
}

export const LandingNavbar = Object.assign(LandingNavbarRoot, {
	Root: LandingNavbarRoot,
	Brand: LandingNavbarBrand,
	Nav: LandingNavbarNav,
	LanguageSwitcher: LandingNavbarLanguageSwitcher,
	Actions: LandingNavbarActions,
});
