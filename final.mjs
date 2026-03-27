import puppeteer from "puppeteer";
import { join } from "path";
const outDir = "./temporary screenshots";
const browser = await puppeteer.launch({ headless: true, args: ["--no-sandbox"] });
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
await page.goto("http://localhost:3001", { waitUntil: "networkidle0", timeout: 30000 });
await new Promise(r => setTimeout(r, 2500));
const h = await page.evaluate(() => document.body.scrollHeight);
console.log("Height:", h);
const pts = [0, Math.round(h*0.2), Math.round(h*0.42), Math.round(h*0.63), Math.round(h*0.82), h-900];
const names = ["hero","overview","amenities-gallery","outdoor-location","enquiry","footer"];
for (let i = 0; i < pts.length; i++) {
  await page.evaluate(y => window.scrollTo(0, y), pts[i]);
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: join(outDir, `screenshot-${i+1}-${names[i]}.png`) });
  console.log("Saved:", names[i]);
}
await browser.close();
