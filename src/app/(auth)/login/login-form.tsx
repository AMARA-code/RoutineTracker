"use client";

import { useActionState } from "react";
import { useSearchParams } from "next/navigation";
import { login } from "../actions";
import { AuthBrand, AuthFooterLink } from "@/components/auth/auth-brand";
import { Button, Card, Input } from "@/components/ui";

export function LoginForm() {
  const searchParams = useSearchParams();
  const urlError = searchParams.get("error");
  const [state, formAction, pending] = useActionState(login, null);

  const errorMessage =
    state?.error ||
    (urlError === "auth" ? "Authentication failed. Please try again." : null);

  return (
    <Card className="w-full max-w-md card-shadow-lg" padding="lg">
      <AuthBrand
        title="Sign in"
        subtitle="Track routines, habits, and goals — all in one place."
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
          placeholder="••••••••"
          required
          autoComplete="current-password"
        />

        {errorMessage && (
          <p className="rounded-xl bg-coral/40 px-3 py-2 text-sm text-[#5a3a3a]">
            {errorMessage}
          </p>
        )}

        <Button type="submit" className="w-full" loading={pending}>
          Sign in
        </Button>
      </form>

      <AuthFooterLink
        text="Don't have an account?"
        linkText="Create account"
        href="/register"
      />
    </Card>
  );
}
