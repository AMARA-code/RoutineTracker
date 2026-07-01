"use client";

import { useActionState } from "react";
import { signup } from "../actions";
import { AuthBrand, AuthFooterLink } from "@/components/auth/auth-brand";
import { Button, Card, Input } from "@/components/ui";

export function RegisterForm() {
  const [state, formAction, pending] = useActionState(signup, null);

  return (
    <Card className="w-full max-w-md card-shadow-lg" padding="lg">
      <AuthBrand
        title="Create account"
        subtitle="Join RoutineTracker and build better daily habits."
      />

      <form action={formAction} className="space-y-4">
        <Input
          label="Email"
          name="email"
          type="email"
          placeholder="you@example.com"
          required
          autoComplete="email"
        />
        <Input
          label="Password"
          name="password"
          type="password"
          placeholder="At least 8 characters"
          required
          minLength={8}
          autoComplete="new-password"
        />
        <Input
          label="Confirm password"
          name="confirmPassword"
          type="password"
          placeholder="Repeat your password"
          required
          minLength={8}
          autoComplete="new-password"
        />

        {state?.error && (
          <p className="rounded-xl bg-coral/40 px-3 py-2 text-sm text-[#5a3a3a]">
            {state.error}
          </p>
        )}

        {state?.success && (
          <p className="rounded-xl bg-sage/50 px-3 py-2 text-sm text-[#3d5a3e]">
            {state.success}
          </p>
        )}

        <Button type="submit" className="w-full" loading={pending}>
          Create account
        </Button>
      </form>

      <AuthFooterLink
        text="Already have an account?"
        linkText="Sign in"
        href="/login"
      />
    </Card>
  );
}
