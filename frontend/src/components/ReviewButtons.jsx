const BUTTONS = [
  {
    rating: "Again",
    label: "Again",
    sublabel: "<10m",
    bg: "#ef4444",
    hover: "#dc2626",
  },
  {
    rating: "Hard",
    label: "Hard",
    sublabel: "<1d",
    bg: "#f97316",
    hover: "#ea6c10",
  },
  {
    rating: "Good",
    label: "Good",
    sublabel: "+1d",
    bg: "#22c55e",
    hover: "#16a34a",
  },
  {
    rating: "Easy",
    label: "Easy",
    sublabel: "+4d",
    bg: "#3b82f6",
    hover: "#2563eb",
  },
];

export default function ReviewButtons({ onRate, disabled = false }) {
  return (
    <div className="grid grid-cols-4 gap-3 w-full">
      {BUTTONS.map(({ rating, label, sublabel, bg, hover }) => (
        <button
          key={rating}
          type="button"
          disabled={disabled}
          onClick={() => onRate(rating)}
          className="flex flex-col items-center gap-1 rounded-xl py-3 px-2 text-white font-semibold text-sm transition active:scale-95 disabled:opacity-50"
          style={{ background: bg }}
          onMouseEnter={(e) => { e.currentTarget.style.background = hover; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = bg; }}
        >
          <span>{label}</span>
          <span className="text-xs font-normal opacity-80">{sublabel}</span>
        </button>
      ))}
    </div>
  );
}