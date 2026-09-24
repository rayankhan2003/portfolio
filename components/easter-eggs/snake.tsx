"use client";
import { useEffect, useRef, useState } from "react";

const COLS = 24;
const ROWS = 14;
const TICK_MS = 110;
const BEST_KEY = "snake-best";

type Pt = { x: number; y: number };
const DIRS: Record<string, Pt> = {
  ArrowUp: { x: 0, y: -1 }, w: { x: 0, y: -1 },
  ArrowDown: { x: 0, y: 1 }, s: { x: 0, y: 1 },
  ArrowLeft: { x: -1, y: 0 }, a: { x: -1, y: 0 },
  ArrowRight: { x: 1, y: 0 }, d: { x: 1, y: 0 },
};

function readBest() {
  try {
    return Number(localStorage.getItem(BEST_KEY)) || 0;
  } catch {
    return 0;
  }
}

function randomFood(snake: Pt[]): Pt {
  for (;;) {
    const p = { x: Math.floor(Math.random() * COLS), y: Math.floor(Math.random() * ROWS) };
    if (!snake.some((s) => s.x === p.x && s.y === p.y)) return p;
  }
}

/** Outlives the component: the terminal unmounts its output when closed and
 *  remounts it on reopen, and a finished game must not restart then. */
export interface SnakeSession {
  done: boolean;
  score: number;
  mounts?: number;
}

/** Snake, played inside the terminal output. Calls onEnd once — on game over,
 *  on quit, or when the terminal is closed mid-game. */
export default function Snake({
  session,
  onEnd,
}: {
  session: SnakeSession;
  onEnd: (score: number) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const [over, setOver] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    setBest(readBest());
    if (session.done) {
      setScore(session.score);
      setOver(true);
      return;
    }
    const mount = (session.mounts = (session.mounts ?? 0) + 1);

    const css = getComputedStyle(document.documentElement);
    const accent = css.getPropertyValue("--primary").trim() || "#e07b39";
    const fg = css.getPropertyValue("--foreground").trim() || "#222";
    const muted = css.getPropertyValue("--border").trim() || "#ddd";

    const cell = canvas.width / COLS;
    let snake: Pt[] = [{ x: 6, y: 7 }, { x: 5, y: 7 }, { x: 4, y: 7 }];
    let dir: Pt = { x: 1, y: 0 };
    const queue: Pt[] = [];
    let food = randomFood(snake);
    let points = 0;
    let ended = false;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = muted;
      ctx.strokeRect(0.5, 0.5, canvas.width - 1, canvas.height - 1);
      ctx.fillStyle = accent;
      ctx.fillRect(food.x * cell + cell * 0.2, food.y * cell + cell * 0.2, cell * 0.6, cell * 0.6);
      snake.forEach((p, i) => {
        ctx.fillStyle = i === 0 ? accent : fg;
        ctx.globalAlpha = i === 0 ? 1 : Math.max(0.35, 1 - i * 0.03);
        ctx.fillRect(p.x * cell + 1, p.y * cell + 1, cell - 2, cell - 2);
      });
      ctx.globalAlpha = 1;
    };

    const finish = () => {
      if (ended) return;
      ended = true;
      session.done = true;
      session.score = points;
      clearInterval(timer);
      setOver(true);
      try {
        if (points > readBest()) localStorage.setItem(BEST_KEY, String(points));
      } catch {
        // no storage — the high score just doesn't persist
      }
      setBest((b) => Math.max(b, points));
      onEnd(points);
    };

    const turn = (next: Pt) => {
      const last = queue[queue.length - 1] ?? dir;
      // no reversing into yourself, no duplicate inputs
      if (next.x === -last.x && next.y === -last.y) return;
      if (next.x === last.x && next.y === last.y) return;
      if (queue.length < 3) queue.push(next);
    };

    const step = () => {
      dir = queue.shift() ?? dir;
      const head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };
      const hitWall = head.x < 0 || head.y < 0 || head.x >= COLS || head.y >= ROWS;
      const hitSelf = snake.some((p) => p.x === head.x && p.y === head.y);
      if (hitWall || hitSelf) return finish();
      snake = [head, ...snake];
      if (head.x === food.x && head.y === food.y) {
        points += 1;
        setScore(points);
        food = randomFood(snake);
      } else {
        snake.pop();
      }
      draw();
    };

    const onKey = (e: KeyboardEvent) => {
      if (ended) return;
      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      if (key === "Escape" || key === "q") {
        e.preventDefault();
        e.stopPropagation();
        return finish();
      }
      const next = DIRS[key];
      if (next) {
        e.preventDefault();
        turn(next);
      }
    };

    let touch: Pt | null = null;
    const onTouchStart = (e: TouchEvent) => {
      touch = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };
    const onTouchEnd = (e: TouchEvent) => {
      if (!touch) return;
      const dx = e.changedTouches[0].clientX - touch.x;
      const dy = e.changedTouches[0].clientY - touch.y;
      touch = null;
      if (Math.max(Math.abs(dx), Math.abs(dy)) < 20) return;
      turn(Math.abs(dx) > Math.abs(dy) ? { x: Math.sign(dx), y: 0 } : { x: 0, y: Math.sign(dy) });
    };

    draw();
    const timer = setInterval(step, TICK_MS);
    window.addEventListener("keydown", onKey, true);
    canvas.addEventListener("touchstart", onTouchStart, { passive: true });
    canvas.addEventListener("touchend", onTouchEnd);
    return () => {
      clearInterval(timer);
      // closing the terminal mid-game counts as quitting — deferred, so a
      // dev-mode StrictMode remount (which re-runs this effect) isn't one
      setTimeout(() => {
        if (session.mounts === mount) finish();
      }, 0);
      window.removeEventListener("keydown", onKey, true);
      canvas.removeEventListener("touchstart", onTouchStart);
      canvas.removeEventListener("touchend", onTouchEnd);
    };
    // runs once per game
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-1.5 py-1">
      <canvas
        ref={canvasRef}
        width={COLS * 20}
        height={ROWS * 20}
        className="w-full max-w-[480px] touch-none"
        aria-label="Snake game"
      />
      <p className="text-muted-foreground">
        score <span className="text-primary">{score}</span> · best {Math.max(best, score)}
        {over ? (
          <span> · game over</span>
        ) : (
          <span> · arrows/WASD or swipe · q to quit</span>
        )}
      </p>
    </div>
  );
}
