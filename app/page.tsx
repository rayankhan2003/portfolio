import About from "@/components/about";
import Footer from "@/components/footer";
import Header from "@/components/header";
import Hero from "@/components/hero";
import HeroBackground from "@/components/hero-background";
import Projects from "@/components/projects";

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
            className="relative min-h-screen flex items-center"
          >
            <Hero />
          </section>
        </div>
        <section id="about" className="min-h-screen flex items-center">
          <About />
        </section>
        <section id="projects" className="min-h-screen flex items-center">
          <Projects />
        </section>
        <Footer />
      </main>
    </div>
  );
}
