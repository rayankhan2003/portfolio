/**
 * Captures portfolio case-study screenshots from a locally running Scan2Help.
 *
 * How to rerun:
 *   1. Start Scan2Help (in /Users/eapple/Developer/Personal/scan2help):
 *        DATABASE_URL="postgresql://eapple@localhost:5432/scan2help" \
 *        NEXT_PUBLIC_BASE_URL="http://localhost:3001" \
 *        ADMIN_EMAILS="admin@example.com" SMTP_HOST="" \
 *        npm run dev -- -p 3001 > /tmp/scan2help.log 2>&1 &
 *   2. From the portfolio root:
 *        S2H_LOG=/tmp/scan2help.log node scripts/capture-scan2help-screenshots.mjs
 *
 * S2H_LOG must point at the Scan2Help server log — in dev its mailer prints
 * magic-link emails there, which this script reads to log in as the demo
 * admin/buyer. Only reserved example.com emails and fake numbers are used.
 * Requires Google Chrome installed (playwright-core "chrome" channel).
 */
import { chromium } from "playwright-core";
import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";

const BASE = process.env.S2H_URL ?? "http://localhost:3001";
const LOG = process.env.S2H_LOG;
const OUT = path.join(process.cwd(), "public", "projects", "scan2help");
const BUYER_EMAIL = "demo@example.com";
const ADMIN_EMAIL = "admin@example.com";

const pngs = [];

function magicLinks() {
  if (!LOG || !fs.existsSync(LOG)) return [];
  const txt = fs.readFileSync(LOG, "utf8");
  return [...txt.matchAll(/🔗 (\S*verify\?token=\S+)/g)].map((m) => m[1]);
}

async function waitForNewMagicLink(prevCount) {
  for (let i = 0; i < 60; i++) {
    const links = magicLinks();
    if (links.length > prevCount) return links[links.length - 1];
    await new Promise((r) => setTimeout(r, 500));
  }
  throw new Error("magic link never appeared in S2H_LOG");
}

async function loginViaMagicLink(page, email) {
  const before = magicLinks().length;
  await page.goto(`${BASE}/login`, { waitUntil: "load" });
  await page.locator('input[type="email"]').fill(email);
  await page.locator('button[type="submit"]').first().click();
  const link = await waitForNewMagicLink(before);
  await page.goto(link, { waitUntil: "load" });
  await page.waitForTimeout(1000);
}

/** hide Next.js dev-tools indicator so screenshots look like production */
async function cleanContext(browser, opts) {
  const ctx = await browser.newContext(opts);
  await ctx.addInitScript(() => {
    const hide = () => {
      const s = document.createElement("style");
      s.textContent = "nextjs-portal{display:none!important}";
      document.documentElement.appendChild(s);
    };
    if (document.readyState !== "loading") hide();
    else document.addEventListener("DOMContentLoaded", hide);
  });
  return ctx;
}

async function shoot(page, name) {
  const file = path.join(OUT, `${name}.png`);
  await page.screenshot({ path: file });
  pngs.push(file);
  console.log("captured", name);
}

