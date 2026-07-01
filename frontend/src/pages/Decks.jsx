import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, BookOpen, Trash2, Loader2, X } from "lucide-react";
import MainLayout from "../layouts/MainLayout";
import { listDecks, createDeck, deleteDeck } from "../services/deck";

function CreateDeckModal({ onClose, onCreate }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed || loading) return;

    setLoading(true);
    setError(null);

    try {
      const deck = await createDeck(trimmed, description.trim() || null);
      onCreate(deck);
    } catch (err) {
      setError(err.message || "Couldn't create deck");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0"
        style={{ background: "rgba(0,0,0,0.4)" }}
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="relative w-full max-w-md rounded-2xl border p-6 space-y-5"
        style={{
          background: "var(--surface)",
          borderColor: "var(--border)",
          boxShadow: "var(--shadow-card)",
        }}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold" style={{ color: "var(--foreground)" }}>
            New Deck
          </h2>
          <button
            onClick={onClose}
            className="grid h-8 w-8 place-items-center rounded-full transition hover:opacity-70"
            style={{ color: "var(--muted-foreground)" }}
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label
              className="text-sm font-medium"
              style={{ color: "var(--foreground)" }}
            >
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. JLPT N5 Vocab"
              maxLength={255}
              className="w-full rounded-xl border px-4 py-2.5 text-sm outline-none transition focus:ring-2"
              style={{
                background: "var(--background)",
                borderColor: "var(--border)",
                color: "var(--foreground)",
              }}
            />
          </div>

          <div className="space-y-1.5">
            <label
              className="text-sm font-medium"
              style={{ color: "var(--foreground)" }}
            >
              Description{" "}
              <span style={{ color: "var(--muted-foreground)" }}>(optional)</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What's this deck for?"
              rows={3}
              className="w-full resize-none rounded-xl border px-4 py-2.5 text-sm outline-none transition focus:ring-2"
              style={{
                background: "var(--background)",
                borderColor: "var(--border)",
                color: "var(--foreground)",
              }}
            />
          </div>

          {error && (
            <p className="text-sm" style={{ color: "var(--primary)" }}>
              {error}
            </p>
          )}

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border py-2.5 text-sm font-medium transition hover:opacity-80"
              style={{
                background: "var(--background)",
                borderColor: "var(--border)",
                color: "var(--foreground)",
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!title.trim() || loading}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-medium transition hover:opacity-90 disabled:opacity-50"
              style={{
                background: "var(--primary)",
                color: "var(--primary-foreground, #fff)",
              }}
            >
              {loading ? <Loader2 size={15} className="animate-spin" /> : <Plus size={15} />}
              Create Deck
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function Decks() {
  const navigate = useNavigate();
  const [decks, setDecks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    async function fetchDecks() {
      try {
        const data = await listDecks();
        setDecks(data);
      } catch (err) {
        setError(err.message || "Couldn't load decks");
      } finally {
        setLoading(false);
      }
    }
    fetchDecks();
  }, []);

  function handleCreated(deck) {
    setDecks((prev) => [deck, ...prev]);
    setShowModal(false);
  }

  async function handleDelete(e, deckId) {
    e.stopPropagation();
    if (deletingId) return;
    if (!window.confirm("Delete this deck? This can't be undone.")) return;

    setDeletingId(deckId);
    try {
      await deleteDeck(deckId);
      setDecks((prev) => prev.filter((d) => d.id !== deckId));
    } catch (err) {
      alert(err.message || "Couldn't delete deck");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <MainLayout>
      <div className="mx-auto max-w-4xl space-y-6">

        {/* Header */}
        <div className="flex items-end justify-between gap-4">
          <div>
            <h1
              className="text-2xl font-semibold tracking-tight"
              style={{ color: "var(--foreground)" }}
            >
              My Decks
            </h1>
            <p className="mt-1 text-sm" style={{ color: "var(--muted-foreground)" }}>
              {loading ? "Loading..." : `${decks.length} deck${decks.length !== 1 ? "s" : ""}`}
            </p>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition hover:opacity-90"
            style={{
              background: "var(--primary)",
              color: "var(--primary-foreground, #fff)",
            }}
          >
            <Plus size={16} />
            New Deck
          </button>
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
              No decks yet
            </p>
            <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
              Create your first deck to start learning.
            </p>
          </div>
        )}

        {/* Deck grid */}
        {!loading && !error && decks.length > 0 && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {decks.map((deck) => (
              <div
                key={deck.id}
                onClick={() => navigate(`/decks/${deck.id}`)}
                className="group relative flex cursor-pointer flex-col gap-3 rounded-2xl border p-5 transition hover:-translate-y-0.5"
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

                <div
                  className="text-xs"
                  style={{ color: "var(--muted-foreground)" }}
                >
                  {deck.owner_id ? "Your deck" : "Official deck"}
                </div>

                {/* Delete button */}
                {deck.owner_id && (
                  <button
                    onClick={(e) => handleDelete(e, deck.id)}
                    disabled={deletingId === deck.id}
                    className="absolute right-3 top-3 grid h-7 w-7 place-items-center rounded-full opacity-0 transition group-hover:opacity-100 hover:bg-red-500/10 disabled:opacity-50"
                    style={{ color: "var(--muted-foreground)" }}
                    aria-label="Delete deck"
                  >
                    {deletingId === deck.id ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <Trash2 size={14} />
                    )}
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <CreateDeckModal
          onClose={() => setShowModal(false)}
          onCreate={handleCreated}
        />
      )}
    </MainLayout>
  );
}