import Link from "next/link";
import { Star, GitFork, ArrowSquareOut } from "@phosphor-icons/react/dist/ssr";
import SectionPrompt from "@/components/section-prompt";
import TerminalWindow from "@/components/terminal-window";
import GithubShards from "@/components/three/github-shards";
import ContributionChart from "@/components/three/contribution-chart";

const USERNAME = "rayankhan2003";

interface GithubProfile {
  public_repos: number;
  followers: number;
  following: number;
  created_at: string;
}

interface GithubRepo {
  name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
}

async function getGithubData() {
  try {
    const [profileRes, reposRes] = await Promise.all([
      fetch(`https://api.github.com/users/${USERNAME}`, {
        next: { revalidate: 3600 },
        headers: { Accept: "application/vnd.github+json" },
      }),
      fetch(
        `https://api.github.com/users/${USERNAME}/repos?sort=updated&per_page=4`,
        { next: { revalidate: 3600 }, headers: { Accept: "application/vnd.github+json" } }
      ),
    ]);

    if (!profileRes.ok || !reposRes.ok) return null;

    const profile: GithubProfile = await profileRes.json();
    const repos: GithubRepo[] = await reposRes.json();
    return { profile, repos };
  } catch {
    return null;
  }
}

export default async function GithubActivity() {
  const data = await getGithubData();
  const memberSince = data
    ? new Date(data.profile.created_at).getFullYear()
    : null;

  return (
    <section className="relative max-w-6xl mx-auto px-6 py-24">
      <GithubShards />
      <h2 className="sr-only">GitHub Activity</h2>
      <SectionPrompt
        path="github"
        command={`curl api.github.com/users/${USERNAME}`}
        className="mb-10"
      />

      {data ? (
        <div className="grid lg:grid-cols-[1fr_1.2fr] gap-6">
          <TerminalWindow title="profile.json" contentClassName="p-6 sm:p-8">
            <dl className="font-mono text-sm space-y-2 mb-6">
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">public_repos</dt>
                <dd className="text-primary">{data.profile.public_repos}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">followers</dt>
                <dd className="text-primary">{data.profile.followers}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">following</dt>
                <dd className="text-primary">{data.profile.following}</dd>
              </div>
              {memberSince && (
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">member_since</dt>
                  <dd className="text-primary">{memberSince}</dd>
                </div>
              )}
            </dl>
            <div className="h-px bg-border mb-6" />
            <p className="font-mono text-xs text-muted-foreground mb-3">
              contribution_graph
            </p>
            <ContributionChart username={USERNAME} />
          </TerminalWindow>

          <TerminalWindow title="recent-repos" contentClassName="p-6 sm:p-8">
            <div className="space-y-5">
              {data.repos.map((repo) => (
                <Link
                  key={repo.name}
                  href={repo.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block group"
                >
                  <div className="flex items-start justify-between gap-3">
                    <p className="font-mono text-sm text-foreground group-hover:text-primary transition-colors truncate">
                      {repo.name}
                    </p>
                    <ArrowSquareOut
                      weight="light"
                      className="w-4 h-4 text-muted-foreground shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    />
                  </div>
                  {repo.description && (
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                      {repo.description}
                    </p>
                  )}
                  <div className="flex items-center gap-4 mt-2 font-mono text-xs text-muted-foreground">
                    {repo.language && <span>{repo.language}</span>}
                    <span className="flex items-center gap-1">
                      <Star weight="light" className="w-3.5 h-3.5" />
                      {repo.stargazers_count}
                    </span>
                    <span className="flex items-center gap-1">
                      <GitFork weight="light" className="w-3.5 h-3.5" />
                      {repo.forks_count}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </TerminalWindow>
        </div>
      ) : (
        <TerminalWindow title="github.status" contentClassName="p-8 text-center">
          <p className="font-mono text-sm text-muted-foreground mb-4">
            couldn&apos;t reach the GitHub API right now
          </p>
          <Link
            href={`https://github.com/${USERNAME}`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-sm text-primary hover:underline"
          >
            view profile directly →
          </Link>
        </TerminalWindow>
      )}
    </section>
  );
}
