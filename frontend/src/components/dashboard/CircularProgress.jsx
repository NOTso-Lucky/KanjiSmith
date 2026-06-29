export default function CircularProgress({ value = 0, total = 100, size = 160, stroke = 12 }) {
  const pct = Math.max(0, Math.min(1, total === 0 ? 0 : value / total));
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c * (1 - pct);

  return (
    <div className="relative grid place-items-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--border)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--primary)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 600ms ease" }}
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center">
        <div className="text-center">
          <div
            className="text-3xl font-semibold tracking-tight"
            style={{ color: "var(--foreground)" }}
          >
            {Math.round(pct * 100)}%
          </div>
          <div className="text-xs" style={{ color: "var(--muted-foreground)" }}>
            {value} / {total}
          </div>
        </div>
      </div>
    </div>
  );
}
