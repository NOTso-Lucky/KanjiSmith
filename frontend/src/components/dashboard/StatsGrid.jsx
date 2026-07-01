import { Clock, BookOpen, Layers, Flame } from "lucide-react";
import StatCard from "./StatCard";

export default function StatsGrid({ summary, dueCount, loading }) {
  const stats = [
    {
      label: "Cards Due",
      value: loading ? "—" : (dueCount?.due_reviews ?? 0) + (dueCount?.new_cards ?? 0),
      icon: Clock,
      hint: "Review today",
    },
    {
      label: "Words Learned",
      value: loading ? "—" : summary?.today.cards_learned ?? 0,
      icon: BookOpen,
      hint: "New today",
    },
    {
      label: "Reviewed Today",
      value: loading ? "—" : summary?.today.reviews_completed ?? 0,
      icon: Layers,
      hint: `${loading ? "—" : summary?.today.correct_answers ?? 0} correct`,
    },
    {
      label: "Current Streak",
      value: loading ? "—" : `${summary?.activity_streak ?? 0}d`,
      icon: Flame,
      hint: summary?.activity_streak > 0 ? "Keep it up" : "Start today",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((s) => (
        <StatCard key={s.label} {...s} />
      ))}
    </div>
  );
}