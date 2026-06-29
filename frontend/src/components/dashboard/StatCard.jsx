export default function StatCard({ label, value, icon: Icon, hint }) {
  return (
    <div
      className="group rounded-2xl border p-5 transition duration-200 hover:-translate-y-1"
      style={{
        background: "var(--surface)",
        borderColor: "var(--border)",
        boxShadow: "var(--shadow-card)",
      }}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p
            className="text-sm font-medium"
            style={{ color: "var(--muted-foreground)" }}
          >
            {label}
          </p>
          <p
            className="text-3xl font-semibold tracking-tight"
            style={{ color: "var(--foreground)" }}
          >
            {value}
          </p>
        </div>
        <div
          className="grid h-10 w-10 place-items-center rounded-xl transition group-hover:scale-110"
          style={{
            background: "var(--background)",
            color: "var(--primary)",
          }}
        >
          <Icon size={18} />
        </div>
      </div>
      {hint && (
        <p
          className="mt-3 text-xs"
          style={{ color: "var(--muted-foreground)" }}
        >
          {hint}
        </p>
      )}
    </div>
  );
}
