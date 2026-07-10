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
import BlurText from "@/components/reactbits/blur-text";
import TextType from "@/components/reactbits/text-type";

export default function Hero() {
  return (
    <section className="flex items-center  justify-center max-w-6xl mx-auto min-h-[100dvh] px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
      <div className="max-w-6xl w-full">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
          {/* Left Content */}
          <div className="flex-1 max-w-2xl text-center lg:text-left">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight">
              <div className="flex flex-wrap items-baseline justify-center lg:justify-start gap-x-3">
                <BlurText
                  text="Full-Stack Web"
                  delay={120}
                  animateBy="words"
                  direction="top"
                />
                <TextType
                  as="span"
                  text={[
                    "Developer",
                    "Engineer",
                    "Problem Solver",
                    "Coffee Enjoyer",
                  ]}
                  className="text-primary"
                  typingSpeed={80}
                  deletingSpeed={40}
                  pauseDuration={1800}
                  cursorCharacter="|"
                  cursorClassName="text-primary"
                />
              </div>
            </h1>

            <Reveal delay={0.1}>
              <p className="text-base sm:text-lg text-muted-foreground mb-8 leading-relaxed">
                Rayan Khan, Full-Stack Developer turning ideas into web
                experiences.
                <br />
                Lifelong learner, based in Peshawar, Pakistan.
              </p>
            </Reveal>

            {/* Social Icons */}
            <Reveal
              delay={0.2}
              className="flex justify-center lg:justify-start items-center gap-3 mb-8"
            >
              <a
                href="https://linkedin.com/in/rayankhanwebdev"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn profile"
                className="w-11 h-11 flex items-center justify-center hover:scale-110 transition-transform"
              >
                <LinkedinLogo weight="light" className="w-6 h-6 text-foreground" />
              </a>
              <a
                href="https://github.com/rayankhan2003"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub profile"
                className="w-11 h-11 flex items-center justify-center hover:scale-110 transition-transform"
              >
                <GithubLogo weight="light" className="w-6 h-6 text-foreground" />
              </a>
            </Reveal>

            {/* Buttons */}
            <Reveal
              delay={0.3}
              className="flex flex-wrap justify-center lg:justify-start gap-4 mb-16"
            >
              <motion.a
                href="#contact"
                whileTap={{ scale: 0.96 }}
                className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors text-sm sm:text-base"
              >
                <EnvelopeSimple weight="light" className="w-4 h-4" />
                Contact Me
              </motion.a>
              <motion.a
                href="/rayan-cv.pdf"
                target="_blank"
                rel="noopener noreferrer"
                whileTap={{ scale: 0.96 }}
                className="flex items-center gap-2 border-2 border-foreground text-foreground px-6 py-3 rounded-lg hover:bg-foreground hover:text-background transition-colors text-sm sm:text-base"
              >
                <DownloadSimple weight="light" className="w-4 h-4" />
                Download CV
              </motion.a>
            </Reveal>
          </div>

          {/* Right Image */}
          <Reveal delay={0.2} className="flex-shrink-0 mt-10 lg:mt-0 self-center">
            <div className="w-[220px] sm:w-[280px] md:w-[320px] lg:w-[350px] aspect-square rounded-full overflow-hidden mx-auto lg:mx-0 shadow-[0_16px_48px_-12px_oklch(0.551_0.169_46_/_0.35)]">
              <Image
                src="/images/profile.jpg"
                alt="Rayan Khan"
                width={350}
                height={350}
                className="w-full h-full object-cover object-center"
                priority
              />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
