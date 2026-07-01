import { CalendarCheck, Flame, Smile } from "lucide-react";
import { Card, CardContent } from "@/components/ui";
import { moodEmoji } from "@/lib/personal";
import { MOOD_OPTIONS } from "@/types/personal";

function moodLabel(value: string | null) {
  const m = MOOD_OPTIONS.find((o) => o.value === value);
  return m ? `${m.emoji} ${m.label}` : "Not set";
}

export function PersonalSnapshot({
  mood,
  streak,
  weekLogged,
  loggedToday,
}: {
  mood: string | null;
  streak: number;
  weekLogged: number;
  loggedToday: boolean;
}) {
  const items = [
    {
      label: "Mood today",
      value: mood ? moodLabel(mood) : "Not logged",
      icon: Smile,
      hint: loggedToday ? "Entry saved" : "Log below",
    },
    {
      label: "Logging streak",
      value: `${streak} day${streak === 1 ? "" : "s"}`,
      icon: Flame,
      hint: streak > 0 ? "Keep it going" : "Start today",
    },
    {
      label: "This week",
      value: `${weekLogged}/7 days`,
      icon: CalendarCheck,
      hint: weekLogged >= 5 ? "Strong week" : "Room to grow",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <Card key={item.label} variant="alerts">
            <CardContent className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{item.label}</p>
                <p className="mt-1 text-xl font-semibold">{item.value}</p>
                {item.hint && (
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {item.label === "Mood today" && mood
                      ? `${moodEmoji(mood)} ${item.hint}`
                      : item.hint}
                  </p>
                )}
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-lavender/50">
                <Icon className="h-5 w-5 text-[#4a3d5a]" />
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
