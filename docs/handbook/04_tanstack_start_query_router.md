---
name: tanstack-data-fetching
description: Apply the canonical TanStack Start/Router/Query + Supabase data-fetching patterns. Use when writing or reviewing query functions, query keys/options, route loaders, mutations, or Supabase access. Covers the query contract, loader policy, suspense rules, and QueryClient lifecycle.
---

# TanStack Start, Router, Query, and Supabase Patterns

## When to Use

- Writing a query function, key factory, or `queryOptions`.
- Deciding route loader criticality and Suspense usage.
- Adding a mutation, invalidating caches, or accessing Supabase.

## Approved Stack

- TanStack Start for app/server function integration.
- TanStack Router for routes, loaders, route context, error boundaries, and not-found handling.
- TanStack Query for server-state caching, loading/error states, invalidation, retries, and mutations.
- Supabase JS client for database, auth, and realtime access.
- Zod for validation.

Do not introduce another server-state cache layer.

## Query Function Contract

A query function must either return real data or throw an error.

In practice, this means:

- If the request succeeds, return the payload the UI should actually use.
- If the request fails for a real transport/server/auth problem, let the error bubble up.
- Only catch errors when you are intentionally translating a known domain case, such as `404 -> notFound()`.

Wrong:

```ts
try {
  const { data } = await supabase.from("users").select("*")
  return data ?? []
} catch (error) {
  console.error(error)
  return []
}
```

Correct:

```ts
const { data } = await supabase.from("users").select("*")
return data
```

This repo also has one related pattern for list endpoints: the query function may normalize a missing Supabase payload to an empty list, for example `return data ?? []`. That is not the same as swallowing an error in a `catch` block.

Only catch known domain cases:

```ts
try {
  const { data, error } = await supabase.from("users").select("*").eq("id", userId).single()
  if (error) throw error
  return data
} catch (error) {
  if (error.code === "PGRST116") {
    throw notFound()
  }

  throw error
}
```

That pattern is used for detail resources in this repo: a missing user or key resource becomes `notFound()`, while everything else still fails normally so the route or UI can show the real error state.

## Query Keys

Each feature owns a key factory:

```ts
export const userKeys = {
  all: ["users"] as const,
  me: () => [...userKeys.all, "me"] as const,
  searches: () => [...userKeys.all, "search"] as const,
  search: (q: string) => [...userKeys.searches(), q] as const,
}
```

Use key factory prefixes for invalidation.

## Query Options

Export query options factories:

```ts
export const searchUsersQueryOptions = (q: string) =>
  queryOptions({
    queryKey: userKeys.search(q),
    queryFn: () => searchUsersFn({ data: { q } }),
  })
```

Use the same options in loaders, components, and cache APIs:

```ts
await context.queryClient.query(searchUsersQueryOptions(query))
const { data } = useSuspenseQuery(searchUsersQueryOptions(query))
queryClient.invalidateQueries({ queryKey: userKeys.searches() })
```

## Route Loader Policy

Routes decide criticality.

This is the core mental model:

- Critical data blocks route rendering with an awaited `queryClient.query(...)`.
- Secondary data may be prefetched fire-and-forget, but its component must still render local states.
- Failed query data is never an empty state.
- Suspense must be backed by a loader guarantee.

| Data kind | Loader | Component |
|---|---|---|
| Critical route data | `queryClient.query(...)` (awaited) | `useSuspenseQuery` / `useSuspenseQueries` |
| Secondary widget data | `queryClient.query(...)` fire-and-forget (`void ... .catch(noop)`) | `useQuery` with local states |
| Optional/search/inline data | Usually no blocking loader | `useQuery` with `enabled` |

Do not use `useSuspenseQuery` for data that is only fire-and-forget prefetched.

## Suspense Rules

- Suspense query options should not include `enabled` (`useSuspenseQuery` does not accept `enabled`; it is excluded from its options).
- Route params are the precondition for critical route data.
- Use `enabled` for optional, search, and inline component-local queries.
- Missing critical resources should become `notFound()` only for known 404 cases.
- Unknown failures should propagate to the nearest route error boundary.

> [!NOTE]
> The loader methods `ensureQueryData` and `prefetchQuery` are deprecated in TanStack Query and will be removed in the next major version. Use `queryClient.query(...)` instead: `await` it for critical route data, or fire it off with `void queryClient.query(...).catch(noop)` for secondary data. See the Query prefetching guide.

