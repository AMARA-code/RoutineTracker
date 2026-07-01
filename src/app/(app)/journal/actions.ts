"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { parseNumber } from "@/lib/journal";
import type {
  ScreenshotType,
  Trade,
  TradeDirection,
  TradeOutcome,
  TradeScreenshot,
} from "@/types/journal";

const BUCKET = "trade-screenshots";
const SIGNED_URL_TTL = 3600;

type ActionResult = { error?: string; success?: string };

async function getUserId() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user?.id ?? null;
}

async function signScreenshotUrls(
  screenshots: TradeScreenshot[],
): Promise<TradeScreenshot[]> {
  if (!screenshots.length) return screenshots;

  const supabase = await createClient();
  return Promise.all(
    screenshots.map(async (shot) => {
      const { data } = await supabase.storage
        .from(BUCKET)
        .createSignedUrl(shot.image_url, SIGNED_URL_TTL);
      return { ...shot, signed_url: data?.signedUrl };
    }),
  );
}

async function attachScreenshots(trades: Trade[]): Promise<Trade[]> {
  return Promise.all(
    trades.map(async (trade) => {
      const screenshots = trade.trade_screenshots ?? [];
      const signed = await signScreenshotUrls(screenshots);
      return { ...trade, trade_screenshots: signed };
    }),
  );
}

export async function getTradesForDate(date: string): Promise<Trade[]> {
  const userId = await getUserId();
  if (!userId) return [];

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("trades")
    .select("*, trade_screenshots(*)")
    .eq("user_id", userId)
    .eq("trade_date", date)
    .order("created_at", { ascending: false });

  if (error || !data) return [];
  return attachScreenshots(data as Trade[]);
}

export async function getAllTrades(): Promise<Trade[]> {
  const userId = await getUserId();
  if (!userId) return [];

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("trades")
    .select("*, trade_screenshots(*)")
    .eq("user_id", userId)
    .order("trade_date", { ascending: false })
    .order("created_at", { ascending: false });

  if (error || !data) return [];
  return attachScreenshots(data as Trade[]);
}

export async function getDailyAnalysis(
  date: string,
): Promise<string | null> {
  const userId = await getUserId();
  if (!userId) return null;

  const supabase = await createClient();
  const { data } = await supabase
    .from("journal_daily")
    .select("daily_analysis")
    .eq("user_id", userId)
    .eq("journal_date", date)
    .maybeSingle();

  return data?.daily_analysis ?? null;
}

export async function getDistinctStrategies(): Promise<string[]> {
  const userId = await getUserId();
  if (!userId) return [];

  const supabase = await createClient();
  const { data } = await supabase
    .from("trades")
    .select("strategy")
    .eq("user_id", userId)
    .not("strategy", "is", null);

  const strategies = new Set<string>();
  data?.forEach((row) => {
    if (row.strategy?.trim()) strategies.add(row.strategy.trim());
  });
  return Array.from(strategies).sort();
}

