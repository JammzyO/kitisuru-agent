import puppeteer from "puppeteer";
import { join } from "path";

const browser = await puppeteer.launch({ headless: true, args: ["--no-sandbox"] });
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
await page.goto("http://localhost:3000", { waitUntil: "networkidle0", timeout: 30000 });
await new Promise(r => setTimeout(r, 2000));
await page.screenshot({ path: "temporary screenshots/screenshot-7-fullpage.png", fullPage: true });
await browser.close();
console.log("Full page screenshot saved");
