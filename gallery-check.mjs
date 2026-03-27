import puppeteer from "puppeteer";
import { readdirSync } from "fs";
import { join } from "path";
const outDir = "./temporary screenshots";
const browser = await puppeteer.launch({ headless: true, args: ["--no-sandbox"] });
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
await page.goto("http://localhost:3000", { waitUntil: "networkidle0", timeout: 30000 });
await new Promise(r => setTimeout(r, 1800));
// Scroll to gallery section
await page.evaluate(() => window.scrollTo(0, 4400));
await new Promise(r => setTimeout(r, 1200));
let count = readdirSync(outDir).filter(f => f.startsWith("screenshot-")).length + 1;
await page.screenshot({ path: join(outDir, `screenshot-${count}-gallery-grid.png`) });
// Also check page total height
const height = await page.evaluate(() => document.body.scrollHeight);
console.log("Page height:", height);
console.log("Screenshot saved");
await browser.close();
