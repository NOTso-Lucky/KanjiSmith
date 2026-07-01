import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft, BookOpen, Play, Trash2, Loader2, Search, Pencil
} from "lucide-react";
import MainLayout from "../layouts/MainLayout";
import { getDeckFlashcards, removeFlashcardFromDeck } from "../services/deck";

const JLPT_TONE = {
  N5: { bg: "color-mix(in oklab, var(--primary) 12%, transparent)", fg: "var(--primary)" },
  N4: { bg: "color-mix(in oklab, var(--primary) 12%, transparent)", fg: "var(--primary)" },
  N3: { bg: "color-mix(in oklab, var(--foreground) 8%, transparent)", fg: "var(--foreground)" },
  N2: { bg: "color-mix(in oklab, var(--foreground) 8%, transparent)", fg: "var(--foreground)" },
  N1: { bg: "color-mix(in oklab, var(--foreground) 8%, transparent)", fg: "var(--foreground)" },
};

export default function DeckDetail() {
  const { deckId } = useParams();
  const navigate = useNavigate();

  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [removingId, setRemovingId] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function fetchCards() {
      try {
        const data = await getDeckFlashcards(deckId);
        setCards(data);
      } catch (err) {
        setError(err.message || "Couldn't load flashcards");
      } finally {
        setLoading(false);
      }
    }
    fetchCards();
  }, [deckId]);

  async function handleRemove(e, flashcardId) {
    e.stopPropagation();
    if (removingId) return;
    if (!window.confirm("Remove this card from the deck?")) return;

    setRemovingId(flashcardId);
    try {
      await removeFlashcardFromDeck(deckId, flashcardId);
      setCards((prev) => prev.filter((c) => c.flashcard_id !== flashcardId));
    } catch (err) {
      alert(err.message || "Couldn't remove card");
    } finally {
      setRemovingId(null);
    }
  }

  const filtered = cards.filter((c) => {
    const q = search.toLowerCase();
    const f = c.flashcard;
    return (
      f.expression?.toLowerCase().includes(q) ||
      f.reading?.toLowerCase().includes(q) ||
      f.meaning?.toLowerCase().includes(q)
    );
  });

  return (
    <MainLayout>
      <div className="mx-auto max-w-4xl space-y-6">

        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/decks")}
              className="grid h-9 w-9 place-items-center rounded-full border transition hover:opacity-70"
              style={{
                borderColor: "var(--border)",
                background: "var(--surface)",
                color: "var(--foreground)",
              }}
              aria-label="Back to decks"
            >
              <ArrowLeft size={16} />
            </button>
            <div>
              <h1
                className="text-xl font-semibold tracking-tight"
                style={{ color: "var(--foreground)" }}
              >
                Deck Cards
              </h1>
              <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
                {loading ? "Loading..." : `${cards.length} card${cards.length !== 1 ? "s" : ""}`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(`/search`)}
              className="inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition hover:opacity-80"
              style={{
                background: "var(--background)",
                borderColor: "var(--border)",
                color: "var(--foreground)",
              }}
            >
              <Search size={15} />
              Add Cards
            </button>

            <button
              onClick={() => navigate(`/review?deck_id=${deckId}`)}
              disabled={cards.length === 0}
              className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition hover:opacity-90 disabled:opacity-40"
              style={{
                background: "var(--primary)",
                color: "var(--primary-foreground, #fff)",
              }}
            >
              <Play size={15} />
              Study Deck
            </button>
          </div>
        </div>

        {/* Search filter */}
        {!loading && cards.length > 4 && (
          <label
            className="flex items-center gap-3 rounded-xl border px-4 py-3 transition focus-within:ring-2"
            style={{
              background: "var(--background)",
              borderColor: "var(--border)",
            }}
          >
            <Search size={16} style={{ color: "var(--muted-foreground)" }} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter cards..."
              className="w-full bg-transparent text-sm outline-none"
              style={{ color: "var(--foreground)" }}
            />
          </label>
        )}

        {/* Loading */}
        {loading && (
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="h-16 animate-pulse rounded-2xl border"
                style={{ background: "var(--surface)", borderColor: "var(--border)" }}
              />
            ))}
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <p className="text-sm" style={{ color: "var(--primary)" }}>{error}</p>
        )}

        {/* Empty deck */}
        {!loading && !error && cards.length === 0 && (
          <div
            className="flex flex-col items-center gap-3 rounded-2xl border border-dashed py-20 text-center"
            style={{ borderColor: "var(--border)", background: "var(--surface)" }}
          >
            <BookOpen size={32} style={{ color: "var(--muted-foreground)" }} />
            <p className="font-medium" style={{ color: "var(--foreground)" }}>
              No cards in this deck
            </p>
            <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
              Use Search to find words and add them here.
            </p>
            <button
              onClick={() => navigate("/search")}
              className="mt-2 rounded-xl px-4 py-2 text-sm font-medium transition hover:opacity-90"
              style={{
                background: "var(--primary)",
                color: "var(--primary-foreground, #fff)",
              }}
            >
              Search Words
            </button>
          </div>
        )}

        {/* No filter results */}
        {!loading && !error && cards.length > 0 && filtered.length === 0 && (
          <p className="text-sm text-center py-8" style={{ color: "var(--muted-foreground)" }}>
            No cards match "{search}"
          </p>
        )}

        {/* Card list */}
        {!loading && !error && filtered.length > 0 && (
          <div className="space-y-3">
            {filtered.map((entry) => {
              const f = entry.flashcard;
              const tone = f.jlpt_level ? JLPT_TONE[f.jlpt_level] : null;

              return (
                <div
                  key={entry.flashcard_id}
                  className="group relative flex items-center gap-4 rounded-2xl border px-5 py-4 transition hover:-translate-y-0.5"
                  style={{
                    background: "var(--surface)",
                    borderColor: "var(--border)",
                    boxShadow: "var(--shadow-card)",
                  }}
                >
                  {/* Expression */}
                  <div
                    className="w-24 shrink-0 text-2xl font-semibold"
                    style={{
                      color: "var(--foreground)",
                      fontFamily: "'Noto Serif JP', 'Hiragino Mincho ProN', serif",
                    }}
                  >
                    {f.expression}
                  </div>

                  {/* Reading + romaji */}
                  <div className="w-28 shrink-0 space-y-0.5">
                    <p className="text-sm" style={{ color: "var(--foreground)" }}>
                      {f.reading}
                    </p>
                    {f.reading_romaji && (
                      <p className="text-xs italic" style={{ color: "var(--muted-foreground)" }}>
                        {f.reading_romaji}
                      </p>
                    )}
                  </div>

                  {/* Meaning */}
                  <div className="flex-1 min-w-0">
                    <p
                      className="truncate text-sm"
                      style={{ color: "var(--foreground)" }}
                    >
                      {f.meaning}
                    </p>
                  </div>

                  {/* JLPT badge */}
                  {tone && (
                    <span
                      className="shrink-0 rounded-full px-2.5 py-1 text-xs font-medium"
                      style={{ background: tone.bg, color: tone.fg }}
                    >
                      {f.jlpt_level}
                    </span>
                  )}
                    {/* Edit button */}
                    <button
                    onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/decks/${deckId}/flashcards/${entry.flashcard_id}/edit`);
                    }}
                    className="ml-2 shrink-0 grid h-7 w-7 place-items-center rounded-full opacity-0 transition group-hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/10"
                    style={{ color: "var(--muted-foreground)" }}
                    aria-label="Edit card"
                    >
                    <Pencil size={14} />
                    </button>
                  {/* Remove button */}
                  <button
                    onClick={(e) => handleRemove(e, entry.flashcard_id)}
                    disabled={removingId === entry.flashcard_id}
                    className="ml-2 shrink-0 grid h-7 w-7 place-items-center rounded-full opacity-0 transition group-hover:opacity-100 hover:bg-red-500/10 disabled:opacity-50"
                    style={{ color: "var(--muted-foreground)" }}
                    aria-label="Remove from deck"
                  >
                    {removingId === entry.flashcard_id ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <Trash2 size={14} />
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </MainLayout>
  );
}