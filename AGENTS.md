# Agent Instructions

Fast entry point for agents. The detailed source of truth lives in `docs/handbook/`. Read the matching doc before writing code; this file only lists the invariants you must respect even before opening a doc.

## Read Order

1. `docs/handbook/00_index.md` — index + core decisions.
2. The handbook page matching your task:

| Task | Doc |
|---|---|
| Stack, environment, TypeScript setup | `docs/handbook/01_project_overview.md` |
| Architecture, feature boundaries, route orchestration, route tree conventions | `docs/handbook/02_architecture.md` |
| Building/refactoring a feature module | `docs/handbook/03_feature_development.md` |
| Data fetching, loaders, SSR, mutations, Supabase, server boundary | `docs/handbook/04_tanstack_start_query_router.md` |
| Async UI states (loading/error/empty, isPending vs isFetching) | `docs/handbook/05_ui_state_patterns.md` |
| Quality rules, primitives, styling, checks | `docs/handbook/06_quality_rules.md` |
| Development & review checklist | `docs/handbook/07_development_checklist.md` |
| Zustand client state & SSR rules | `docs/handbook/08_zustand_best_practices.md` |
| i18n / locale routing | `docs/handbook/09_i18n.md` |
| Design tokens & styling rules | `docs/handbook/10_design_tokens.md` |
| Forms (TanStack Form) | `docs/handbook/11_tanstack_form.md` |
| Tables (TanStack Table v9) | `docs/handbook/12_tanstack_table.md` |

Project-specific references (not part of the base): `docs/project/`.

## Invariants

These hold for every change. Details and rationale are in the linked docs.

- **Feature-based architecture**: feature modules own feature-local code under `src/features/[feature]/` (`components/`, `server.ts`, `functions.ts`, `queries.ts`, `schemas.ts`, `index.ts`). Routes own cross-feature page composition. (`02_architecture.md`)
- **Barrels are client-safe**: `index.ts` must never export `server.ts` or server-only modules. Use `@/*` imports. (`02_architecture.md`, `04`)
- **Cross-feature data flows through props**: feature components never fetch another feature's data; routes/layouts load it and pass data + loading/error + callbacks. (`02_architecture.md`, `03`)
- **Query functions resolve valid data or throw** — never return `null`/`[]`/fallbacks for failures. Failed queries are never empty states. (`04`, `05`)
- **Loader decides criticality**: critical data = `loader` + awaited `context.queryClient.query(...)` + `useSuspenseQuery`; secondary = fire-and-forget `queryClient.query(...).catch(noop)` or local `useQuery` with local states. (`04`)
- **No module-level `QueryClient` singleton** — use `createQueryClient()` per request lifecycle. (`04`)
- **Suspense queries don't use `enabled`**; optional/inline queries may. (`04`)
- **Mutations own cache correctness** (invalidation/optimistic/cache writes); **components own UX** (toasts/dialog/navigation). (`04`)
- **State boundary**: TanStack Query owns server state; Zustand owns synchronous client UI state only — never mirror server data in Zustand. (`08`)
- **Every async UI distinguishes loading / error / valid-empty**; loading = `<Skeleton>`, error = `<Alert variant="destructive">` + `getErrorMessage`, empty only for valid empty data. (`05`)
- **Supabase**: use the shared client in `src/utils/supabase.ts`; check `error` on every response; translate known no-rows (`PGRST116`) into `notFound()`. (`04`)
- **Server boundary**: a route `beforeLoad` guard is UX, not authorization — protect server functions/endpoints at the boundary. (`04`)

## Checks

Run these after major multi-file work (not after tiny edits):

```bash
pnpm exec biome check --write
pnpm typecheck
pnpm build
pnpm check:encoding
```

## Operational Guardrails

- Prefer small, scoped changes that match existing code patterns.
- Never write source files with PowerShell (`Set-Content`, `Out-File`) — they corrupt UTF-8 into mojibake. Use the edit tool; after a batch regex/shell edit run `pnpm check:encoding`.
- Do not run expensive checks repeatedly for tiny edits unless requested.
- Only commit/amend/push/PR when explicitly asked.