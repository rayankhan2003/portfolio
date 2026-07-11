"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { AnimatePresence, motion } from "motion/react";
import { CircleNotch, PaperPlaneTilt, CheckCircle } from "@phosphor-icons/react/dist/ssr";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Reveal from "@/components/reveal";
import SectionPrompt from "@/components/section-prompt";
import TerminalWindow from "@/components/terminal-window";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Enter a valid email address"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactFormValues = z.infer<typeof contactSchema>;

function FieldPrompt({
  label,
  htmlFor,
  error,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={htmlFor} className="font-mono text-sm text-primary">
        {label}&gt;
      </label>
      {children}
      {error && <p className="text-sm text-destructive font-mono">{error}</p>}
    </div>
  );
}

export default function Contact() {
  const [status, setStatus] = useState<"idle" | "success">("idle");
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (values: ContactFormValues) => {
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Something went wrong");
      }
      setStatus("success");
      toast.success("Message sent! I'll get back to you soon.");
      reset();
      setTimeout(() => setStatus("idle"), 3500);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to send message"
      );
    }
  };

  return (
    <section className="max-w-2xl mx-auto px-6 py-24">
      <h2 className="sr-only">Contact</h2>
      <SectionPrompt path="contact" command="./send-message.sh" className="mb-10" />

      <Reveal>
        <TerminalWindow title="contact.sh" contentClassName="p-6 sm:p-8">
          <AnimatePresence mode="wait">
            {status === "success" ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="font-mono text-sm space-y-2 py-8"
              >
                <p className="text-muted-foreground">$ ./send-message.sh</p>
                <p className="text-primary flex items-center gap-2">
                  <CheckCircle weight="light" className="w-4 h-4" />
                  250 message queued for delivery
                </p>
                <p className="text-muted-foreground">process exited, code 0</p>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                exit={{ opacity: 0 }}
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-5"
              >
                <FieldPrompt label="name" htmlFor="name" error={errors.name?.message}>
                  <Input
                    id="name"
                    placeholder="your name"
                    className="font-mono"
                    {...register("name")}
                  />
                </FieldPrompt>

                <FieldPrompt label="email" htmlFor="email" error={errors.email?.message}>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    className="font-mono"
                    {...register("email")}
                  />
                </FieldPrompt>

                <FieldPrompt label="message" htmlFor="message" error={errors.message?.message}>
                  <Textarea
                    id="message"
                    placeholder="tell me about your project..."
                    rows={5}
                    className="font-mono"
                    {...register("message")}
                  />
                </FieldPrompt>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full font-mono active:scale-[0.98] transition-transform"
                  size="lg"
                >
                  {isSubmitting ? (
                    <>
                      <CircleNotch weight="bold" className="w-4 h-4 animate-spin" />
                      sending...
                    </>
                  ) : (
                    <>
                      <PaperPlaneTilt weight="light" className="w-4 h-4" />
                      send message
                    </>
                  )}
                </Button>
              </motion.form>
            )}
          </AnimatePresence>
        </TerminalWindow>
      </Reveal>
    </section>
  );
}
