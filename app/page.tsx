import About from "@/components/about";
import Footer from "@/components/footer";
import Header from "@/components/header";
import Hero from "@/components/hero";
import Projects from "@/components/projects";

export default function Home() {
  return (
    <div className="min-h-screen">
      <div className="grid-background">
        <Header />
        <section id="home" className="min-h-screen flex items-center">
          <Hero />
        </section>
      </div>
      <main className="scroll-smooth">
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