async function uploadScreenshots(
  tradeId: string,
  userId: string,
  files: File[],
  types: string[],
) {
  const supabase = await createClient();

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    if (!file?.size) continue;

    const screenshotType = (types[i] || "entry") as ScreenshotType;
    const ext = file.name.split(".").pop() || "png";
    const path = `${userId}/${tradeId}/${Date.now()}-${i}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(path, file, { upsert: false });

    if (uploadError) continue;

    await supabase.from("trade_screenshots").insert({
      trade_id: tradeId,
      image_url: path,
      screenshot_type: screenshotType,
    });
  }
}

export async function saveDailyAnalysis(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const userId = await getUserId();
  if (!userId) return { error: "Not authenticated." };

  const date = formData.get("journal_date") as string;
  const analysis = (formData.get("daily_analysis") as string) || "";

  const supabase = await createClient();
  const { error } = await supabase.from("journal_daily").upsert(
    {
      user_id: userId,
      journal_date: date,
      daily_analysis: analysis,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id,journal_date" },
  );

  if (error) return { error: error.message };

  revalidatePath("/journal");
  return { success: "Daily analysis saved." };
}

export async function createTrade(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const userId = await getUserId();
  if (!userId) return { error: "Not authenticated." };

  const supabase = await createClient();
  const tradeDate = formData.get("trade_date") as string;
  const instrument = (formData.get("instrument") as string)?.trim();
  const direction = formData.get("direction") as TradeDirection;

  if (!instrument) return { error: "Instrument is required." };
  if (!direction) return { error: "Direction is required." };

  const { data: trade, error } = await supabase
    .from("trades")
    .insert({
      user_id: userId,
      trade_date: tradeDate,
      instrument,
      direction,
      entry_price: parseNumber(formData.get("entry_price")),
      sl_price: parseNumber(formData.get("sl_price")),
      tp_price: parseNumber(formData.get("tp_price")),
      lot_size: parseNumber(formData.get("lot_size")),
      outcome: (formData.get("outcome") as TradeOutcome) || null,
      r_multiple: parseNumber(formData.get("r_multiple")),
      strategy: (formData.get("strategy") as string)?.trim() || null,
      emotion_note: (formData.get("emotion_note") as string)?.trim() || null,
      notes: (formData.get("notes") as string)?.trim() || null,
    })
    .select("id")
    .single();

  if (error || !trade) return { error: error?.message ?? "Failed to create trade." };

  const files = formData.getAll("screenshots") as File[];
  const types = formData.getAll("screenshot_types") as string[];
  const validFiles = files.filter((f) => f.size > 0);

  if (validFiles.length) {
    await uploadScreenshots(trade.id, userId, validFiles, types);
  }

  revalidatePath("/journal");
  return { success: "Trade logged." };
}

export async function updateTrade(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const userId = await getUserId();
  if (!userId) return { error: "Not authenticated." };

  const tradeId = formData.get("trade_id") as string;
  const instrument = (formData.get("instrument") as string)?.trim();
  const direction = formData.get("direction") as TradeDirection;

  if (!tradeId) return { error: "Trade ID missing." };
  if (!instrument) return { error: "Instrument is required." };

  const supabase = await createClient();
  const { error } = await supabase
    .from("trades")
    .update({
      instrument,
      direction,
      entry_price: parseNumber(formData.get("entry_price")),
      sl_price: parseNumber(formData.get("sl_price")),
      tp_price: parseNumber(formData.get("tp_price")),
      lot_size: parseNumber(formData.get("lot_size")),
      outcome: (formData.get("outcome") as TradeOutcome) || null,
      r_multiple: parseNumber(formData.get("r_multiple")),
      strategy: (formData.get("strategy") as string)?.trim() || null,
      emotion_note: (formData.get("emotion_note") as string)?.trim() || null,
      notes: (formData.get("notes") as string)?.trim() || null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", tradeId)
    .eq("user_id", userId);

  if (error) return { error: error.message };

  const files = formData.getAll("screenshots") as File[];
  const types = formData.getAll("screenshot_types") as string[];
  const validFiles = files.filter((f) => f.size > 0);

  if (validFiles.length) {
    await uploadScreenshots(tradeId, userId, validFiles, types);
  }

  revalidatePath("/journal");
  return { success: "Trade updated." };
}

export async function deleteTrade(tradeId: string): Promise<ActionResult> {
  const userId = await getUserId();
  if (!userId) return { error: "Not authenticated." };

  const supabase = await createClient();

  const { data: screenshots } = await supabase
    .from("trade_screenshots")
    .select("image_url")
    .eq("trade_id", tradeId);

  if (screenshots?.length) {
    await supabase.storage
      .from(BUCKET)
      .remove(screenshots.map((s) => s.image_url));
  }

  const { error } = await supabase
    .from("trades")
    .delete()
    .eq("id", tradeId)
    .eq("user_id", userId);

  if (error) return { error: error.message };

  revalidatePath("/journal");
  return { success: "Trade deleted." };
}

export async function deleteScreenshot(
  screenshotId: string,
): Promise<ActionResult> {
  const userId = await getUserId();
  if (!userId) return { error: "Not authenticated." };

  const supabase = await createClient();

  const { data: shot } = await supabase
    .from("trade_screenshots")
    .select("image_url, trade_id")
    .eq("id", screenshotId)
    .single();

  if (!shot) return { error: "Screenshot not found." };

  const { data: trade } = await supabase
    .from("trades")
    .select("id")
    .eq("id", shot.trade_id)
    .eq("user_id", userId)
    .maybeSingle();

  if (!trade) return { error: "Not authorized." };

  await supabase.storage.from(BUCKET).remove([shot.image_url]);
  await supabase.from("trade_screenshots").delete().eq("id", screenshotId);

  revalidatePath("/journal");
  return { success: "Screenshot removed." };
}
