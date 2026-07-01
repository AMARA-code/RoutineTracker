import { ImageResponse } from "next/og";
import { AppIconMarkup } from "@/lib/app-icon-markup";

export const runtime = "nodejs";

export async function GET() {
  return new ImageResponse(<AppIconMarkup size={512} />, {
    width: 512,
    height: 512,
  });
}
