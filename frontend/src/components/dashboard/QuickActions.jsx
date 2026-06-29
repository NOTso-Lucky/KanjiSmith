import { Search, Play, Plus, Upload } from "lucide-react";

const ACTIONS = [
  { label: "Search Words", icon: Search },
  { label: "Study Now", icon: Play },
  { label: "Create Deck", icon: Plus },
  { label: "Import Deck", icon: Upload },
];

export default function QuickActions() {
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
          Quick Actions
        </h2>
        <p className="mt-0.5 text-sm" style={{ color: "var(--muted-foreground)" }}>
          One-tap shortcuts.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {ACTIONS.map(({ label, icon: Icon }) => (
          <button
            key={label}
            type="button"
            className="flex flex-col items-start gap-2 rounded-xl border p-4 text-left transition hover:-translate-y-0.5"
            style={{
              background: "var(--background)",
              borderColor: "var(--border)",
              color: "var(--foreground)",
            }}
          >
            <span
              className="grid h-8 w-8 place-items-center rounded-lg"
              style={{ background: "var(--surface)", color: "var(--primary)" }}
            >
              <Icon size={16} />
            </span>
            <span className="text-sm font-medium">{label}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
