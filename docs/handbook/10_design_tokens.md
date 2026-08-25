---
name: design-tokens
description: Apply the canonical design-token and styling rules. Use when writing or reviewing any styling — color, typography, spacing, radius, icons, motion. Covers the semantic theme tokens, the fixed hero palette, the 3-font system, and banned patterns.
---

# Design Tokens & Styling

## When to Use

- Writing any `className` / styling.
- Choosing a color, font, size, spacing, or radius.
- Reviewing UI for token consistency.

## Principles

1. Use **semantic theme tokens** or the **hero palette** — never raw colors or raw Tailwind palette colors.
2. Use the **Tailwind default scale** — never arbitrary values.
3. Use existing primitives as-is (see `06_quality_rules.md`).

## Colors

Semantic theme tokens live in `src/styles.css`:

| Family | Tokens | Use for |
|---|---|---|
| Theme (light) | `background`, `foreground`, `card`, `popover`, `primary`, `secondary`, `muted`, `accent`, `destructive`, `border`, `input`, `ring`, `chart-1..5`, `sidebar-*` | All UI. The project is light-only (`getThemeServerFn` always returns `"light"`). |
| Always-dark brand surfaces | No extra tokens — `HERO_SCOPE_STYLE` remaps the standard tokens | Hero, footer, dark marketing cards |

Rules:

- Use standard theme classes — `text-foreground`, `text-muted-foreground`, `bg-background`, `bg-muted`, `border-border`, `bg-primary` ... — never `#hex`, `rgb(...)`, `bg-[#...]`, or raw Tailwind palette (`bg-zinc-900`, `text-zinc-300`).
- Adjust intensity with the `/xx` opacity syntax: `text-muted-foreground/70`, `bg-background/80`, `text-foreground/30`.
- **Always-dark surfaces** (hero, footer, dark cards) apply `HERO_SCOPE_STYLE` (`src/features/landing/constants.ts`) to the section root via inline `style`, then use the **same standard classes**. The scope maps `background` → deep indigo, `foreground`/`primary` → white, etc. There is no separate `--hero-*` token set — the brand palette IS the light-mode `--primary`/`--primary-foreground` pair.
- Never hardcode z-index; rely on the Tailwind stack (`z-10`…`z-50`) and primitive internals.

## Typography (3 fonts)

| Token | Font | Use |
|---|---|---|
| `--font-sans` | Geist Variable | Body, UI text, default headings |
| `--font-mono` | Geist Mono Variable | Numbers, data, code, timestamps, IDs |
| `--font-title` | Funnel Display Variable | Large marketing/hero headings |

`--font-heading` = `--font-sans` (default headings use Geist; `font-title` is reserved for big brand/marketing type).

- Tailwind default scale only: `text-xs`..`text-9xl`; minimum is `text-xs` (12px).
- No arbitrary `text-[...]`.
- `font-normal` (400) / `font-medium` (500) / `font-semibold` (600) / `font-bold` (700).
- Note: shadcn primitives may carry internal arbitrary values (e.g. `text-[0.8rem]`); project code must not.

## Spacing

- Tailwind default 4px scale: `0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 5, 6, 7, 8, 9, 10, 11, 12, 14, 16, 20, 24, 28, 32, 36, 40, ...`
- Prefer `gap-*` on flex/grid over `space-x/y-*`.
- No arbitrary values (`w-[460px]`, `p-[15px]`, `min-h-[500px]`).
- Use `size-*` when width and height match (`size-4`, not `w-4 h-4`).

## Radius

`--radius: 0` is the project's intentional sharp/square style. `rounded-lg/2xl/3xl` resolve to `0` (square). Use `rounded-full` only for pills, avatars, and circular controls. Do not add `rounded-*` overrides to primitives that already define their shape.

## Icons

- `@tabler/icons-react` only.
- Icons inside primitives use `data-icon="inline-start|inline-end"`; no sizing classes on icons inside components.

## Motion

- Animate `transform`, `opacity`, `color` only.
- Use `tw-animate-css` / Tailwind utilities before custom keyframes.
- Respect reduced motion with `motion-safe:` / `motion-reduce:`.

## Banned Patterns

- Arbitrary class values (`text-[10px]`, `w-[450px]`, `p-[15px]`, `min-h-[500px]`, `z-[999]`).
- Hardcoded colors (`#fff`, `rgb(...)`, `bg-[#...]`).
- Raw Tailwind palette colors when a theme or hero token exists (`zinc-*`, `slate-*`, ...).
- `space-x/y-*` when `gap-*` works.
- Manual `dark:` overrides when semantic tokens already adapt.
- Custom keyframes when built-in utilities suffice.