---
name: page-patterns
description: Canonical page-format taxonomy for the research-lab site. Defines the reusable layout templates (page archetypes) and their building blocks, wireframed and mapped to routing/data rules. Use when designing or building any new page — pick an existing archetype before hand-rolling a layout.
---

# Page Patterns & Reusable Layout Templates

## When to Use

- Before designing or building any new page on the lab site.
- Choosing which layout template a route should compose.
- Reviewing a page for consistency against the canonical archetypes.

## Goal

Do not build each page from scratch. The site has a small surface of **reusable
layout templates (page archetypes)**; every page is one of them (or a
composition of them). This doc defines the archetypes, their wireframes, their
building blocks, and how they map to routing + data rules.

The design is distilled from two references:

- **Google Research** (content-heavy lab site): `research.google`
- **Vercel Ship** (serious-as-design, conference/marketing): `vercel.com/ship`

---

## Content Model (what a research-lab site actually has)

These are the *content types* the templates render. A template is chosen per
content type, but the template is not owned by the content — it is reusable.

| Content type | Archetype (below) |
|---|---|
| Research area / theme / category | A — Collection Index |
| Topic / project / area detail | B — Entity Detail |
| Blog post / paper / news article | C — Article Detail |
| Datasets / events / publications list | D — Filterable List |
| Publications / seminars / news grid | E — Card Grid |
| Speakers / collaborators / people | F — List-with-preview |
| About / static pages | B — Entity Detail |

---

## The 6 Archetypes

### A. Collection / Theme Index

A category of content with several sub-sections stacked on one page. The left
rail is a *sticky in-page nav* that anchors to each section.

Source: Google Research "Applied AI & sciences".

```text
+------------------------+--------------------------------------------------+
|  sticky in-page nav    |  PageHeading:  Applied AI & sciences               |
|                        |  Lede: Using computational power and techniques...  |
|  RESEARCH THEMES       |                                                  |
|  · Applied AI & sci ^  |  // section: cards grid                            |
|    Foundational ML     |  +--------+   +--------+   +--------+             |
|    People sys & QA     |  | img    |   | img    |   | img    |             |
|                        |  | title  |   | title  |   | title  |             |
|  (active item has a    |  | Learn m|   | Learn m|   | Learn m|             |
|  left border indicator)|  +--------+   +--------+   +--------+             |
|                        |                                                  |
|                        |  // section: another block                        |
+------------------------+--------------------------------------------------+
```

Key behaviors:

- Left rail is `sticky top-*`; it scrolls with the page, not fixed.
- Active section is highlighted (underline / left-indicator) while scrolling.
- The title + optional lede sits above the flow; sections render below.
- Sections can be any band: card grid, split image + copy, list, quote.

### B. Entity / Topic Detail

A single subject with a big hero and arbitrary content bands below. Hero is the
visual anchor; everything after is a "stack of bands".

Source: Google Research "Google Earth AI" (hero + "Featured blogs" band).

```text
+----------------------------------------------+
|  Big Title   (font-title)           | hero   |
|  Google Earth AI                    | image  |
|  Lede: Built on years of modeling...  +------+
|  [ Learn more ]                              |
|                                              |
|  ------------------------------------------  |
|  /* Band 1: Featured blogs (card grid)   */  |
|  +-------+   +-------+   +-------+            |
|  | card  |   | card  |   | card  |            |
|  +-------+   +-------+   +-------+            |
|                                              |
|  /* Band 2: ... arbitrary */                  |
+----------------------------------------------+
```

Key behaviors:

- Hero: two-column (text left, media right) or full-bleed.
- The hero is the *one* place for a primary CTA + hero media.
- Below hero: an ordered set of reusable **bands** (card grid, split, list,
  quote, call-to-action). A band is a chunk; a topic page is a composition of
  bands. Same bands power the homepage.

### C. Article / Rich Content Detail

A long-form piece: prose body with a right sticky rail for peripheral actions
(cross-links, share). The classic blog / paper detail layout.

Source: Google Research "Google Earth AI: Unlocking geospatial insights...".

```text
+----------------------------------------------+----------------+
|  Breadcrumb:  Home > Blog                     |                |
|  Title (big, 5-6 lines allowed)              |                |
|  Meta: date · authors                          |  QUICK LINKS   |
|  [ hero image ]                                |  ⇗ Link 1      |
|                                                |  ⇗ Link 2      |
|  Prose body (readable width)                  |  ⇗ Link 3      |
|  [callout] [quote] [figure]  ← rich content   |  ────────────  |
|                                                |  ⤴ Share       |
|  ...                                           |                |
+----------------------------------------------+----------------+
```

Key behaviors:

- **Breadcrumb** first for wayfinding.
- Header block: single column; title, meta (date/authors/labels), hero image.
- Body: prose constrained to a readable measure (`max-w-*`).
- **Right rail** is `sticky top-*`; holds quick-links and share. It is not
  required — collapse when absent.
