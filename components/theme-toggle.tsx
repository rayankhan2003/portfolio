"use client";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon } from "@phosphor-icons/react/dist/ssr";
import { crtSwitch } from "@/components/easter-eggs/crt";

export default function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <button
      onClick={() =>
        crtSwitch(() => setTheme(resolvedTheme === "dark" ? "light" : "dark"))
      }
      aria-label="Toggle theme"
      className="p-2 rounded-lg text-foreground hover:bg-secondary transition-colors"
    >
      {mounted && resolvedTheme === "dark" ? (
        <Sun weight="light" size={20} />
      ) : (
        <Moon weight="light" size={20} />
      )}
    </button>
  );
}
