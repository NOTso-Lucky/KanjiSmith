import { useEffect, useRef, useState } from "react";
import { Plus, ChevronDown, Check, Loader2 } from "lucide-react";
import { listDecks, addFlashcardToDeck } from "../services/deck";

export default function AddToDeckMenu({ flashcardId }) {
  const [open, setOpen] = useState(false);
  const [decks, setDecks] = useState(null);
  const [loadingDecks, setLoadingDecks] = useState(false);
  const [error, setError] = useState(null);
  const [addingId, setAddingId] = useState(null);
  const [addedIds, setAddedIds] = useState(new Set());
  const containerRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function handleOpen() {
    const next = !open;
    setOpen(next);
    setError(null);

    if (next && decks === null) {
      setLoadingDecks(true);
      try {
        const data = await listDecks();
        // listDecks returns an array of DeckResponse objects
        setDecks(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message || "Couldn't load decks");
      } finally {
        setLoadingDecks(false);
      }
    }
  }

  async function handleAdd(deckId) {
    setAddingId(deckId);
    setError(null);

    try {
      await addFlashcardToDeck(deckId, flashcardId);
      setAddedIds((prev) => new Set(prev).add(deckId));
    } catch (err) {
      if (err.message?.toLowerCase().includes("already")) {
        setAddedIds((prev) => new Set(prev).add(deckId));
      } else {
        setError(err.message || "Couldn't add to deck");
      }
    } finally {
      setAddingId(null);
    }
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={handleOpen}
        className="flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-sm font-medium transition hover:-translate-y-0.5"
        style={{
          background: "var(--background)",
          borderColor: "var(--border)",
          color: "var(--foreground)",
        }}
      >
        <Plus size={14} />
        Add to Deck
        <ChevronDown size={14} />
      </button>

      {open && (
        <div
          className="absolute right-0 z-10 mt-2 w-56 rounded-xl border p-2"
          style={{
            background: "var(--surface)",
            borderColor: "var(--border)",
            boxShadow: "var(--shadow-card)",
          }}
        >
          {loadingDecks && (
            <div
              className="flex items-center justify-center gap-2 py-3 text-sm"
              style={{ color: "var(--muted-foreground)" }}
            >
              <Loader2 size={14} className="animate-spin" />
              Loading decks...
            </div>
          )}

          {!loadingDecks && decks?.length === 0 && (
            <p className="px-2 py-3 text-sm" style={{ color: "var(--muted-foreground)" }}>
              You don't have any decks yet.
            </p>
          )}

          {!loadingDecks &&
            decks?.map((deck) => {
              const added = addedIds.has(deck.id);
              const adding = addingId === deck.id;

              return (
                <button
                  key={deck.id}
                  type="button"
                  disabled={adding || added}
                  onClick={() => handleAdd(deck.id)}
                  className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition disabled:opacity-70"
                  style={{ color: "var(--foreground)", background: "transparent" }}
                  onMouseEnter={(e) => {
                    if (!adding && !added)
                      e.currentTarget.style.background = "var(--surface-hover)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "transparent";
                  }}
                >
                  <span className="truncate">{deck.title}</span>
                  {adding && <Loader2 size={14} className="animate-spin" />}
                  {added && <Check size={14} style={{ color: "var(--primary)" }} />}
                </button>
              );
            })}

          {error && (
            <p className="px-2 pt-2 text-xs" style={{ color: "var(--primary)" }}>
              {error}
            </p>
          )}
        </div>
      )}
    </div>
  );
}