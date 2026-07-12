import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="min-h-dvh flex flex-col items-center justify-center gap-6 px-6 text-center">
      <p className="font-mono text-sm text-muted-foreground">
        <span className="text-primary">rayan@portfolio</span>:~ $ cat requested-page
      </p>
      <h1 className="font-pixel text-6xl sm:text-7xl">404</h1>
      <p className="text-muted-foreground font-mono text-sm">
        cat: requested-page: No such file or directory
      </p>
      <Button asChild className="font-mono">
        <Link href="/">cd ~</Link>
      </Button>
    </main>
  );
}
