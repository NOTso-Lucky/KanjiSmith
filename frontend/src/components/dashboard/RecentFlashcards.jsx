import { Sparkles } from "lucide-react";
import FlashcardPreview from "./FlashcardPreview";

const CARDS = [
  { kanji: "猫", reading: "ねこ", meaning: "cat", difficulty: "Easy", status: "Reviewed" },
  { kanji: "勉強", reading: "べんきょう", meaning: "study", difficulty: "Medium", status: "Due" },
  { kanji: "新聞", reading: "しんぶん", meaning: "newspaper", difficulty: "Hard", status: "New" },
  { kanji: "食べる", reading: "たべる", meaning: "to eat", difficulty: "Easy", status: "Reviewed" },
];

export default function RecentFlashcards() {
  const isEmpty = CARDS.length === 0;

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
          <p
            className="mt-1 text-sm"
            style={{ color: "var(--muted-foreground)" }}
          >
            Cards you've saved or reviewed recently.
          </p>
        </div>
        <button
          type="button"
          className="text-sm font-medium transition hover:opacity-80"
          style={{ color: "var(--primary)" }}
        >
          View all
        </button>
      </div>

      {isEmpty ? (
        <div
          className="flex flex-col items-center gap-3 rounded-2xl border border-dashed py-16 text-center"
          style={{ borderColor: "var(--border)", background: "var(--surface)" }}
        >
          <Sparkles size={28} style={{ color: "var(--muted-foreground)" }} />
          <p className="text-base font-medium" style={{ color: "var(--foreground)" }}>
            No flashcards yet.
          </p>
          <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
            Search your first Japanese word.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CARDS.map((c) => (
            <FlashcardPreview key={c.kanji} {...c} />
          ))}
        </div>
      )}
    </section>
  );
}
