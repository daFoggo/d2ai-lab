# Typography & Spacing Standards

> Bộ quy chuẩn typography và spacing cho startcn-base Dashboard, tham khảo shadcn/ui base typography và phân tích từ layout Supabase.
> Chỉ tập trung 2 phần: **Typography** và **Spacing**. Các phần khác (color, shadow, motion) sẽ bổ sung sau.

---

## 1. Typography

### Font Stack

Dự án đã có sẵn 3 font variable:

| Token | Font | Dùng cho |
|-------|------|----------|
| `--font-sans` | Geist Variable | Body, heading, UI text |
| `--font-mono` | Geist Mono Variable | Code, data values, IDs, timestamps |
| `--font-title` | Funnel Display Variable | Brand logo, marketing headline (ít dùng trong dashboard) |

**Quy tắc:**

- Dashboard chủ yếu dùng `font-sans`.
- Chỉ dùng `font-mono` cho: ID, connection string, database column type, log timestamp, metric value.
- Không dùng `font-title` cho UI text thông thường.

### Type Scale

Chỉ dùng **Tailwind default font sizes**, không dùng arbitrary values.

| Token | Tailwind class | Size | Line Height | Weight | Tracking | Dùng cho |
|-------|---------------|------|-------------|--------|----------|----------|
| `display` | `text-4xl` | 36px | 1.1 | 700 (bold) | `tracking-tighter` | Empty state hero |
| `page-title` | `text-3xl` | 30px | 1.2 | 600 (semibold) | `tracking-tight` | Tiêu đề page |
| `section-title` | `text-xl` | 20px | 1.3 | 600 (semibold) | `tracking-tight` | Tiêu đề section |
| `card-title` | `text-base` | 16px | 1.4 | 600 (semibold) | — | Tên organization, project, table |
| `body` | `text-sm` | 14px | 1.5 | 400 (normal) | — | Description, metadata |
| `body-sm` | `text-sm` | 14px | 1.5 | 400 (normal) | — | Secondary text, hint |
| `label` | `text-xs` | 12px | 1.4 | 500 (medium) | — | Form label, sidebar group label |
| `caption` | `text-xs` | 12px | 1.3 | 500 (medium) | `uppercase tracking-wider` | Badge, tag |
| `data` | `text-xs` | 12px | 1.4 | 400 (normal) | — | Code/data với `font-mono` |

### Quy tắc sử dụng cụ thể

#### Headings

```tsx
// Page title — đỉnh trang, chỉ 1 trên mỗi page
<h1 className="text-3xl font-semibold tracking-tight">

// Section title — chia vùng nội dung lớn
<h2 className="text-xl font-semibold tracking-tight">

// Card title — tên item trong list/grid
<h3 className="text-base font-semibold">
```

#### Body & Meta

```tsx
// Mô tả/metas chính
<p className="text-sm text-muted-foreground">

// Mô tả phụ, hint (cùng size nhưng muted)
<p className="text-sm text-muted-foreground/70">

// Data values
<code className="font-mono text-xs">
```

#### Labels & Badges

```tsx
// Sidebar group label: "DATABASE MANAGEMENT", "CONFIGURATION"
<span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">

// Badge/Tag: "FREE", "PRODUCTION", "BETA", "NEW"
<span className="text-xs font-medium uppercase tracking-wider">
```

### Color & Contrast

| Vai trò | Light mode | Dark mode |
|---------|------------|-----------|
| Primary text | `foreground` | `foreground` |
| Secondary text | `muted-foreground` | `muted-foreground` |
| Active/selected | `foreground` | `foreground` |
| Disabled | `muted-foreground` với `opacity-50` | `muted-foreground` với `opacity-50` |

### Không làm

- Không dùng `font-thin` (100) cho UI text.
- Không dùng `font-black` (900) trong dashboard.
- Không dùng quá 2 font trong cùng một màn hình dashboard.
- Không dùng `italic` cho UI text.
- **Nghiêm cấm font size nhỏ hơn `text-xs` (12px).** `text-xs` là giới hạn dưới, không dùng arbitrary values như `text-[11px]`, `text-[10px]`, `text-[0.625rem]`.

---

## 2. Spacing

### Base Spacing Scale

| Token | Value | Dùng cho |
|-------|-------|----------|
| `space-1` | 4px | Icon gap, badge padding |
| `space-2` | 8px | Tight gap trong component |
| `space-3` | 12px | Gap giữa các phần tử trong card |
| `space-4` | 16px | Card padding, section gap tiêu chuẩn |
| `space-5` | 20px | Card padding lớn hơn một chút |
| `space-6` | 24px | Gap giữa page title và content |
| `space-8` | 32px | Page padding |
| `space-10` | 40px | Page padding lớn trên màn hình rộng |
| `space-12` | 48px | Section spacing lớn |
| `space-16` | 64px | Marketing/empty state spacing |

