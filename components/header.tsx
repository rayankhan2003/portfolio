"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  return (
    <header
      className={`py-4 px-4 sm:px-6 lg:px-8 sticky top-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-white shadow-md" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-gray-900">
            rayankhan.dev
          </Link>

          <nav className="hidden md:flex font-semibold text-[16px] items-center space-x-8">
            <Link href="#" className="text-gray-900 ">
              Home
            </Link>
            <Link href="#about" className="text-gray-900 ">
              About
            </Link>
            <Link href="#projects" className="text-gray-900 ">
              Projects
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
