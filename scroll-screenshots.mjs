import puppeteer from "puppeteer";
import { existsSync, mkdirSync, readdirSync } from "fs";
import { join } from "path";

const url = "http://localhost:3000";
const outDir = "./temporary screenshots";
if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });

const browser = await puppeteer.launch({ headless: true, args: ["--no-sandbox"] });
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
await page.goto(url, { waitUntil: "networkidle0", timeout: 30000 });
await new Promise(r => setTimeout(r, 1500));

const sections = [
  { scrollY: 900, name: "overview" },
  { scrollY: 2200, name: "living" },
  { scrollY: 3500, name: "amenities" },
  { scrollY: 5400, name: "gallery" },
  { scrollY: 7200, name: "enquiry" },
];

let count = readdirSync(outDir).filter(f => f.startsWith("screenshot-")).length;
for (const s of sections) {
  await page.evaluate((y) => window.scrollTo(0, y), s.scrollY);
  await new Promise(r => setTimeout(r, 700));
  count++;
  const filename = join(outDir, `screenshot-${count}-${s.name}.png`);
  await page.screenshot({ path: filename });
  console.log(`Saved: ${filename}`);
}
await browser.close();