### Dashboard Layout Spacing

Dựa trên phân tích từ ảnh Supabase, dùng **Tailwind spacing classes** thuần.

| Vị trí | Tailwind class | Giá trị | Ghi chú |
|--------|---------------|---------|---------|
| Topbar height | `h-14` | 56px | Fixed height |
| Primary sidebar width | `w-64` | 256px | Mở rộng |
| Primary sidebar width (collapsed) | `w-12` | 48px | Chỉ hiện icon |
| Secondary sidebar width | `w-72` | 288px | Sub-navigation |
| Page padding | `p-8` | 32px | Mặc định |
| Page padding (wide ≥1440px) | `p-10` | 40px | Tăng nhẹ trên màn hình lớn |
| Gap title → toolbar | `gap-6` | 24px | |
| Gap toolbar → content | `gap-4` | 16px | |
| Gap giữa cards | `gap-4` | 16px | Grid gap |
| Card padding | `p-4` | 16px | Tiêu chuẩn |
| Card padding (compact) | `p-3` | 12px | Khi nhiều thông tin |
| Sidebar item height | `h-9` | 36px | |
| Sidebar item padding-x | `px-3` | 12px | |
| Toolbar item gap | `gap-3` | 12px | Giữa search, filter, sort, action |

### Spacing Patterns

#### Page Layout

```tsx
// Main content wrapper
<main className="flex-1 p-8">
  <div className="mx-auto max-w-7xl">
    {/* page content */}
  </div>
</main>
```

#### Section Stack

```tsx
<section className="flex flex-col gap-6">
  <h2 className="text-xl font-semibold tracking-tight">Section Title</h2>
  <div className="flex flex-col gap-4">
    {/* content */}
  </div>
</section>
```

#### Toolbar

```tsx
<div className="flex items-center justify-between gap-4">
  <div className="flex items-center gap-3">
    <SearchInput />
    <FilterDropdown />
    <SortDropdown />
  </div>
  <PrimaryActionButton />
</div>
```

#### Card Grid

```tsx
<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
  <Card />
  <Card />
  <Card />
</div>
```

### Z-Index Layers

| Layer | z-index | Dùng cho |
|-------|---------|----------|
| Background | 0 | Page background |
| Content | 10 | Cards, tables |
| Sticky | 20 | Sticky header trong table |
| Topbar | 30 | Fixed topbar |
| Sidebar | 40 | Fixed sidebar |
| Overlay | 50 | Sheet, modal, command palette |
| Tooltip | 60 | Tooltip, popover |

---

## 3. Áp dụng trong code

### Tailwind Classes tham khảo

```tsx
// Page title
<h1 className="text-3xl font-semibold tracking-tight text-foreground">

// Section title
<h2 className="text-xl font-semibold tracking-tight text-foreground">

// Card title
<h3 className="text-base font-semibold text-foreground">

// Body text / description
<p className="text-sm text-muted-foreground">

// Sidebar group label
<span className="px-3 py-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">

// Badge
<span className="text-xs font-medium uppercase tracking-wider">

// Keyboard shortcut
<kbd className="rounded border bg-muted px-1.5 py-0.5 text-xs font-medium">Ctrl K</kbd>
```

### CSS Variables (nếu cần extend sau)

```css
:root {
  --dashboard-topbar-height: 3.5rem;          /* h-14 */
  --dashboard-sidebar-width: 16rem;           /* w-64 */
  --dashboard-sidebar-width-collapsed: 3rem;  /* w-12 */
  --dashboard-secondary-sidebar-width: 18rem; /* w-72 */
  --dashboard-page-padding: 2rem;             /* p-8 */
}
```

Ưu tiên dùng Tailwind classes trực tiếp. CSS variables chỉ dùng khi cần tính toán layout phức tạp hoặc share giữa nhiều component.

---

## 4. Checklist khi viết UI

- [ ] Page title chỉ dùng `text-3xl font-semibold tracking-tight`.
- [ ] Body text mặc định là `text-sm`.
- [ ] Secondary text luôn dùng `text-muted-foreground`.
- [ ] Badge/tag dùng `text-xs font-medium uppercase tracking-wider`.
- [ ] **Không font size nào nhỏ hơn `text-xs` (12px).** Tuyệt đối không dùng `text-[11px]`, `text-[10px]`, `text-[0.625rem]`.
- [ ] Card padding mặc định `p-4`.
- [ ] Gap giữa cards `gap-4`.
- [ ] Page padding `p-8`.
- [ ] Không dùng spacing tùy tiện ngoài scale đã định nghĩa.
- [ ] Ưu tiên Tailwind classes có sẵn, tránh arbitrary values như `text-[...]`, `w-[...rem]`.
