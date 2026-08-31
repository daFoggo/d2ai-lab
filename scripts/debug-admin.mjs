import { chromium } from "playwright";

async function check() {
	const browser = await chromium.launch();
	const page = await browser.newPage();

	page.on("console", (msg) => console.log("PAGE LOG:", msg.type(), msg.text()));
	page.on("pageerror", (err) => console.error("PAGE ERROR:", err.message));

	console.log("Navigating to http://localhost:3000/admin ...");
	const resp = await page.goto("http://localhost:3000/admin", { waitUntil: "networkidle" });
	console.log("Response status:", resp.status());
	console.log("Current URL:", page.url());
	console.log("Body text snippet:", (await page.textContent("body")).slice(0, 300));
	console.log("Topbar exists:", (await page.$("[data-slot='dashboard-topbar']")) !== null);
	console.log("Sidebar exists:", (await page.$("[data-sidebar='sidebar']")) !== null);

	await page.screenshot({ path: "C:/Users/Foggo/.gemini/antigravity/brain/0101f5c5-4159-474b-b7ef-e0262e34084b/screenshots/admin-debug.png" });
	await browser.close();
}

check();
