import type { ReactNode } from "react";
import { FILE_LINES, BIO } from "@/components/about";
import { COMMITS } from "@/components/experience";
import { SKILLS } from "@/components/skills";

/** The slice of a Project the terminal needs — kept small because it is
 *  serialized from the server page into the client bundle. */
export interface TerminalProject {
  slug: string;
  title: string;
  shortDescription: string;
  technologies: string[];
  year: number | null;
  category: string;
  githubUrl: string | null;
  liveUrl: string | null;
}

export interface CommandContext {
  args: string[];
  projects: TerminalProject[];
  history: string[];
  theme: string | undefined;
  print: (node: ReactNode) => void;
  clear: () => void;
  close: () => void;
  /** scroll the page to a section, then close the terminal */
  goTo: (section: string) => void;
  navigate: (href: string) => void;
  openExternal: (href: string) => void;
  setTheme: (theme: string) => void;
  sleep: (ms: number) => Promise<void>;
}

interface Command {
  summary: string;
  usage?: string;
  /** left out of `help` — found by curiosity or `ls -a` */
  hidden?: boolean;
  run: (ctx: CommandContext) => void | Promise<void>;
  /** candidates for the argument being typed */
  complete?: (projects: TerminalProject[]) => string[];
}

export const LINKS = {
  github: "https://github.com/rayankhan2003",
  linkedin: "https://linkedin.com/in/rayankhanwebdev",
  resume: "/rayan-resume.pdf",
};

export const SECTIONS = ["home", "about", "experience", "skills", "projects", "github", "contact"];

const ROOT_ENTRIES = [
  { name: "about.md", kind: "file" },
  { name: "experience.log", kind: "file" },
  { name: "skills/", kind: "dir" },
  { name: "projects/", kind: "dir" },
  { name: "resume.pdf", kind: "file" },
  { name: "contact.sh", kind: "exec" },
];

/* ---------- output primitives ---------- */

export const Accent = ({ children }: { children: ReactNode }) => (
  <span className="text-primary">{children}</span>
);
export const Muted = ({ children }: { children: ReactNode }) => (
  <span className="text-muted-foreground">{children}</span>
);
export const Err = ({ children }: { children: ReactNode }) => (
  <span className="text-red-500 dark:text-red-400">{children}</span>
);

function Table({ rows }: { rows: [ReactNode, ReactNode][] }) {
  return (
    <div className="grid grid-cols-[max-content_1fr] gap-x-4 gap-y-0.5">
      {rows.map(([k, v], i) => (
        <div key={i} className="contents">
          <span className="text-primary">{k}</span>
          <span className="text-muted-foreground">{v}</span>
        </div>
      ))}
    </div>
  );
}

function ExtLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="underline decoration-dotted underline-offset-4 hover:text-primary"
    >
      {children}
    </a>
  );
}

/* ---------- helpers ---------- */

