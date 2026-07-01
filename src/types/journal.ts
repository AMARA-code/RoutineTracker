export type TradeDirection = "long" | "short";
export type TradeOutcome = "win" | "loss" | "be";
export type ScreenshotType = "entry" | "exit" | "sl" | "tp";

export type TradeScreenshot = {
  id: string;
  trade_id: string;
  image_url: string;
  screenshot_type: ScreenshotType;
  signed_url?: string;
};

export type Trade = {
  id: string;
  user_id: string;
  trade_date: string;
  instrument: string;
  direction: TradeDirection;
  entry_price: number | null;
  sl_price: number | null;
  tp_price: number | null;
  lot_size: number | null;
  outcome: TradeOutcome | null;
  r_multiple: number | null;
  strategy: string | null;
  emotion_note: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  trade_screenshots?: TradeScreenshot[];
};

export type JournalDaily = {
  id: string;
  journal_date: string;
  daily_analysis: string | null;
};

export type TradeFilters = {
  outcome?: TradeOutcome | "all";
  strategy?: string;
  instrument?: string;
  dateFrom?: string;
  dateTo?: string;
};
