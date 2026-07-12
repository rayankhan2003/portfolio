"use client";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

const WORDS = ["Hello", "Hi", "Salam", "Hey", "Hallo"];
const WORD_MS = 380;
const SESSION_KEY = "intro-played";

/**
 * Once-per-session multilingual greeting overlay. Skippable via click,
 * Escape, or Enter; skipped entirely for returning visitors and for
 * prefers-reduced-motion. Purely an overlay — the page renders beneath it,
 * so there is no layout shift and no blocked loading.
 */
export default function IntroOverlay() {
  const [show, setShow] = useState(false);
  const [word, setWord] = useState(0);

  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    let played = true;
    try {
      played = sessionStorage.getItem(SESSION_KEY) === "1";
      sessionStorage.setItem(SESSION_KEY, "1");
    } catch {
      // storage unavailable → treat as played, never trap the visitor
    }
    if (reduceMotion || played) return;
    setShow(true);
  }, []);

  useEffect(() => {
    if (!show) return;

    const dismiss = () => setShow(false);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === "Enter") dismiss();
    };
    window.addEventListener("keydown", onKey);

    const ticker = setInterval(
      () => setWord((w) => Math.min(w + 1, WORDS.length - 1)),
      WORD_MS,
    );
    const end = setTimeout(dismiss, WORDS.length * WORD_MS + 250);

    return () => {
      window.removeEventListener("keydown", onKey);
      clearInterval(ticker);
      clearTimeout(end);
    };
  }, [show]);

  return (
    <AnimatePresence>
      {show && (
        <motion.button
          type="button"
          aria-label="Skip intro"
          onClick={() => setShow(false)}
          initial={{ opacity: 1 }}
          exit={{
            y: "-100%",
            transition: { duration: 1, ease: [0.76, 0, 0.24, 1] },
          }}
          className="fixed inset-0 z-[100] flex w-full cursor-default items-center justify-center bg-background"
        >
          {/* screen readers get one greeting, not five announcements */}
          <span className="sr-only">Hello</span>
          <span aria-hidden="true" className="flex items-center gap-3">
            <motion.span
              layout
              className="h-2.5 w-2.5 rounded-full bg-primary"
            />
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span
                key={WORDS[word]}
                initial={{ y: 14, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -14, opacity: 0 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
                className="font-mono text-4xl sm:text-5xl font-semibold text-foreground"
              >
                {WORDS[word]}
              </motion.span>
            </AnimatePresence>
          </span>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
