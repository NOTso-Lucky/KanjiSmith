import { useState } from "react";
import { Search, Loader2 } from "lucide-react";

export default function SearchBar({ onSearch, loading = false }) {
  const [value, setValue] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed || loading) return;
    onSearch(trimmed);
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
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
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Search kanji, kana, or romaji..."
          className="w-full bg-transparent text-base outline-none placeholder:opacity-70"
          style={{ color: "var(--foreground)" }}
        />

        <button
          type="submit"
          disabled={loading || !value.trim()}
          className="shrink-0 rounded-xl px-4 py-2 text-sm font-medium transition disabled:opacity-50"
          style={{
            background: "var(--primary)",
            color: "var(--primary-foreground)",
          }}
        >
          {loading ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            "Search"
          )}
        </button>
      </label>
    </form>
  );
}