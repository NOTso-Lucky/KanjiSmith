import { Play } from "lucide-react";
import { useNavigate } from "react-router-dom";
import CircularProgress from "./CircularProgress";

export default function TodayStudyCard({ summary, loading }) {
  const navigate = useNavigate();

  const reviewed = summary?.today.reviews_completed ?? 0;
  const goal = summary?.daily_goal ?? 20;
  const remaining = Math.max(0, goal - reviewed);

  return (
    <div
      className="flex h-full flex-col gap-6 rounded-2xl border p-6 sm:p-8 md:flex-row md:items-center"
      style={{
        background: "var(--surface)",
        borderColor: "var(--border)",
        boxShadow: "var(--shadow-card)",
      }}
    >
      <div className="flex justify-center">
        <CircularProgress value={reviewed} total={goal} />
      </div>

      <div className="flex-1 space-y-4">
        <div>
          <p
            className="text-xs uppercase tracking-wide"
            style={{ color: "var(--muted-foreground)" }}
          >
            Today's Study
          </p>
          <h3
            className="mt-1 text-2xl font-semibold tracking-tight"
            style={{ color: "var(--foreground)" }}
          >
            {loading ? "Loading..." : `Goal: ${goal} cards`}
          </h3>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div
            className="rounded-xl border p-4"
            style={{ background: "var(--background)", borderColor: "var(--border)" }}
          >
            <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>
              Reviewed
            </p>
            <p className="mt-1 text-2xl font-semibold" style={{ color: "var(--foreground)" }}>
              {loading ? "—" : reviewed}
            </p>
          </div>
          <div
            className="rounded-xl border p-4"
            style={{ background: "var(--background)", borderColor: "var(--border)" }}
          >
            <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>
              Remaining
            </p>
            <p className="mt-1 text-2xl font-semibold" style={{ color: "var(--foreground)" }}>
              {loading ? "—" : remaining}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => navigate("/review")}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-medium transition hover:opacity-90 sm:w-auto"
          style={{
            background: "var(--primary)",
            color: "var(--primary-foreground, #fff)",
          }}
        >
          <Play size={16} />
          {remaining > 0 ? "Start Studying" : "All Done Today!"}
        </button>
      </div>
    </div>
  );
}