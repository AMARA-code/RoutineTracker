export async function sendAlertEmail(
  to: string,
  message: string,
): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  const from =
    process.env.ALERT_EMAIL_FROM ?? "RoutineTracker <onboarding@resend.dev>";

  if (!apiKey) {
    console.warn("[alerts] RESEND_API_KEY not set — skipping email");
    return false;
  }

  try {
    const { Resend } = await import("resend");
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from,
      to,
      subject: "⚠️ RoutineTracker Alert",
      text: message,
      html: `<p style="font-family:sans-serif;color:#3e4c59">${message}</p>`,
    });
    return !error;
  } catch (err) {
    console.error("[alerts] Email send failed:", err);
    return false;
  }
}
