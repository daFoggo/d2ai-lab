import {
	IconCheck,
	IconChevronDown,
	IconLanguage,
	IconMenu2,
	IconSearch,
	IconX,
} from "@tabler/icons-react";
import { Link, useRouterState } from "@tanstack/react-router";
import type { ComponentProps, ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupButton,
	InputGroupInput,
} from "@/components/ui/input-group";
import {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	NavigationMenuTrigger,
	navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { DEFAULT_LOCALE, LOCALES, useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { HERO_SCOPE_STYLE } from "../constants";
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
	const [isScrolled, setIsScrolled] = useState(false);
	const [isOverHero, setIsOverHero] = useState(true);
	const headerRef = useRef<HTMLElement>(null);
	const pathname = useRouterState({
		select: (s) => s.location.pathname,
	});

	useEffect(() => {
		const handleScroll = () => {
			// Check if scrolled past threshold for background color
			setIsScrolled(window.scrollY > 20);
		};

		window.addEventListener("scroll", handleScroll, { passive: true });
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	// Track whether the header still overlaps the hero section so its color
	// scheme can follow the hero while over it and switch back to the site's
	// normal tokens once the user scrolls past it into the sections below.
	// Re-runs on route change: isOverHero lives on a single shared header that
	// does not remount between pages, so returning to / must re-attach to the
	// (newly mounted) hero after the route transition.
	useEffect(() => {
		let observer: IntersectionObserver | undefined;

		const isHome = pathname === "/" || /^\/(en|vi)\/?$/.test(pathname);

		const attach = () => {
			// Only the home route renders the hero; other routes have no hero.
			if (!isHome) {
				setIsOverHero(false);
				return;
			}

			const heroEl = document.querySelector('[data-slot="landing-hero"]');
			if (!heroEl) {
				setIsOverHero(false);
				return;
			}

			const navHeight = headerRef.current?.offsetHeight ?? 80;
			observer = new IntersectionObserver(
				([entry]) => setIsOverHero(entry.isIntersecting),
				{ rootMargin: `-${navHeight}px 0px 0px 0px`, threshold: 0 },
			);
			observer.observe(heroEl);
		};

		// Wait a frame so the route content (hero) is mounted before observing.
		const raf = requestAnimationFrame(attach);

		return () => {
			cancelAnimationFrame(raf);
			observer?.disconnect();
		};
	}, [pathname]);

	return (
		<header
			ref={headerRef}
			data-slot="landing-navbar"
			style={isOverHero ? HERO_SCOPE_STYLE : undefined}
			className={cn(
				"fixed top-0 right-0 left-0 z-50 w-full text-foreground transition-colors duration-300 ease-in-out",
				isOverHero
					? isScrolled
						? "bg-background/90"
						: "bg-transparent"
					: "bg-background",
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
	const { locale } = useI18n();

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
		<Link
			to="/{-$locale}"
			params={{ locale: locale === DEFAULT_LOCALE ? undefined : locale }}
			data-slot="landing-navbar-brand"
			className={cn(
				"group flex shrink-0 items-center gap-2 select-none focus:outline-hidden",
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
		</Link>
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
	const { locale } = useI18n();

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
										<NavigationMenuTrigger>{item.label}</NavigationMenuTrigger>
										<NavigationMenuContent className="w-80 p-2 sm:w-96">
											<div className="flex flex-col gap-1">
												{item.items.map((subItem) => {
													const subLinkProps = subItem.to
														? {
																render: (
																	<Link
																		to={subItem.to}
																		params={{
																			locale:
																				locale === DEFAULT_LOCALE
																					? undefined
																					: locale,
																		}}
																	/>
																),
															}
														: { href: subItem.href ?? "#" };

													return (
														<NavigationMenuLink
															key={subItem.href ?? subItem.to}
															{...subLinkProps}
															onClick={() => onItemClick?.(item)}
															className="group/subitem flex flex-col items-start gap-1 rounded-xl p-3 transition-colors hover:bg-muted"
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
													);
												})}
											</div>
										</NavigationMenuContent>
									</NavigationMenuItem>
								);
							}

							return (
								<NavigationMenuItem key={item.href ?? item.to ?? item.label}>
									{item.to ? (
										<NavigationMenuLink
											render={
												<Link
													to={item.to}
													params={{
														locale:
															locale === DEFAULT_LOCALE ? undefined : locale,
													}}
												/>
											}
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
									) : (
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
									)}
								</NavigationMenuItem>
							);
						})}
					</NavigationMenuList>
				</NavigationMenu>
			)}
		</div>
	);
}

export interface ILandingNavbarLanguageSwitcherProps {
	className?: string;
}