async function main() {
  if (!LOG) {
    console.warn(
      "S2H_LOG not set — only public pages will be captured (no admin/dashboard)."
    );
  }
  fs.mkdirSync(OUT, { recursive: true });

  const browser = await chromium.launch({ channel: "chrome", headless: true });
  const desktop = await cleanContext(browser, {
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
    colorScheme: "light",
  });
  const page = await desktop.newPage();

  // 1 — landing (cover)
  await page.goto(`${BASE}/`, { waitUntil: "load" });
  await page.waitForTimeout(1500);
  await shoot(page, "cover");

  // 2 — purchase form, filled with demo data
  await page.goto(`${BASE}/purchase`, { waitUntil: "load" });
  await page.waitForTimeout(800);
  await page.locator('input[type="text"]').first().fill("Demo Customer");
  await page.locator('input[type="tel"]').first().fill("0300 1234567");
  await page.locator('input[type="email"]').first().fill(BUYER_EMAIL);
  await page.waitForTimeout(300);
  await shoot(page, "purchase");

  // 3 — submit → payment instructions / order confirmation
  await page.locator('button[type="submit"]').first().click();
  await page
    .getByText(/JazzCash|EasyPaisa|payment|order/i)
    .first()
    .waitFor({ timeout: 15000 });
  await page.waitForTimeout(800);
  await shoot(page, "order-confirmation");

  let scanUrl = null;

  if (LOG) {
    // 4 — admin approves the pending order
    const adminCtx = await cleanContext(browser, {
      viewport: { width: 1440, height: 900 },
      deviceScaleFactor: 2,
      colorScheme: "light",
    });
    const adminPage = await adminCtx.newPage();
    await loginViaMagicLink(adminPage, ADMIN_EMAIL);
    await adminPage.goto(`${BASE}/admin`, { waitUntil: "load" });
    await adminPage.getByText("Approve").first().waitFor({ timeout: 15000 });
    await adminPage.waitForTimeout(800);
    await shoot(adminPage, "admin-orders");
    adminPage.on("dialog", (d) => d.accept());
    await adminPage.getByText("Approve").first().click();
    await adminPage.waitForTimeout(2500);
    await adminCtx.close();

    // 5 — buyer dashboard with the newly generated QRs
    const buyerCtx = await cleanContext(browser, {
      viewport: { width: 1440, height: 900 },
      deviceScaleFactor: 2,
      colorScheme: "light",
    });
    const buyerPage = await buyerCtx.newPage();
    await loginViaMagicLink(buyerPage, BUYER_EMAIL);
    await buyerPage.goto(`${BASE}/dashboard`, { waitUntil: "load" });
    const qrLink = buyerPage.locator('a[href^="/p/"]').first();
    await qrLink.waitFor({ timeout: 15000 });
    await buyerPage.waitForTimeout(1000);
    await shoot(buyerPage, "dashboard");

    // 6 — activate the QR on its scan page, then capture the emergency page
    scanUrl = new URL(await qrLink.getAttribute("href"), BASE).toString();
    await buyerPage.goto(scanUrl, { waitUntil: "load" });
    await buyerPage.waitForTimeout(800);
    const nameInput = buyerPage.locator('input[placeholder="e.g. John Doe"]');
    if (await nameInput.isVisible().catch(() => false)) {
      await nameInput.fill("Demo Rider");
      await buyerPage
        .locator('input[placeholder="+1 234 567 890"]')
        .fill("0300 1234567");
      await buyerPage
        .locator('textarea, input[placeholder*="Blood"]')
        .first()
        .fill("Blood group B+. Asthmatic — inhaler in bag.");
      await buyerPage.locator('button[type="submit"]').first().click();
      await buyerPage.waitForTimeout(2500);
    }
    await buyerPage.goto(scanUrl, { waitUntil: "load" });
    await buyerPage.waitForTimeout(1200);
    await shoot(buyerPage, "scan-page");
    await buyerCtx.close();

    // 7 — the scan page on mobile (the screen a rescuer actually sees)
    const mobile = await cleanContext(browser, {
      viewport: { width: 390, height: 844 },
      deviceScaleFactor: 3,
      isMobile: true,
      hasTouch: true,
      colorScheme: "light",
    });
    const mobilePage = await mobile.newPage();
    await mobilePage.goto(scanUrl, { waitUntil: "load" });
    await mobilePage.waitForTimeout(1200);
    await shoot(mobilePage, "scan-mobile");
    await mobile.close();
  }

  await browser.close();

  // convert to webp and drop the pngs
  for (const file of pngs) {
    const webp = file.replace(/\.png$/, ".webp");
    await sharp(file).webp({ quality: 88 }).toFile(webp);
    fs.unlinkSync(file);
    console.log("converted", path.basename(webp));
  }
  console.log("done →", OUT);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
