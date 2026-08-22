# Quality Rules

This document collects consistency and safety rules for startcn-base.

## Checks

Run these after larger changes or before merging:

```bash
pnpm exec biome check --write
pnpm typecheck
pnpm build
```

Do not run expensive checks repeatedly for every tiny edit unless requested.

## Code Safety

- Do not use non-null assertions (`!`) to bypass types.
- Use guard clauses, optional chaining, and safe fallbacks.
- Custom `<button>` elements need explicit `type`.
- Do not use `window.confirm()`; use `AlertDialog`.
- Do not remove focus rings.
- Do not introduce hidden runtime assumptions for route params or query data.

## Styling Rules

- **Nghiêm cấm arbitrary custom values (`className-[...]`)**: Tuyệt đối không dùng các class tùy biến như `w-[460px]`, `max-w-[400px]`, `text-[10px]`, `text-[11px]`, `p-[15px]`, `gap-[10px]`, `min-h-[500px]`.
- **Chuẩn hóa Design Tokens theo Tailwind Scale**:
  - **Font size**: Chỉ dùng `text-xs`, `text-sm`, `text-base`, `text-lg`, `text-xl`, `text-2xl`, `text-3xl`, `text-4xl`, `text-5xl`, `text-6xl`, `text-7xl`, `text-8xl`, `text-9xl`. Giới hạn dưới tối thiểu là `text-xs` (12px), tuyệt đối không dùng font nhỏ hơn.
  - **Spacing & Dimension**: Dùng thang chuẩn 4px (`0, 1, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10, 12, 14, 16, 20, 24...`).
  - **Max/Min Width & Height**: Dùng scale chuẩn (`max-w-xs`, `max-w-sm`, `max-w-md`, `max-w-lg`, `max-w-xl`, `max-w-2xl`, `max-w-4xl`, `max-w-7xl`, `min-h-screen`, `min-h-120`...).
  - **Font weight**: `font-normal` (400), `font-medium` (500), `font-semibold` (600), `font-bold` (700).
- Do not hardcode raw colors such as `#fff`, `rgb(...)`, or `bg-[#...]`.
- Do not hardcode custom z-index values such as `z-[999]`.
- Use Tailwind design tokens and project CSS variables.
- Use @tabler/icons-react only for icons.
- Do not use `<Badge>` for filters because badges do not provide interactive state.

## Component Rules

- Prefer existing `@/components/ui` and `@/components/common` components.
- Add a new component only when existing components cannot be composed cleanly.
- New reusable components should have `data-slot` on the root element.
- Components with two or more variants should use CVA.
- Icon-only buttons need `aria-label` or screen-reader text.
- Inputs must support default, focus, error, disabled, and readonly states.
- Use `aria-invalid` for error states.

## Motion Rules

- Animate transform, opacity, and color.
- Do not animate width, height, or padding.
- Respect reduced motion with `motion-safe:` and `motion-reduce:`.
- Use existing Tailwind/tw-animate-css utilities before adding custom keyframes.

## Review Rules

When reviewing code, prioritize:

1. Runtime bugs and user-visible regressions.
2. Query/data correctness.
3. Error handling and SSR safety.
4. Missing loading/error/empty states.
5. Cache invalidation and mutation side effects.
6. Accessibility and design-system violations.
7. Test or verification gaps.

## Documentation Rules

- Update handbook docs when a repeated pattern or project-wide rule changes.
- Keep `AGENTS.md` as an entry point, not as the full detailed manual.
