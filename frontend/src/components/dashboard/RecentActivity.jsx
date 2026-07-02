import { useEffect, useState } from "react";
import { Eye, Layers, Plus, Sparkles } from "lucide-react";
import { getRecentActivity } from "../../services/dashboard";

const ICON_BY_TYPE = {
  review: Eye,
  deck_added: Layers,
  flashcard_added: Plus,
};

function timeAgo(dateStr) {
  const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000);
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 172800) return "Yesterday";
  return `${Math.floor(diff / 86400)}d ago`;
}

export default function RecentActivity() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchActivity() {
      try {
        const data = await getRecentActivity(5);
        setActivities(data.activities);
      } catch (err) {
        setActivities([]);
      } finally {
        setLoading(false);
      }
    }
    fetchActivity();
  }, []);

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

      {loading && (
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-9 animate-pulse rounded-lg"
              style={{ background: "var(--background)" }}
            />
          ))}
        </div>
      )}

      {!loading && activities.length === 0 && (
        <div className="flex flex-col items-center gap-2 py-8 text-center">
          <Sparkles size={22} style={{ color: "var(--muted-foreground)" }} />
          <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
            No activity yet — search a word, add a deck, or start reviewing.
          </p>
        </div>
      )}

      {!loading && activities.length > 0 && (
        <ol className="relative space-y-4">
          <span
            className="absolute left-[18px] top-2 bottom-2 w-px"
            style={{ background: "var(--border)" }}
            aria-hidden
          />
          {activities.map((a, i) => {
            const Icon = ICON_BY_TYPE[a.type] ?? Sparkles;

            return (
              <li key={i} className="relative flex items-start gap-3">
                <div
                  className="relative z-10 grid h-9 w-9 shrink-0 place-items-center rounded-full border"
                  style={{
                    background: "var(--background)",
                    borderColor: "var(--border)",
                    color: "var(--primary)",
                  }}
                >
                  <Icon size={16} />
                </div>
                <div className="min-w-0 flex-1 pt-1">
                  <p
                    className="truncate text-sm font-medium"
                    style={{ color: "var(--foreground)" }}
                  >
                    {a.text}
                  </p>
                  <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>
                    {timeAgo(a.timestamp)}
                  </p>
                </div>
              </li>
            );
          })}
        </ol>
      )}
    </section>
  );
}