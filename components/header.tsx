"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import ThemeToggle from "@/components/theme-toggle";

const NAV_ITEMS = [
  { href: "#home", id: "home", label: "Home" },
  { href: "#about", id: "about", label: "About" },
  { href: "#projects", id: "projects", label: "Projects" },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

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
      className={`py-4 px-4 sm:px-6 lg:px-8 transition-all duration-300 ${
        isScrolled
          ? "bg-background/80 backdrop-blur-md shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto flex items-center sm:pt-4 md:pt-0 justify-between">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold text-foreground">
          rayankhan<span className="text-primary">.dev</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex font-semibold text-[16px] items-center space-x-8">
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
          <ThemeToggle />
        </nav>

        {/* Mobile: theme toggle + hamburger */}
        <div className="flex md:hidden items-center gap-1">
          <ThemeToggle />
          <button
            className="p-2 text-foreground"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle Menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
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
                  className="block text-foreground font-semibold hover:text-primary"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
