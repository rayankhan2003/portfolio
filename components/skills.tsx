import Reveal from "@/components/reveal";
import Counter from "@/components/counter";
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
} from "@/components/tech-icons";

const SKILL_GROUPS = [
  {
    title: "Frontend",
    span: "md:col-span-2",
    icons: [
      { Icon: HtmlIcon, name: "HTML" },
      { Icon: CssIcon, name: "CSS" },
      { Icon: JavaScriptIcon, name: "JavaScript" },
      { Icon: ReactIcon, name: "React" },
      { Icon: TailwindIcon, name: "Tailwind" },
      { Icon: NextJsIcon, name: "Next.js", invert: true },
      { Icon: ShadcnIcon, name: "shadcn/ui", invert: true },
    ],
  },
  {
    title: "Backend",
    span: "md:col-span-1",
    icons: [
      { Icon: PythonIcon, name: "Python" },
      { Icon: FlaskIcon, name: "Flask" },
      { Icon: MongoDbIcon, name: "MongoDB" },
      { Icon: PostgresqlIcon, name: "PostgreSQL" },
      { Icon: SupabaseIcon, name: "Supabase" },
    ],
  },
  {
    title: "Tools & Version Control",
    span: "md:col-span-3",
    icons: [
      { Icon: GitHubIcon, name: "GitHub", invert: true },
      { Icon: GitLabIcon, name: "GitLab" },
    ],
  },
];

const STATS = [
  { to: 3, suffix: "+", label: "Projects Shipped" },
  { to: 2, suffix: "+", label: "Years Learning & Building" },
  { to: 14, suffix: "+", label: "Tools & Technologies" },
];

export default function Skills() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-24">
      <Reveal className="mb-16 space-y-4 text-center lg:text-left">
        <h2 className="text-4xl font-bold text-foreground">Skills & Stack</h2>
      </Reveal>

      <div className="grid md:grid-cols-3 gap-8 mb-16">
        {SKILL_GROUPS.map((group, i) => (
          <Reveal key={group.title} delay={i * 0.1} className={group.span}>
            <div className="rounded-2xl bg-card p-8 h-full shadow-[0_8px_30px_-10px_oklch(0.551_0.169_46_/_0.12)]">
              <h3 className="text-lg font-bold text-foreground mb-6">
                {group.title}
              </h3>
              <div className="flex flex-wrap gap-6">
                {group.icons.map(({ Icon, name, invert }) => (
                  <div
                    key={name}
                    className="flex flex-col items-center gap-2 w-16"
                  >
                    <Icon className={`w-8 h-8 ${invert ? "dark:invert" : ""}`} />
                    <span className="text-xs text-muted-foreground text-center">
                      {name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.2}>
        <div className="grid grid-cols-3 gap-4 rounded-2xl bg-card py-8 px-4 shadow-[0_8px_30px_-10px_oklch(0.551_0.169_46_/_0.12)]">
          {STATS.map((stat) => (
            <div key={stat.label} className="text-center">
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
      </Reveal>
    </section>
  );
}
