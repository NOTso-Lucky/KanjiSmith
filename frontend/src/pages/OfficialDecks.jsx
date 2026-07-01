import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen, Plus, Check, Loader2, ArrowLeft } from "lucide-react";
import MainLayout from "../layouts/MainLayout";
import { listOfficialDecks, cloneDeck } from "../services/deck";

export default function OfficialDecks() {
  const navigate = useNavigate();
  const [decks, setDecks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addingId, setAddingId] = useState(null);
  const [addedIds, setAddedIds] = useState(new Set());

  useEffect(() => {
    async function fetchDecks() {
      try {
        const data = await listOfficialDecks();
        setDecks(data);
      } catch (err) {
        setError(err.message || "Couldn't load official decks");
      } finally {
        setLoading(false);
      }
    }
    fetchDecks();
  }, []);

  async function handleAdd(deckId) {
    setAddingId(deckId);

    try {
      await cloneDeck(deckId);
      setAddedIds((prev) => new Set(prev).add(deckId));
    } catch (err) {
      // Already have this one — treat it as success, not a failure.
      if (err.message?.toLowerCase().includes("already")) {
        setAddedIds((prev) => new Set(prev).add(deckId));
      } else {
        alert(err.message || "Couldn't add deck");
      }
    } finally {
      setAddingId(null);
    }
  }

  return (
    <MainLayout>
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Header */}
        <div className="flex items-end justify-between gap-4">
          <div>
            <button
              onClick={() => navigate("/decks")}
              className="mb-2 inline-flex items-center gap-1.5 text-sm transition hover:opacity-80"
              style={{ color: "var(--muted-foreground)" }}
            >
              <ArrowLeft size={14} />
              My Decks
            </button>
            <h1
              className="text-2xl font-semibold tracking-tight"
              style={{ color: "var(--foreground)" }}
            >
              Official Decks
            </h1>
            <p className="mt-1 text-sm" style={{ color: "var(--muted-foreground)" }}>
              {loading ? "Loading..." : `${decks.length} deck${decks.length !== 1 ? "s" : ""} curated by KanjiSmith`}
            </p>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="h-44 animate-pulse rounded-2xl border"
                style={{ background: "var(--surface)", borderColor: "var(--border)" }}
              />
            ))}
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <p className="text-sm" style={{ color: "var(--primary)" }}>{error}</p>
        )}

        {/* Empty */}
        {!loading && !error && decks.length === 0 && (
          <div
            className="flex flex-col items-center gap-3 rounded-2xl border border-dashed py-20 text-center"
            style={{ borderColor: "var(--border)", background: "var(--surface)" }}
          >
            <BookOpen size={32} style={{ color: "var(--muted-foreground)" }} />
            <p className="font-medium" style={{ color: "var(--foreground)" }}>
              No official decks yet
            </p>
            <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
              Check back soon — curated hiragana, katakana, and JLPT decks are on the way.
            </p>
          </div>
        )}

        {/* Deck grid */}
        {!loading && !error && decks.length > 0 && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {decks.map((deck) => {
              const adding = addingId === deck.id;
              const added = addedIds.has(deck.id);

              return (
                <div
                  key={deck.id}
                  className="flex flex-col gap-3 rounded-2xl border p-5"
                  style={{
                    background: "var(--surface)",
                    borderColor: "var(--border)",
                    boxShadow: "var(--shadow-card)",
                  }}
                >
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-xl"
                    style={{
                      background: "color-mix(in oklab, var(--primary) 12%, transparent)",
                    }}
                  >
                    <BookOpen size={20} style={{ color: "var(--primary)" }} />
                  </div>

                  <div className="flex-1 space-y-1">
                    <p
                      className="font-semibold leading-tight"
                      style={{ color: "var(--foreground)" }}
                    >
                      {deck.title}
                    </p>
                    {deck.description && (
                      <p
                        className="text-sm line-clamp-2"
                        style={{ color: "var(--muted-foreground)" }}
                      >
                        {deck.description}
                      </p>
                    )}
                  </div>

                  <button
                    onClick={() => handleAdd(deck.id)}
                    disabled={adding || added}
                    className="inline-flex items-center justify-center gap-2 rounded-xl py-2 text-sm font-medium transition hover:opacity-90 disabled:opacity-60"
                    style={{
                      background: added ? "var(--background)" : "var(--primary)",
                      border: added ? "1px solid var(--border)" : "none",
                      color: added ? "var(--foreground)" : "var(--primary-foreground, #fff)",
                    }}
                  >
                    {adding ? (
                      <Loader2 size={15} className="animate-spin" />
                    ) : added ? (
                      <Check size={15} />
                    ) : (
                      <Plus size={15} />
                    )}
                    {added ? "Added to My Decks" : "Add to My Decks"}
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