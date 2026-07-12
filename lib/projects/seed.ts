import type { Project } from "./types";

/**
 * Static fallback data, used whenever Supabase env vars are absent so the
 * site keeps working before/without the CMS. Once Supabase is configured,
 * the same entries can be imported via supabase/seed.sql and managed from
 * /admin. All facts below come from each project's actual codebase.
 */
export const SEED_PROJECTS: Project[] = [
  {
    id: "seed-scan2help",
    title: "Scan2Help (SafeQR)",
    slug: "scan2help",
    shortDescription:
      "Emergency-contact QR stickers for Pakistan — anyone who scans a sticker sees a Call Now page with the owner's emergency contacts and medical notes.",
    fullDescription:
      "Scan2Help sells physical QR stickers that link a person's belongings — or the person themselves, on a helmet or car — to an emergency profile. A buyer orders stickers, pays via JazzCash/EasyPaisa (confirmed manually over WhatsApp), and an admin approves the order, which atomically mints their QR codes. The buyer activates each QR with emergency phone numbers and medical notes from a dashboard. A stranger who scans a sticker gets a bilingual (English/Urdu) emergency page with a Call Now button — no app install, no signup.",
    coverImage: "/projects/scan2help/cover.webp",
    technologies: [
      "Next.js 16",
      "TypeScript",
      "Prisma 7",
      "PostgreSQL",
      "Tailwind CSS 4",
      "JWT",
      "Nodemailer",
    ],
    category: "Full-Stack SaaS",
    year: 2026,
    role: "Solo developer — full stack, product, and ops flow",
    githubUrl: null,
    liveUrl: null,
    featured: true,
    published: true,
    displayOrder: 0,
    challenge:
      "Emergency info has to be reachable by a total stranger in seconds, while staying safe from abuse: unactivated stickers must be impossible to hijack, phone numbers shouldn't be scrapeable in bulk, and orders are paid outside the platform (JazzCash/EasyPaisa), so payment state can't be trusted from the client.",
    solution:
      "Passwordless magic-link auth (15-minute, single-use, SHA-256-hashed tokens) with a 7-day httpOnly JWT session. QR activation requires both a session and ownership of that QR. The public scan page reveals phone numbers only on click through a tracked API call, with per-IP cooldowns and in-memory rate limiting on all sensitive routes. Order approval is an atomic admin action that generates the buyer's QRs and emails them; admins also batch-mint print-ready sticker PDFs and ZIPs.",
    results:
      "Complete working system: purchase → manual payment approval → QR activation → emergency scan page, plus an admin panel for order review and batch sticker generation for print.",
    images: [
      {
        id: "s2h-1",
        url: "/projects/scan2help/cover.webp",
        caption: "Landing page — the pitch in one screen",
        alt: "SafeQR landing page with headline and phone mockup of an emergency contact screen",
        sortOrder: 0,
      },
      {
        id: "s2h-2",
        url: "/projects/scan2help/purchase.webp",
        caption: "Ordering stickers — email becomes the login identity",
        alt: "Purchase form with name, WhatsApp number, and email fields filled with demo data",
        sortOrder: 1,
      },
      {
        id: "s2h-3",
        url: "/projects/scan2help/order-confirmation.webp",
        caption: "Manual JazzCash/EasyPaisa payment instructions with order reference",
        alt: "Order confirmation screen showing payment instructions and a WhatsApp confirmation step",
        sortOrder: 2,
      },
      {
        id: "s2h-4",
        url: "/projects/scan2help/admin-orders.webp",
        caption: "Admin panel — approving an order atomically mints the buyer's QRs",
        alt: "Admin orders panel with a pending order and approve and reject buttons",
        sortOrder: 3,
      },
      {
        id: "s2h-5",
        url: "/projects/scan2help/dashboard.webp",
        caption: "Buyer dashboard — each QR gets emergency contacts and medical notes",
        alt: "Buyer dashboard listing owned QR codes and their activation status",
        sortOrder: 4,
      },
      {
        id: "s2h-6",
        url: "/projects/scan2help/scan-page.webp",
        caption: "What a rescuer sees — numbers are fetched on tap to prevent scraping",
        alt: "Public emergency page with the owner's name, medical information, and a Call Now button",
        sortOrder: 5,
      },
      {
        id: "s2h-7",
        url: "/projects/scan2help/scan-mobile.webp",
        caption: "The bilingual mobile scan page — the screen that matters in an emergency",
        alt: "Mobile emergency page with English and Urdu Call Now button and medical information card",
        sortOrder: 6,
      },
    ],
  },
  {
    id: "seed-stayease",
    title: "StayEase",
    slug: "stayease",
    shortDescription:
      "A hotel management system delivering seamless room bookings, efficient check-ins, and streamlined branch operations — with role-based workflows built for real front-desk teams.",
    fullDescription:
      "StayEase is a full-stack hotel management platform with a customer-facing landing and booking flow plus an integrated admin and employee dashboard. It supports online payment processing and invoicing through Stripe, and uses Supabase's real-time capabilities for live room availability, staff management, and booking analytics.",
    coverImage: "/images/stayease.webp",
    technologies: ["Next.js", "Tailwind CSS", "Supabase", "Stripe"],
    category: "Full-Stack Web App",
    year: 2025,
    role: "Solo developer — full stack",
    githubUrl: "https://github.com/rayankhan2003/StayEase",
    liveUrl: "https://stay-ease-rayan.vercel.app/",
    featured: true,
    published: true,
    displayOrder: 1,
    challenge: null,
    solution: null,
    results: null,
    images: [
      {
        id: "se-1",
        url: "/images/stayease.webp",
        caption: "StayEase booking experience",
        alt: "StayEase hotel management system screenshot",
        sortOrder: 0,
      },
    ],
  },
  {
    id: "seed-project-runner",
    title: "Project Runner",
    slug: "project-runner",
    shortDescription:
      "An all-in-one construction site management platform that centralizes material requests, deliveries, and on-site workflows into a single, easy-to-use system.",
    fullDescription:
      "Project Runner is a construction site management platform designed to eliminate operational chaos: material requests, deliveries, and day-to-day site coordination live in one system built for builders and construction teams.",
    coverImage: "/images/project-runner.webp",
    technologies: ["React", "Tailwind CSS", "JavaScript"],
    category: "Web App",
    year: 2025,
    role: "Frontend developer",
    githubUrl: "https://github.com/rayankhan2003/project-runner-landing",
    liveUrl: "https://project-runner-landing-seven.vercel.app/",
    featured: true,
    published: true,
    displayOrder: 2,
    challenge: null,
    solution: null,
    results: null,
    images: [
      {
        id: "pr-1",
        url: "/images/project-runner.webp",
        caption: "Project Runner landing",
        alt: "Project Runner website mockup",
        sortOrder: 0,
      },
    ],
  },
  {
    id: "seed-forkify",
    title: "Forkify",
    slug: "forkify",
    shortDescription:
      "A recipe search app for exploring meals, viewing ingredients and cooking steps, and bookmarking favorites for later.",
    fullDescription:
      "Forkify is a recipe application built with modern ES6+ JavaScript following the MVC architecture. It integrates the Forkify API for search and pagination, persists bookmarks in local storage, and supports uploading your own recipes with form validation.",
    coverImage: "/images/forkify.webp",
    technologies: ["JavaScript", "HTML", "CSS"],
    category: "Frontend App",
    year: 2024,
    role: "Solo developer",
    githubUrl: "https://github.com/rayankhan2003/forkify-main",
    liveUrl: "https://forkify-rayan.netlify.app/",
    featured: false,
    published: true,
    displayOrder: 3,
    challenge: null,
    solution: null,
    results: null,
    images: [
      {
        id: "fk-1",
        url: "/images/forkify.webp",
        caption: "Forkify recipe search",
        alt: "Forkify recipe website screenshot",
        sortOrder: 0,
      },
    ],
  },
];
