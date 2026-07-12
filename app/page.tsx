import About from "@/components/about";
import Footer from "@/components/footer";
import Header from "@/components/header";
import Hero from "@/components/hero";
import HeroBackground from "@/components/hero-background";
import Experience from "@/components/experience";
import Skills from "@/components/skills";
import FeaturedProjects from "@/components/featured-projects";
import GithubActivity from "@/components/github-activity";
import Contact from "@/components/contact";

export default function Home() {
  return (
    <div className="w-full ">
      <div className="sticky top-0 z-50">
        <Header />
      </div>
      <main>
        <div className="relative">
          {/* canvas extends up behind the transparent sticky header */}
          <div className="absolute inset-x-0 -top-24 bottom-0 overflow-hidden">
            <HeroBackground />
          </div>
          <section
            id="home"
            className="relative min-h-[100dvh] flex items-center"
          >
            <Hero />
          </section>
        </div>
        <section id="about" className="min-h-[100dvh] flex items-center">
          <About />
        </section>
        <section id="experience" className="flex items-center">
          <Experience />
        </section>
        <section id="skills" className="flex items-center">
          <Skills />
        </section>
        <section id="projects">
          <FeaturedProjects />
        </section>
        <section id="github" className="flex items-center">
          <GithubActivity />
        </section>
        <section id="contact" className="flex items-center">
          <Contact />
        </section>
        <Footer />
      </main>
    </div>
  );
}