## Mutation Policy

```ts
const updateProfile = useMutation({
  mutationFn: updateProfileFn,
  onSuccess: async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: userKeys.me() }),
    ])
  },
})
```

Rules:

- Shared mutation hooks own cache correctness.
- Components own UX side effects.
- Avoid `toast` and `router.navigate` inside shared mutation hooks.
- Await invalidation when pending state should last until related cache updates finish.

### Optimistic Updates

For interactions where instant feedback matters (toggles, likes, status changes), use the documented cache workflow in `onMutate` / `onError` / `onSettled`:

```ts
useMutation({
  mutationFn: updateTodoFn,
  onMutate: async (variables) => {
    // 1. Cancel outgoing refetches so they don't overwrite our update
    await queryClient.cancelQueries({ queryKey: todoKeys.detail(variables.id) })
    // 2. Snapshot the previous value
    const previous = queryClient.getQueryData(todoKeys.detail(variables.id))
    // 3. Optimistically update the cache
    queryClient.setQueryData(todoKeys.detail(variables.id), variables)
    // 4. Return the snapshot for rollback
    return { previous }
  },
  onError: (_err, _variables, context) => {
    // Roll back on failure
    queryClient.setQueryData(todoKeys.detail(variables.id), context?.previous)
  },
  onSettled: () => {
    // Revalidate the source of truth
    queryClient.invalidateQueries({ queryKey: todoKeys.detail(variables.id) })
  },
})
```

Rules:

- Always `cancelQueries` first, snapshot with `getQueryData`, then `setQueryData`.
- Roll back from the snapshot in `onError`; invalidate in `onSettled`.
- Update the cache immutably — never mutate data retrieved from the cache in place.
- If the optimistic result is only shown in one place, prefer `variables` + `isPending` from `useMutation` instead (less code).
- Use `useMutationState` + a `mutationKey` when the optimistic result must render in a different component than the mutation.

### Mutation Response → Cache Write

When a mutation response contains the canonical row, write it to the cache directly instead of refetching:

```ts
onSuccess: (data) => {
  queryClient.setQueryData(todoKeys.detail(data.id), data)
}
```

## Parallel vs Serial Queries

- Multiple `useQuery` hooks in the same component run in parallel — fine.
- Multiple `useSuspenseQuery` hooks in the same component run **serially** (each suspends in order) — a request waterfall. Use `useSuspenseQueries` to fetch them in parallel:

```ts
const results = useSuspenseQueries({
  queries: [userQueryOptions(id), postsQueryOptions(id)],
})
```

- Dependent queries (`enabled: !!id`) are also a form of waterfall. Flatten the API into a single request when possible.

## placeholderData vs initialData

- `initialData` is **persisted to the cache** — use it only for real data (e.g. reusing a parent detail query). Never pass placeholder/partial data.
- `placeholderData` is **not persisted** and shows immediately while the real fetch runs. Use it to keep the previous page/list visible:

```ts
queryOptions({
  queryKey: [...],
  queryFn: fetchPage,
  placeholderData: keepPreviousData, // paginated/infinite: keep last data during refetch
})
```

- When using `placeholderData`, the query reports `isPlaceholderData: true` — use it to disable "Next" or dim stale content.

## Loading Indicators: isPending vs isFetching

- `isPending` — no data yet → hard loading state (`<Skeleton>`).
- `isFetching` — background refetch while data exists → lightweight indicator ("Refreshing…"), never a full skeleton.
- Global progress: `useIsFetching()`.

## Query Cancellation

- Query functions receive an `AbortSignal`; pass it to `fetch`/Supabase so in-flight requests can be cancelled:

```ts
queryFn: ({ signal }) => fetch("/api/users", { signal }).then((r) => r.json())
```

- Cancellation does **not** work with Suspense hooks (`useSuspenseQuery`, `useSuspenseQueries`, `useSuspenseInfiniteQuery`).

## QueryClient Lifecycle

SSR-safe pattern:

```ts
export function getRouter() {
  const queryClient = createQueryClient()

  const router = createTanStackRouter({
    routeTree,
    context: { queryClient },
  })

  setupRouterSsrQueryIntegration({
    router,
    queryClient,
    wrapQueryClient: false,
  })

  return router
}
```

Rules:

