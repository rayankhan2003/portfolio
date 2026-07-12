"use client";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

/** Public, unauthenticated GitHub contribution heatmap image — no token
 *  or server-side scraping needed. Widely used, same service many
 *  GitHub READMEs embed. */
export default function ContributionChart({ username }: { username: string }) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const color = mounted && resolvedTheme === "dark" ? "f0a860" : "c2661a";

  return (
    <img
      src={`https://ghchart.rshah.org/${color}/${username}`}
      alt={`${username}'s GitHub contribution graph`}
      className="w-full h-auto"
      loading="lazy"
    />
  );
}
