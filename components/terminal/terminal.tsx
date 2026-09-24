"use client";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { AnimatePresence, motion } from "motion/react";
import { scrollToSection } from "@/components/smooth-scroll";
import {
  ALIASES,
  COMMANDS,
  Accent,
  Err,
  Muted,
  complete,
  type CommandContext,
  type TerminalProject,
} from "@/lib/terminal/commands";

export const OPEN_TERMINAL_EVENT = "terminal:open";

/** Open the terminal from anywhere (header button, hero hint, …). */
export function openTerminal(command?: string) {
  window.dispatchEvent(new CustomEvent(OPEN_TERMINAL_EVENT, { detail: command }));
}

interface Entry {
  id: number;
  node: ReactNode;
}

const QUICK = ["help", "whoami", "projects", "neofetch", "contact"];

function Prompt({ path = "~" }: { path?: string }) {
  return (
    <span className="mr-2 shrink-0 select-none">
      <Accent>rayan@portfolio</Accent>
      <Muted>:{path} $</Muted>
    </span>
  );
}

function Banner() {
  return (
    <div className="space-y-1">
      <p>
        <Accent>portfolio-sh 1.0</Accent>{" "}
        <Muted>— an actual shell for this site.</Muted>
      </p>
      <p>
        <Muted>type</Muted> <Accent>help</Accent>{" "}
        <Muted>to see what it can do, or just poke around.</Muted>
      </p>
    </div>
  );
}

