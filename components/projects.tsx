import { ExternalLink, Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/reveal";

export default function Projects() {
  return (
    <section className="py-20 px-6 max-w-6xl mx-auto">
      <div className="max-w-6xl mx-auto">
        <Reveal className="mb-16 space-y-4">
          <p className="text-primary font-extrabold text-lg tracking-wide uppercase">
            My Projects
          </p>
          <h2 className="text-4xl font-bold text-foreground">
            Each project is a unique piece of development 💸
          </h2>
        </Reveal>

        <div className="space-y-20">
          <Reveal className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 text-center">
              <div className="flex items-center justify-center gap-2">
                <h4 className="text-2xl font-bold text-foreground">StayEase</h4>
                <span className="text-2xl">🏨</span>
              </div>

              <p className="text-muted-foreground text-lg leading-relaxed max-w-xs mx-auto">
                A hotel management system that delivers seamless room bookings,
                efficient check-ins, and streamlined branch operations. The
                platform provides an interface for exploring room options,
                managing reservations, and enabling role-based workflows that
                enhance service quality and overall guest satisfaction.
              </p>

              <div className="flex gap-4 items-center justify-center">
                <span className="px-4 py-2 bg-secondary text-secondary-foreground rounded-full font-medium">
                  NextJs
                </span>
                <span className="px-4 py-2 bg-blue-100 text-blue-500 dark:bg-blue-950 dark:text-blue-300 rounded-full font-medium">
                  tailwindCSS
                </span>
                <span className="px-4 py-2 bg-orange-100 text-orange-500 dark:bg-orange-950 dark:text-orange-300 rounded-full font-medium">
                  SupaBase
                </span>
              </div>

              <div className="flex justify-center mt-7 gap-4">
                <Link
                  href={"https://github.com/rayankhan2003/StayEase"}
                  target="_blank"
                >
                  <Button
                    variant="outline"
                    className="flex items-center gap-2 bg-transparent"
                  >
                    <span>Code</span>
                    <Github className="w-4 h-4" />
                  </Button>
                </Link>
                <Link
                  href={"https://stay-ease-rayan.vercel.app/"}
                  target="_blank"
                >
                  <Button className="flex items-center gap-2">
                    <span>Live Demo</span>
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative group overflow-hidden rounded-lg shadow-lg">
              <Image
                src="/images/stayease.webp"
                alt="StayEase hotel management system screenshot"
                width={600}
                height={600}
                className="w-full h-auto transition-transform duration-500 group-hover:scale-105"
              />
            </div>
          </Reveal>
          <Reveal className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative group overflow-hidden rounded-lg shadow-lg">
              <Image
                src="/images/project-runner.webp"
                alt="Project runner Website Mockup"
                width={600}
                height={600}
                className="w-full h-auto transition-transform duration-500 group-hover:scale-105"
              />
            </div>

            <div className="space-y-6">
              <div className="space-y-2 text-center">
                <div className="flex justify-center items-center gap-2">
                  <h4 className="text-lg font-bold text-foreground">
                    Project Runner
                  </h4>
                  <span className="text-lg">🧱⚒️</span>
                </div>

                <p className="text-muted-foreground text-lg leading-relaxed max-w-xs mx-auto">
                  Project Runner is an all-in-one construction site management
                  platform designed to eliminate operational chaos and
                  streamline day-to-day site coordination. Built specifically
                  for builders and construction teams, the platform centralizes
                  material requests, deliveries, and on-site workflows into a
                  single, easy-to-use system.
                </p>

                <div className="flex justify-center gap-6 text-md font-bold">
                  <span className="px-4 py-2 bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 rounded-full font-medium">
                    React
                  </span>
                  <span className="px-4 py-2 bg-pink-100 text-pink-800 dark:bg-pink-950 dark:text-pink-300 rounded-full font-medium">
                    Tailwind
                  </span>
                  <span className="px-4 py-2 bg-yellow-100 text-yellow-600 dark:bg-yellow-950 dark:text-yellow-300 rounded-full font-medium">
                    Js
                  </span>
                </div>

                <div className="flex justify-center mt-7 gap-4">
                  <Link
                    href={
                      "https://github.com/rayankhan2003/project-runner-landing"
                    }
                    target="_blank"
                  >
                    <Button
                      variant="outline"
                      className="flex items-center gap-2 bg-transparent"
                    >
                      <span>Code</span>
                      <Github className="w-4 h-4" />
                    </Button>
                  </Link>
                  <Link
                    href={"https://project-runner-landing-seven.vercel.app/"}
                    target="_blank"
                  >
                    <Button className="flex items-center gap-2">
                      <span>Live Demo</span>
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 text-center">
              <div className="flex items-center justify-center gap-2">
                <h4 className="text-2xl font-bold text-foreground">Forkify</h4>
                <span className="text-2xl">🍕😋</span>
              </div>

              <p className="text-muted-foreground text-lg leading-relaxed max-w-xs mx-auto">
                A recipe website that allows users to search and explore
                different meals. The website provides an interface for viewing
                ingredients, cooking steps, and bookmarking favorite recipes.
              </p>

              <div className="flex gap-4 items-center justify-center">
                <span className="px-4 py-2 bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 rounded-full font-medium">
                  HTML
                </span>
                <span className="px-4 py-2 bg-pink-100 text-pink-800 dark:bg-pink-950 dark:text-pink-300 rounded-full font-medium">
                  CSS
                </span>
                <span className="px-4 py-2 bg-yellow-100 text-yellow-600 dark:bg-yellow-950 dark:text-yellow-300 rounded-full font-medium">
                  JS
                </span>
              </div>

              <div className="flex justify-center mt-7 gap-4">
                <Link
                  href={"https://github.com/rayankhan2003/forkify-main"}
                  target="_blank"
                >
                  <Button
                    variant="outline"
                    className="flex items-center gap-2 bg-transparent"
                  >
                    <span>Code</span>
                    <Github className="w-4 h-4" />
                  </Button>
                </Link>
                <Link
                  href={"https://forkify-rayan.netlify.app/"}
                  target="_blank"
                >
                  <Button className="flex items-center gap-2">
                    <span>Live Demo</span>
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative group overflow-hidden rounded-lg shadow-lg">
              <Image
                src="/images/forkify.webp"
                alt="Forkify recipe website screenshot"
                width={600}
                height={400}
                className="w-full h-auto transition-transform duration-500 group-hover:scale-105"
              />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
