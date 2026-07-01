import { AuthPageShell } from "@/components/auth/auth-brand";
import { RegisterForm } from "./register-form";

export default function RegisterPage() {
  return (
    <AuthPageShell>
      <RegisterForm />
    </AuthPageShell>
  );
}
