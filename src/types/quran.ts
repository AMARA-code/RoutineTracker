export type QuranLog = {
  id: string;
  log_date: string;
  pages_read: number;
  surah: string | null;
  completed: boolean;
  notes: string | null;
  created_at: string;
};

export const PAGE_PRESETS = [1, 2, 5, 10, 20] as const;
