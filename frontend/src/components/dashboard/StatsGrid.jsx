import { Clock, BookOpen, Layers, Flame } from "lucide-react";
import StatCard from "./StatCard";

const STATS = [
  { label: "Cards Due", value: 24, icon: Clock, hint: "Review today" },
  { label: "Words Learned", value: 312, icon: BookOpen, hint: "+18 this week" },
  { label: "Decks", value: 8, icon: Layers, hint: "2 active" },
  { label: "Current Streak", value: "12d", icon: Flame, hint: "Keep it up" },
];

export default function StatsGrid() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {STATS.map((s) => (
        <StatCard key={s.label} {...s} />
      ))}
    </div>
  );
}
