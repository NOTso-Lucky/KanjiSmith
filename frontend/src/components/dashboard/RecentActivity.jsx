import { Plus, Eye, Layers, CheckCircle2 } from "lucide-react";

const ACTIVITY = [
  { icon: Plus, text: "Added 新聞", time: "2m ago" },
  { icon: Eye, text: "Reviewed 猫", time: "1h ago" },
  { icon: Layers, text: "Created JLPT N5 Deck", time: "Yesterday" },
  { icon: CheckCircle2, text: "Studied 20 cards", time: "2 days ago" },
];

export default function RecentActivity() {
  return (
    <section
      className="h-full space-y-4 rounded-2xl border p-6"
      style={{
        background: "var(--surface)",
        borderColor: "var(--border)",
        boxShadow: "var(--shadow-card)",
      }}
    >
      <div>
        <h2
          className="text-lg font-semibold tracking-tight"
          style={{ color: "var(--foreground)" }}
        >
          Recent Activity
        </h2>
        <p className="mt-0.5 text-sm" style={{ color: "var(--muted-foreground)" }}>
          What you've been up to.
        </p>
      </div>

      <ol className="relative space-y-4">
        <span
          className="absolute left-[18px] top-2 bottom-2 w-px"
          style={{ background: "var(--border)" }}
          aria-hidden
        />
        {ACTIVITY.map((a, i) => (
          <li key={i} className="relative flex items-start gap-3">
            <div
              className="relative z-10 grid h-9 w-9 shrink-0 place-items-center rounded-full border"
              style={{
                background: "var(--background)",
                borderColor: "var(--border)",
                color: "var(--primary)",
              }}
            >
              <a.icon size={16} />
            </div>
            <div className="min-w-0 flex-1 pt-1">
              <p
                className="truncate text-sm font-medium"
                style={{ color: "var(--foreground)" }}
              >
                {a.text}
              </p>
              <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>
                {a.time}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
