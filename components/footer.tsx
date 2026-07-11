import { GithubLogo, LinkedinLogo } from "@phosphor-icons/react/dist/ssr";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-secondary/60 font-mono text-xs">
      <div className="flex items-center justify-between max-w-7xl mx-auto px-4 sm:px-6 py-2.5">
        <p className="flex items-center gap-2 text-muted-foreground">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
          </span>
          main · © {new Date().getFullYear()} rayankhan.dev
        </p>
        <div className="flex items-center gap-3 text-muted-foreground">
          <a
            href="https://www.linkedin.com/in/rayankhanwebdev"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn profile"
            className="w-8 h-8 flex items-center justify-center hover:text-primary transition-colors"
          >
            <LinkedinLogo weight="light" size={16} />
          </a>
          <a
            href="https://github.com/rayankhan2003"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub profile"
            className="w-8 h-8 flex items-center justify-center hover:text-primary transition-colors"
          >
            <GithubLogo weight="light" size={16} />
          </a>
        </div>
      </div>
    </footer>
  );
}
