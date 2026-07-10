import { GithubLogo, LinkedinLogo } from "@phosphor-icons/react/dist/ssr";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-background text-foreground text-center py-6 px-6">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <p className="text-sm text-muted-foreground">
          Copyright ©{new Date().getFullYear()} All rights are reserved
        </p>
        <div className="flex items-center gap-2">
          <a
            href="https://www.linkedin.com/in/rayankhanwebdev"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn profile"
            className="w-11 h-11 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
          >
            <LinkedinLogo weight="light" size={20} />
          </a>
          <a
            href="https://github.com/rayankhan2003"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub profile"
            className="w-11 h-11 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
          >
            <GithubLogo weight="light" size={20} />
          </a>
        </div>
      </div>
    </footer>
  );
}
