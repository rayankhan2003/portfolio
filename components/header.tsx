"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`py-4 px-4 sm:px-6 lg:px-8 transition-all duration-100 ${
        isScrolled ? "bg-white" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto flex items-center sm:pt-4 md:pt-0 justify-between">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold text-gray-900">
          rayankhan.dev
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex font-semibold text-[16px] items-center space-x-8">
          <Link href="#home" className="text-gray-900 hover:text-gray-600">
            Home
          </Link>
          <Link href="#about" className="text-gray-900 hover:text-gray-600">
            About
          </Link>
          <Link href="#projects" className="text-gray-900 hover:text-gray-600">
            Projects
          </Link>
        </nav>

        {/* Mobile Hamburger Button */}
        <button
          className="md:hidden p-2 text-gray-900"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle Menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className="md:hidden mt-4 bg-white shadow-lg rounded-lg p-4 space-y-4">
          <Link
            href="#home"
            className="block text-gray-900 font-semibold hover:text-gray-600"
            onClick={() => setIsMenuOpen(false)}
          >
            Home
          </Link>
          <Link
            href="#about"
            className="block text-gray-900 font-semibold hover:text-gray-600"
            onClick={() => setIsMenuOpen(false)}
          >
            About
          </Link>
          <Link
            href="#projects"
            className="block text-gray-900 font-semibold hover:text-gray-600"
            onClick={() => setIsMenuOpen(false)}
          >
            Projects
          </Link>
        </div>
      )}
    </header>
  );
}
