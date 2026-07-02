import { BookOpen } from "lucide-react";

export default function ReviewCard({ card, flipped, onFlip }) {
  return (
    <div
      className="w-full cursor-pointer"
      style={{ perspective: "1200px" }}
      onClick={onFlip}
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          minHeight: "340px",
          transformStyle: "preserve-3d",
          transition: "transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
          transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        {/* FRONT */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: "1rem",
            boxShadow: "var(--shadow-card)",
          }}
          className="flex flex-col items-center justify-center gap-4 p-8"
        >
          <div
            className="text-7xl font-semibold leading-none tracking-tight text-center"
            style={{
              color: "var(--foreground)",
              fontFamily: "'Noto Serif JP', 'Hiragino Mincho ProN', serif",
            }}
          >
            {card.expression}
          </div>

          {card.card_type !== "Kana" && (
            <div className="text-lg" style={{ color: "var(--muted-foreground)" }}>
              {card.reading}
            </div>
          )}

          <p className="mt-4 text-sm" style={{ color: "var(--muted-foreground)" }}>
            Tap to reveal answer
          </p>
        </div>

        {/* BACK */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: "1rem",
            boxShadow: "var(--shadow-card)",
            overflowY: "auto",
          }}
          className="flex flex-col justify-center gap-5 p-8"
        >
          <div className="text-center">
            <div
              className="text-5xl font-semibold leading-none tracking-tight"
              style={{
                color: "var(--foreground)",
                fontFamily: "'Noto Serif JP', 'Hiragino Mincho ProN', serif",
              }}
            >
              {card.expression}
            </div>

            <div className="mt-3 text-base" style={{ color: "var(--muted-foreground)" }}>
              {card.reading}
            </div>

            {card.reading_romaji && (
              <div className="mt-0.5 text-sm italic" style={{ color: "var(--muted-foreground)" }}>
                {card.reading_romaji}
              </div>
            )}
          </div>

          <div
            className="border-t pt-4 text-center text-xl font-medium"
            style={{ borderColor: "var(--border)", color: "var(--foreground)" }}
          >
            {card.meaning}
          </div>

          {card.example_sentence && (
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
                <p className="text-sm" style={{ color: "var(--foreground)" }}>
                  {card.example_sentence}
                </p>
                {card.example_romaji && (
                  <p className="text-xs italic" style={{ color: "var(--muted-foreground)" }}>
                    {card.example_romaji}
                  </p>
                )}
                {card.example_translation && (
                  <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>
                    {card.example_translation}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}