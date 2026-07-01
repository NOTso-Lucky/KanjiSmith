import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen, Sparkles } from "lucide-react";
import DeckCard from "./DeckCard";
import { getDecks } from "../../services/dashboard";

export default function MyDecks() {
  const navigate = useNavigate();
  const [decks, setDecks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDecks() {
      try {
        const data = await getDecks();
        setDecks(data.decks);
      } catch (err) {
        setDecks([]);
      } finally {
        setLoading(false);
      }
    }
    fetchDecks();
  }, []);

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
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate("/decks")}
            className="text-sm font-medium transition hover:opacity-80"
            style={{ color: "var(--muted-foreground)" }}
          >
            View all
          </button>
          <button
            type="button"
            onClick={() => navigate("/decks")}
            className="text-sm font-medium transition hover:opacity-80"
            style={{ color: "var(--primary)" }}
          >
            New deck
          </button>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {[...Array(2)].map((_, i) => (
            <div
              key={i}
              className="h-40 animate-pulse rounded-2xl border"
              style={{ background: "var(--surface)", borderColor: "var(--border)" }}
            />
          ))}
        </div>
      ) : decks.length === 0 ? (
        <div
          className="flex flex-col items-center gap-3 rounded-2xl border border-dashed py-16 text-center"
          style={{ borderColor: "var(--border)", background: "var(--surface)" }}
        >
          <Sparkles size={28} style={{ color: "var(--muted-foreground)" }} />
          <p className="text-base font-medium" style={{ color: "var(--foreground)" }}>
            No decks yet.
          </p>
          <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
            Create your first deck to get started.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {decks.map((deck) => (
            <DeckCard
              key={deck.deck_id}
              name={deck.title}
              icon={BookOpen}
              total={deck.total_cards}
              learned={deck.cards_learned}
              deckId={deck.deck_id}
            />
          ))}
        </div>
      )}
    </section>
  );
}