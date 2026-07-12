"use client";
import { useActionState } from "react";
import { signIn, type ActionResult } from "@/lib/admin/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AdminLoginPage() {
  const [state, action, pending] = useActionState<ActionResult | null, FormData>(
    signIn,
    null
  );

  return (
    <main className="min-h-dvh flex items-center justify-center px-6">
      <form
        action={action}
        className="w-full max-w-sm space-y-5 rounded-lg border border-border bg-card p-8"
      >
        <div>
          <h1 className="font-mono text-lg font-semibold">admin login</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Portfolio content management
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="username"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
          />
        </div>

        {state && !state.ok && (
          <p role="alert" className="text-sm text-destructive">
            {state.error}
          </p>
        )}

        <Button type="submit" disabled={pending} className="w-full">
          {pending ? "Signing in…" : "Sign in"}
        </Button>
      </form>
    </main>
  );
}
