"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { provisionUserAlerts } from "@/lib/alerts/provision-user";
import { createClient } from "@/lib/supabase/server";
import { validateUsername } from "@/lib/user";

type AuthState = {
  error?: string;
  success?: string;
};

export async function login(
  _prev: AuthState | null,
  formData: FormData,
): Promise<AuthState | null> {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: error.message };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) {
    const supabase = await createClient();
    await provisionUserAlerts(supabase, user.id, user.email);
  }

  revalidatePath("/", "layout");
  redirect("/home");
}

export async function signup(
  _prev: AuthState | null,
  formData: FormData,
): Promise<AuthState | null> {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;
  const username = (formData.get("username") as string)?.trim();

  const usernameError = validateUsername(username ?? "");
  if (usernameError) {
    return { error: usernameError };
  }

  if (password.length < 8) {
    return { error: "Password must be at least 8 characters." };
  }

  if (password !== confirmPassword) {
    return { error: "Passwords do not match." };
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        username,
      },
    },
  });

  if (error) {
    return { error: error.message };
  }

  if (data.session && data.user) {
    const supabase = await createClient();
    await provisionUserAlerts(supabase, data.user.id, data.user.email);
    revalidatePath("/", "layout");
    redirect("/home");
  }

  return {
    success:
      "Account created! Check your email to confirm your account, then sign in.",
  };
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/login");
}
