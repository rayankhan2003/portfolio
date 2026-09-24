"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { List, X } from "@phosphor-icons/react/dist/ssr";
import { motion, AnimatePresence, useScroll, useSpring } from "motion/react";
import ThemeToggle from "@/components/theme-toggle";
import { openTerminal } from "@/components/terminal/terminal";

function TerminalButton() {
  return (
    <button
      type="button"
      onClick={() => openTerminal()}
      aria-label="Open terminal (Ctrl+K)"
      title="Open terminal (Ctrl+K)"
      className="p-2 rounded-lg font-mono text-sm text-foreground hover:bg-secondary hover:text-primary transition-colors"
    >
      &gt;_
    </button>
  );
}

const NAV_ITEMS = [
  { href: "#home", id: "home", label: "~" },
  { href: "#about", id: "about", label: "~/about" },
  { href: "#experience", id: "experience", label: "~/experience" },
  { href: "#skills", id: "skills", label: "~/skills" },
  { href: "#projects", id: "projects", label: "~/projects" },
  { href: "#github", id: "github", label: "~/github" },
  { href: "#contact", id: "contact", label: "~/contact" },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 300,
    damping: 40,
    restDelta: 0.001,
  });

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        }
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );
    NAV_ITEMS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <header
      className={`relative py-4 px-4 sm:px-6 lg:px-8 transition-all duration-300 ${
        isScrolled
          ? "bg-background/80 backdrop-blur-md shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto flex items-center sm:pt-4 md:pt-0 justify-between">
        {/* Logo */}
        <Link href="/" className="font-mono text-lg font-semibold text-foreground">
          rayankhan<span className="text-primary">.dev</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex font-mono text-sm items-center space-x-7">
          {NAV_ITEMS.map(({ href, id, label }) => (
            <Link
              key={id}
              href={href}
              className={`relative pb-1 transition-colors ${
                activeSection === id
                  ? "text-primary"
                  : "text-foreground hover:text-primary"
              }`}
            >
              {label}
              {activeSection === id && (
                <motion.span
                  layoutId="nav-underline"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
            </Link>
          ))}
          <span className="flex items-center gap-1 -mr-2">
            <TerminalButton />
            <ThemeToggle />
          </span>
        </nav>

        {/* Mobile: theme toggle + hamburger */}
        <div className="flex md:hidden items-center gap-1">
          <TerminalButton />
          <ThemeToggle />
          <button
            className="p-2 text-foreground"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle Menu"
          >
            {isMenuOpen ? (
              <X weight="light" size={24} />
            ) : (
              <List weight="light" size={24} />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -8 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0, y: -8 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="md:hidden overflow-hidden"
          >
            <div className="mt-4 bg-background shadow-lg rounded-lg p-4 space-y-4 border border-border">
              {NAV_ITEMS.map(({ href, id, label }) => (
                <Link
                  key={id}
                  href={href}
                  className="block text-foreground font-mono text-sm hover:text-primary"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary origin-left"
        style={{ scaleX }}
      />
    </header>
  );
}
