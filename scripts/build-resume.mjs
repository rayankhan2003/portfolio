/**
 * Renders resume/resume.html to public/rayan-resume.pdf (the file the site
 * links to).
 *
 *   pnpm resume
 *
 * Uses your installed Google Chrome. To use a different Chromium build, set
 * CHROME_PATH to its executable.
 */
import { chromium } from "playwright-core";
import path from "node:path";
import { pathToFileURL } from "node:url";

const SOURCE = path.join(process.cwd(), "resume", "resume.html");
const OUT = path.join(process.cwd(), "public", "rayan-resume.pdf");

const browser = await chromium.launch(
  process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : { channel: "chrome" },
);
try {
  const page = await browser.newPage();
  await page.goto(pathToFileURL(SOURCE).href, { waitUntil: "load" });
  await page.pdf({ path: OUT, format: "Letter", preferCSSPageSize: true, printBackground: true });
  console.log(`Wrote ${path.relative(process.cwd(), OUT)}`);
} finally {
  await browser.close();
}
