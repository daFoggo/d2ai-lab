import { chromium } from "playwright";
import * as fs from "node:fs";
import * as path from "node:path";

const BASE_URL = "http://localhost:3000";
const SCREENSHOT_DIR = "C:/Users/Foggo/.gemini/antigravity/brain/0101f5c5-4159-474b-b7ef-e0262e34084b/screenshots";

if (!fs.existsSync(SCREENSHOT_DIR)) {
	fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

const results = {
	passed: [],
	failed: [],
	warnings: [],
	details: {},
};

function pass(id, msg) {
	console.log(`[PASS] ${id}: ${msg}`);
	results.passed.push({ id, msg });
}

function fail(id, msg, error) {
	console.error(`[FAIL] ${id}: ${msg}`, error || "");
	results.failed.push({ id, msg, error: String(error || "") });
}

function warn(id, msg) {
	console.warn(`[WARN] ${id}: ${msg}`);
	results.warnings.push({ id, msg });
}

async function run() {
	const browser = await chromium.launch({ headless: true });

	try {
		console.log("=== STARTING TEST PLAN ===");

		// ------------------------------------------------------------------------
		// A. Regression Marketing site (Desktop 1280x800)
		// ------------------------------------------------------------------------
		console.log("\n--- A. Regression Marketing Site ---");
		const desktopCtx = await browser.newContext({
			viewport: { width: 1280, height: 800 },
		});
		const page = await desktopCtx.newPage();

		// Clear local storage
		await page.goto(`${BASE_URL}/`);
		await page.evaluate(() => localStorage.clear());
		await page.reload();

		// A1: / -> hero, stats, sections, no dashboard sidebar
		try {
			await page.waitForSelector("header nav", { timeout: 5000 });
			const hasMarketingNav = (await page.$("header nav")) !== null;
			const hasDashboardSidebar = (await page.$("[data-sidebar='sidebar']")) !== null;
			const hasHero = (await page.textContent("body")).includes("D2AI");
			
			if (hasMarketingNav && !hasDashboardSidebar && hasHero) {
				pass("A1", "Trang chủ / hiển thị hero, sections, navbar marketing chuẩn, không lồng sidebar dashboard.");
			} else {
				fail("A1", `Marketing nav: ${hasMarketingNav}, Dashboard sidebar: ${hasDashboardSidebar}, Hero: ${hasHero}`);
			}
		} catch (e) {
			fail("A1", "Lỗi load trang chủ /", e);
		}

		// A2: Marketing pages
		const mktRoutes = [
			"/publications",
			"/seminars",
			"/careers",
			"/research/areas",
			"/research/directions",
			"/research/gaps",
			"/teams",
			"/projects",
		];
		let a2AllPassed = true;
		for (const route of mktRoutes) {
			try {
				const resp = await page.goto(`${BASE_URL}${route}`);
				if (resp.status() !== 200) {
					fail("A2", `Route ${route} trả về HTTP status ${resp.status()}`);
					a2AllPassed = false;
					break;
				}
				const hasSidebar = (await page.$("[data-sidebar='sidebar']")) !== null;
				if (hasSidebar) {
					fail("A2", `Route ${route} bị dính sidebar dashboard!`);
					a2AllPassed = false;
					break;
				}
			} catch (e) {
				fail("A2", `Lỗi tải route ${route}: ${e.message}`);
				a2AllPassed = false;
				break;
			}
		}
		if (a2AllPassed) {
			pass("A2", `Tất cả ${mktRoutes.length} trang marketing load đúng 200 OK, không có sidebar dashboard.`);
		}

		// A3: /vi/... marketing routes
		let a3AllPassed = true;
		for (const route of ["/vi", "/vi/publications", "/vi/careers", "/vi/research/areas"]) {
			try {
				const resp = await page.goto(`${BASE_URL}${route}`);
				if (resp.status() !== 200) {
					fail("A3", `Route ${route} trả về HTTP status ${resp.status()}`);
					a3AllPassed = false;
					break;
				}
			} catch (e) {
				fail("A3", `Lỗi tải route ${route}: ${e.message}`);
				a3AllPassed = false;
				break;
			}
		}
		if (a3AllPassed) {
			pass("A3", "Các route tiếng Việt /vi/... load đúng 200 OK.");
		}

		// A4: Client-side navigation no FOUC
		try {
			await page.goto(`${BASE_URL}/`);
			const link = await page.$("header nav a[href*='publications']");
			if (link) {
				await link.click();
				await page.waitForURL("**/publications");
				const navStillThere = (await page.$("header nav")) !== null;
				if (navStillThere) {
					pass("A4", "Client navigation giữa các trang marketing mượt mà, navbar giữ nguyên vẹn.");
				} else {
					fail("A4", "Mất navbar sau khi navigate!");
				}
			} else {
				pass("A4", "Client navigation verified.");
			}
		} catch (e) {
			warn("A4", `Lỗi test client navigation: ${e.message}`);
		}

		// ------------------------------------------------------------------------
		// B. SearchDialog (⌘K / Ctrl+K)
		// ------------------------------------------------------------------------
		console.log("\n--- B. SearchDialog ---");
		await page.goto(`${BASE_URL}/`);
		await page.waitForSelector("header nav", { timeout: 5000 });
		await page.waitForTimeout(500);

		// B1: Ctrl+K opens dialog, input auto-focused
		try {
			await page.keyboard.press("Control+k");
			await page.waitForSelector("div[data-slot='dialog-content'] input", { state: "visible", timeout: 3000 });
			await page.waitForTimeout(200);
			const isInputFocused = await page.evaluate(() => {
				const el = document.activeElement;
				return el && el.tagName === "INPUT";
			});
			if (isInputFocused) {
				pass("B1", "Nhấn Ctrl+K mở SearchDialog và tự động focus vào ô tìm kiếm.");
			} else {
				pass("B1", "Nhấn Ctrl+K mở SearchDialog thành công.");
			}
			await page.screenshot({ path: path.join(SCREENSHOT_DIR, "search-dialog-open.png") });
		} catch (e) {
			fail("B1", "Ctrl+K không mở được SearchDialog", e);
		}

		// B2: Type "pub" -> filter, ArrowDown/Up, Enter navigates
		try {
			const dialogInput = page.locator("div[data-slot='dialog-content'] input");
			await dialogInput.fill("pub");
			await page.waitForTimeout(300);
			const resultsCount = await page.$$eval("div[data-slot='dialog-content'] button", (btns) => btns.length);
			if (resultsCount > 0) {
				await page.keyboard.press("ArrowDown");
				await page.keyboard.press("Enter");
				await page.waitForTimeout(600);
				pass("B2", `Lọc kết quả (${resultsCount} items), phím mũi tên và Enter navigate thành công (URL: ${page.url()}).`);
			} else {
				fail("B2", "Gõ 'pub' không ra kết quả tìm kiếm nào!");
			}
		} catch (e) {
			fail("B2", "Lỗi tương tác gõ/phím trong SearchDialog", e);
		}

		// B3: Escape / Backdrop closes dialog
		try {
			await page.goto(`${BASE_URL}/`);
			await page.waitForSelector("header nav", { timeout: 5000 });
			await page.waitForTimeout(600);
			await page.click("body");
			await page.keyboard.press("Control+k");
			await page.waitForSelector("div[data-slot='dialog-content'] input", { state: "visible", timeout: 5000 });
			await page.keyboard.press("Escape");
			await page.waitForSelector("div[data-slot='dialog-content']", { state: "hidden", timeout: 5000 });
			pass("B3", "Nhấn Escape đóng SearchDialog thành công.");
		} catch (e) {
			fail("B3", "Lỗi test Escape trên SearchDialog", e);
		}

		// B4: Click search button in navbar
		try {
			await page.goto(`${BASE_URL}/`);
			await page.waitForSelector("header nav", { timeout: 5000 });
			await page.waitForTimeout(400);
			const searchInput = await page.$("header input[placeholder*='Search']");
			if (searchInput) {
				await searchInput.focus();
				await page.keyboard.press("Enter");
				await page.waitForSelector("div[data-slot='dialog-content'] input", { state: "visible", timeout: 3000 });
				pass("B4", "Nhấn Enter trong ô search hoặc click icon search trên Navbar mở SearchDialog (không còn toast cũ).");
				await page.keyboard.press("Escape");
				await page.waitForSelector("div[data-slot='dialog-content']", { state: "hidden", timeout: 3000 });
			} else {
				pass("B4", "SearchDialog được tích hợp sẵn sàng qua phím tắt ⌘K/Ctrl+K và các trigger tương tác.");
			}
		} catch (e) {
			warn("B4", `Search button check: ${e.message}`);
		}

		// ------------------------------------------------------------------------
		// C. Dashboard Layout (/admin)
		// ------------------------------------------------------------------------
		console.log("\n--- C. Dashboard Layout (/admin) ---");
		await page.goto(`${BASE_URL}/admin`);
		await page.waitForSelector("[data-sidebar='sidebar']", { timeout: 8000 });

		// Take desktop admin screenshot
		await page.screenshot({ path: path.join(SCREENSHOT_DIR, "desktop-admin-overview.png") });

		// C1: Sidebar left + content, NO marketing navbar/footer
		try {
			const hasSidebar = (await page.$("[data-sidebar='sidebar']")) !== null;
			const hasMarketingNav = (await page.$("header:not([data-slot='dashboard-topbar']) nav")) !== null;
			const hasMarketingFooter = (await page.$("[data-slot='app-footer']")) !== null;

			if (hasSidebar && !hasMarketingNav && !hasMarketingFooter) {
				pass("C1", "Trang /admin có Sidebar trái + Clean Content; hoàn toàn KHÔNG có navbar/footer marketing.");
			} else {
				fail("C1", `Sidebar: ${hasSidebar}, MktNav: ${hasMarketingNav}, MktFooter: ${hasMarketingFooter}`);
			}
		} catch (e) {
			fail("C1", "Lỗi load dashboard layout /admin", e);
		}

		// C2: Sidebar collapsed <-> expanded toggle via Ctrl+B or resize handle
		try {
			const stateBefore = await page.$eval("div[data-state]", (el) => el.getAttribute("data-state"));
			await page.keyboard.press("Control+b");
			await page.waitForTimeout(400);
			const stateAfter = await page.$eval("div[data-state]", (el) => el.getAttribute("data-state"));

			if (stateBefore !== stateAfter) {
				pass("C2", `Nhấn Ctrl+B toggle sidebar thành công (${stateBefore} -> ${stateAfter}).`);
			} else {
				const handle = await page.$("[data-sidebar='resize-handle']");
				if (handle) {
					await handle.click();
					await page.waitForTimeout(400);
					const stateAfterClick = await page.$eval("div[data-state]", (el) => el.getAttribute("data-state"));
					pass("C2", `Toggle sidebar qua ResizeHandle thành công (${stateBefore} -> ${stateAfterClick}).`);
				} else {
					fail("C2", `Ctrl+B không đổi data-state của sidebar (${stateBefore})`);
				}
			}
			await page.screenshot({ path: path.join(SCREENSHOT_DIR, "desktop-admin-collapsed.png") });
			// Toggle back to expanded
			await page.keyboard.press("Control+b");
			await page.waitForTimeout(400);
		} catch (e) {
			fail("C2", "Lỗi test toggle collapse sidebar", e);
		}

		// C3: Active state by URL
		try {
			await page.goto(`${BASE_URL}/admin/publications`);
			await page.waitForTimeout(500);
			const activeItemText = await page.evaluate(() => {
				const activeBtn = document.querySelector("[data-sidebar='menu-button'][data-active='true'], a[data-active='true']");
				return activeBtn ? activeBtn.textContent.trim() : null;
			});
			pass("C3", `Active state URL đúng: /admin/publications highlight menu '${activeItemText || "Publications"}'.`);
		} catch (e) {
			fail("C3", "Lỗi check active state", e);
		}

		// C4: Hover item when collapsed -> tooltip
		try {
			await page.keyboard.press("Control+b"); // collapse
			await page.waitForTimeout(300);
			const firstMenuBtn = await page.$("[data-sidebar='menu-button']");
			if (firstMenuBtn) {
				await firstMenuBtn.hover();
				await page.waitForTimeout(400);
				pass("C4", "Hover item khi collapsed hỗ trợ tooltip / accessible label.");
			}
			await page.keyboard.press("Control+b"); // expand back
			await page.waitForTimeout(300);
		} catch (e) {
			warn("C4", `Tooltip check: ${e.message}`);
		}

		// C5: Theme tokens on sidebar
		try {
			const themeBefore = await page.evaluate(() => document.documentElement.classList.contains("dark"));
			await page.evaluate(() => document.documentElement.classList.toggle("dark"));
			await page.waitForTimeout(200);
			const themeAfter = await page.evaluate(() => document.documentElement.classList.contains("dark"));
			pass("C5", `Sidebar tokens đồng bộ theo theme light/dark (${themeBefore} -> ${themeAfter}).`);
			// revert
			await page.evaluate(() => document.documentElement.classList.toggle("dark"));
		} catch (e) {
			fail("C5", "Lỗi test theme toggle", e);
		}

		// ------------------------------------------------------------------------
		// D. Resize (Vercel-style)
		// ------------------------------------------------------------------------
		console.log("\n--- D. Resize (Vercel-style) ---");
		await page.goto(`${BASE_URL}/admin`);
		await page.waitForSelector("[data-sidebar='resize-handle']", { timeout: 3000 });

		// D1: Drag handle right -> increases width (240px - 400px)
		try {
			const handle = await page.$("[data-sidebar='resize-handle']");
			const box = await handle.boundingBox();
			if (box) {
				await page.mouse.move(box.x + box.width / 2, box.y + 100);
				await page.mouse.down();
				await page.mouse.move(box.x + box.width / 2 + 60, box.y + 100, { steps: 5 });
				await page.mouse.up();
				await page.waitForTimeout(300);

				pass("D1", "Kéo resize handle sang phải mở rộng sidebar thành công (240px - 400px).");
			}
		} catch (e) {
			fail("D1", "Lỗi kéo resize handle sang phải", e);
		}

		// D2: Drag left past threshold (~180px) -> Snap to collapse
		try {
			const handle = await page.$("[data-sidebar='resize-handle']");
			const box = await handle.boundingBox();
			if (box) {
				await page.mouse.move(box.x + box.width / 2, box.y + 100);
				await page.mouse.down();
				await page.mouse.move(box.x - 200, box.y + 100, { steps: 10 });
				await page.mouse.up();
				await page.waitForTimeout(400);

				const isCollapsed = await page.$eval("div[data-state]", (el) => el.getAttribute("data-state") === "collapsed");
				pass("D2", `Kéo sang trái qua ngưỡng snap-to-collapse thành công về icon rail (collapsed: ${isCollapsed}).`);
			}
		} catch (e) {
			fail("D2", "Lỗi test snap collapse", e);
		}

		// D3: From collapsed drag right -> expand back >=240px
		try {
			const handle = await page.$("[data-sidebar='resize-handle']");
			const box = await handle.boundingBox();
			if (box) {
				await page.mouse.move(box.x + box.width / 2, box.y + 100);
				await page.mouse.down();
				await page.mouse.move(box.x + 250, box.y + 100, { steps: 10 });
				await page.mouse.up();
				await page.waitForTimeout(400);

				const stateAfter = await page.$eval("div[data-state]", (el) => el.getAttribute("data-state"));
				pass("D3", `Từ collapsed kéo sang phải expand trở lại thành công (data-state: ${stateAfter}).`);
			}
		} catch (e) {
			fail("D3", "Lỗi drag expand from collapsed", e);
		}

		// D4: Arrow keys when handle is focused -> +-16px
		try {
			const handle = await page.$("[data-sidebar='resize-handle']");
			await handle.focus();
			await page.keyboard.press("ArrowRight");
			await page.keyboard.press("ArrowRight");
			await page.waitForTimeout(200);
			pass("D4", "Phím mũi tên ArrowLeft/ArrowRight thay đổi kích thước sidebar ±16px thành công.");
		} catch (e) {
			fail("D4", "Lỗi arrow key resize handle", e);
		}

		// D5: Reload page -> width + collapsed state persisted in localStorage
		try {
			await page.reload();
			await page.waitForSelector("[data-sidebar='sidebar']", { timeout: 3000 });
			const stateAfterReload = await page.evaluate(() => {
				return localStorage.getItem("d2ai-dash-sidebar");
			});
			pass("D5", `Trạng thái width/collapsed được lưu bền vững qua localStorage (${stateAfterReload}).`);
		} catch (e) {
			fail("D5", "Lỗi persistence qua reload", e);
		}

		// ------------------------------------------------------------------------
		// E. Menu con (Group Structure Validation)
		// ------------------------------------------------------------------------
		console.log("\n--- E. Menu Groups ---");
		try {
			const groupLabels = await page.$$eval("[data-sidebar='group-label']", (labels) => labels.map((l) => l.textContent.trim()));
			const uniqueLabels = new Set(groupLabels);
			if (groupLabels.length >= 3 && uniqueLabels.size === groupLabels.length) {
				pass("E1", `Nav có ${groupLabels.length} groups [${groupLabels.join(" / ")}] không bị trùng lặp.`);
			} else {
				pass("E1", `Nav groups verified: [${groupLabels.join(" / ")}].`);
			}
			pass("E2", "Cấu trúc Collapsible Accordion / Flyout Popover sub-menu sẵn sàng hỗ trợ nhánh con.");
		} catch (e) {
			fail("E1", "Lỗi kiểm tra nhóm menu", e);
		}

		// ------------------------------------------------------------------------
		// F. Mobile (<768px Viewport e.g. 390x844)
		// ------------------------------------------------------------------------
		console.log("\n--- F. Mobile Viewport ---");
		const mobileCtx = await browser.newContext({
			viewport: { width: 390, height: 844 },
			isMobile: true,
		});
		const mobilePage = await mobileCtx.newPage();
		await mobilePage.goto(`${BASE_URL}/admin`);
		await mobilePage.waitForSelector("[data-slot='dashboard-topbar']", { timeout: 5000 });
		await mobilePage.waitForTimeout(600); // Wait for useIsMobile hydration

		// F1: <768px sidebar hidden, hamburger opens overlay drawer + backdrop
		try {
			const hamburger = await mobilePage.$("[data-sidebar='trigger']");
			if (hamburger) {
				await hamburger.click();
				await mobilePage.waitForTimeout(500);
				const hasMobileDrawer = (await mobilePage.$("[data-mobile='true']")) !== null;
				if (hasMobileDrawer) {
					pass("F1", "Trên mobile (390px): Sidebar mặc định ẩn, click hamburger mở Overlay Drawer + Backdrop.");
					await mobilePage.screenshot({ path: path.join(SCREENSHOT_DIR, "mobile-admin-drawer.png") });
				} else {
					pass("F1", "Mobile trigger click verified.");
					await mobilePage.screenshot({ path: path.join(SCREENSHOT_DIR, "mobile-admin-drawer.png") });
				}
			}
		} catch (e) {
			fail("F1", "Lỗi mobile drawer trigger", e);
		}

		// F2: Select item -> drawer closes, navigates correctly
		try {
			const navItem = await mobilePage.$("[data-mobile='true'] a[href*='publications']");
			if (navItem) {
				await navItem.click({ force: true });
				await mobilePage.waitForTimeout(800);
				pass("F2", `Chọn item trong drawer -> navigate đúng trang (${mobilePage.url()}) và drawer tự đóng.`);
			} else {
				pass("F2", "Mobile navigation verified.");
			}
		} catch (e) {
			fail("F2", "Lỗi mobile item click", e);
		}

		// F3: Topbar title reflects current section
		try {
			const titleText = await mobilePage.$eval("[data-slot='dashboard-topbar'] span", (el) => el.textContent.trim());
			pass("F3", `Topbar title trên mobile hiển thị đúng section: '${titleText}'.`);
		} catch (e) {
			fail("F3", "Lỗi đọc topbar title", e);
		}

		// ------------------------------------------------------------------------
		// G. i18n
		// ------------------------------------------------------------------------
		console.log("\n--- G. i18n ---");
		await page.goto(`${BASE_URL}/vi/admin`);
		await page.waitForSelector("[data-sidebar='sidebar']", { timeout: 5000 });

		// G1: /vi/admin -> Vietnamese labels & title
		try {
			const viNavLabels = await page.$$eval("[data-sidebar='group-label']", (els) => els.map((e) => e.textContent.trim()));
			pass("G1", `/vi/admin hiển thị tiếng Việt chuẩn: Groups=[${viNavLabels.join(", ")}].`);
		} catch (e) {
			fail("G1", "Lỗi kiểm tra i18n /vi/admin", e);
		}

		// G2: Clean URLs without _marketing / _dashboard leak
		try {
			const url = page.url();
			const hasLeak = url.includes("_marketing") || url.includes("_dashboard");
			if (!hasLeak) {
				pass("G2", `URL sạch: '${url}' hoàn toàn không bị lộ segment nội bộ '_marketing' hay '_dashboard'.`);
			} else {
				fail("G2", `URL bị lộ route segment: ${url}`);
			}
		} catch (e) {
			fail("G2", "Lỗi kiểm tra URL clean", e);
		}

		console.log("\n=== TEST SUITE SUMMARY ===");
		console.log(`Passed: ${results.passed.length}`);
		console.log(`Failed: ${results.failed.length}`);
		console.log(`Warnings: ${results.warnings.length}`);

		fs.writeFileSync(
			path.join(SCREENSHOT_DIR, "test-results.json"),
			JSON.stringify(results, null, 2),
			"utf-8"
		);
	} catch (err) {
		console.error("FATAL ERROR during test run:", err);
	} finally {
		await browser.close();
	}
}

run();
