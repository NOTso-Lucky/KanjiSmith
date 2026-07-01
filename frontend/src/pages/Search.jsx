import { useState } from "react";
import { Search as SearchIcon, AlertCircle } from "lucide-react";
import MainLayout from "../layouts/MainLayout";
import SearchBar from "../components/SearchBar";
import Flashcard from "../components/Flashcard";
import { searchWord } from "../services/search";

const SUGGESTIONS = ["猫", "勉強", "新聞", "食べる"];

export default function Search() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastQuery, setLastQuery] = useState("");

  async function handleSearch(query) {
    setLoading(true);
    setError(null);
    setLastQuery(query);

    try {
      const data = await searchWord(query);
      setResult(data);
    } catch (err) {
      setResult(null);
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <MainLayout>
      <div className="mx-auto max-w-2xl space-y-8">
        <div className="text-center">
          <h1
            className="text-2xl font-semibold sm:text-3xl"
            style={{ color: "var(--foreground)" }}
          >
            Search
          </h1>
          <p className="mt-1 text-sm sm:text-base" style={{ color: "var(--muted-foreground)" }}>
            Kanji, kana, or romaji — look up any Japanese word.
          </p>
        </div>

        <SearchBar onSearch={handleSearch} loading={loading} />

        {!result && !loading && !error && (
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
                  background: "var(--surface)",
                  borderColor: "var(--border)",
                  color: "var(--foreground)",
                }}
              >
                {s}
              </button>
            ))}
          </div>
        )}

        {loading && (
          <div
            className="rounded-2xl border p-10 text-center"
            style={{
              background: "var(--surface)",
              borderColor: "var(--border)",
              color: "var(--muted-foreground)",
            }}
          >
            Searching for "{lastQuery}"...
          </div>
        )}

        {!loading && error && (
          <div
            className="flex items-start gap-3 rounded-2xl border p-6"
            style={{
              background: "var(--surface)",
              borderColor: "var(--border)",
            }}
          >
            <AlertCircle size={20} style={{ color: "var(--primary)" }} className="mt-0.5 shrink-0" />
            <div>
              <p className="font-medium" style={{ color: "var(--foreground)" }}>
                Couldn't find "{lastQuery}"
              </p>
              <p className="mt-1 text-sm" style={{ color: "var(--muted-foreground)" }}>
                {error}
              </p>
            </div>
          </div>
        )}

        {!loading && !error && result && <Flashcard card={result} />}

        {!loading && !error && !result && (
          <div className="flex flex-col items-center gap-2 py-10 text-center">
            <SearchIcon size={28} style={{ color: "var(--muted-foreground)" }} />
            <p style={{ color: "var(--muted-foreground)" }}>
              Search for a word to see its meaning, reading, and romaji.
            </p>
          </div>
        )}
      </div>
    </MainLayout>
  );
}