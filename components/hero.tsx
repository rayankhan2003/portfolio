"use client";
import Image from "next/image";
import {
  GithubLogo,
  LinkedinLogo,
  DownloadSimple,
  EnvelopeSimple,
} from "@phosphor-icons/react/dist/ssr";
import { motion } from "motion/react";
import Reveal from "@/components/reveal";
import TextType from "@/components/reactbits/text-type";
import TerminalWindow from "@/components/terminal-window";
import { openTerminal } from "@/components/terminal/terminal";
import SectionWebGL from "@/components/three/section-webgl";
import type { ShardConfig } from "@/components/three/wireframe-field";

const HERO_SHARDS: ShardConfig[] = [
  { position: [3.2, 1.2, -1], scale: 0.9, speed: 0.25, parallax: 0.6 },
  { position: [-3.4, -0.8, -2.5], scale: 1.3, speed: 0.18, parallax: 0.6 },
  { position: [2.6, -1.8, -3.5], scale: 0.7, speed: 0.3, parallax: 0.2 },
  { position: [-2.6, 1.9, -4], scale: 1.0, speed: 0.22, parallax: 0.2 },
  { position: [4.2, -0.4, -5], scale: 1.6, speed: 0.12, parallax: 0.2 },
  { position: [-4.4, 0.3, -1.8], scale: 0.55, speed: 0.35, parallax: 0.6 },
];

const SOCIALS = [
  {
    href: "https://github.com/rayankhan2003",
    label: "GitHub profile",
    Icon: GithubLogo,
  },
  {
    href: "https://linkedin.com/in/rayankhanwebdev",
    label: "LinkedIn profile",
    Icon: LinkedinLogo,
  },
];

export default function Hero() {
  return (
    <section className="relative flex items-center justify-center max-w-6xl mx-auto min-h-[100dvh] px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
      <SectionWebGL shards={HERO_SHARDS} />
      <div className="max-w-6xl w-full">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-center">
          {/* Left: the terminal session */}
          <div className="flex-1 max-w-2xl text-center lg:text-left">
            <p className="font-mono text-sm sm:text-base mb-5 text-muted-foreground">
              <span className="text-primary">rayan@portfolio</span>
              <span>:~ $ </span>
              <TextType
                as="span"
                text="whoami"
                typingSpeed={90}
                initialDelay={400}
                loop={false}
                showCursor={false}
                className="text-foreground"
              />
            </p>

            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1, duration: 0.1 }}
              className="font-pixel text-[3.4rem] sm:text-7xl lg:text-8xl leading-[0.95] text-foreground mb-6 select-none"
            >
              RAYAN
              <br />
              <span className="caret-block">KHAN</span>
            </motion.h1>

            <Reveal delay={1.25}>
              <div className="font-mono text-lg sm:text-xl mb-6">
                <span className="text-primary">›</span>{" "}
                <TextType
                  as="span"
                  text={[
                    "full-stack developer",
                    "react + next.js",
                    "node.js backends",
                    "coffee-driven",
                  ]}
                  typingSpeed={70}
                  deletingSpeed={35}
                  initialDelay={1500}
                  pauseDuration={1800}
                  cursorCharacter="▌"
                  cursorClassName="text-primary"
                />
              </div>
            </Reveal>

            <Reveal delay={1.4}>
              <p className="text-base sm:text-lg text-muted-foreground mb-8 leading-relaxed">
                I turn ideas into fast, reliable web apps — from database to
                pixel-perfect UI. Based in Peshawar, Pakistan.
              </p>
            </Reveal>

            <Reveal
              delay={1.5}
              className="flex flex-wrap justify-center lg:justify-start items-center gap-4"
            >
              <motion.a
                href="#contact"
                whileTap={{ scale: 0.96 }}
                className="flex items-center gap-2 bg-primary text-primary-foreground font-mono text-sm sm:text-base px-6 py-3 rounded-md hover:bg-primary/90 transition-colors"
              >
                <EnvelopeSimple weight="light" className="w-4 h-4" />
                Contact me
              </motion.a>
              <motion.a
                href="/rayan-resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                whileTap={{ scale: 0.96 }}
                className="flex items-center gap-2 border border-border text-foreground font-mono text-sm sm:text-base px-6 py-3 rounded-md hover:border-primary hover:text-primary transition-colors"
              >
                <DownloadSimple weight="light" className="w-4 h-4" />
                Download CV
              </motion.a>

              <span className="flex items-center gap-2 ml-1">
                {SOCIALS.map(({ href, label, Icon }) => (
                  <a
                    key={href}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="w-11 h-11 flex items-center justify-center rounded-md border border-border text-muted-foreground hover:border-primary hover:text-primary transition-colors"
                  >
                    <Icon weight="light" className="w-5 h-5" />
                  </a>
                ))}
              </span>
            </Reveal>

            <Reveal delay={1.7}>
              <button
                type="button"
                onClick={() => openTerminal("help")}
                className="mt-6 font-mono text-xs text-muted-foreground hover:text-primary transition-colors"
              >
                <span className="text-primary">›</span> this site has a real
                shell — press{" "}
                <kbd className="rounded border border-border px-1.5 py-0.5">
                  ctrl K
                </kbd>{" "}
                or tap here
              </button>
            </Reveal>
          </div>

          {/* Right: profile.jpg viewed in a window */}
          <Reveal delay={0.3} className="flex-shrink-0 mt-6 lg:mt-0">
            <TerminalWindow
              title="~/images/profile.jpg"
              className="w-[260px] sm:w-[300px] md:w-[340px]"
            >
              <Image
                src="/images/profile.jpg"
                alt="Rayan Khan"
                width={340}
                height={340}
                className="aspect-square w-full object-cover object-center"
                priority
              />
            </TerminalWindow>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