- Rich-text blocks: paragraph, heading, list, callout, blockquote, figure,
  inline link, footnote.

### D. Filterable List (sidebar facets + toolbar)

A data listing where you narrow by facets. Bounded-height result rows are tight
(list rows, not big cards). The "headless" data pattern.

Source: Google Research "Datasets" / "Conferences & Events".

```text
+----------------------+-----------------------------------------+
|  PageHeading (above) |                                         |
|  (optional, full-    |  Sort By ▾         [ Search      ]  1-15 of 169
|   width)             |                                         |
|                      |  Title row 1                            |
|  FILTER BY:          |  short meta · description               |
|  ▾ Dataset Type      |  ─────────────────────────────────────  |
|     □ Audio          |  Title row 2                            |
|     □ Image          |  short meta · description               |
|     □ Other          |  ─────────────────────────────────────  |
|     □ Robotics       |  Title row 3                            |
|     □ Video          |  short meta · description               |
|  ▾ Dataset Year      |  ...                                    |
+----------------------+-----------------------------------------+
```

Key behaviors:

- Left **FilterSidebar**: collapsible facet groups with checkboxes, chips, or
  range controls. Optional — sometimes the page is just the list.
- Toolbar: **Sort** control, **Search** input, **result count** ("1–15 of 169").
- Rows: title + one-line meta + short description. Tight vertical rhythm.
- Pagination (or infinite) at the bottom.
- Empty state when facets match nothing (not "hide the section").

### E. Card Grid + Search/Filter bar

A visual listing of cards. Can carry a featured card in the hero, and a compact
filter bar instead of a sidebar.

Source: Google Research "The latest research from Google".

```text
+------------------------------------+---------------------------+
|  The latest research from Google    |  featured card (big)     |
|  [social: x in rss]                 |  date · title · tags     |
|                                    |                          |
+------------------------------------+---------------------------+
|  Years ▾   Labels ▾          [ Search ]                       |
|                                                              |
|  +--------+  +--------+  +--------+                          |
|  | image  |  | image  |  | image  |   ← 3-col grid           |
|  | date   |  | date   |  | date   |                          |
|  | title  |  | title  |  | title  |                          |
|  | tags   |  | tags   |  | tags   |                          |
|  +--------+  +--------+  +--------+                          |
|                                                              |
+--------------------------------------------------------------+
```

Key behaviors:

- **MediaCard**: thumbnail, date (mono uppercase), title, tag(s), "Read the
  blog / Learn more" link.
- Optional split hero (title + social on the left, featured card right).
- **FilterBar** is compact inline (dropdowns + search) — contrast with D's
  sidebar. Both are data listings; they differ only in how they render items
  and where filters live.

### F. List-with-preview (Speakers / People)

A list on the left; hovering / selecting a row reveals a large feature preview
on the right. Great for people where you want a face + bio without a grid.

Source: Vercel Ship "Featured speakers".

```text
+------------------+                      +----------------+
|  Featured speaker|  [VIEW ALL →]        |                |
|  (left list)     |                      |  preview       |
|                  |                      |  (large face   |
|  ─────────────── |                      |   / card)      |
|  HAN WANG ▴      |   ← active/hovered  |                |
|  CEO, MINTLIFY   |                      |                |
|  ─────────────── |                      |                |
|  PAUL KLEIN IV   |                      |                |
|  FOUNDER&CEO,.. |                      |                |
|  ─────────────── |                      |                |
+------------------+                      +----------------+
```

Key behaviors:

- Two-pane: left rows (name + role + meta), right large preview.
- Active row highlighted; preview syncs to active/hovered row (works on
  keyboard focus too, not just hover).
- Reuse `DataListRow` from D; the preview is the featured card from E.

---

## The Reusable Building Blocks

The archetypes are not monolithic — they are **layout shells** composed of
**interchangeable building blocks**. Build the blocks once; the archetypes and
eventual pages are just compositions.

### Shell components (page scaffolding)

Reusable across many archetypes (put in `src/components/common/`):

| Primitive | Used by | Purpose |
|---|---|---|
| `PageHeader` | A, B, D, E | Title + lede + optional meta + optional CTA |
| `Breadcrumb` | C | Wayfinding path |
| `StickyInPageNav` | A | Left in-page section anchor nav (sticky) |
| `StickyRightRail` | C | Right peripheral links + share (sticky) |
| `EntityHero` | B, C | Big title + lede + CTA + hero media |
| `FilterSidebar` | D | Collapsible facet groups |
| `FilterToolbar` | D, E | Sort + search + result count |
| `FilterBar` | E | Inline compact dropdown filters + search |
| `ResultCount` | D | "1–15 of 169" |
| `SectionBand` | B, home | A generic stacked content chunk (grid / split / list / quote / cta) |

### Cell components (content pieces)

