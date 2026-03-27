import puppeteer from "puppeteer";
import { existsSync, readdirSync, mkdirSync } from "fs";
import { join } from "path";

const outDir = "./temporary screenshots";
const browser = await puppeteer.launch({ headless: true, args: ["--no-sandbox"] });
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
await page.goto("http://localhost:3000", { waitUntil: "networkidle0", timeout: 30000 });
await new Promise(r => setTimeout(r, 1500));

const shots = [
  { y: 1800, name: "living-room" },
  { y: 3000, name: "amenities-grid" },
  { y: 4600, name: "gallery-view" },
  { y: 6100, name: "outdoor-feature" },
  { y: 7500, name: "enquiry-form" },
];

let count = readdirSync(outDir).filter(f => f.startsWith("screenshot-")).length;
for (const s of shots) {
  await page.evaluate((y) => window.scrollTo(0, y), s.y);
  await new Promise(r => setTimeout(r, 900));
  count++;
  const f = join(outDir, `screenshot-${count}-${s.name}.png`);
  await page.screenshot({ path: f });
  console.log(f);
}
await browser.close();
