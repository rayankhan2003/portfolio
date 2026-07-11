import TextType from "@/components/reactbits/text-type";

interface SectionPromptProps {
  path: string;
  command: string;
  className?: string;
}

/** `rayan@portfolio:~/path $ command` — typed once when the section enters view. */
export default function SectionPrompt({
  path,
  command,
  className,
}: SectionPromptProps) {
  return (
    <p className={`font-mono text-sm sm:text-base text-muted-foreground ${className ?? ""}`}>
      <span className="text-primary">rayan@portfolio</span>
      <span>:~/{path} $ </span>
      <TextType
        as="span"
        text={command}
        typingSpeed={45}
        loop={false}
        startOnVisible
        cursorCharacter="▌"
        cursorClassName="text-primary"
        className="text-foreground"
      />
    </p>
  );
}
