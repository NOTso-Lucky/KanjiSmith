import { useState, useEffect, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { CheckCircle, RotateCcw, Home } from "lucide-react";
import MainLayout from "../layouts/MainLayout";
import ReviewCard from "../components/ReviewCard";
import ReviewButtons from "../components/ReviewButtons";
import { getQueue, submitReview } from "../services/review";

export default function Review() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const deckId = searchParams.get("deck_id") || null;

  const [cards, setCards] = useState([]);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Session stats
  const [reviewed, setReviewed] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [sessionStart] = useState(Date.now());

  // Per-card timer
  const cardStartRef = useRef(Date.now());

  useEffect(() => {
    async function fetchQueue() {
      setLoading(true);
      setError(null);
      try {
        const data = await getQueue(deckId, 20);
        setCards(data.cards);
      } catch (err) {
        setError(err.message || "Couldn't load review queue");
      } finally {
        setLoading(false);
      }
    }
    fetchQueue();
  }, []);

  function handleFlip() {
    if (!flipped) setFlipped(true);
  }

  async function handleRate(rating) {
    if (submitting) return;
    setSubmitting(true);

    const responseTimeMs = Date.now() - cardStartRef.current;
    const currentCard = cards[index];

    // Fire and forget — don't await, advance immediately
    submitReview(currentCard.id, rating, responseTimeMs).catch((err) => {
      console.error("Failed to submit review:", err);
    });

    const isCorrect = rating !== "Again";
    setReviewed((r) => r + 1);
    if (isCorrect) setCorrect((c) => c + 1);

    setFlipped(false);

    setTimeout(() => {
      setIndex((i) => i + 1);
      cardStartRef.current = Date.now();
      setSubmitting(false);
    }, 300);
  }
  const currentCard = cards[index];
  const isDone = !loading && !error && index >= cards.length;
  const sessionMinutes = Math.round((Date.now() - sessionStart) / 60000);

  // ── Loading ──────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <MainLayout>
        <div className="flex h-64 items-center justify-center">
          <p style={{ color: "var(--muted-foreground)" }}>Loading your review queue...</p>
        </div>
      </MainLayout>
    );
  }

  // ── Error ────────────────────────────────────────────────────────────────
  if (error) {
    return (
      <MainLayout>
        <div className="mx-auto max-w-md space-y-4 text-center pt-16">
          <p className="text-lg font-medium" style={{ color: "var(--foreground)" }}>
            Something went wrong
          </p>
          <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>{error}</p>
          <button
            onClick={() => navigate("/dashboard")}
            className="rounded-xl px-5 py-2.5 text-sm font-medium text-white transition hover:opacity-90"
            style={{ background: "var(--primary)" }}
          >
            Back to Dashboard
          </button>
        </div>
      </MainLayout>
    );
  }

  // ── Empty queue ──────────────────────────────────────────────────────────
  if (cards.length === 0) {
    return (
      <MainLayout>
        <div className="mx-auto max-w-md space-y-4 text-center pt-16">
          <CheckCircle size={48} className="mx-auto" style={{ color: "var(--primary)" }} />
          <p className="text-xl font-semibold" style={{ color: "var(--foreground)" }}>
            Nothing due right now
          </p>
          <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
            All caught up! Come back later when more cards are due.
          </p>
          <button
            onClick={() => navigate("/dashboard")}
            className="rounded-xl px-5 py-2.5 text-sm font-medium text-white transition hover:opacity-90"
            style={{ background: "var(--primary)" }}
          >
            Back to Dashboard
          </button>
        </div>
      </MainLayout>
    );
  }

  // ── Completion screen ────────────────────────────────────────────────────
  if (isDone) {
    const accuracy = reviewed > 0 ? Math.round((correct / reviewed) * 100) : 0;

    return (
      <MainLayout>
        <div className="mx-auto max-w-md space-y-6 pt-12">
          <div className="text-center space-y-2">
            <CheckCircle size={52} className="mx-auto" style={{ color: "var(--primary)" }} />
            <h1 className="text-2xl font-semibold" style={{ color: "var(--foreground)" }}>
              Session Complete
            </h1>
            <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
              Great work — here's how you did.
            </p>
          </div>

          <div
            className="grid grid-cols-3 gap-4 rounded-2xl border p-6"
            style={{ background: "var(--surface)", borderColor: "var(--border)" }}
          >
            <div className="text-center space-y-1">
              <p className="text-2xl font-bold" style={{ color: "var(--foreground)" }}>
                {reviewed}
              </p>
              <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>
                Reviewed
              </p>
            </div>
            <div className="text-center space-y-1">
              <p className="text-2xl font-bold" style={{ color: "var(--foreground)" }}>
                {accuracy}%
              </p>
              <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>
                Accuracy
              </p>
            </div>
            <div className="text-center space-y-1">
              <p className="text-2xl font-bold" style={{ color: "var(--foreground)" }}>
                {sessionMinutes}m
              </p>
              <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>
                Time
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => {
                setCards([]);
                setIndex(0);
                setFlipped(false);
                setReviewed(0);
                setCorrect(0);
                setLoading(true);
                getQueue(deckId, 20)
                  .then((data) => setCards(data.cards))
                  .catch((err) => setError(err.message))
                  .finally(() => setLoading(false));
              }}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl border py-2.5 text-sm font-medium transition hover:opacity-80"
              style={{
                background: "var(--background)",
                borderColor: "var(--border)",
                color: "var(--foreground)",
              }}
            >
              <RotateCcw size={15} />
              Study Again
            </button>

            <button
              onClick={() => navigate("/dashboard")}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-medium text-white transition hover:opacity-90"
              style={{ background: "var(--primary)" }}
            >
              <Home size={15} />
              Dashboard
            </button>
          </div>
        </div>
      </MainLayout>
    );
  }

  // ── Active review ────────────────────────────────────────────────────────
  return (
    <MainLayout>
      <div className="mx-auto max-w-xl space-y-6">

        {/* Progress bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs" style={{ color: "var(--muted-foreground)" }}>
            <span>{index} / {cards.length} cards</span>
            <span>{cards.length - index} remaining</span>
          </div>
          <div
            className="h-1.5 w-full rounded-full overflow-hidden"
            style={{ background: "var(--border)" }}
          >
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{
                width: `${(index / cards.length) * 100}%`,
                background: "var(--primary)",
              }}
            />
          </div>
        </div>

        {/* Card */}
        <ReviewCard card={currentCard} flipped={flipped} onFlip={handleFlip} />

        {/* Show Answer / Rating buttons */}
        {!flipped ? (
          <button
            onClick={handleFlip}
            className="w-full rounded-xl py-3 text-sm font-semibold text-white transition hover:opacity-90"
            style={{ background: "var(--primary)" }}
          >
            Show Answer
          </button>
        ) : (
          <ReviewButtons onRate={handleRate} disabled={submitting} />
        )}

      </div>
    </MainLayout>
  );
}