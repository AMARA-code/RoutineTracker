import { Suspense } from "react";
import { AuthPageShell } from "@/components/auth/auth-brand";
import { PageLoader } from "@/components/ui/loader";
import { LoginForm } from "./login-form";

export default function LoginPage() {
  return (
    <AuthPageShell variant="login">
      <Suspense fallback={<PageLoader message="Loading sign in…" />}>
        <LoginForm />
      </Suspense>
    </AuthPageShell>
  );
}
