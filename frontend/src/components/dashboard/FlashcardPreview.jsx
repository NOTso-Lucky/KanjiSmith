const DIFFICULTY_TONE = {
  Easy: { bg: "color-mix(in oklab, var(--primary) 12%, transparent)", fg: "var(--primary)" },
  Medium: { bg: "color-mix(in oklab, var(--foreground) 8%, transparent)", fg: "var(--foreground)" },
  Hard: { bg: "color-mix(in oklab, var(--primary) 18%, transparent)", fg: "var(--primary)" },
};

export default function FlashcardPreview({ kanji, reading, meaning, difficulty = "Medium", status = "Due" }) {
  const tone = DIFFICULTY_TONE[difficulty] ?? DIFFICULTY_TONE.Medium;

  return (
    <div
      className="group flex flex-col gap-4 rounded-2xl border p-5 transition duration-200 hover:-translate-y-1"
      style={{
        background: "var(--surface)",
        borderColor: "var(--border)",
        boxShadow: "var(--shadow-card)",
      }}
    >
      <div className="flex items-start justify-between gap-3">
        <span
          className="rounded-full px-2.5 py-1 text-xs font-medium"
          style={{ background: tone.bg, color: tone.fg }}
        >
          {difficulty}
        </span>
        <span
          className="text-xs"
          style={{ color: "var(--muted-foreground)" }}
        >
          {status}
        </span>
      </div>

      <div className="min-h-[88px]">
        <div
          className="text-5xl font-semibold leading-none tracking-tight"
          style={{ color: "var(--foreground)", fontFamily: "'Noto Serif JP', 'Hiragino Mincho ProN', serif" }}
        >
          {kanji}
        </div>
        <div
          className="mt-3 text-sm"
          style={{ color: "var(--muted-foreground)" }}
        >
          {reading}
        </div>
      </div>

      <div
        className="border-t pt-3 text-sm"
        style={{ borderColor: "var(--border)", color: "var(--foreground)" }}
      >
        {meaning}
      </div>
    </div>
  );
}
