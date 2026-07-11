"use client";
import Reveal from "@/components/reveal";
import Counter from "@/components/counter";
import SectionPrompt from "@/components/section-prompt";
import TerminalWindow from "@/components/terminal-window";
import SkillOrbs from "@/components/three/skill-orbs";
import type { OrbSkill } from "@/components/three/skill-orb-field";
import {
  HtmlIcon,
  CssIcon,
  JavaScriptIcon,
  ReactIcon,
  TailwindIcon,
  MongoDbIcon,
  NextJsIcon,
  ShadcnIcon,
  PythonIcon,
  FlaskIcon,
  PostgresqlIcon,
  SupabaseIcon,
  GitHubIcon,
  GitLabIcon,
  TypeScriptIcon,
  NodeJsIcon,
  FigmaIcon,
  PostmanIcon,
  GitIcon,
} from "@/components/tech-icons";

const SKILLS: OrbSkill[] = [
  // core — used across nearly every project
  { name: "HTML", tier: "core", Icon: HtmlIcon, color: "#E44D26" },
  { name: "CSS", tier: "core", Icon: CssIcon, color: "#264DE4" },
  { name: "JavaScript", tier: "core", Icon: JavaScriptIcon, color: "#F7DF1E" },
  { name: "React", tier: "core", Icon: ReactIcon, color: "#61DAFB" },
  { name: "Tailwind", tier: "core", Icon: TailwindIcon, color: "#06B6D4" },
  { name: "Next.js", tier: "core", Icon: NextJsIcon, color: "#111111", invert: true },
  // working knowledge — used on specific projects
  { name: "TypeScript", tier: "working", Icon: TypeScriptIcon, color: "#3178C6" },
  { name: "Node.js", tier: "working", Icon: NodeJsIcon, color: "#339933" },
  { name: "shadcn/ui", tier: "working", Icon: ShadcnIcon, color: "#f5f5f5", invert: true },
  { name: "Python", tier: "working", Icon: PythonIcon, color: "#3776AB" },
  { name: "Flask", tier: "working", Icon: FlaskIcon, color: "#3BABC3" },
  { name: "MongoDB", tier: "working", Icon: MongoDbIcon, color: "#599636" },
  { name: "PostgreSQL", tier: "working", Icon: PostgresqlIcon, color: "#4169E1" },
  { name: "Supabase", tier: "working", Icon: SupabaseIcon, color: "#3FCF8E" },
  // familiar — tools, not deep usage
  { name: "Git", tier: "familiar", Icon: GitIcon, color: "#F05032" },
  { name: "GitHub", tier: "familiar", Icon: GitHubIcon, color: "#fafafa", invert: true },
  { name: "GitLab", tier: "familiar", Icon: GitLabIcon, color: "#FC6D26" },
  { name: "Figma", tier: "familiar", Icon: FigmaIcon, color: "#A259FF" },
  { name: "Postman", tier: "familiar", Icon: PostmanIcon, color: "#FF6C37" },
];

const STATS = [
  { to: 4, suffix: "+", label: "projects_shipped" },
  { to: 2, suffix: "+", label: "years_building" },
  { to: 19, suffix: "+", label: "tools_loaded" },
];

export default function Skills() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-24">
      <h2 className="sr-only">Skills &amp; Stack</h2>
      <SectionPrompt path="skills" command="./scan-stack.sh --list" className="mb-10" />

      <Reveal>
        <div className="relative left-1/2 right-1/2 -mx-[50vw] w-screen px-4 sm:px-6">
          <TerminalWindow
            title="skills.gl"
            className="max-w-[1600px] mx-auto bg-transparent"
          >
            <SkillOrbs skills={SKILLS} />
          </TerminalWindow>
        </div>
        <p className="font-mono text-xs text-muted-foreground text-center mt-3">
          drag a balloon and let go to fling it — hover to see how deep the experience goes
        </p>
      </Reveal>

      <Reveal delay={0.15} className="mt-6">
        <TerminalWindow title="stack.status" contentClassName="p-6 sm:p-8">
          <div className="grid grid-cols-3 gap-4">
            {STATS.map((stat) => (
              <div key={stat.label} className="text-center font-mono">
                <Counter
                  to={stat.to}
                  suffix={stat.suffix}
                  className="text-3xl sm:text-4xl font-bold text-primary"
                />
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </TerminalWindow>
      </Reveal>
    </section>
  );
}
