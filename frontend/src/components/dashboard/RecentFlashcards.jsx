import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";
import { getReviewHistory } from "../../services/review";

const RATING_STYLE = {
  Again: { label: "Again", bg: "color-mix(in oklab, #ef4444 15%, transparent)", fg: "#ef4444" },
  Hard:  { label: "Hard",  bg: "color-mix(in oklab, #f97316 15%, transparent)", fg: "#f97316" },
  Good:  { label: "Good",  bg: "color-mix(in oklab, #22c55e 15%, transparent)", fg: "#22c55e" },
  Easy:  { label: "Easy",  bg: "color-mix(in oklab, #3b82f6 15%, transparent)", fg: "#3b82f6" },
};

function timeAgo(dateStr) {
  const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000);
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export default function RecentFlashcards() {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchHistory() {
      try {
        const data = await getReviewHistory(5);
        setCards(data);
      } catch (err) {
        setCards([]);
      } finally {
        setLoading(false);
      }
    }
    fetchHistory();
  }, []);

  return (
    <section className="space-y-4">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2
            className="text-xl font-semibold tracking-tight"
            style={{ color: "var(--foreground)" }}
          >
            Recent Flashcards
          </h2>
          <p className="mt-1 text-sm" style={{ color: "var(--muted-foreground)" }}>
            Cards you've reviewed recently.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="h-36 animate-pulse rounded-2xl border"
              style={{ background: "var(--surface)", borderColor: "var(--border)" }}
            />
          ))}
        </div>
      ) : cards.length === 0 ? (
        <div
          className="flex flex-col items-center gap-3 rounded-2xl border border-dashed py-16 text-center"
          style={{ borderColor: "var(--border)", background: "var(--surface)" }}
        >
          <Sparkles size={28} style={{ color: "var(--muted-foreground)" }} />
          <p className="text-base font-medium" style={{ color: "var(--foreground)" }}>
            No reviews yet.
          </p>
          <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
            Complete your first review session to see cards here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {cards.map((entry) => {
            const f = entry.flashcard;
            const style = RATING_STYLE[entry.rating] ?? RATING_STYLE.Good;

            return (
              <div
                key={entry.flashcard_id}
                className="flex flex-col gap-3 rounded-2xl border p-4"
                style={{
                  background: "var(--surface)",
                  borderColor: "var(--border)",
                  boxShadow: "var(--shadow-card)",
                }}
              >
                <div className="flex items-center justify-between">
                  <span
                    className="rounded-full px-2 py-0.5 text-xs font-medium"
                    style={{ background: style.bg, color: style.fg }}
                  >
                    {style.label}
                  </span>
                  <span className="text-xs" style={{ color: "var(--muted-foreground)" }}>
                    {timeAgo(entry.reviewed_at)}
                  </span>
                </div>

                <div>
                  <div
                    className="text-3xl font-semibold leading-none"
                    style={{
                      color: "var(--foreground)",
                      fontFamily: "'Noto Serif JP', 'Hiragino Mincho ProN', serif",
                    }}
                  >
                    {f.expression}
                  </div>
                  <div className="mt-1.5 text-sm" style={{ color: "var(--muted-foreground)" }}>
                    {f.reading}
                  </div>
                  {f.reading_romaji && (
                    <div className="text-xs italic" style={{ color: "var(--muted-foreground)" }}>
                      {f.reading_romaji}
                    </div>
                  )}
                </div>

                <div
                  className="border-t pt-2 text-sm"
                  style={{ borderColor: "var(--border)", color: "var(--foreground)" }}
                >
                  {f.meaning}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}