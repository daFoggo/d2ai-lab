# Tài liệu Đặc tả Hành vi Sidebar Dashboard (Sidebar Behavior Specification)

Tài liệu này tập trung chi tiết vào toàn bộ **kiến trúc kỹ thuật, hành vi tương tác (behaviors), giải phẫu thành phần (anatomy) và mã nguồn triển khai** của hệ thống Sidebar Dashboard hiện đại (reverse-engineered từ Vercel Dashboard).

---

## MỤC LỤC

1. [Cơ chế Khởi tạo Chống giật Layout (Zero-FOUC Strategy)](#1-cơ-chế-khởi-tạo-chống-giật-layout-zero-fouc-strategy)
2. [Hành vi Co giãn & Chỉnh kích thước (Resize & Collapse Behavior)](#2-hành-vi-co-giãn--chỉnh-kích-thước-resize--collapse-behavior)
   - [Thông số kích thước & Ràng buộc (Constraints)](#thông-số-kích-thước--ràng-buộc-constraints)
   - [Kéo thả đổi kích thước (Drag-to-Resize) & Hitbox](#kéo-thả-đổi-kích-thước-drag-to-resize--hitbox)
   - [Cơ chế Tự động Bắt dính để Thu gọn (Snap-to-Collapse)](#cơ-chế-tự-động-bắt-dính-để-thu-gọn-snap-to-collapse)
3. [Phím tắt Toàn cục & Khả năng Tiếp cận (Keyboard & A11y)](#3-phím-tắt-toàn-cục--khả-năng-tiếp-cận-keyboard--a11y)
4. [Giải phẫu & Hành vi của Menu Item](#4-giải-phẫu--hành-vi-của-menu-item)
   - [Cấu trúc 1 Menu Item đơn lẻ](#cấu-trúc-1-menu-item-đơn-lẻ)
   - [Bảng trạng thái tương tác (Interactive States)](#bảng-trạng-thái-tương-tác-interactive-states)
5. [Hành vi Menu Item có Sub-items (Cấp con)](#5-hành-vi-menu-item-có-sub-items-cấp-con)
   - [Kịch bản A: Khi Sidebar MỞ (Expanded) -> Dạng Accordion Slide-Down](#kịch-bản-a-khi-sidebar-mở-expanded---dạng-accordion-slide-down)
   - [Kịch bản B: Khi Sidebar GẬP (Collapsed) -> Dạng Flyout Dropdown Popover](#kịch-bản-b-khi-sidebar-gập-collapsed---dạng-flyout-dropdown-popover)
6. [Kiến trúc Tương tác Dual-Panel (Sidebar Trái + AI Drawer Phải)](#6-kiến-trúc-tương-tác-dual-panel-sidebar-trái--ai-drawer-phải)
7. [Mã nguồn Triển khai Mẫu Hoàn chỉnh (React + Tailwind + Radix)](#7-mã-nguồn-triển-khai-mẫu-hoàn-chỉnh-react--tailwind--radix)

---

## 1. Cơ chế Khởi tạo Chống giật Layout (Zero-FOUC Strategy)

Để tránh hiện tượng giật giao diện (Cumulative Layout Shift - CLS) và hiện tượng nháy layout (Flash of Unstyled Content - FOUC) khi tải lại trang, kích thước và trạng thái sidebar được khởi tạo **đồng bộ ngay trong thẻ `<head>`** trước khi React mount/hydrate:

```html
<script>
  (()=>{
    try {
      let savedWidth = Number(localStorage.getItem("vc-dash-sidebar-width") || 256);
      if (Number.isNaN(savedWidth)) return;
      
      // Ràng buộc trong khoảng an toàn (240px - 400px), hoặc 0px nếu đã gập
      let validWidth = savedWidth <= 0 ? 0 : Math.max(240, Math.min(savedWidth, 400));
      
      // Gán biến CSS trực tiếp lên thẻ <html>
      document.documentElement.style.setProperty("--raw-sidebar-width", `${validWidth}px`);
      if (!validWidth) {
        document.documentElement.classList.add("sidebar-collapsed");
      }
    } catch {}
  })();
</script>
```

### Nguyên lý hoạt động:
* Thẻ `<main>` và các container sử dụng CSS custom property: `width: calc(100vw - var(--raw-sidebar-width))`.
* Layout hiển thị đúng độ rộng mong muốn ngay từ **Frame đầu tiên** mà không bị gián đoạn hay co giãn lại sau khi JavaScript chạy xong.

---

## 2. Hành vi Co giãn & Chỉnh kích thước (Resize & Collapse Behavior)

### Thông số kích thước & Ràng buộc (Constraints)
* **Độ rộng mặc định (Default Width):** `256px`
* **Độ rộng tối thiểu (Min Width):** `240px`
* **Độ rộng tối đa (Max Width):** `400px`
* **Độ rộng khi gập (Collapsed / Icon-only):** `48px` (hoặc `0px` tùy chế độ ẩn hoàn toàn).

---

### Kéo thả đổi kích thước (Drag-to-Resize) & Hitbox

```
Sidebar Body                       Resize Handle (Rail)          Main Content
+-----------------------------+    +---------------+             +-----------------+
|                             |    |               |             |                 |
|  [Icon] Projects            | :  | █ (1px line)  |             |                 |
|  [Icon] Deployments         | :  |   [ 8-12px ]  | <--- Drag   |                 |
|                             | :  |   Hitbox Area |  col-resize |                 |
+-----------------------------+    +---------------+             +-----------------+
```

* **Thanh viền phân cách (Visual Border):** Chỉ dày `1px` (`border-r border-border`).
* **Vùng tương tác chuột (Hitbox Area):** Rộng `8px` đến `12px` đặt nổi chính giữa đường viền, có con trỏ chuột `cursor: col-resize`.
* **Sự kiện chuột:**
  - `mousedown`: Bắt đầu kéo, thêm class `select-none` lên toàn bộ trang để tránh bôi đen văn bản khi đang kéo.
  - `mousemove`: Cập nhật liên tục biến `--raw-sidebar-width` trên `<html>`.
  - `mouseup`: Kết thúc kéo, lưu giá trị chiều rộng mới vào `localStorage` (`vc-dash-sidebar-width`).

---

### Cơ chế Tự động Bắt dính để Thu gọn (Snap-to-Collapse)

* Khi người dùng kéo sidebar thu nhỏ về phía bên trái:
  - Nếu độ rộng $> 180\text{px}$: Sidebar giữ mức tối thiểu là `240px`.
  - Nếu người dùng tiếp tục kéo dạt về $< 180\text{px}$: Sidebar sẽ **tự động "hít" (snap) về `0px`**, thêm class `sidebar-collapsed` và chuyển sang trạng thái gập.

---

## 3. Phím tắt Toàn cục & Khả năng Tiếp cận (Keyboard & A11y)

* **`Cmd + B`** (macOS) / **`Ctrl + B`** (Windows/Linux): Toggle nhanh trạng thái đóng/mở Sidebar từ bất kỳ vị trí nào trên ứng dụng.
* **`Cmd + K`** / **`Ctrl + K`**: Mở Command Palette / Global Search.
* **Skip to Content Link:** Khi người dùng sử dụng bàn phím (nhấn `Tab`), link ẩn `Skip to content` (`[data-testid="geistcn/skip-nav-link"]`) sẽ hiện lên góc trái cho phép người dùng lướt qua nhanh toàn bộ sidebar đến thẳng nội dung chính.

---

## 4. Giải phẫu & Hành vi của Menu Item

### Cấu trúc 1 Menu Item đơn lẻ

```
+-------------------------------------------------------------------------+
| [Icon]   Tên Menu Item              [Badge]   [Action Button / Shortcut]|
|  16px    flex-1 truncate            "Beta"          "..." / "⌘P"       |
+-------------------------------------------------------------------------+
```

1. **Leading Icon (16px - 18px):** Cố định kích thước (`shrink-0`). Khi sidebar gập lại, icon tự động căn giữa cột.
2. **Label Text:** Chiếm `flex-1`, tự động thêm dấu ba chấm (`truncate`) nếu tên vượt quá chiều rộng của sidebar.
3. **Badge / Counter (Tùy chọn):** Thẻ nhỏ hiển thị nhãn `"New"`, `"Beta"`, hoặc số đếm `"12"`.
4. **Action Button / Shortcut (Tùy chọn):** 
   - Mặc định: Ẩn hoặc hiển thị phím tắt (`⌘P`).
   - Khi hover vào item: Nút `...` (More options) hiện lên (`group-hover:opacity-100`) để mở popup thao tác nhanh (Ghim, Đổi tên, Xóa).

---

### Bảng trạng thái tương tác (Interactive States)

| Trạng thái | Giao diện thị giác (Visual UI) | Thuộc tính & Hành vi |
| :--- | :--- | :--- |
| **Default** | Chữ xám vừa (`text-muted-foreground`), nền trong suốt | `aria-selected="false"` |
| **Hover** | Nền đổi màu xám nhẹ (`bg-accent` / `hover:bg-muted`), chữ sáng rõ | Hiệu ứng transition 150ms |
| **Active / Selected** | Nền xám đậm hoặc viền nổi bật, chữ sáng (`text-foreground font-medium`) | `aria-current="page"` |
| **Focus-Visible** | Viền sáng `ring-2 ring-primary ring-offset-2` khi dùng phím `Tab` | Chuẩn A11y |
| **Collapsed (Gập)** | Chữ và badge ẩn hoàn toàn (`w-0 opacity-0`). **Hover vào icon sẽ bật Floating Tooltip ra bên phải**. | Kích hoạt Radix Tooltip |

---

## 5. Hành vi Menu Item có Sub-items (Cấp con)

Khi một mục menu chứa các mục con (ví dụ: mục **Settings** chứa *General, Domains, Billing*), hệ thống xử lý theo **2 kịch bản hoàn toàn khác nhau** dựa trên trạng thái của Sidebar:

```
                  ┌───────────────────────────────────────────────┐
                  │ Menu Item có Sub-items (ví dụ mục "Settings") │
                  └───────────────────────┬───────────────────────┘
                                          │
                   Sidebar đang MỞ hay GẬP?
                   ┌──────────────────────┴──────────────────────┐
                   ▼                                             ▼
       [Sidebar đang MỞ (Expanded)]                  [Sidebar đang GẬP (Collapsed)]
                   │                                             │
      ┌────────────┴────────────┐                   ┌────────────┴────────────┐
      ▼                         ▼                   ▼                         ▼
  Accordion Slide-Down     Tree Rail Line       Flyout Popover          Header + List
  (Chevron xoay 90°,      (Đường kẻ dọc chỉ    (Bật floating menu     (Tên menu cha +
   trượt mượt xuống)       thị phân cấp con)    ra bên phải icon)      danh sách sub-items)
```

---

### Kịch bản A: Khi Sidebar MỞ (Expanded) -> Dạng Accordion Slide-Down

```
[>] Projects                 <- Chưa mở (Chevron trỏ sang phải)
 ⌵  Settings                 <- Đã click mở (Chevron xoay 90° xuống dưới)
    │── General              <- Sub-item 1 (Thụt lề pl-6, font-size nhỏ hơn)
    │── Domains              <- Sub-item 2
    └── Billing              <- Sub-item 3 (Đường kẻ nhánh cây visual)
```

1. **Hiệu ứng Chevron:** Đuôi Menu cha có icon mũi tên `ChevronRight`. Khi click, icon xoay 90 độ xuống dưới (`transition-transform duration-200 rotate-90`).
2. **Animation trượt mượt mà:** Khối Sub-menu trượt mở từ chiều cao `0px` xuống chiều cao thực tế bằng CSS Transition.
3. **Đường kẻ phân cấp (Tree Rail Indicator):**
   - Các sub-items thụt lề vào trong (`pl-6` đến `pl-8`).
   - Có một đường kẻ dọc mỏng (`border-l border-border/50`) chạy dọc bên trái các sub-items.
4. **Tự động mở theo URL (Auto-expanded):** Khi tải trang ở URL `/settings/billing`, menu cha **Settings** tự động ở trạng thái mở sẵn.

---

### Kịch bản B: Khi Sidebar GẬP (Collapsed) -> Dạng Flyout Dropdown Popover

Vì sidebar lúc này là thanh icon hẹp, không thể mở accordion dọc (sẽ làm vỡ layout). Hệ thống tự động chuyển sang dạng **Flyout Popover nổi ra ngoài**:

```
Sidebar Hẹp (Gập)             Flyout Popover bay ra ngoài (z-50)
+-----+                     +---------------------------------------+
| (H) |                     |  Settings                             |
+-----+                     |  -----------------------------------  |
| [⚙] | ------------->      |  • General                            |
+-----+  Hover / Click      |  • Domains                            |
| (D) |                     |  • Billing (Active)                   |
+-----+                     +---------------------------------------+
```

1. Khi người dùng **Hover** hoặc **Click** vào icon bánh răng `[⚙]`:
   - Một popup nổi (`DropdownMenuContent` / `Popover`) lập tức bay ra phía bên phải của icon (`side="right" align="start"`).
2. Nội dung trong Popover:
   - Trên cùng: Tên tiêu đề Menu cha (`Settings`).
   - Phía dưới: Danh sách toàn bộ các sub-items để người dùng click chuyển trang trực tiếp.

---

## 6. Kiến trúc Tương tác Dual-Panel (Sidebar Trái + AI Drawer Phải)

Hệ thống dashboard hỗ trợ mở đồng thời Sidebar điều hướng bên trái và AI Assistant Panel bên phải:

* **Sidebar Trái:** Biến `--raw-sidebar-width` (240px - 400px).
* **AI Panel Phải:** Biến `--raw-omniagent-panel-width` (mặc định 420px).
* **Công thức tính vùng hiển thị chính (`<main>`):**
  $$\text{Width} = 100\text{vw} - \text{var}(--\text{raw-sidebar-width}) - \text{var}(--\text{raw-omniagent-panel-width})$$

---

## 7. Mã nguồn Triển khai Mẫu Hoàn chỉnh (React + Tailwind + Radix)

Dưới đây là component mẫu xử lý đầy đủ cả Menu đơn lẻ và Menu con đa cấp (tự động chuyển đổi giữa Accordion khi mở và Popover khi gập):

```tsx
import * as React from "react"
import { ChevronRight, Settings, Folder, MoreHorizontal, Database } from "lucide-react"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarMenuAction,
  SidebarMenuBadge,
  useSidebar,
} from "@/components/ui/sidebar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// 1. Menu Item đơn lẻ có Badge & Action Button
export function SingleMenuItem() {
  return (
    <SidebarMenuItem>
      <SidebarMenuButton tooltip="Projects" isActive={true}>
        <Folder className="size-4" />
        <span>Projects</span>
      </SidebarMenuButton>
      
      <SidebarMenuBadge>12</SidebarMenuBadge>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <SidebarMenuAction showOnHover>
            <MoreHorizontal className="size-4" />
            <span className="sr-only">Tùy chọn</span>
          </SidebarMenuAction>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="right" align="start">
          <DropdownMenuItem>Tạo Project mới</DropdownMenuItem>
          <DropdownMenuItem>Ghim lên đầu</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  )
}

// 2. Menu Item CÓ Sub-Items (Tự động đổi giữa Accordion và Flyout Popover)
export function CollapsibleMenuItem() {
  const { state } = useSidebar() // "expanded" | "collapsed"
  const [isOpen, setIsOpen] = React.useState(false)

  // A. KHI SIDEBAR GẬP (Collapsed): Chuyển thành Flyout Popover
  if (state === "collapsed") {
    return (
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton tooltip="Database Settings">
              <Database className="size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="right" align="start" className="min-w-48 shadow-lg">
            <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground border-b mb-1">
              Database Settings
            </div>
            <DropdownMenuItem asChild><a href="/database/tables">Tables & Views</a></DropdownMenuItem>
            <DropdownMenuItem asChild><a href="/database/roles">Roles & Privileges</a></DropdownMenuItem>
            <DropdownMenuItem asChild><a href="/database/backups">Backups & PITR</a></DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    )
  }

  // B. KHI SIDEBAR MỞ (Expanded): Hiển thị dạng Accordion trượt xuống
  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="group/collapsible">
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton>
            <Database className="size-4" />
            <span>Database</span>
            <ChevronRight className="ml-auto size-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
          </SidebarMenuButton>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <SidebarMenuSub>
            <SidebarMenuSubItem>
              <SidebarMenuSubButton asChild isActive={true}>
                <a href="/database/tables"><span>Tables & Views</span></a>
              </SidebarMenuSubButton>
            </SidebarMenuSubItem>
            <SidebarMenuSubItem>
              <SidebarMenuSubButton asChild>
                <a href="/database/roles"><span>Roles & Privileges</span></a>
              </SidebarMenuSubButton>
            </SidebarMenuSubItem>
            <SidebarMenuSubItem>
              <SidebarMenuSubButton asChild>
                <a href="/database/backups"><span>Backups & PITR</span></a>
              </SidebarMenuSubButton>
            </SidebarMenuSubItem>
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  )
}
```
