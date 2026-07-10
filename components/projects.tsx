import { ArrowSquareOut, GithubLogo } from "@phosphor-icons/react/dist/ssr";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/reveal";

function TechTag({ children }: { children: React.ReactNode }) {
  return (
    <span className="px-4 py-2 bg-secondary text-secondary-foreground rounded-full font-medium text-sm">
      {children}
    </span>
  );
}

export default function Projects() {
  return (
    <section className="py-20 px-6 max-w-6xl mx-auto">
      <div className="max-w-6xl mx-auto">
        <Reveal className="mb-16 space-y-4">
          <p className="text-primary font-extrabold text-lg tracking-wide uppercase">
            My Projects
          </p>
          <h2 className="text-4xl font-bold text-foreground">
            Each project is a unique piece of development
          </h2>
        </Reveal>

        <div className="space-y-20">
          <Reveal className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 text-center">
              <h3 className="text-2xl font-bold text-foreground">StayEase</h3>

              <p className="text-muted-foreground text-lg leading-relaxed max-w-xs mx-auto">
                A hotel management system that delivers seamless room bookings,
                efficient check-ins, and streamlined branch operations. The
                platform provides an interface for exploring room options,
                managing reservations, and enabling role-based workflows that
                enhance service quality and overall guest satisfaction.
              </p>

              <div className="flex gap-4 items-center justify-center">
                <TechTag>Next.js</TechTag>
                <TechTag>Tailwind CSS</TechTag>
                <TechTag>Supabase</TechTag>
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
                    <GithubLogo weight="light" className="w-4 h-4" />
                  </Button>
                </Link>
                <Link
                  href={"https://stay-ease-rayan.vercel.app/"}
                  target="_blank"
                >
                  <Button className="flex items-center gap-2">
                    <span>Live Demo</span>
                    <ArrowSquareOut weight="light" className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative group overflow-hidden rounded-lg shadow-[0_16px_48px_-12px_oklch(0.551_0.169_46_/_0.25)]">
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
            <div className="relative group overflow-hidden rounded-lg shadow-[0_16px_48px_-12px_oklch(0.551_0.169_46_/_0.25)] lg:order-2">
              <Image
                src="/images/project-runner.webp"
                alt="Project runner Website Mockup"
                width={600}
                height={600}
                className="w-full h-auto transition-transform duration-500 group-hover:scale-105"
              />
            </div>

            <div className="space-y-6 lg:order-1">
              <div className="space-y-2 text-center">
                <h3 className="text-2xl font-bold text-foreground">
                  Project Runner
                </h3>

                <p className="text-muted-foreground text-lg leading-relaxed max-w-xs mx-auto">
                  Project Runner is an all-in-one construction site management
                  platform designed to eliminate operational chaos and
                  streamline day-to-day site coordination. Built specifically
                  for builders and construction teams, the platform centralizes
                  material requests, deliveries, and on-site workflows into a
                  single, easy-to-use system.
                </p>

                <div className="flex justify-center gap-4">
                  <TechTag>React</TechTag>
                  <TechTag>Tailwind CSS</TechTag>
                  <TechTag>JavaScript</TechTag>
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
                      <GithubLogo weight="light" className="w-4 h-4" />
                    </Button>
                  </Link>
                  <Link
                    href={"https://project-runner-landing-seven.vercel.app/"}
                    target="_blank"
                  >
                    <Button className="flex items-center gap-2">
                      <span>Live Demo</span>
                      <ArrowSquareOut weight="light" className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal>
            <div className="rounded-2xl bg-card shadow-[0_8px_30px_-10px_oklch(0.551_0.169_46_/_0.15)] p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-8">
              <div className="relative shrink-0 w-full sm:w-48 aspect-square overflow-hidden rounded-xl group">
                <Image
                  src="/images/forkify.webp"
                  alt="Forkify recipe website screenshot"
                  width={400}
                  height={400}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              <div className="flex-1 text-center sm:text-left space-y-4">
                <h3 className="text-2xl font-bold text-foreground">Forkify</h3>

                <p className="text-muted-foreground text-lg leading-relaxed">
                  A recipe website that allows users to search and explore
                  different meals. The website provides an interface for
                  viewing ingredients, cooking steps, and bookmarking favorite
                  recipes.
                </p>

                <div className="flex gap-4 items-center justify-center sm:justify-start flex-wrap">
                  <TechTag>HTML</TechTag>
                  <TechTag>CSS</TechTag>
                  <TechTag>JavaScript</TechTag>
                </div>

                <div className="flex justify-center sm:justify-start gap-4 pt-1">
                  <Link
                    href={"https://github.com/rayankhan2003/forkify-main"}
                    target="_blank"
                  >
                    <Button
                      variant="outline"
                      className="flex items-center gap-2 bg-transparent"
                    >
                      <span>Code</span>
                      <GithubLogo weight="light" className="w-4 h-4" />
                    </Button>
                  </Link>
                  <Link
                    href={"https://forkify-rayan.netlify.app/"}
                    target="_blank"
                  >
                    <Button className="flex items-center gap-2">
                      <span>Live Demo</span>
                      <ArrowSquareOut weight="light" className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