function findProject(projects: TerminalProject[], query: string) {
  const q = query.toLowerCase().replace(/^projects\//, "").replace(/\/$/, "");
  return (
    projects.find((p) => p.slug === q) ??
    projects.find((p) => p.title.toLowerCase().startsWith(q)) ??
    null
  );
}

function printProject(ctx: CommandContext, p: TerminalProject) {
  ctx.print(
    <div className="space-y-2">
      <p>
        <Accent>{p.title}</Accent>
        {p.year && <Muted> · {p.year}</Muted>}
        {p.category && <Muted> · {p.category}</Muted>}
      </p>
      <p className="text-foreground/90">{p.shortDescription}</p>
      <p>
        <Muted>stack: </Muted>
        {p.technologies.join(", ")}
      </p>
      <p className="flex flex-wrap gap-x-4">
        {p.liveUrl && <ExtLink href={p.liveUrl}>live ↗</ExtLink>}
        {p.githubUrl && <ExtLink href={p.githubUrl}>source ↗</ExtLink>}
        <Muted>
          run <Accent>open {p.slug}</Accent> for the full case study
        </Muted>
      </p>
    </div>
  );
}

function listProjects(ctx: CommandContext) {
  if (ctx.projects.length === 0) {
    ctx.print(<Muted>projects/ is empty — the index failed to load.</Muted>);
    return;
  }
  ctx.print(
    <Table
      rows={ctx.projects.map((p) => [
        `${p.slug}/`,
        `${p.year ?? "----"}  ${p.shortDescription}`,
      ])}
    />
  );
  ctx.print(
    <Muted>
      tip: <Accent>cat projects/&lt;name&gt;</Accent> for details,{" "}
      <Accent>open &lt;name&gt;</Accent> for the case study
    </Muted>
  );
}

function listSkills(ctx: CommandContext) {
  const tiers = [
    ["core", "core stack"],
    ["working", "working knowledge"],
    ["familiar", "familiar"],
  ] as const;
  ctx.print(
    <Table
      rows={tiers.map(([tier, label]) => [
        label,
        SKILLS.filter((s) => s.tier === tier)
          .map((s) => s.name)
          .join(" · "),
      ])}
    />
  );
}

function catAbout(ctx: CommandContext) {
  ctx.print(
    <div className="space-y-2">
      <Table rows={FILE_LINES.map(({ key, value }) => [`${key}:`, value])} />
      <p className="text-foreground/90 max-w-prose">{BIO}</p>
    </div>
  );
}

function catExperience(ctx: CommandContext) {
  ctx.print(
    <div className="space-y-2">
      {COMMITS.map((c) => (
        <div key={c.hash}>
          <p>
            <span className="text-yellow-600 dark:text-yellow-400">commit {c.hash}</span>
            {"tag" in c && c.tag && <Accent> ({c.tag})</Accent>}
            <Muted> · {c.date}</Muted>
          </p>
          <p className="pl-4 text-foreground/90">{c.title}</p>
          <p className="pl-4 text-muted-foreground">{c.body}</p>
        </div>
      ))}
    </div>
  );
}

const startedAt = typeof performance !== "undefined" ? performance.now() : 0;
function uptime() {
  const s = Math.floor((performance.now() - startedAt) / 1000);
  const m = Math.floor(s / 60);
  return m > 0 ? `${m}m ${s % 60}s` : `${s}s`;
}

const LOGO = String.raw`
 ____  _  __
|  _ \| |/ /
| |_) | ' /
|  _ <| . \
|_| \_\_|\_\
`;

/* ---------- the command table ---------- */

export const COMMANDS: Record<string, Command> = {
  help: {
    summary: "list available commands",
    run: (ctx) => {
      const visible = Object.entries(COMMANDS).filter(([, c]) => !c.hidden);
      ctx.print(
        <div className="space-y-2">
          <Table
            rows={visible.map(([name, c]) => [c.usage ?? name, c.summary])}
          />
          <Muted>
            ↑/↓ history · tab autocomplete · ctrl+l clear · esc close. some
            commands aren&apos;t listed here.
          </Muted>
        </div>
      );
    },
  },
  whoami: {
    summary: "who is this guy?",
    run: (ctx) =>
      ctx.print(
        <span>
          <Accent>rayan khan</Accent> — full-stack web developer from Peshawar,
          Pakistan. React · Next.js · Node.js. currently{" "}
          <Accent>open to work</Accent>.
        </span>
      ),
  },
  ls: {
    summary: "list files",
    usage: "ls [dir]",
    complete: () => ["projects", "skills", "-a"],
    run: (ctx) => {
      const target = ctx.args.find((a) => !a.startsWith("-"))?.replace(/\/$/, "");
      const all = ctx.args.includes("-a") || ctx.args.includes("-la");
      if (!target || target === "~" || target === ".") {
        ctx.print(
          <div className="flex flex-wrap gap-x-6">
            {all && <Muted>.secrets</Muted>}
            {ROOT_ENTRIES.map((e) => (
              <span
                key={e.name}
                className={
                  e.kind === "dir"
                    ? "text-primary"
                    : e.kind === "exec"
                      ? "text-green-600 dark:text-green-400"
                      : ""
                }
              >
                {e.name}
              </span>
            ))}
          </div>
        );
      } else if (target === "projects") listProjects(ctx);
      else if (target === "skills") listSkills(ctx);
      else ctx.print(<Err>ls: {target}: No such file or directory</Err>);
    },
  },
  cat: {
    summary: "print a file",
    usage: "cat <file>",
    complete: (projects) => [
      "about.md",
      "experience.log",
      "resume.pdf",
      "contact.sh",
      ...projects.map((p) => `projects/${p.slug}`),
    ],
    run: (ctx) => {
      const file = ctx.args[0];
      if (!file) return ctx.print(<Err>cat: missing file operand</Err>);
      if (file === "about.md") return catAbout(ctx);
      if (file === "experience.log") return catExperience(ctx);
      if (file === ".secrets")
        return ctx.print(
          <span>
            the real secret: every ball in <Accent>~/skills</Accent> can be
            thrown. also try <Accent>sudo hire-me</Accent>.
          </span>
        );
      if (file === "resume.pdf")
        return ctx.print(
          <Muted>
            binary file — run <Accent>open resume</Accent> to view it
          </Muted>
        );
      if (file === "contact.sh")
        return ctx.print(
          <pre className="whitespace-pre-wrap">{`#!/bin/sh\n# the fastest way to reach me\n./contact.sh  →  jumps to the contact form`}</pre>
        );
      if (file.startsWith("projects/")) {
        const p = findProject(ctx.projects, file);
        if (p) return printProject(ctx, p);
      }
      if (file === "skills" || file === "projects")
        return ctx.print(<Err>cat: {file}: Is a directory</Err>);
      ctx.print(<Err>cat: {file}: No such file or directory</Err>);
    },
  },
  cd: {
    summary: "jump to a section",
    usage: "cd <section>",
    complete: () => SECTIONS,
    run: (ctx) => {
      const raw = (ctx.args[0] ?? "~").replace(/^~\/?/, "").replace(/\/$/, "");
      const section = raw === "" || raw === ".." ? "home" : raw;
      if (SECTIONS.includes(section)) return ctx.goTo(section);
      ctx.print(<Err>cd: no such directory: {ctx.args[0]}</Err>);
    },
  },
  projects: {
    summary: "list my projects",
    run: listProjects,
  },
  open: {
    summary: "open a project, resume, github or linkedin",
    usage: "open <name>",
    complete: (projects) => ["resume", "github", "linkedin", ...projects.map((p) => p.slug)],
    run: (ctx) => {
      const what = ctx.args[0];
      if (!what) return ctx.print(<Err>open: what should I open? try `ls projects`</Err>);
      if (what === "resume" || what === "resume.pdf" || what === "cv")
        return ctx.openExternal(LINKS.resume);
      if (what === "github") return ctx.openExternal(LINKS.github);
      if (what === "linkedin") return ctx.openExternal(LINKS.linkedin);
      const p = findProject(ctx.projects, what);
      if (p) {
        ctx.print(<Muted>opening {p.title}…</Muted>);
        return ctx.navigate(`/projects/${p.slug}`);
      }
      ctx.print(<Err>open: {what}: not found. try `ls projects`</Err>);
    },
  },
  about: { summary: "alias for cat about.md", run: catAbout },
  experience: { summary: "alias for cat experience.log", run: catExperience },
  skills: { summary: "what I work with", run: listSkills },
  resume: {
    summary: "open my CV",
    run: (ctx) => ctx.openExternal(LINKS.resume),
  },
  socials: {
    summary: "where to find me",
    run: (ctx) =>
      ctx.print(
        <Table
          rows={[
            ["github", <ExtLink key="g" href={LINKS.github}>github.com/rayankhan2003</ExtLink>],
            ["linkedin", <ExtLink key="l" href={LINKS.linkedin}>linkedin.com/in/rayankhanwebdev</ExtLink>],
          ]}
        />
      ),
  },
  contact: {
    summary: "get in touch",
    run: (ctx) => ctx.goTo("contact"),
  },
  neofetch: {
    summary: "system info",
    run: (ctx) =>
      ctx.print(
        <div className="flex flex-col sm:flex-row gap-x-6 gap-y-2">
          <pre className="text-primary leading-tight">{LOGO}</pre>
          <div>
            <p>
              <Accent>rayan</Accent>@<Accent>portfolio</Accent>
            </p>
            <p className="text-muted-foreground">-----------------</p>
            <Table
              rows={[
                ["OS", "Next.js 15 · React 19"],
                ["Host", "rayankhan.dev"],
                ["Shell", "portfolio-sh 1.0"],
                ["Uptime", `${uptime()} (this visit)`],
                ["Location", "Peshawar, PK"],
                ["Stack", "React · Next.js · Node.js"],
                ["Projects", `${ctx.projects.length} shipped`],
                ["Theme", ctx.theme ?? "system"],
                ["Status", "open to work"],
              ]}
            />
            <div className="mt-2 flex gap-1" aria-hidden>
              {["bg-red-500", "bg-yellow-400", "bg-green-500", "bg-sky-500", "bg-primary", "bg-foreground"].map(
                (c) => (
                  <span key={c} className={`h-3 w-5 ${c}`} />
                )
              )}
            </div>
          </div>
        </div>
      ),
  },
  theme: {
    summary: "switch theme",
    usage: "theme [dark|light]",
    complete: () => ["dark", "light"],
    run: (ctx) => {
      const next = ctx.args[0] ?? (ctx.theme === "dark" ? "light" : "dark");
      if (next !== "dark" && next !== "light")
        return ctx.print(<Err>theme: expected dark or light</Err>);
      ctx.setTheme(next);
      ctx.print(<Muted>theme set to {next}</Muted>);
    },
  },
  history: {
    summary: "previous commands",
    run: (ctx) =>
      ctx.print(
        <div>
          {ctx.history.map((h, i) => (
            <p key={i}>
              <Muted>{String(i + 1).padStart(4)} </Muted>
              {h}
            </p>
          ))}
        </div>
      ),
  },
  clear: { summary: "clear the screen", run: (ctx) => ctx.clear() },
  exit: { summary: "close the terminal", run: (ctx) => ctx.close() },

  /* ---- not in help: for the curious ---- */
  pwd: { summary: "", hidden: true, run: (ctx) => ctx.print("/home/rayan/portfolio") },
  date: { summary: "", hidden: true, run: (ctx) => ctx.print(new Date().toString()) },
  echo: { summary: "", hidden: true, run: (ctx) => ctx.print(ctx.args.join(" ")) },
  "./contact.sh": { summary: "", hidden: true, run: (ctx) => ctx.goTo("contact") },
  sudo: {
    summary: "",
    hidden: true,
    run: async (ctx) => {
      const rest = ctx.args.join(" ");
      if (rest === "hire-me" || rest === "hire rayan" || rest === "hire-rayan") {
        ctx.print(<Muted>[sudo] password for recruiter: ********</Muted>);
        await ctx.sleep(600);
        ctx.print(<Accent>✔ access granted. excellent decision.</Accent>);
        await ctx.sleep(700);
        return ctx.goTo("contact");
      }
      if (rest.startsWith("rm")) return COMMANDS.rm.run({ ...ctx, args: ctx.args.slice(1) });
      ctx.print(
        <span>
          rayan is not in the sudoers file. this incident will be reported.{" "}
          <Muted>(try `sudo hire-me`)</Muted>
        </span>
      );
    },
  },
  rm: {
    summary: "",
    hidden: true,
    run: async (ctx) => {
      if (!ctx.args.some((a) => a.includes("r")) || !ctx.args.some((a) => a === "/" || a === "/*")) {
        return ctx.print(<Err>rm: permission denied. nice try.</Err>);
      }
      for (const path of ["/usr/bin", "/etc/passwd", "~/projects", "~/skills", "~/about.md", "/boot/kernel"]) {
        ctx.print(<Err>removed &apos;{path}&apos;</Err>);
        await ctx.sleep(220);
      }
      await ctx.sleep(500);
      ctx.print(<span>…just kidding. everything&apos;s version controlled. 😌</span>);
    },
  },
  vim: {
    summary: "",
    hidden: true,
    run: (ctx) =>
      ctx.print(<span>you are now trapped in vim forever. <Muted>(type `:q` to escape)</Muted></span>),
  },
  ":q": { summary: "", hidden: true, run: (ctx) => ctx.print(<Accent>you escaped vim. few ever do.</Accent>) },
  coffee: {
    summary: "",
    hidden: true,
    run: (ctx) =>
      ctx.print(<pre className="text-primary">{"  ( (\n   ) )\n ........\n |      |]\n \\      /\n  `----'  brewing… this is what powers the code."}</pre>),
  },
  hello: { summary: "", hidden: true, run: (ctx) => ctx.print("hey 👋 type `help` to look around.") },
  hi: { summary: "", hidden: true, run: (ctx) => ctx.print("hey 👋 type `help` to look around.") },
  ping: { summary: "", hidden: true, run: (ctx) => ctx.print("pong — ~12ms from Peshawar") },
};

export const ALIASES: Record<string, string> = {
  "cat about": "cat about.md",
  "ls -la": "ls -a",
  man: "help",
  "?": "help",
  cls: "clear",
  q: "exit",
  quit: "exit",
  cv: "resume",
  github: "open github",
  linkedin: "open linkedin",
  email: "contact",
  "hire-me": "sudo hire-me",
};

/** Complete the word under the cursor: a command name, or its argument. */
export function complete(input: string, projects: TerminalProject[]): string[] {
  const parts = input.split(/\s+/);
  if (parts.length <= 1) {
    const q = parts[0] ?? "";
    return Object.entries(COMMANDS)
      .filter(([name, c]) => !c.hidden && name.startsWith(q))
      .map(([name]) => name);
  }
  const cmd = COMMANDS[parts[0]];
  const q = parts[parts.length - 1];
  return (cmd?.complete?.(projects) ?? []).filter((c) => c.startsWith(q));
}
