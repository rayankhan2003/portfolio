"use client";
import { useRef, useEffect } from "react";
import { motion, useMotionValue, useTransform, useInView, animate } from "motion/react";

type CounterProps = {
  to: number;
  suffix?: string;
  duration?: number;
  className?: string;
};

export default function Counter({ to, suffix = "", duration = 1.5, className }: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => Math.round(v).toString());

  useEffect(() => {
    if (inView) {
      const controls = animate(count, to, { duration, ease: "easeOut" });
      return () => controls.stop();
    }
  }, [inView, to, duration, count]);

  return (
    <span ref={ref} className={className}>
      <motion.span>{rounded}</motion.span>
      {suffix}
    </span>
  );
}
