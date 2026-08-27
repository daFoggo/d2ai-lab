---
name: reference-styles
description: Reference analysis of the /dev/notion style system, distilled into adoptable patterns for the lab site. Use when choosing visual treatment for a section or page — backgrounds, code blocks, ornament, logo walls, section dividers. Complements 10_design_tokens.md and 11_page_patterns.md.
---

# Reference Styles (from /dev/notion)

## When to Use

- Choosing the visual treatment for a new section or page.
- Deciding between an all-white page vs. an alternating-background rhythm.
- Placing a code block, logo wall, or decorative blueprint grid.

## Why This Reference

The lab's style system is already the same family as /dev/notion — deep indigo
primary, sharp `radius: 0`, mono uppercase labels. So the win from this
reference is *not new colors* but **how to compose and ornament with the tokens
we already have**.

## Already Matched (do not add anything)

| /dev/notion | Our token |
|---|---|
| Deep indigo (dark hero/footer/sections) | `--primary` (`oklch(0.3718 0.2366 266.8)`) |
| Vivid cobalt accent | `--ring`, `chart-1` / `chart-2` |
| Light lavender section fill | `--accent`, `--secondary` |
| Sharp/square corners | `--radius: 0` |
| Mono uppercase labels | `--font-mono` |

## Adoptable Patterns

### P1 — Alternating section backgrounds (rhythm)

Instead of everything on `bg-background`, alternate band surfaces using existing
tokens: white `bg-background` → light lavender `bg-accent` / `bg-secondary` →
always-dark indigo (`bg-primary`). This adds rhythm without new colors.

- Applies to: home, archetype A (Collection Index), archetype B (Entity Detail).
- Each `SectionBand` may declare a surface (`background` | `accent` | `dark`);
  the band is the unit of background rhythm, not each page.

### P2 — "Real artifact" embed + floating callback cards

The hero embeds a realistic product/UI, with small floating status cards
connected by dashed lines and a subtle dotted blueprint grid behind.

- For the lab: embed a **result figure / dataset preview / interface mockup**,
  with a `StatusCard` or `CalloutCard` pinned beside it.
- Use a `border-dashed` connector line and a low-opacity dotted grid on the
  hero only, sparingly, respecting `motion-safe:` / `motion-reduce:`.
- Do **not** reproduce a merchandising-style data table or heavy interactive
  product UI. Keep it an artifact, not a storefront.

### P3 — Code block as the primary visual artifact

Dark indigo terminal/code blocks are the dominant visual here. For the lab this
is the strongest adoptable motif:

- `CodeBlock`: dark surface (`bg-primary text-primary-foreground`), `font-mono`,
  `$` prompt, copy button, download, optional syntax highlight.
- Content: paper pseudocode, `pip`/`conda install`, train/eval command,
  algorithm snippet, dataset schema.
- Applies to: archetype B band, archetype C body, "how to use / reproduce"
  sections.

### P4 — Blueprint ornament (dotted grid + dashed connectors)

A low-opacity dotted grid and dashed connector lines between elements give a
"designed, systematic" feel — on-brand for a research lab.

- Implement as a decorative utility (`bg-dot` grid, `border-dashed`).
- Restrict to the hero + 1–2 key bands; too much becomes noise.
- Non-interactive decoration must be `aria-hidden` and respect reduced motion.

### P5 — Badge chips (Beta / Alpha → status text)

Small mono-uppercase pills for state. Map to lab content:

- `Published`, `Under Review`, `In Review`, `Accepted @ SIGIR`, etc.
- Use on archetype C metadata and archetype D result rows.
- Keep the color monochrome (`text-foreground` / `bg-muted`) — do **not** add a
  green "success" token; stay in the indigo family.

### P6 — Section-divider headline

A big centered `font-title` headline ("Any data. Any tool. Any agent.") used as a
rhythm-breaker between bands.

- Light sections: `text-primary` (deep indigo) or `text-foreground`.
- Dark sections: `text-primary-foreground` (white) on `bg-primary`.

### P7 — Logo wall ("Trusted by …")

Thin-bordered logo boxes in a row. Map to `Funded by / In collaboration with` —
universities, partners, co-labs.

- New `LogoWall` primitive: grid of bordered `LogoCard` cells.
- Applies to: archetype A / B, or a footer-adjacent band.

### P8 — Asymmetric feature cards

Two-column cards with differing heights, each: title + short copy + anchor link
("Read the docs →"). Maps to `MediaCard`-adjacent `LinkCard`.

- Applies to: archetype A, archetype E.

### P9 — Dark centered footer CTA

Dark footer with a centered command (`curl …` / `pip …`) + copy button, a
"Start … / read the docs" line, language switcher, and a legal row.

- For the lab: centered CTA + tagline + language switcher + legal footer row
  with a centered `CodeBlock`-style install line.
- Extends the existing `LandingFooter`.

## What to Avoid

- **Keyboard-shortcut nav** (`[S] [A] [H]`): a dev-tool/terminal affordance; out
  of place on a lab site except inside a docs section.
- **Gamified elements** (SCORE / BEST counters, "Get ticket free"): off-brand for
  a research lab.
- **Green "Done." success accent**: our palette has no green; keep status states
  monochrome (`text-foreground` / `text-primary`).
- **Heavy interactive product table**: not the product; use artifacts/figures.

## New Primitives Implied

`CodeBlock` · `SectionDivider` · `LogoWall` · `StatusCard` / `CalloutCard` ·
`LinkCard` · decorative `bg-dot` utility. Add to the inventory in
`11_page_patterns.md` when building.

## Rule Summary

1. Reuse tokens; add no new color.
2. The band is the unit of background rhythm — use P1.
3. Code blocks and result figures are core visual artifacts — use P3 / P2.
4. Ornament (P4) sparingly and accessibly.
5. Status labels are mono-uppercase pills, monochrome — use P5.
