---
name: ui-state-patterns
description: Apply the mandatory async UI state rules. Use when rendering any async surface (lists, tables, cards, widgets) or form actions. Covers loading/error/empty/valid states, compact exceptions, submit-critical dependencies, and Suspense vs local UI.
---

# UI State Patterns

## When to Use

- Rendering a `useQuery` / `useSuspenseQuery` surface.
- Adding loading, error, or empty states.
- Gating an action behind a query that feeds critical form data.

## Principle

Failed data is not empty data.

Every async UI must distinguish:

- loading
- error
- valid empty
- valid data

Do not hide failed queries by defaulting to `[]`, `null`, empty UI, or harmless-looking fallback values.

## Standard Main Content Pattern

Use this for pages, lists, tables, grids, cards, and large content panels.

| State | Component | Rule |
|---|---|---|
| Loading | `<Skeleton>` | Hardcode count/layout to match expected content. Do not map unstable indexes from fetched data. |
| Error | `<Alert variant="destructive">` | Use `getErrorMessage(error, fallback)`. |
| Empty | Full empty state | Use a centered composition with icon, title, description, and optional action button. |

Example:

```tsx
if (isLoading) return <UserListSkeleton />

if (isError) {
  return (
    <Alert variant="destructive">
      <AlertCircle className="size-4" />
      <AlertDescription>
        {getErrorMessage(error, "Could not load users.")}
      </AlertDescription>
    </Alert>
  )
}

if (users.length === 0) {
  return (
    <div className="flex flex-col items-center gap-2 py-12 text-center">
      <UsersIcon className="size-12 text-muted-foreground/50" />
      <p className="text-lg font-medium">No users yet</p>
      <p className="text-sm text-muted-foreground">
        Add or invite users to start collaborating.
      </p>
      <Button className="mt-2">Invite user</Button>
    </div>
  )
}
```

## Compact UI Exceptions

Use compact state UI only when a full `Alert` or `Empty` would break layout flow:

- sidebars
- headers
- inline status rows
- table cells
- badges
- small widgets
- combobox helper areas
- popover rows

Compact loading:

```tsx
<Skeleton className="h-4 w-24" />
```

Compact error:

```tsx
<div className="flex items-center gap-1.5 text-xs text-destructive">
  <AlertCircle className="size-3.5 shrink-0" />
  <span>{getErrorMessage(error, "Could not load data.")}</span>
</div>
```

Compact empty:

```tsx
<p className="text-xs text-muted-foreground">No items yet.</p>
```

## Submit-Critical Query Rule

Some optional-looking queries still feed critical form data. These must block actions while loading or errored.

Examples:

- current user for `user_id`
- user search options
- permission / authorization checks

Rule:

- show a loading state
- show an error state
- disable submit/action when the dependency is loading or errored
- do not fallback to `order: 0`, `user_id: ""`, empty options, or hidden avatars as if the query succeeded

Common failure modes to avoid:

- failed member query -> hidden avatars
- failed user search -> empty search results
- failed config query -> `order: 0`
- failed current user query -> `user_id: ""`

## Suspense vs Local UI

Critical route data:

- route loader uses `ensureQueryData`
- component uses `useSuspenseQuery`
- route error boundary owns error UI

Optional widget data:

- component uses `useQuery`
- component owns loading/error/empty UI

## Empty State Rules

Only show empty UI when the server returned valid empty data.

Do not show empty state when:

- query errored
- auth dependency failed
- required route param is missing
- search API failed
- config query failed

## Loading Rules

- Use `<Skeleton>`, not custom `animate-pulse` markup.
- Hardcode skeleton count and layout.
- Skeleton should preserve layout dimensions and avoid content jumps.
- For compact spaces, an inline skeleton is enough.

## Error Copy

Use:

```ts
getErrorMessage(error, "Fallback message")
```

Do not parse backend payloads in components. Use `getErrorMessage(error, fallback)` and let Supabase/TanStack Query surface the underlying error.
