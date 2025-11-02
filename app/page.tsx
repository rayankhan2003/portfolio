import About from "@/components/about";
import Footer from "@/components/footer";
import Header from "@/components/header";
import Hero from "@/components/hero";
import Projects from "@/components/projects";

export default function Home() {
  return (
    <div className="w-full ">
      <div className=" grid-background  sticky top-0 z-50 ">
        <Header />
      </div>
      <main className="scroll-smooth">
        <div className="grid-background">
          <section id="home" className="min-h-screen flex items-center ">
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
