import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

const SUGGESTIONS = ["猫", "勉強", "新聞", "食べる"];

export default function SearchHero() {
  const navigate = useNavigate();

  return (
    <div
      className="rounded-3xl border p-6 sm:p-10"
      style={{
        background: "var(--surface)",
        borderColor: "var(--border)",
        boxShadow: "var(--shadow-card)",
      }}
    >
      <div className="mx-auto max-w-3xl space-y-5">
        <div className="text-center">
          <h2
            className="text-xl font-semibold sm:text-2xl"
            style={{ color: "var(--foreground)" }}
          >
            Look up any Japanese word
          </h2>
          <p
            className="mt-1 text-sm sm:text-base"
            style={{ color: "var(--muted-foreground)" }}
          >
            Kanji, kana, or romaji — save anything to a deck.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate("/search")}
          className="flex w-full items-center gap-3 rounded-2xl border px-5 py-4 transition hover:ring-2 text-left"
          style={{
            background: "var(--background)",
            borderColor: "var(--border)",
          }}
        >
          <Search size={20} style={{ color: "var(--muted-foreground)" }} />
          <span style={{ color: "var(--muted-foreground)" }} className="opacity-70 text-base">
            Search kanji, kana, or romaji...
          </span>
        </button>

        <div className="flex flex-wrap items-center justify-center gap-2">
          <span
            className="text-xs uppercase tracking-wide"
            style={{ color: "var(--muted-foreground)" }}
          >
            Try
          </span>
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => navigate(`/search?q=${encodeURIComponent(s)}`)}
              className="rounded-full border px-4 py-1.5 text-sm transition hover:-translate-y-0.5"
              style={{
                background: "var(--background)",
                borderColor: "var(--border)",
                color: "var(--foreground)",
              }}
            >
              {s}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}