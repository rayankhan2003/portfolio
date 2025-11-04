import Image from "next/image";
import { MapPin } from "lucide-react";

export default function About() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-24">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        {/* Hero Image with Badge */}
        <div className="relative">
          <div className="relative rounded-2xl overflow-hidden shadow-2xl">
            <Image
              src="/images/workspace.jpg"
              alt="Developer workspace with laptop, tablet, and coffee"
              width={600}
              height={400}
              className="w-full h-auto object-cover"
            />
          </div>

          {/* Circular Badge */}
          <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-white rounded-full shadow-lg flex items-center justify-center border-4 border-white">
            <div className="relative w-30 h-30">
              {/* Circular Text */}
              <svg
                className="w-full h-full animate-spin-slow"
                viewBox="0 0 100 100"
              >
                <defs>
                  <path
                    id="circle"
                    d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0"
                  />
                </defs>
                <text className="text-[10px] font-serif font-medium fill-gray-900 tracking-wider">
                  <textPath href="#circle">
                    DEVELOPER • FRONT END • WEB •
                  </textPath>
                </text>
              </svg>

              {/* Center Avatar */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-12 h-12 rounded-full flex items-center justify-center">
                  <span className="text-white  text-5xl">👨‍💻</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-6">
          <div className="space-y-2">
            <p className="text-gray-900 font-extrabold text-lg tracking-wide uppercase">
              About Me
            </p>
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
              A Creative Frontend Developer based in Peshawar, Pakistan{" "}
              <MapPin className="inline-block w-8 h-8 text-red-500 ml-1" />
            </h1>
          </div>

          <p className="text-gray-600 text-lg leading-relaxed text-justify">
            I’m Rayan Khan, a Full-Stack Developer who enjoys working across
            both the front-end and back-end of modern web applications. On the
            front-end, I focus on creating clean, responsive interfaces with
            React and Tailwind, while on the back-end I build reliable APIs and
            server logic using Node.js. I like writing code that not only works
            but also makes life easier for the people using it. Beyond the
            technical side, I value working with others, sharing ideas, and
            learning new approaches to solve real problems through technology.
          </p>
        </div>
      </div>
    </section>
  );
}
