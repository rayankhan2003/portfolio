import { ExternalLink, Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function Projects() {
  return (
    <section className="py-20 px-6 max-w-6xl mx-auto bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="mb-16 space-y-4">
          <h2 className="text-gray-900 font-extrabold text-lg">My Projects</h2>
          <h3 className="text-4xl font-bold text-gray-900">
            Each project is a unique piece of development 💸
          </h3>
        </div>

        <div className="space-y-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 text-center">
              <div className="flex items-center justify-center gap-2">
                <h4 className="text-2xl font-bold text-gray-900">StayEase</h4>
                <span className="text-2xl">🏨</span>
              </div>

              <p className="text-gray-700 text-lg leading-relaxed max-w-xs mx-auto">
                A hotel management system that delivers seamless room bookings,
                efficient check-ins, and streamlined branch operations. The
                platform provides an interface for exploring room options,
                managing reservations, and enabling role-based workflows that
                enhance service quality and overall guest satisfaction.
              </p>

              <div className="flex gap-4 items-center justify-center">
                <span className="px-4 py-2 bg-gray-200 text-gray-800 rounded-full font-medium">
                  NextJs
                </span>
                <span className="px-4 py-2 bg-blue-100 text-blue-500 rounded-full font-medium">
                  tailwindCSS
                </span>
                <span className="px-4 py-2 bg-orange-100 text-orange-500 rounded-full font-medium">
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
            <div className="relative">
              <Image
                src="/images/stayease.png"
                alt="Car Rental Website Mockup"
                width={600}
                height={600}
                className="w-full h-auto rounded-lg shadow-lg"
              />
            </div>
          </div>
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <Image
                src="/images/project-runner.png"
                alt="Project runner Website Mockup"
                width={600}
                height={600}
                className="w-full h-auto rounded-lg shadow-lg"
              />
            </div>

            <div className="space-y-6">
              <div className="space-y-2 text-center">
                <div className="flex justify-center items-center gap-2">
                  <h4 className="text-lg font-bold text-gray-900">
                    Project Runner
                  </h4>
                  <span className="text-lg">🧱⚒️</span>
                </div>

                <p className="text-gray-700 text-lg leading-relaxed max-w-xs mx-auto">
                  Project Runner is an all-in-one construction site management
                  platform designed to eliminate operational chaos and
                  streamline day-to-day site coordination. Built specifically
                  for builders and construction teams, the platform centralizes
                  material requests, deliveries, and on-site workflows into a
                  single, easy-to-use system.
                </p>

                <div className="flex justify-center gap-6 text-md font-bold">
                  <span className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full font-medium">
                    React
                  </span>
                  <span className="px-4 py-2 bg-pink-100 text-pink-800 rounded-full font-medium">
                    Tailwind
                  </span>
                  <span className="px-4 py-2 bg-yellow-100 text-yellow-600 rounded-full font-medium">
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
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 text-center">
              <div className="flex items-center justify-center gap-2">
                <h4 className="text-2xl font-bold text-gray-900">Forkify</h4>
                <span className="text-2xl">🍕😋</span>
              </div>

              <p className="text-gray-700 text-lg leading-relaxed max-w-xs mx-auto">
                A recipe website that allows users to search and explore
                different meals. The website provides an interface for viewing
                ingredients, cooking steps, and bookmarking favorite recipes.
              </p>

              <div className="flex gap-4 items-center justify-center">
                <span className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full font-medium">
                  HTML
                </span>
                <span className="px-4 py-2 bg-pink-100 text-pink-800 rounded-full font-medium">
                  CSS
                </span>
                <span className="px-4 py-2 bg-yellow-100 text-yellow-600 rounded-full font-medium">
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
            <div className="relative">
              <Image
                src="/images/omnifood.png"
                alt="Car Rental Website Mockup"
                width={600}
                height={400}
                className="w-full h-auto rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
