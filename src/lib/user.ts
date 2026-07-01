import type { User } from "@supabase/supabase-js";

const USERNAME_PATTERN = /^[a-zA-Z0-9_]{2,24}$/;

export function validateUsername(username: string): string | null {
  const trimmed = username.trim();
  if (!trimmed) return "Username is required.";
  if (trimmed.length < 2) return "Username must be at least 2 characters.";
  if (trimmed.length > 24) return "Username must be 24 characters or fewer.";
  if (!USERNAME_PATTERN.test(trimmed)) {
    return "Username can only use letters, numbers, and underscores.";
  }
  return null;
}

export function getUserDisplayName(user: User | null): string | null {
  if (!user) return null;
  const meta = user.user_metadata ?? {};
  const username =
    typeof meta.username === "string" ? meta.username.trim() : "";
  if (username) return username;
  const fullName =
    typeof meta.full_name === "string" ? meta.full_name.trim() : "";
  if (fullName) return fullName;
  return null;
}
