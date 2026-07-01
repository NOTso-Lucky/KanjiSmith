import { BookOpen } from "lucide-react";
import AddToDeckMenu from "./AddToDeckMenu";

const JLPT_TONE = {
  N5: { bg: "color-mix(in oklab, var(--primary) 12%, transparent)", fg: "var(--primary)" },
  N4: { bg: "color-mix(in oklab, var(--primary) 12%, transparent)", fg: "var(--primary)" },
  N3: { bg: "color-mix(in oklab, var(--foreground) 8%, transparent)", fg: "var(--foreground)" },
  N2: { bg: "color-mix(in oklab, var(--foreground) 8%, transparent)", fg: "var(--foreground)" },
  N1: { bg: "color-mix(in oklab, var(--foreground) 8%, transparent)", fg: "var(--foreground)" },
};

export default function Flashcard({ card }) {
  if (!card) return null;

  const {
    id,
    expression,
    reading,
    reading_romaji,
    meaning,
    example_sentence,
    example_romaji,
    example_translation,
    jlpt_level,
  } = card;

  const tone = jlpt_level ? JLPT_TONE[jlpt_level] : null;

  return (
    <div
      className="flex flex-col gap-5 rounded-2xl border p-6"
      style={{
        background: "var(--surface)",
        borderColor: "var(--border)",
        boxShadow: "var(--shadow-card)",
      }}
    >
      <div className="flex items-start justify-between gap-3">
        {jlpt_level ? (
          <span
            className="rounded-full px-2.5 py-1 text-xs font-medium"
            style={{ background: tone.bg, color: tone.fg }}
          >
            JLPT {jlpt_level}
          </span>
        ) : (
          <span />
        )}

        <AddToDeckMenu flashcardId={id} />
      </div>

      <div>
        <div
          className="text-5xl font-semibold leading-none tracking-tight"
          style={{
            color: "var(--foreground)",
            fontFamily: "'Noto Serif JP', 'Hiragino Mincho ProN', serif",
          }}
        >
          {expression}
        </div>
        <div className="mt-3 text-base" style={{ color: "var(--muted-foreground)" }}>
          {reading}
        </div>
        {reading_romaji && (
          <div className="mt-0.5 text-sm italic" style={{ color: "var(--muted-foreground)" }}>
            {reading_romaji}
          </div>
        )}
      </div>

      <div
        className="border-t pt-4 text-base"
        style={{ borderColor: "var(--border)", color: "var(--foreground)" }}
      >
        {meaning}
      </div>

      {example_sentence && (
        <div
          className="flex gap-3 rounded-xl border p-4"
          style={{ background: "var(--background)", borderColor: "var(--border)" }}
        >
          <BookOpen
            size={18}
            className="mt-0.5 shrink-0"
            style={{ color: "var(--muted-foreground)" }}
          />
          <div className="space-y-1">
            <p style={{ color: "var(--foreground)" }}>{example_sentence}</p>
            {example_romaji && (
              <p className="text-sm italic" style={{ color: "var(--muted-foreground)" }}>
                {example_romaji}
              </p>
            )}
            {example_translation && (
              <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
                {example_translation}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}