export function LandingNavbarLanguageSwitcher({
	className,
}: ILandingNavbarLanguageSwitcherProps) {
	const { locale, t } = useI18n();

	return (
		<DropdownMenu>
			<DropdownMenuTrigger
				render={<Button variant="outline" className={className} />}
				aria-label={t("common.changeLanguage")}
			>
				<IconLanguage className="size-4 text-muted-foreground" />
				<span className="text-xs font-semibold tracking-wider uppercase">
					{locale}
				</span>
				<IconChevronDown className="size-3.5 text-muted-foreground" />
			</DropdownMenuTrigger>

			<DropdownMenuContent align="end" className="w-36">
				{LOCALES.map((lang) => {
					const isSelected = lang === locale;
					return (
						<DropdownMenuItem
							key={lang}
							render={
								<Link
									to="/{-$locale}"
									params={{
										locale: lang === DEFAULT_LOCALE ? undefined : lang,
									}}
								/>
							}
							className="flex items-center justify-between"
						>
							<span
								className={cn(isSelected && "font-semibold text-foreground")}
							>
								{t(`common.language.${lang}`)}
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
	loginLabel?: string;
	onLoginClick?: () => void;
	items?: TLandingNavItem[];
	onItemClick?: (item: TLandingNavItem) => void;
	className?: string;
}

export function LandingNavbarActions({
	children,
	searchLabel,
	onSearchClick,
	loginLabel,
	onLoginClick,
	items,
	onItemClick,
	className,
	...props
}: ILandingNavbarActionsProps) {
	const { t, locale } = useI18n();
	const [mobileOpen, setMobileOpen] = useState(false);
	const resolvedSearch = searchLabel ?? t("common.search");
	const resolvedLogin = loginLabel ?? t("common.signIn");

	return (
		<div
			data-slot="landing-navbar-actions"
			className={cn("flex shrink-0 items-center gap-2 sm:gap-2.5", className)}
			{...props}
		>
			{/* Desktop controls — hidden on mobile, moved into the drawer */}
			<div className="hidden items-center gap-2 sm:gap-2.5 md:flex">
				{/* 1. Search Input */}
				{onSearchClick && (
					<InputGroup
						data-slot="landing-search-trigger"
						className="w-28 sm:w-44 lg:w-56"
					>
						<InputGroupInput
							placeholder={resolvedSearch}
							aria-label={resolvedSearch}
							onKeyDown={(e) => {
								if (e.key === "Enter") {
									e.preventDefault();
									onSearchClick();
								}
							}}
						/>
						<InputGroupAddon align="inline-end">
							<InputGroupButton
								size="icon-sm"
								onClick={onSearchClick}
								aria-label={resolvedSearch}
							>
								<IconSearch />
							</InputGroupButton>
						</InputGroupAddon>
					</InputGroup>
				)}

				{/* 2. Dropdown Language Switcher */}
				<LandingNavbarLanguageSwitcher />

				{/* 3. Sign In / Auth Button */}
				{onLoginClick ? (
					<Button onClick={onLoginClick}>{resolvedLogin}</Button>
				) : (
					children
				)}
			</div>

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
							className="absolute top-full left-0 z-50 flex max-h-screen w-full animate-in flex-col gap-3 overflow-y-auto border-b border-border bg-background p-4 shadow-lg fade-in slide-in-from-top-2"
						>
							{/* Search (mobile) */}
							{onSearchClick && (
								<InputGroup data-slot="landing-search-trigger">
									<InputGroupInput
										placeholder={resolvedSearch}
										aria-label={resolvedSearch}
										onKeyDown={(e) => {
											if (e.key === "Enter") {
												e.preventDefault();
												onSearchClick();
												setMobileOpen(false);
											}
										}}
									/>
									<InputGroupAddon align="inline-end">
										<InputGroupButton
											size="icon-sm"
											onClick={() => {
												onSearchClick();
												setMobileOpen(false);
											}}
											aria-label={resolvedSearch}
										>
											<IconSearch />
										</InputGroupButton>
									</InputGroupAddon>
								</InputGroup>
							)}

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
											{item.items.map((subItem) => {
												if (subItem.to) {
													return (
														<Link
															key={subItem.to}
															to={subItem.to}
															params={{
																locale:
																	locale === DEFAULT_LOCALE
																		? undefined
																		: locale,
															}}
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
														</Link>
													);
												}

												return (
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
												);
											})}
										</div>
									);
								}

								return item.to ? (
									<Link
										key={item.to}
										to={item.to}
										params={{
											locale: locale === DEFAULT_LOCALE ? undefined : locale,
										}}
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
									</Link>
								) : (
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

							<div className="flex items-center justify-between border-t border-border pt-3">
								<span className="text-sm font-medium text-muted-foreground">
									{t("common.languageLabel")}
								</span>
								<div className="flex items-center gap-1">
									{LOCALES.map((lang) => (
										<Link
											key={lang}
											to="/{-$locale}"
											params={{
												locale: lang === DEFAULT_LOCALE ? undefined : lang,
											}}
											onClick={() => setMobileOpen(false)}
											className={cn(
												"rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
												lang === locale
													? "bg-foreground font-semibold text-background"
													: "bg-muted text-muted-foreground hover:text-foreground",
											)}
										>
											{lang.toUpperCase()}
										</Link>
									))}
								</div>
							</div>

							{onLoginClick ? (
								<Button
									type="button"
									onClick={() => {
										onLoginClick?.();
										setMobileOpen(false);
									}}
									className="w-full"
								>
									{resolvedLogin}
								</Button>
							) : children ? (
								<div className="mt-2 flex w-full justify-center">
									{children}
								</div>
							) : null}
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