export default function Terminal({ projects }: { projects: TerminalProject[] }) {
  const router = useRouter();
  const { resolvedTheme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const [entries, setEntries] = useState<Entry[]>([{ id: 0, node: <Banner /> }]);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const historyIndex = useRef<number | null>(null);
  const nextId = useRef(1);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const pending = useRef<string | null>(null);

  const print = useCallback((node: ReactNode) => {
    setEntries((prev) => [...prev, { id: nextId.current++, node }]);
  }, []);

  const close = useCallback(() => setOpen(false), []);

  const run = useCallback(
    async (line: string) => {
      const trimmed = line.trim();
      print(
        <div className="flex">
          <Prompt />
          <span className="break-all">{trimmed}</span>
        </div>
      );
      if (!trimmed) return;

      const nextHistory = [...history, trimmed];
      setHistory(nextHistory);
      historyIndex.current = null;

      const expanded = ALIASES[trimmed] ?? trimmed;
      const [name, ...args] = expanded.split(/\s+/);
      const command = COMMANDS[name.toLowerCase()];
      if (!command) {
        print(
          <span>
            <Err>command not found: {name}</Err>{" "}
            <Muted>— type `help` for a list</Muted>
          </span>
        );
        return;
      }

      const ctx: CommandContext = {
        args,
        projects,
        history: nextHistory,
        theme: resolvedTheme,
        print,
        clear: () => setEntries([]),
        close,
        goTo: (section) => {
          setOpen(false);
          // wait for the overlay's exit so the scroll isn't fighting it
          setTimeout(() => scrollToSection(section), 180);
        },
        navigate: (href) => {
          setOpen(false);
          router.push(href);
        },
        openExternal: (href) => {
          window.open(href, "_blank", "noopener,noreferrer");
          print(<Muted>opened {href} in a new tab</Muted>);
        },
        setTheme,
        sleep: (ms) => new Promise((r) => setTimeout(r, ms)),
      };

      setBusy(true);
      try {
        await command.run(ctx);
      } finally {
        setBusy(false);
      }
    },
    [history, projects, resolvedTheme, print, close, router, setTheme]
  );

  // global shortcuts: ⌘K / ctrl+K anywhere, or ` when not typing in a field
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const typing =
        target?.isContentEditable ||
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA";
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      } else if (e.key === "`" && !typing) {
        e.preventDefault();
        setOpen(true);
      }
    };
    const onOpen = (e: Event) => {
      const cmd = (e as CustomEvent<string | undefined>).detail;
      if (cmd) pending.current = cmd;
      setOpen(true);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener(OPEN_TERMINAL_EVENT, onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener(OPEN_TERMINAL_EVENT, onOpen);
    };
  }, []);

  // focus on open, and run a command handed over by openTerminal(cmd)
  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => inputRef.current?.focus(), 50);
    if (pending.current) {
      const cmd = pending.current;
      pending.current = null;
      run(cmd);
    }
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // the input is disabled while a command runs, which drops focus
  useEffect(() => {
    if (open && !busy) inputRef.current?.focus();
  }, [open, busy]);

  // keep the newest output in view
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [entries]);

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      if (busy) return;
      const line = input;
      setInput("");
      run(line);
    } else if (e.key === "Escape") {
      setOpen(false);
    } else if (e.key === "Tab") {
      e.preventDefault();
      const options = complete(input, projects);
      if (options.length === 1) {
        const parts = input.split(/\s+/);
        parts[parts.length - 1] = options[0];
        setInput(parts.join(" ") + (parts.length === 1 ? " " : ""));
      } else if (options.length > 1) {
        print(
          <div className="flex">
            <Prompt />
            <span>{input}</span>
          </div>
        );
        print(<div className="flex flex-wrap gap-x-6 text-muted-foreground">{options.map((o) => <span key={o}>{o}</span>)}</div>);
      }
    } else if (e.key === "ArrowUp" || e.key === "ArrowDown") {
      if (history.length === 0) return;
      e.preventDefault();
      const cur = historyIndex.current ?? history.length;
      const next = e.key === "ArrowUp" ? Math.max(cur - 1, 0) : cur + 1;
      if (next >= history.length) {
        historyIndex.current = null;
        setInput("");
      } else {
        historyIndex.current = next;
        setInput(history[next]);
      }
    } else if (e.ctrlKey && e.key.toLowerCase() === "l") {
      e.preventDefault();
      setEntries([]);
    } else if (e.ctrlKey && e.key.toLowerCase() === "c") {
      print(
        <div className="flex">
          <Prompt />
          <span>{input}^C</span>
        </div>
      );
      setInput("");
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="terminal"
          className="fixed inset-0 z-[100] flex items-start justify-center bg-background/60 px-3 pt-[8vh] backdrop-blur-sm sm:px-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setOpen(false);
          }}
          role="dialog"
          aria-modal="true"
          aria-label="Interactive terminal"
        >
          <motion.div
            initial={{ y: 16, scale: 0.98, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: 8, scale: 0.98, opacity: 0 }}
            transition={{ type: "spring", stiffness: 420, damping: 32 }}
            className="w-full max-w-3xl overflow-hidden rounded-lg border border-border bg-card shadow-[0_24px_80px_-12px_rgb(0_0_0/0.5)]"
            onClick={() => inputRef.current?.focus()}
          >
            <div className="flex items-center gap-2 border-b border-border bg-secondary/60 px-4 py-2.5">
              <span className="flex gap-1.5">
                <button
                  type="button"
                  aria-label="Close terminal"
                  onClick={() => setOpen(false)}
                  className="h-3 w-3 rounded-full bg-[#ff5f57]"
                />
                <span className="h-3 w-3 rounded-full bg-[#febc2e]" aria-hidden />
                <span className="h-3 w-3 rounded-full bg-[#28c840]" aria-hidden />
              </span>
              <span className="ml-2 truncate font-mono text-xs text-muted-foreground">
                rayan@portfolio: ~ — portfolio-sh
              </span>
              <span className="ml-auto hidden font-mono text-[10px] text-muted-foreground sm:inline">
                esc to close
              </span>
            </div>

            <div
              ref={scrollRef}
              data-lenis-prevent
              className="h-[min(60vh,520px)] space-y-1.5 overflow-y-auto p-4 font-mono text-[13px] leading-relaxed sm:p-5 sm:text-sm"
              aria-live="polite"
            >
              {entries.map((entry) => (
                <div key={entry.id}>{entry.node}</div>
              ))}
              <div className="flex items-center">
                <Prompt />
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={onKeyDown}
                  disabled={busy}
                  aria-label="Terminal input"
                  autoComplete="off"
                  autoCapitalize="off"
                  autoCorrect="off"
                  spellCheck={false}
                  enterKeyHint="send"
                  className="min-w-0 flex-1 bg-transparent text-foreground caret-primary outline-none"
                />
              </div>
            </div>

            {/* touch keyboards make typing commands a chore — offer the
                common ones as taps */}
            <div className="flex gap-2 overflow-x-auto border-t border-border px-4 py-2.5 font-mono text-xs">
              {QUICK.map((cmd) => (
                <button
                  key={cmd}
                  type="button"
                  disabled={busy}
                  onClick={() => run(cmd)}
                  className="shrink-0 rounded border border-border px-2.5 py-1 text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                >
                  {cmd}
                </button>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
