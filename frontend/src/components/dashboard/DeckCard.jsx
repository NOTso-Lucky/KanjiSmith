import { Play } from "lucide-react";

export default function DeckCard({ name, icon: Icon, progress, total, learned }) {
  const pct = Math.round((learned / total) * 100);

  return (
    <div
      className="group flex flex-col gap-4 rounded-2xl border p-5 transition duration-200 hover:-translate-y-1"
      style={{
        background: "var(--surface)",
        borderColor: "var(--border)",
        boxShadow: "var(--shadow-card)",
      }}
    >
      <div className="flex items-center gap-3">
        <div
          className="grid h-11 w-11 shrink-0 place-items-center rounded-xl"
          style={{ background: "var(--background)", color: "var(--primary)" }}
        >
          <Icon size={20} />
        </div>
        <div className="min-w-0 flex-1">
          <p
            className="truncate text-base font-semibold"
            style={{ color: "var(--foreground)" }}
          >
            {name}
          </p>
          <p
            className="text-xs"
            style={{ color: "var(--muted-foreground)" }}
          >
            {total} cards · {learned} learned
          </p>
        </div>
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs">
          <span style={{ color: "var(--muted-foreground)" }}>Progress</span>
          <span style={{ color: "var(--foreground)" }}>{pct}%</span>
        </div>
        <div
          className="h-1.5 w-full overflow-hidden rounded-full"
          style={{ background: "var(--border)" }}
        >
          <div
            className="h-full rounded-full transition-all"
            style={{ width: `${pct}%`, background: "var(--primary)" }}
          />
        </div>
      </div>

      <button
        type="button"
        className="inline-flex items-center justify-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium transition hover:-translate-y-0.5"
        style={{
          background: "var(--background)",
          borderColor: "var(--border)",
          color: "var(--foreground)",
        }}
      >
        <Play size={14} />
        Study
      </button>
    </div>
  );
}
