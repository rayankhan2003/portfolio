"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { CircleNotch, PaperPlaneTilt, CheckCircle } from "@phosphor-icons/react/dist/ssr";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import Reveal from "@/components/reveal";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Enter a valid email address"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactFormValues = z.infer<typeof contactSchema>;

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
      setTimeout(() => setStatus("idle"), 3000);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to send message"
      );
    }
  };

  return (
    <section className="max-w-2xl mx-auto px-6 py-24">
      <Reveal className="mb-12 space-y-4 text-center">
        <p className="text-primary font-extrabold text-lg tracking-wide uppercase">
          Get In Touch
        </p>
        <h2 className="text-4xl font-bold text-foreground">
          Let&apos;s build something together
        </h2>
        <p className="text-muted-foreground text-lg">
          Have a project in mind or just want to say hi? My inbox is open.
        </p>
      </Reveal>

      <Reveal delay={0.15}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6 rounded-2xl bg-card p-8 shadow-[0_8px_30px_-10px_oklch(0.551_0.169_46_/_0.15)]"
        >
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" placeholder="Your name" {...register("name")} />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              placeholder="Tell me about your project..."
              rows={5}
              {...register("message")}
            />
            {errors.message && (
              <p className="text-sm text-destructive">
                {errors.message.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full active:scale-[0.98] transition-transform"
            size="lg"
          >
            {isSubmitting ? (
              <>
                <CircleNotch weight="bold" className="w-4 h-4 animate-spin" />
                Sending...
              </>
            ) : status === "success" ? (
              <>
                <CheckCircle weight="light" className="w-4 h-4" />
                Sent!
              </>
            ) : (
              <>
                <PaperPlaneTilt weight="light" className="w-4 h-4" />
                Send Message
              </>
            )}
          </Button>
        </form>
      </Reveal>
    </section>
  );
}