- Do not import a module-level `queryClient` singleton for user data.
- Create QueryClient through `createQueryClient()`.
- Create it in the router/request lifecycle.
- Pass the same instance to router context and `QueryProvider`.
- Clear query caches from auth mutation and account-switch flows when the signed-in identity changes.

## Supabase Client Rules

Keep the client setup centralized in `src/utils/supabase.ts`.

- Use a single `createClient()` instance with the `VITE_*` env vars.
- Use `select("*")` explicitly instead of relying on default projections.
- Check `error` on every Supabase response; `data` can be `null` on errors.
- For detail resources, use `.single()` and translate known no-row errors (e.g. `PGRST116`) into `notFound()`.
- UI should call `getErrorMessage(error, fallback)` from `src/lib/error.ts`.
- Do not swallow errors into empty arrays. `data ?? []` is only valid after a successful empty response.

Correct:

- Supabase errors propagate to the caller.
- UI calls `getErrorMessage`.
- Query functions return valid data or throw.

Incorrect:

- query functions return fallback data after a Supabase failure.
- swallowing `error` and hiding failed UI behind empty states.
- creating ad-hoc Supabase clients inside features.

## Server Boundary & Middleware (Start)

Server functions are API endpoints. A route `beforeLoad` guard improves route UX but is **not** the security boundary for the data — protect the server function/route that reads or mutates private data.

- Attach auth/authorization at the server function boundary with `createMiddleware()`:

```ts
const authMiddleware = createMiddleware().server(async ({ next }) => {
  // verify the session from a server-trusted source (cookie + DB), then:
  return next({ context: { user } })
})

export const getPrivateData = createServerFn()
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    // context.user is available here; unauthorized callers never reach this
  })
```

- Server function middleware has `.server()`, `.client()`, and `.validator()` phases. Client context is **not** sent to the server unless you pass it with `sendContext`. Shape validation is not authorization.
- If the app defines `src/start.ts` for global middleware, re-add the CSRF middleware — otherwise it is installed automatically.

## Environment Variables & Functions

- Server code reads unprefixed `process.env`; client code only reads `VITE_*`/`PUBLIC_*` (via `import.meta.env`).
- **Read env per-request, inside handlers/loaders** — module-scope `process.env.X` reads run before env exists (undefined) and risk inlining secrets into the client bundle.
- For env-dependent code that must differ server/client, use `createIsomorphicFn()` / `createServerOnlyFn()` from `@tanstack/react-start` — they tree-shake the wrong side and throw if called in the wrong environment.

## Import Protection

Import protection is enabled by default in Start: client bundles reject `**/*.server.*` and `@tanstack/react-start/server`; server bundles reject `**/*.client.*`.

- Keep feature barrels client-safe: `index.ts` must not re-export server-only modules (matches `02_architecture.md`).
- Avoid mixed barrels that export both client-safe and server-only values — split into separate entry points, or the barrel leaks server code into the client (or warns in dev).
- Use `import "@tanstack/react-start/server-only"` at the top of server-only files.

## Selective SSR

- Route `ssr: true` (default) renders on the server. `ssr: false` renders client-only (with `pendingComponent` as the server fallback). `ssr: "data-only"` runs `beforeLoad`/`loader` on the server but renders on the client.
- The loader (`queryClient.query(...)`) only runs on the server when the route's `ssr` setting allows it.
- Inheritance is restrictive-only: a child can make SSR more restrictive, never less.

## Server Routes vs Server Functions

- **Server functions** (`createServerFn`) — for calling server logic from inside the app, with serialization handled for you. Use for mutations/reads from components and loaders.
- **Server routes** (`createFileRoute` + `server.handlers` with GET/POST/...) — HTTP endpoints called from outside the app (webhooks, external clients, raw API). Same file-based routing, params `$id`/`$`, route-level `server.middleware`.

## ISR & Static Prerendering

- ISR in Start uses standard HTTP cache headers (not a framework `revalidate` option): `Cache-Control: public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400` via a route `headers()`.
- `max-age` = browser cache, `s-maxage` = CDN, `stale-while-revalidate` = serve stale while revalidating.
- User-specific pages must use `private`/`no-store` — never let a CDN cache another user's data.
- Static prerender: dynamic routes (`$param`) are excluded from auto-discovery; enable `crawlLinks` or list them in `prerender.pages` explicitly.
