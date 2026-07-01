import { Suspense } from "react";
import { AuthPageShell } from "@/components/auth/auth-brand";
import { LoginForm } from "./login-form";

export default function LoginPage() {
  return (
    <AuthPageShell>
      <Suspense
        fallback={
          <div className="h-96 w-full max-w-md animate-pulse rounded-2xl bg-muted" />
        }
      >
        <LoginForm />
      </Suspense>
    </AuthPageShell>
  );
}
