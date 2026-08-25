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
await context.queryClient.ensureQueryData(searchUsersQueryOptions(query))
const { data } = useSuspenseQuery(searchUsersQueryOptions(query))
queryClient.invalidateQueries({ queryKey: userKeys.searches() })
```

## Route Loader Policy

Routes decide criticality.

This is the core mental model:

- Critical data blocks route rendering with `ensureQueryData`.
- Secondary data may be prefetched, but its component must still render local states.
- Failed query data is never an empty state.
- Suspense must be backed by a loader guarantee.

| Data kind | Loader | Component |
|---|---|---|
| Critical route data | `ensureQueryData` | `useSuspenseQuery` / `useSuspenseQueries` |
| Secondary widget data | `prefetchQuery` | `useQuery` with local states |
| Optional/search/inline data | Usually no blocking loader | `useQuery` with `enabled` |

Do not use `useSuspenseQuery` for data that is only fire-and-forget prefetched.

## Suspense Rules

- Suspense query options should not include `enabled`.
- Route params are the precondition for critical route data.
- Use `enabled` for optional, search, and inline component-local queries.
- Missing critical resources should become `notFound()` only for known 404 cases.
- Unknown failures should propagate to the nearest route error boundary.

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
