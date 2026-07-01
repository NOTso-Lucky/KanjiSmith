import { useState } from "react";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

const SUGGESTIONS = ["猫", "勉強", "新聞", "食べる"];

export default function SearchHero() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  function handleSearch(term) {
    const q = (term ?? query).trim();
    if (!q) return;
    navigate(`/search?q=${encodeURIComponent(q)}`);
  }

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

        <label
          className="flex items-center gap-3 rounded-2xl border px-5 py-4 transition focus-within:ring-2"
          style={{
            background: "var(--background)",
            borderColor: "var(--border)",
          }}
        >
          <Search size={20} style={{ color: "var(--muted-foreground)" }} />
          <input
            type="text"
            placeholder="Search Japanese words..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="w-full bg-transparent text-base outline-none placeholder:opacity-70"
            style={{ color: "var(--foreground)" }}
          />
          <button
            type="button"
            onClick={() => handleSearch()}
            className="rounded-xl px-4 py-1.5 text-sm font-semibold transition hover:opacity-80"
            style={{
              background: "var(--primary)",
              color: "var(--primary-foreground)",
            }}
          >
            Search
          </button>
        </label>

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
              onClick={() => handleSearch(s)}
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