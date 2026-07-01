import { CalendarCheck, Flame, Smile } from "lucide-react";
import { HabitStatCard } from "@/components/ui";
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
      variant: "coral" as const,
    },
    {
      label: "Logging streak",
      value: `${streak} day${streak === 1 ? "" : "s"}`,
      icon: Flame,
      hint: streak > 0 ? "Keep it going" : "Start today",
      variant: "peach" as const,
    },
    {
      label: "This week",
      value: `${weekLogged}/7 days`,
      icon: CalendarCheck,
      hint: weekLogged >= 5 ? "Strong week" : "Room to grow",
      variant: "lavender" as const,
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <HabitStatCard
            key={item.label}
            label={item.label}
            value={item.value}
            sub={
              item.label === "Mood today" && mood
                ? `${moodEmoji(mood)} ${item.hint}`
                : item.hint
            }
            icon={Icon}
            variant={item.variant}
          />
        );
      })}
    </div>
  );
}