| Primitive | Purpose |
|---|---|
| `MediaCard` | E, B, home — image + date + title + tag + link |
| `DataListRow` | D, F — tight row: title + meta + description |
| `ProseBody` | C — rich-text renderer (p/h/list/callout/quote/figure/link) |
| `ShareBar` | C — x / in / rss / copy-link |
| `FacetGroup` | D — collapsible filter group + checkbox/chip |

### Already exist (reuse as-is)

- `LandingLayout`, `LandingNavbar` (+ LanguageSwitcher/Actions), `LandingFooter`
  → app shell for every page.
- `LandingHero`, `LandingDomains`, `LandingProjects`, `LandingLatest`,
  `LandingQuote`, `LandingFilm`, `LandingFuture` → these ARE the **bands**
  (`SectionBand`) the topic/detail pages reuse. Rename/alias as generic
  `SectionBand` variants rather than duplicating.
- `HERO_SCOPE_STYLE` → replaced by `bg-primary text-primary-foreground`
  for always-dark surfaces (hero, footer, dark cards); the navbar-over-hero
  scope lives in `src/styles.css` (`[data-slot="landing-navbar"][data-over-hero="true"]`).
- `InputGroup` + `Input` → search inputs; `DropdownMenu` + `Button` → sort &
  filter triggers; `Button` → CTA / icon controls.

### Styling rules that always apply

From `10_design_tokens.md`:

- Semantic tokens only (`text-foreground`, `text-muted-foreground`, `bg-background`,
  `border-border`, ...). Never raw hex / palette colors.
- Heading accents: `font-title` (Funnel Display) for big marketing/hero type;
  `font-mono text-xs uppercase tracking-wider` for date/category/label data.
- Label data (`AUGUST 12`, `BLOG`, `years`) uses the mono-uppercase pattern.
- Tailwind default scale only; min text `text-xs`. No arbitrary `text-[...]`.
- Radius is `0` (sharp). `rounded-full` only for pills/avatars/circular controls.
- Always-dark surfaces use `bg-primary text-primary-foreground` and map nested
  content to primary tokens.

---

## Routing & Data Mapping

Routes own page composition; features own data. See `02_architecture.md`.

### Theme (marketing) vs Listing (data) split

- **B / C / bands / hero** → primarily marketing shape; content is copy + media.
- **D / E / F** → data listings; must follow the UI-state rules
  (`05_ui_state_patterns.md`): loading skeleton, error `Alert`, valid-empty
  state. Never hide a failed query behind `[]`/`null`.

### Critical vs secondary data

- **A / B / C** — the page's own record (topic, article) is *critical*:
  `loader` + `context.queryClient.ensureQueryData(...)` + `useSuspenseQuery`.
- **D / E / F** — the listing may be *critical* too (it is the page), but the
  facets / filter options are *secondary/optional*: `prefetchQuery` or local
  `useQuery` with local loading/error states.
- **Related widgets / bands** (e.g. Featured blogs under a topic) are secondary:
  local `useQuery` with loading/error/empty.

### Route shape

```text
src/routes/{-$locale}/
|-- index.tsx                    # home = landing composition
|-- <feature>/route.tsx          # composes an archetype + queries
|-- <feature>/$id/route.tsx      # detail archetype (B / C)
```

The `feature` folder name is the *content type*; the route picks the archetype.

---

## Build Order

Do not build page by page. Build the reusable layer first:

1. **Shell + cell primitives** — `PageHeader`, `Breadcrumb`, `StickyRightRail`,
   `StickyInPageNav`, `EntityHero`, `SectionBand`, `ProseBody`, `MediaCard`,
   `DataListRow`, `FilterSidebar/Toolbar`, `ResultCount`, `ShareBar`.
2. **Archetype C (Article)** — easiest, introduces Breadcrumb + ProseBody +
   StickyRightRail, and is the foundation for separating data.
3. **Archetype B (Entity)** — reuses PageHeader + EntityHero + SectionBand.
4. **Archetype A (Collection Index)** — adds StickyInPageNav to B.
5. **Archetypes D → E → F** — share FilterSidebar/FilterToolbar; D dense,
   E card variant, F list-with-preview.
6. Extract the hard-coded landing data into `server.ts` / `queries.ts` per
   feature so SSR/SSG and caches work correctly.

> Note: where the new templates live (new feature folders vs. expanding
> `landing`) is intentionally left open. Pick it when we start coding. For
> layout analysis, the archetypes and blocks above are the source of truth.

---

## Open Questions (to resolve before coding)

- Should the bands be promoted out of `features/landing` into a generic
  `components/common` `SectionBand` set, or stay in `landing` and be imported?
- Full-text search across page types: one global search surface (popover) or
  per-page `FilterToolbar` search only?
- Data source: is the lab's content in Supabase (`src/utils/supabase.ts`), or
  hard-coded/markdown for now? Sets whether `server.ts` queries a DB or reads
  static files.
- Pagination style: offset-based numbered, or "load more"/infinite (affects
  D/E route data shape).
