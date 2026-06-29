import { GraduationCap, Coffee, Tv, Plane } from "lucide-react";
import DeckCard from "./DeckCard";

const DECKS = [
  { name: "JLPT N5", icon: GraduationCap, total: 120, learned: 84 },
  { name: "Daily Vocabulary", icon: Coffee, total: 60, learned: 22 },
  { name: "Anime Words", icon: Tv, total: 45, learned: 30 },
  { name: "Travel Japanese", icon: Plane, total: 80, learned: 12 },
];

export default function MyDecks() {
  return (
    <section className="space-y-4">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2
            className="text-xl font-semibold tracking-tight"
            style={{ color: "var(--foreground)" }}
          >
            My Decks
          </h2>
          <p className="mt-1 text-sm" style={{ color: "var(--muted-foreground)" }}>
            Jump back into your study sets.
          </p>
        </div>
        <button
          type="button"
          className="text-sm font-medium transition hover:opacity-80"
          style={{ color: "var(--primary)" }}
        >
          New deck
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {DECKS.map((d) => (
          <DeckCard key={d.name} {...d} />
        ))}
      </div>
    </section>
  );
}
