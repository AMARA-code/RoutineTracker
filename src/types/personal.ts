export type PersonalLog = {
  id: string;
  log_date: string;
  content: string | null;
  mood: string | null;
  goals: string | null;
  created_at: string;
  updated_at: string;
};

export const MOOD_OPTIONS = [
  { value: "great", label: "Great", emoji: "😊" },
  { value: "good", label: "Good", emoji: "🙂" },
  { value: "okay", label: "Okay", emoji: "😐" },
  { value: "low", label: "Low", emoji: "😔" },
  { value: "rough", label: "Rough", emoji: "😞" },
] as const;
