import { cn } from "@/lib/utils";

interface TerminalWindowProps {
  title?: string;
  className?: string;
  contentClassName?: string;
  children: React.ReactNode;
}

/** Editor/terminal window chrome: traffic lights + title bar around any content. */
export default function TerminalWindow({
  title,
  className,
  contentClassName,
  children,
}: TerminalWindowProps) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-lg border border-border bg-card shadow-[0_16px_48px_-12px_rgb(0_0_0/0.35)]",
        className
      )}
    >
      <div className="flex items-center gap-2 border-b border-border bg-secondary/60 px-4 py-2.5">
        <span className="flex gap-1.5" aria-hidden="true">
          <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
          <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
          <span className="h-3 w-3 rounded-full bg-[#28c840]" />
        </span>
        {title && (
          <span className="ml-2 truncate font-mono text-xs text-muted-foreground">
            {title}
          </span>
        )}
      </div>
      <div className={cn("p-0", contentClassName)}>{children}</div>
    </div>
  );
}
