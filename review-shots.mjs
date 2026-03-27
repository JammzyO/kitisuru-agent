import puppeteer from "puppeteer";
import { readdirSync } from "fs";
import { join } from "path";
const outDir = "./temporary screenshots";
const browser = await puppeteer.launch({ headless: true, args: ["--no-sandbox"] });
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
await page.goto("http://localhost:3000", { waitUntil: "networkidle0", timeout: 30000 });
await new Promise(r => setTimeout(r, 2000));
const h = await page.evaluate(() => document.body.scrollHeight);
console.log("Page height:", h);
const shots = [0, 900, 1800, 2700, 3600, h - 1800, h - 900];
let count = readdirSync(outDir).filter(f => f.startsWith("screenshot-")).length;
for (const y of shots) {
  await page.evaluate(sy => window.scrollTo(0, sy), y);
  await new Promise(r => setTimeout(r, 800));
  count++;
  const f = join(outDir, `screenshot-${count}-y${y}.png`);
  await page.screenshot({ path: f });
  console.log("Saved:", f);
}
await browser.close();
