import { Search } from "lucide-react";

const SUGGESTIONS = ["猫", "勉強", "新聞", "食べる"];

export default function SearchHero() {
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
            className="w-full bg-transparent text-base outline-none placeholder:opacity-70"
            style={{ color: "var(--foreground)" }}
          />
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
