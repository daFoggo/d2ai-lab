import type { CSSProperties } from "react";

/**
 * Maps the standard design tokens (used by nested subcomponents via
 * `text-foreground`, `bg-background`, `border-border`, ...) to the fixed
 * brand palette of the always-dark sections (hero, footer, dark cards).
 *
 * The project is light-only, and the brand palette IS the light-mode
 * `--primary` / `--primary-foreground` pair (deep indigo + white), so no
 * separate `--hero-*` CSS tokens are needed. Values are inlined here to
 * avoid a cyclic `--primary`/`--primary-foreground` self-reference.
 */
export const HERO_SCOPE_STYLE = {
	"--background": "oklch(0.3718 0.2366 266.8)",
	"--foreground": "oklch(0.985 0 0)",
	"--muted": "oklch(0.985 0 0 / 12%)",
	"--muted-foreground": "oklch(0.985 0 0 / 80%)",
	"--accent": "oklch(0.985 0 0 / 12%)",
	"--accent-foreground": "oklch(0.985 0 0)",
	"--border": "oklch(0.985 0 0 / 18%)",
	"--input": "oklch(0.985 0 0 / 18%)",
	"--primary": "oklch(0.985 0 0)",
	"--primary-foreground": "oklch(0.3718 0.2366 266.8)",
	"--ring": "oklch(0.985 0 0 / 80%)",
} as CSSProperties;
