import { useState } from "react";
import {
  ChevronDown,
  Sun,
  Moon,
  Cherry,
  Palette,
  Check,
} from "lucide-react";

import { useTheme } from "../contexts/ThemeContext";

const themes = [
  {
    id: "paper",
    label: "Paper",
    icon: Sun,
  },
  {
    id: "midnight",
    label: "Midnight",
    icon: Moon,
  },
  {
    id: "sakura",
    label: "Sakura",
    icon: Cherry,
  },
];

function ThemeSelector() {
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);

  const current = themes.find((t) => t.id === theme);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-2 text-sm hover:bg-surface-hover transition"
      >
        <current.icon className="h-4 w-4" />
        <span className="hidden sm:block">
          {current.label}
        </span>
        <ChevronDown className="h-4 w-4" />
      </button>

      {open && (
        <div
          className="absolute right-0 mt-2 w-48 rounded-xl border border-border bg-surface shadow-lg z-50"
          onMouseLeave={() => setOpen(false)}
        >
          <div className="flex items-center gap-2 px-4 py-3 text-xs uppercase tracking-wide text-muted-foreground">
            <Palette className="h-4 w-4" />
            Theme
          </div>

          {themes.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setTheme(item.id);
                setOpen(false);
              }}
              className="flex w-full items-center justify-between px-4 py-3 hover:bg-surface-hover transition"
            >
              <span className="flex items-center gap-2">
                <item.icon className="h-4 w-4" />
                {item.label}
              </span>

              {theme === item.id && (
                <Check className="h-4 w-4 text-primary" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default ThemeSelector;