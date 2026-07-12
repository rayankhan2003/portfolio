-- Seeds the projects CMS with the same entries as the static fallback
-- (lib/projects/seed.ts). Run AFTER 0001_projects.sql, e.g. in the Supabase
-- SQL editor. Screenshot URLs point at this repo's /public assets, which the
-- deployed site serves — you can replace them with Storage uploads from
-- /admin at any time.

with p as (
  insert into public.projects
    (title, slug, short_description, full_description, cover_image,
     technologies, category, year, role, github_url, live_url,
     featured, published, display_order, challenge, solution, results)
  values
  ('Scan2Help (SafeQR)', 'scan2help',
   'Emergency-contact QR stickers for Pakistan — anyone who scans a sticker sees a Call Now page with the owner''s emergency contacts and medical notes.',
   'Scan2Help sells physical QR stickers that link a person''s belongings — or the person themselves, on a helmet or car — to an emergency profile. A buyer orders stickers, pays via JazzCash/EasyPaisa (confirmed manually over WhatsApp), and an admin approves the order, which atomically mints their QR codes. The buyer activates each QR with emergency phone numbers and medical notes from a dashboard. A stranger who scans a sticker gets a bilingual (English/Urdu) emergency page with a Call Now button — no app install, no signup.',
   '/projects/scan2help/cover.webp',
   array['Next.js 16','TypeScript','Prisma 7','PostgreSQL','Tailwind CSS 4','JWT','Nodemailer'],
   'Full-Stack SaaS', 2026, 'Solo developer — full stack, product, and ops flow',
   null, null, true, true, 0,
   'Emergency info has to be reachable by a total stranger in seconds, while staying safe from abuse: unactivated stickers must be impossible to hijack, phone numbers shouldn''t be scrapeable in bulk, and orders are paid outside the platform (JazzCash/EasyPaisa), so payment state can''t be trusted from the client.',
   'Passwordless magic-link auth (15-minute, single-use, SHA-256-hashed tokens) with a 7-day httpOnly JWT session. QR activation requires both a session and ownership of that QR. The public scan page reveals phone numbers only on click through a tracked API call, with per-IP cooldowns and in-memory rate limiting on all sensitive routes. Order approval is an atomic admin action that generates the buyer''s QRs and emails them; admins also batch-mint print-ready sticker PDFs and ZIPs.',
   'Complete working system: purchase → manual payment approval → QR activation → emergency scan page, plus an admin panel for order review and batch sticker generation for print.')
  returning id
)
insert into public.project_images (project_id, url, caption, alt, sort_order)
select p.id, v.url, v.caption, v.alt, v.sort_order
from p, (values
  ('/projects/scan2help/cover.webp', 'Landing page — the pitch in one screen',
   'SafeQR landing page with headline and phone mockup of an emergency contact screen', 0),
  ('/projects/scan2help/purchase.webp', 'Ordering stickers — email becomes the login identity',
   'Purchase form with name, WhatsApp number, and email fields filled with demo data', 1),
  ('/projects/scan2help/order-confirmation.webp', 'Manual JazzCash/EasyPaisa payment instructions with order reference',
   'Order confirmation screen showing payment instructions and a WhatsApp confirmation step', 2),
  ('/projects/scan2help/admin-orders.webp', 'Admin panel — approving an order atomically mints the buyer''s QRs',
   'Admin orders panel with a pending order and approve and reject buttons', 3),
  ('/projects/scan2help/dashboard.webp', 'Buyer dashboard — each QR gets emergency contacts and medical notes',
   'Buyer dashboard listing owned QR codes and their activation status', 4),
  ('/projects/scan2help/scan-page.webp', 'What a rescuer sees — numbers are fetched on tap to prevent scraping',
   'Public emergency page with the owner''s name, medical information, and a Call Now button', 5),
  ('/projects/scan2help/scan-mobile.webp', 'The bilingual mobile scan page — the screen that matters in an emergency',
   'Mobile emergency page with English and Urdu Call Now button and medical information card', 6)
) as v(url, caption, alt, sort_order);

insert into public.projects
  (title, slug, short_description, full_description, cover_image,
   technologies, category, year, role, github_url, live_url,
   featured, published, display_order)
values
('StayEase', 'stayease',
 'A hotel management system delivering seamless room bookings, efficient check-ins, and streamlined branch operations — with role-based workflows built for real front-desk teams.',
 'StayEase is a full-stack hotel management platform with a customer-facing landing and booking flow plus an integrated admin and employee dashboard. It supports online payment processing and invoicing through Stripe, and uses Supabase''s real-time capabilities for live room availability, staff management, and booking analytics.',
 '/images/stayease.webp',
 array['Next.js','Tailwind CSS','Supabase','Stripe'],
 'Full-Stack Web App', 2025, 'Solo developer — full stack',
 'https://github.com/rayankhan2003/StayEase', 'https://stay-ease-rayan.vercel.app/',
 true, true, 1),
('Project Runner', 'project-runner',
 'An all-in-one construction site management platform that centralizes material requests, deliveries, and on-site workflows into a single, easy-to-use system.',
 'Project Runner is a construction site management platform designed to eliminate operational chaos: material requests, deliveries, and day-to-day site coordination live in one system built for builders and construction teams.',
 '/images/project-runner.webp',
 array['React','Tailwind CSS','JavaScript'],
 'Web App', 2025, 'Frontend developer',
 'https://github.com/rayankhan2003/project-runner-landing', 'https://project-runner-landing-seven.vercel.app/',
 true, true, 2),
('Forkify', 'forkify',
 'A recipe search app for exploring meals, viewing ingredients and cooking steps, and bookmarking favorites for later.',
 'Forkify is a recipe application built with modern ES6+ JavaScript following the MVC architecture. It integrates the Forkify API for search and pagination, persists bookmarks in local storage, and supports uploading your own recipes with form validation.',
 '/images/forkify.webp',
 array['JavaScript','HTML','CSS'],
 'Frontend App', 2024, 'Solo developer',
 'https://github.com/rayankhan2003/forkify-main', 'https://forkify-rayan.netlify.app/',
 false, true, 3);

insert into public.project_images (project_id, url, caption, alt, sort_order)
select id, cover_image, title, title || ' screenshot', 0
from public.projects
where slug in ('stayease', 'project-runner', 'forkify');
